@echo off
echo ===========================================
echo Fit & Flare Studio - Database Setup Script
echo ===========================================
echo.

set /p PGPASSWORD="Enter your PostgreSQL 'postgres' user password: "

echo.
echo Attempting to create database 'fit_flare_studio'...
"C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres fit_flare_studio

echo.
echo Attempting to run schema migration...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d fit_flare_studio -f database/schema.sql

echo.
echo Converting password to backend configuration...
echo DB_PASSWORD=%PGPASSWORD% > backend\.env.local

echo.
echo Database setup attempt complete.
echo If you saw errors above, please check your password and PostgreSQL version/path.
echo You can manually run: psql -U postgres -d fit_flare_studio -f database/schema.sql
pause
