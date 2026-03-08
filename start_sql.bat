@echo off
@REM cd C:\mysql\bin

echo Starting MySQL server...
start "" mysqld

echo Waiting for server to initialize...
timeout /t 5 >nul

echo Connecting to MySQL...
mysql -u root -p

pause