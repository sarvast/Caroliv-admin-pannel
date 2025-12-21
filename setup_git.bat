@echo off
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/sarvast/Caroliv-admin-pannel.git
git push -u origin main
