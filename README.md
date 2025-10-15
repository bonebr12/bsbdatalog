# bsbdatalog - API Flask para Cloud Run

Este repositório contém uma API Flask simples preparada para deploy no Google Cloud Run. Ela expõe dois endpoints (`/healthz` e `/parse`) e demonstra como baixar e processar arquivos fornecidos por URL.

## Pré-requisitos

- Conta Google Cloud com um projeto configurado.
- [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install) instalado e autenticado.
- Permissões para usar Cloud Build e Cloud Run no projeto escolhido.

## Autenticação no Google Cloud

1. Faça login com a sua conta Google:

   ```bash
   gcloud auth login
   ```

2. Configure o projeto padrão (substitua `PROJECT_ID` pelo ID do seu projeto):

   ```bash
   gcloud config set project PROJECT_ID
   ```

## Build e envio da imagem para o Container Registry

Execute o comando abaixo a partir da raiz do repositório para construir a imagem Docker e enviá-la para o Container Registry (ou Artifact Registry) do seu projeto:

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/bsbdatalog
```

## Deploy no Cloud Run

Realize o deploy utilizando o Cloud Run (região `southamerica-east1` como no exemplo):

```bash
gcloud run deploy bsbdatalog \
  --image gcr.io/PROJECT_ID/bsbdatalog \
  --platform managed \
  --region southamerica-east1 \
  --allow-unauthenticated
```

> Anote a URL gerada pelo Cloud Run ao final do deploy; ela será usada para testar os endpoints.

## Configurando variáveis de ambiente

A aplicação precisa da variável `DJI_APP_KEY`. Configure-a com o comando:

```bash
gcloud run services update bsbdatalog \
  --platform managed \
  --region southamerica-east1 \
  --set-env-vars DJI_APP_KEY="sua_chave_dji_aqui"
```

## Testando os endpoints

Substitua `CLOUD_RUN_URL` pela URL retornada no deploy (ex.: `https://bsbdatalog-abc123-uc.a.run.app`).

### Health check

```bash
curl -i "CLOUD_RUN_URL/healthz"
```

Resposta esperada:

```json
{"status":"ok"}
```

### Endpoint /parse

```bash
curl -i \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"input_url":"https://exemplo.com/arquivo.txt"}' \
  "CLOUD_RUN_URL/parse"
```

Resposta esperada (exemplo):

```json
{"ok":true,"size":12345}
```

Se a variável `DJI_APP_KEY` não estiver configurada, o endpoint retornará:

```json
{"error":"DJI_APP_KEY não configurada"}
```

## Execução local para desenvolvimento

1. Crie e ative um ambiente virtual (opcional):

   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

3. Exporte a variável `DJI_APP_KEY` e execute o servidor Flask:

   ```bash
   export DJI_APP_KEY="sua_chave_dji_aqui"
   flask --app app run --host 0.0.0.0 --port 8080
   ```

Agora os endpoints estarão disponíveis em `http://localhost:8080`.

## Estrutura do projeto

- `app.py`: código principal da API Flask.
- `requirements.txt`: dependências Python.
- `Dockerfile`: imagem Docker otimizada para Cloud Run.
- `.dockerignore`: arquivos ignorados na build Docker.

Sinta-se à vontade para adaptar os endpoints conforme as necessidades do seu projeto.
