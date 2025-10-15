# DJI Flight Parser API

API Flask que consome a biblioteca oficial da DJI (`FlightRecordParsingLib`) para
decodificar arquivos `.TXT` produzidos pelo aplicativo DJI Fly. O serviço realiza
download do log, busca as _keychains_ na API da DJI e retorna um resumo do voo.

## Pré-requisitos

1. **Ferramentas de compilação (para a lib oficial da DJI)**

   ```bash
   sudo apt-get update
   sudo apt-get install -y rustc cargo python3-dev build-essential
   ```

2. **Clonar e instalar a biblioteca oficial**

   ```bash
   git clone https://github.com/dji-sdk/FlightRecordParsingLib.git
   cd FlightRecordParsingLib
   pip install -e .
   ```

   > Dica: você também pode copiar o repositório clonado para dentro de
   > `flight-parser/FlightRecordParsingLib` e o app o encontrará
   > automaticamente.

3. **Criar uma API Key na DJI** pelo portal [developer.dji.com](https://developer.dji.com).

## Variáveis de ambiente

| Nome                 | Obrigatório | Descrição                                                                 |
| -------------------- | ----------- | ------------------------------------------------------------------------- |
| `DJI_API_KEY`        | ✅          | Chave oficial usada para baixar as keychains da DJI.                      |
| `DJI_KEYCHAIN_CACHE` | Opcional    | Caminho do arquivo JSON usado para cache local das keychains (default: `.dji_keychains_cache.json`). |

Exemplo para desenvolvimento local:

```bash
export DJI_API_KEY="sua_chave_da_dji"
export DJI_KEYCHAIN_CACHE="$PWD/.cache/dji_keychains.json"
```

## Desenvolvimento local

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

O servidor será iniciado em `http://localhost:8080`.

## Deploy no Cloud Run

```bash
gcloud run deploy dji-log-parser \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated \
  --set-env-vars "DJI_API_KEY=..."
```

Recomendamos armazenar a chave em um Secret do Google Cloud e montá-lo como
variável de ambiente durante o deploy.
