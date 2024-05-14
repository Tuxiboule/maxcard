# Utiliser une image de base Python officielle
FROM python:3.9-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier des dépendances dans le répertoire de travail
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copier le contenu de l'application dans le répertoire de travail
COPY . .

# set permissions and execute necessary commands
RUN apt-get update && apt-get install -y procps
RUN mkdir -p /app/static && chmod 755 /app/static
RUN python manage.py collectstatic --no-input
RUN python manage.py migrate

# Définir la commande par défaut pour exécuter l'application avec Gunicorn
CMD ["gunicorn", "maxcard.wsgi:application", "--bind", "0.0.0.0:8000"]
