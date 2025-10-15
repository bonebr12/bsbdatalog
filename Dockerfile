# Dockerfile otimizado para deploy no Google Cloud Run
FROM python:3.11-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências primeiro para aproveitar cache do Docker
COPY requirements.txt .

# Instala as dependências em modo não interativo
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código da aplicação
COPY . .

# Define a porta exposta
EXPOSE 8080

# Comando de entrada utilizando gunicorn, conforme recomendado pelo Cloud Run
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
