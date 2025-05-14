@echo off
echo [1/2] 正在启动 MySQL 服务...

REM 尝试启动 MySQL（默认服务名为 MySQL80）
net start MySQL80

IF %ERRORLEVEL% EQU 0 (
    echo MySQL 服务已启动。
) ELSE (
    echo MySQL 服务可能已经在运行，或启动失败。
)
