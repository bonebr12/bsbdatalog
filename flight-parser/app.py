from flask import Flask, request, jsonify
import tempfile
import os
import requests
import pandas as pd
import sys

# Importa a biblioteca moderna que decodifica logs DJI Fly
sys.path.append(os.path.join(os.path.dirname(__file__), "DJI-FlightRecordParsingLib"))
from FlightRecordParsingLib import FlightRecordParser

app = Flask(__name__)

# 🪪 SUA CHAVE DJI
DJI_API_KEY = "d7a6336b6705e4cb75148bf3a514103"

@app.route("/")
def home():
    return jsonify({
        "status": "ok",
        "message": "API DJI Flight Parser ativa com suporte a logs DJI Fly"
    })

@app.route("/parse", methods=["POST"])
def parse_flight_record():
    try:
        data = request.get_json()
        input_url = data.get("input_url")

        if not input_url:
            return jsonify({"error": "input_url ausente"}), 400

        # Baixar arquivo temporariamente
        with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
            response = requests.get(input_url)
            if response.status_code != 200:
                return jsonify({
                    "error": f"Falha ao baixar arquivo: {response.status_code}"
                }), 400
            tmp.write(response.content)
            tmp_path = tmp.name

        # Criar parser
        parser = FlightRecordParser(tmp_path)

        # Buscar keychains da DJI (somente logs versão >=13)
        try:
            keychains = parser.fetch_keychains(DJI_API_KEY)
            parser.set_keychains(keychains)
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
