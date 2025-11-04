#!/bin/bash
# Script de backup para PostgreSQL en Linux/Mac
# Uso: ./backup_db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DB_NAME="tikakinvest_db"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Realizar backup
echo "Iniciando backup de la base de datos..."
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -f "$BACKUP_DIR/backup_${DATE}.dump"

if [ $? -eq 0 ]; then
    echo "Backup exitoso: backup_${DATE}.dump"
    echo "Ubicación: $BACKUP_DIR/"
    
    # Guardar último backup
    cp "$BACKUP_DIR/backup_${DATE}.dump" "$BACKUP_DIR/backup_latest.dump"
    
    # Limpiar backups antiguos (mantener últimos 7)
    ls -t "$BACKUP_DIR"/backup_*.dump 2>/dev/null | tail -n +8 | xargs rm -f 2>/dev/null
else
    echo "Error al realizar backup"
    exit 1
fi