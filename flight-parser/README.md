# DJI Flight Parser API

Projeto Flask que expõe o parser de voos DJI como uma API pronta para deploy no Cloud Run.

## Estrutura

```
flight-parser/
├── dji-log-parser/
│   ├── __init__.py
│   ├── flight_recorder.py
│   ├── parser.py
│   ├── utils.py
│   └── setup.py
├── app.py
├── requirements.txt
└── Dockerfile
```

## Desenvolvimento local

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -e ./dji-log-parser
python app.py
```

## Deploy no Cloud Run

```bash
gcloud run deploy dji-log-parser \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated
```
