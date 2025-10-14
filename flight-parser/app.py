from flask import Flask, request, jsonify
import tempfile
import os
import requests
from dji_log_parser.flight_recorder import FlightRecorder

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"status": "ok", "message": "DJI Flight Parser API ativa"})

@app.route("/parse", methods=["POST"])
def parse_flight_record():
    try:
        data = request.get_json()
        input_url = data.get("input_url")

        if not input_url:
            return jsonify({"error": "input_url ausente"}), 400

        # Baixa o arquivo temporariamente
        with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
            r = requests.get(input_url)
            if r.status_code != 200:
                return jsonify({
                    "error": f"Falha ao baixar arquivo: {r.status_code}"
                }), 400
            tmp.write(r.content)
            tmp_path = tmp.name

        # Faz o parsing
        fr = FlightRecorder(tmp_path)
        result = fr.to_dict()

        # Limpa o arquivo temporário
        os.remove(tmp_path)

        return jsonify({
            "status": "success",
            "data": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
