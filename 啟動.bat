@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   出圖自組咒語生產器 v2.0
echo ========================================
echo.
echo 正在啟動應用程式...
echo.

REM 檢查 index.html 是否存在
if not exist "index.html" (
    echo [錯誤] 找不到 index.html
    pause
    exit /b 1
)

REM 直接用預設瀏覽器打開
start "" "index.html"

echo [成功] 應用程式已在瀏覽器中打開
echo.
echo 提示：如需使用本地伺服器，請執行：
echo   npm run dev
echo.
pause
