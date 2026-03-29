FROM postgres:15-alpine

# On ne met plus les identifiants en dur ici.
# Ils seront injectés par Docker Compose (local) ou Terraform (Azure).

# Ce fichier reste essentiel pour l'initialisation de la structure de la base
COPY db/init.sql /docker-entrypoint-initdb.d/init.sql
