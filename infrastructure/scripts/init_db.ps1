# Script para configurar la base de datos por primera vez
# Uso: .\init_db.ps1

param(
    [string]$DbName = "tikakinvest_db",
    [string]$DbUser = "postgres",
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432,
    [string]$DbPassword = "postgres123"
)

$env:PGPASSWORD = $DbPassword

Write-Host "Inicializando base de datos de TikalInvest..." -ForegroundColor Cyan

try {
    # Verificar conexión a PostgreSQL
    Write-Host "Verificando conexión a PostgreSQL..." -ForegroundColor Yellow
    & psql -h $DbHost -p $DbPort -U $DbUser -d postgres -c "SELECT version();" | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: No se puede conectar a PostgreSQL" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "EXITO: Conexion a PostgreSQL exitosa" -ForegroundColor Green
    
    # Verificar si BD existe
    Write-Host "Verificando base de datos..." -ForegroundColor Yellow
    $result = & psql -h $DbHost -p $DbPort -U $DbUser -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname='$DbName';"
    
    if ($result -contains "1") {
        Write-Host "ADVERTENCIA: La base de datos ya existe" -ForegroundColor Yellow
        $confirm = Read-Host "¿Recrear? (s/n)"
        
        if ($confirm -eq 's' -or $confirm -eq 'S') {
            Write-Host "Eliminando BD existente..." -ForegroundColor Yellow
            & psql -h $DbHost -p $DbPort -U $DbUser -d postgres -c "DROP DATABASE IF EXISTS $DbName;"
        }
        else {
            Write-Host "Continuando con BD existente..." -ForegroundColor Yellow
            exit 0
        }
    }
    
    # Crear base de datos
    Write-Host "Creando base de datos: $DbName" -ForegroundColor Cyan
    & psql -h $DbHost -p $DbPort -U $DbUser -d postgres -c "CREATE DATABASE $DbName;"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "EXITO: Base de datos creada" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: Error al crear base de datos" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "EXITO: Inicializacion completada" -ForegroundColor Green
    Write-Host "Proximo paso: Ejecutar migraciones de Django" -ForegroundColor Cyan
    Write-Host "  python manage.py migrate" -ForegroundColor White
    
}
catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}
finally {
    $env:PGPASSWORD = ""
}
