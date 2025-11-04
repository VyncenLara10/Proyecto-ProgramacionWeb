# Scripts de Base de Datos

Scripts para gestionar backups, restauración e inicialización de la base de datos PostgreSQL de TikalInvest.

## Archivos

### 1. **init_db.ps1** - Inicializar BD (Primera vez)
```powershell
.\init_db.ps1
```

**Qué hace:**
- Verifica que PostgreSQL esté corriendo
- Crea la base de datos `tikakinvest_db`
- Configura usuarios y permisos

**Cuándo usar:**
- Primera vez que configures el proyecto
- Cuando necesites resetear la BD

---

### 2. **backup_db.ps1** - Hacer backup (Windows)
```powershell
.\backup_db.ps1
```

**Qué hace:**
- Crea dump de la BD completa
- Guarda en carpeta `./backups/`
- Mantiene últimos 7 backups automáticamente
- Crea `backup_latest.dump` (más reciente)

**Cuándo usar:**
- Antes de cambios importantes
- Rutina diaria/semanal
- Antes de actualizar el código

---

### 3. **backup_db.sh** - Hacer backup (Linux/Mac)
```bash
chmod +x backup_db.sh
./backup_db.sh
```

**Mismo comportamiento que backup_db.ps1**

---

### 4. **restore_db.ps1** - Restaurar desde backup
```powershell
.\restore_db.ps1 -BackupFile .\backups\backup_latest.dump
```

**Qué hace:**
- Elimina BD actual
- Restaura desde archivo backup
- Pide confirmación antes de proceder

**Cuándo usar:**
- Recuperación de desastres
- Volver a estado anterior
- Testing de backups

---

## Requisitos

### Windows
```powershell
# PostgreSQL instalado y en PATH
# Verificar:
psql --version
pg_dump --version
```

### Linux/Mac
```bash
# PostgreSQL instalado
brew install postgresql  # Mac
sudo apt-get install postgresql  # Ubuntu/Debian

# Verificar:
psql --version
pg_dump --version
```

---

## Configuración

### Variables de Entorno (Recomendado)

Para no escribir contraseña cada vez:

**Windows:**
```powershell
$env:POSTGRES_PASSWORD = "tu_contraseña"
# O en .env del backend
```

**Linux/Mac:**
```bash
export POSTGRES_PASSWORD="tu_contraseña"
# O en ~/.pgpass:
# localhost:5432:tikakinvest_db:postgres:tu_contraseña
chmod 600 ~/.pgpass
```

---

## Flujo Típico

### Primera vez
```powershell
# 1. Crear BD
.\init_db.ps1

# 2. Aplicar migraciones Django
cd ..\..\backend
python manage.py migrate

# 3. Crear superuser (opcional)
python manage.py createsuperuser
```

### Antes de cambios importantes
```powershell
# 1. Hacer backup
.\backup_db.ps1

# 2. Ver ubicación
ls .\backups\
```

### Si algo falla
```powershell
# 1. Restaurar backup
.\restore_db.ps1 -BackupFile .\backups\backup_latest.dump

# 2. Aplicar migraciones si es necesario
python manage.py migrate
```

---

## Estructura de Backups

```
./backups/
├── backup_latest.dump          # Copia del más reciente
├── backup_20251103_143000.dump
├── backup_20251103_120000.dump
├── backup_20251102_143000.dump
└── ... (hasta 7 archivos)
```

---

## Troubleshooting

### "psql: command not found"
```powershell
# PostgreSQL no está en PATH
# Agregar a PATH manualmente o reinstalar PostgreSQL
```

### "FATAL: Ident authentication failed"
```powershell
# Verificar usuario y contraseña en .env
# Asegurar que POSTGRES_PASSWORD coincide
```

### "Database already exists"
```powershell
.\init_db.ps1 -DbName tikakinvest_db_backup
# O responder 's' cuando pregunte si recrear
```

### Backup corrupto
```powershell
# Probar con backup anterior
.\restore_db.ps1 -BackupFile .\backups\backup_20251102_143000.dump
```

---

## Mejores Prácticas

1. **Backup diario** - Automatizar con task scheduler
2. **Backup antes de cambios** - Antes de migraciones nuevas
3. **Probar restauración** - Verificar que backup funciona
4. **Guardar en ubicación segura** - No solo en local
5. **Versionar changesets** - Junto con migraciones Django

---

## Integración con Django

### Ejecutar migraciones
```bash
cd backend
python manage.py migrate
```

### Revertir migración
```bash
python manage.py migrate apps.nombre version_anterior
```

### Ver estado migraciones
```bash
python manage.py showmigrations
```

---

## Información Técnica

### Formato de Backup
- **Format: `c` (custom)** - Comprimido, más seguro
- **Tamaño:** ~10-50MB (depende de datos)
- **Tiempo:** <1 segundo (sin datos)

### BD PostgreSQL
- **Host:** localhost
- **Port:** 5432
- **User:** postgres
- **DB:** tikakinvest_db
- Password: Ver `.env`

---

## Agenda Sugerida

**Diario:**
```
03:00 AM - Backup automático
```

**Semanal:**
```
Domingo 02:00 AM - Backup full + validación
```

**Mensual:**
```
Primer día del mes - Backup a almacenamiento externo
```

---

Todo configurado!

