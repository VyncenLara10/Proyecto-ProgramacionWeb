# Script para restaurar base de datos desde backup
# Uso: .\restore_db.ps1 -BackupFile .\backups\backup_latest.dump

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    
    [string]$DbName = "tikakinvest_db",
    [string]$DbUser = "postgres",
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432
)

if (-not (Test-Path $BackupFile)) {
    Write-Host "ERROR: Archivo de backup no encontrado: $BackupFile" -ForegroundColor Red
    exit 1
}

Write-Host "ADVERTENCIA: Esta operacion eliminara la base de datos actual y la reemplazara" -ForegroundColor Yellow
Write-Host "Archivo de backup: $BackupFile" -ForegroundColor Yellow
$confirm = Read-Host "¿Continuar? (s/n)"

if ($confirm -ne 's' -and $confirm -ne 'S') {
    Write-Host "Operación cancelada" -ForegroundColor Yellow
    exit 0
}

$env:PGPASSWORD = $env:POSTGRES_PASSWORD

Write-Host "Eliminando base de datos existente..." -ForegroundColor Cyan

try {
    # Terminar conexiones activas
    & psql -h $DbHost -p $DbPort -U $DbUser -d postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$DbName' AND pid <> pg_backend_pid();"
    
    # Eliminar BD
    & psql -h $DbHost -p $DbPort -U $DbUser -d postgres -c "DROP DATABASE IF EXISTS $DbName;"
    
    # Crear BD nueva
    Write-Host "Creando base de datos nueva..." -ForegroundColor Cyan
    & psql -h $DbHost -p $DbPort -U $DbUser -d postgres -c "CREATE DATABASE $DbName;"
    
    # Restaurar backup
    Write-Host "Restaurando desde backup..." -ForegroundColor Cyan
    & pg_restore -h $DbHost -p $DbPort -U $DbUser -d $DbName -Fc $BackupFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "EXITO: Restauracion exitosa" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: Error en la restauracion" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}
finally {
    $env:PGPASSWORD = ""
}
