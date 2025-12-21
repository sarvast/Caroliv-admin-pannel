@echo off
echo ========================================
echo  FIXING ADMIN PANEL CORS
echo ========================================
echo.

echo Adding CORS origin for admin panel...
echo.

az functionapp cors add --name caroliv-api --allowed-origins http://localhost:3000

if errorlevel 1 (
    echo.
    echo ERROR: Failed to add CORS origin!
    echo.
    echo Please add manually in Azure Portal:
    echo 1. Go to: caroliv-api -^> CORS
    echo 2. Add: http://localhost:3000
    echo 3. Click Save
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  CORS CONFIGURED SUCCESSFULLY!
echo ========================================
echo.
echo Now restart your admin panel:
echo   cd caroliv-admin
echo   npm run dev
echo.
echo Then refresh browser: Ctrl+Shift+R
echo.
pause
