$ErrorActionPreference = "Continue"
Start-Transcript -Path "push_log.txt" -Force

Write-Host "Checking Git..."
git --version

Write-Host "Initializing Git..."
git init

Write-Host "Configuring User (if needed)..."
git config user.email "admin@caroliv.com"
git config user.name "Caroliv Admin"

Write-Host "Adding Files..."
git add .

Write-Host "Committing..."
git commit -m "Initial commit for admin panel"

Write-Host "Renaming Branch..."
git branch -M main

Write-Host "Adding Remote..."
git remote remove origin
git remote add origin https://github.com/sarvast/Caroliv-admin-pannel.git

Write-Host "Pushing..."
git push -u origin main

Stop-Transcript
