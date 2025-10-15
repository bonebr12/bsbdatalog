import base64
import hashlib
import json
import os
import pickle
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict

import pandas as pd
import requests
from flask import Flask, jsonify, request

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_CACHE_PATH = BASE_DIR / ".dji_keychains_cache.json"


def _resolve_flight_record_parser() -> "FlightRecordParser":
    """Tenta importar a classe oficial de parser da DJI.

    O desenvolvedor pode ter instalado a biblioteca via `pip install -e` ou
    clonado o repositório oficial dentro do diretório do projeto. Este helper
    adiciona caminhos extras ao ``sys.path`` antes de realizar o import.
    """

    search_paths = [
        BASE_DIR / "FlightRecordParsingLib",
        BASE_DIR / "DJI-FlightRecordParsingLib",
    ]
    for candidate in search_paths:
        if candidate.exists():
            sys.path.insert(0, str(candidate))

    try:
        from FlightRecordParsingLib import FlightRecordParser as Parser  # type: ignore
    except ImportError as exc:  # pragma: no cover - dependência externa
        raise RuntimeError(
            "Não foi possível importar `FlightRecordParsingLib`. "
            "Verifique se o repositório oficial foi clonado ou instalado com "
            "`pip install -e /caminho/para/FlightRecordParsingLib`."
        ) from exc

    return Parser


FlightRecordParser = _resolve_flight_record_parser()

app = Flask(__name__)

# 🪪 Sua chave oficial da DJI deve ser configurada via variável de ambiente.
DJI_API_KEY = os.getenv("DJI_API_KEY")
KEYCHAIN_CACHE_PATH = Path(os.getenv("DJI_KEYCHAIN_CACHE", DEFAULT_CACHE_PATH))


def _load_cache() -> Dict[str, Dict[str, Any]]:
    if not KEYCHAIN_CACHE_PATH.exists():
        return {}

    try:
        with KEYCHAIN_CACHE_PATH.open("r", encoding="utf-8") as cache_file:
            return json.load(cache_file)
    except (OSError, json.JSONDecodeError):  # pragma: no cover - IO externo
        app.logger.warning("Cache de keychains corrompido. Ele será recriado.")
        return {}


def _save_cache(cache: Dict[str, Dict[str, Any]]) -> None:
    try:
        KEYCHAIN_CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
        with KEYCHAIN_CACHE_PATH.open("w", encoding="utf-8") as cache_file:
            json.dump(cache, cache_file)
    except OSError as exc:  # pragma: no cover - IO externo
        app.logger.warning("Não foi possível salvar o cache de keychains: %s", exc)


def _serialize_keychains(keychains: Any) -> Dict[str, str]:
    try:
        json.dumps(keychains)
        return {"type": "json", "value": keychains}
    except TypeError:
        payload = base64.b64encode(pickle.dumps(keychains)).decode("ascii")
        return {"type": "pickle", "value": payload}


def _deserialize_keychains(serialized: Dict[str, str]) -> Any:
    if serialized.get("type") == "pickle":
        return pickle.loads(base64.b64decode(serialized["value"]))
    return serialized.get("value")


def _file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

@app.route("/")
def home():
    return jsonify({
        "status": "ok",
        "message": "API DJI Flight Parser ativa com suporte a logs DJI Fly"
    })

@app.route("/parse", methods=["POST"])
def parse_flight_record():
    try:
        data = request.get_json(silent=True) or {}
        input_url = data.get("input_url")

        if not input_url:
            return jsonify({"error": "input_url ausente"}), 400

        if not DJI_API_KEY:
            return (
                jsonify(
                    {
                        "error": "Variável de ambiente DJI_API_KEY não configurada.",
                        "hint": "Exporte sua chave oficial da DJI antes de iniciar o servidor.",
                    }
                ),
                500,
            )

        # Baixar arquivo temporariamente
        with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
            try:
                response = requests.get(input_url, timeout=30)
                response.raise_for_status()
            except requests.RequestException as exc:
                return jsonify({"error": f"Falha ao baixar arquivo: {exc}"}), 400

            tmp.write(response.content)
            tmp_path = Path(tmp.name)

        # Criar parser
        parser = FlightRecordParser(str(tmp_path))

        # Buscar keychains da DJI (somente logs versão >=13)
        try:
            cache = _load_cache()
            file_hash = _file_sha256(tmp_path)

            cached_payload = cache.get(file_hash)
            if cached_payload:
                parser.set_keychains(_deserialize_keychains(cached_payload))
            else:
                keychains = parser.fetch_keychains(DJI_API_KEY)
                parser.set_keychains(keychains)
                cache[file_hash] = _serialize_keychains(keychains)
                _save_cache(cache)
        except Exception as e:
            print(f"⚠️ Aviso: não foi possível recuperar keychains: {e}")
            return jsonify({"error": f"Falha ao recuperar keychains: {str(e)}"}), 500

        # Decodificar log
        try:
            record = parser.parse()
            df = record.to_dataframe()
        except Exception as e:
            return jsonify({"error": f"Falha ao decodificar log: {str(e)}"}), 500

        if df.empty:
            return jsonify({"error": "Nenhum dado encontrado após decodificação"}), 400

        # Calcular métricas gerais
        metrics = {}
        if "altitude" in df:
            metrics["altitude_max_m"] = df["altitude"].max()
            metrics["altitude_min_m"] = df["altitude"].min()
            metrics["altitude_avg_m"] = df["altitude"].mean()

        if "velocity" in df:
            metrics["speed_max_m_s"] = df["velocity"].max()
            metrics["speed_avg_m_s"] = df["velocity"].mean()

        if "battery" in df:
            metrics["battery_min_percent"] = df["battery"].min()
            metrics["battery_max_percent"] = df["battery"].max()

        # Coordenadas (se existirem)
        if "latitude" in df and "longitude" in df:
            metrics["start_coords"] = [df["latitude"].iloc[0], df["longitude"].iloc[0]]
            metrics["end_coords"] = [df["latitude"].iloc[-1], df["longitude"].iloc[-1]]

        # Adiciona preview dos dados
        preview = df.head(10).to_dict(orient="records")

        return jsonify({
            "status": "ok",
            "summary": metrics,
            "columns_found": df.columns.tolist(),
            "raw_preview": preview
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
