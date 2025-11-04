# Script de backup para PostgreSQL en Windows
# Uso: .\backup_db.ps1

param(
    [string]$BackupDir = ".\backups",
    [string]$DbName = "tikakinvest_db",
    [string]$DbUser = "postgres",
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432
)

$Date = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\backup_$Date.dump"

# Crear directorio si no existe
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Configurar variable de entorno para no pedir contraseña
$env:PGPASSWORD = $env:POSTGRES_PASSWORD

# Realizar backup
Write-Host "Iniciando backup de la base de datos..." -ForegroundColor Cyan

try {
    & pg_dump -h $DbHost -p $DbPort -U $DbUser -d $DbName -F c -f $BackupFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "EXITO: Backup exitoso: backup_$Date.dump" -ForegroundColor Green
        Write-Host "Ubicacion: $BackupFile" -ForegroundColor Green
        
        # Guardar último backup
        Copy-Item $BackupFile "$BackupDir\backup_latest.dump" -Force
        
        # Limpiar backups antiguos (mantener últimos 7)
        $BackupFiles = Get-ChildItem "$BackupDir\backup_*.dump" -ErrorAction SilentlyContinue | 
                       Sort-Object LastWriteTime -Descending
        if ($BackupFiles.Count -gt 7) {
            $BackupFiles | Select-Object -Skip 7 | Remove-Item -Force
            Write-Host "Backups antiguos eliminados" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "ERROR: Error al realizar backup (exit code: $LASTEXITCODE)" -ForegroundColor Red
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
