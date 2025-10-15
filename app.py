"""Aplicação Flask para processamento de arquivos baixados de uma URL."""
import logging
import os
from typing import Any, Dict

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import HTTPException, BadRequest

# Configuração do logger principal da aplicação.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Criação da aplicação Flask.
app = Flask(__name__)

# Habilita CORS para todos os endpoints da API.
CORS(app)


def _json_error(message: str, status_code: int) -> Any:
    """Helper para retornar respostas JSON de erro."""
    response = jsonify({"error": message})
    response.status_code = status_code
    return response


@app.errorhandler(Exception)
def handle_global_exception(error: Exception):
    """Captura exceções não tratadas e retorna uma resposta JSON padronizada."""
    if isinstance(error, HTTPException):
        # Para erros HTTP (ex: 404, 400), usamos o código existente.
        logger.warning("Erro HTTP capturado: %s", error)
        return _json_error(error.description, error.code)

    # Para qualquer outra exceção, registramos como erro interno.
    logger.exception("Erro interno inesperado")
    return _json_error("Erro interno do servidor", 500)


@app.route("/healthz", methods=["GET"])
def health_check():
    """Endpoint simples para verificar se a aplicação está ativa."""
    return jsonify({"status": "ok"})


@app.route("/parse", methods=["POST"])
def parse_endpoint():
    """Endpoint responsável por baixar e processar um arquivo a partir de uma URL."""
    # Recupera a chave da DJI do ambiente.
    app_key = os.getenv("DJI_APP_KEY")
    if not app_key:
        logger.warning("Variável de ambiente DJI_APP_KEY não configurada")
        return _json_error("DJI_APP_KEY não configurada", 400)

    # Lê o corpo da requisição e valida o campo necessário.
    payload: Dict[str, Any] = request.get_json(silent=True) or {}
    input_url = payload.get("input_url")
    if not input_url:
        logger.warning("Campo 'input_url' ausente na requisição")
        raise BadRequest("Campo 'input_url' é obrigatório")

    logger.info("Iniciando download do arquivo a partir de %s", input_url)

    try:
        # Faz o download do conteúdo usando streaming para evitar consumo excessivo de memória.
        response = requests.get(input_url, stream=True, timeout=30)
        response.raise_for_status()
    except requests.RequestException as exc:
        logger.warning("Falha ao baixar o arquivo: %s", exc)
        return _json_error("Não foi possível baixar o arquivo fornecido", 400)

    # Conta o número de bytes do arquivo baixado.
    size_in_bytes = 0
    for chunk in response.iter_content(chunk_size=8192):
        if chunk:  # Evita contar keep-alives.
            size_in_bytes += len(chunk)

    logger.info("Download concluído. Tamanho total: %d bytes", size_in_bytes)

    return jsonify({"ok": True, "size": size_in_bytes})


if __name__ == "__main__":
    # Execução local da aplicação para desenvolvimento.
    app.run(host="0.0.0.0", port=8080, debug=True)
