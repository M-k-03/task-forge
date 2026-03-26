---
description: How to set up the development environment for the Ionic Utility App on Windows
---

# Windows Environment Setup

## Prerequisites

### 1. Fix PowerShell Execution Policy (Windows)
Windows blocks npm scripts by default. Run this **once** in PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

> This allows locally-created scripts to run. Close & reopen your terminal after running it.

### 2. Verify Node.js & npm
```powershell
node -v
npm -v
```

## Project Setup

### 3. Install Ionic CLI
```powershell
npm install -g @ionic/cli
```

### 4. Initialize Ionic Project (first time only)
If starting from scratch or the project has no `package.json`:

```powershell
cd C:\Users\HP\MKPrep\IonicProjects
ionic start utility-app blank --type=angular-standalone --no-git
```

> If the folder already has custom source files, **back them up first**, scaffold the project, then copy them back:
> ```powershell
> Copy-Item -Path "utility-app\src" -Destination "utility-app-backup-src" -Recurse
> Remove-Item -Path "utility-app" -Recurse -Force
> ionic start utility-app blank --type=angular-standalone --no-git
> Copy-Item -Path "utility-app-backup-src\app\*" -Destination "utility-app\src\app\" -Recurse -Force
> Remove-Item -Path "utility-app-backup-src" -Recurse -Force
> ```

### 5. Install project dependencies
```powershell
cd C:\Users\HP\MKPrep\IonicProjects\utility-app
npm install
```

> If you see peer dependency conflicts, use `npm install --legacy-peer-deps`.

### 5. Run the app
```powershell
ionic serve
```

The app will open at `http://localhost:8100`.

## Troubleshooting

| Issue | Fix |
|---|---|
| `npm.ps1 cannot be loaded` | Run the `Set-ExecutionPolicy` command from Step 1 |
| `ionic` not recognized | Close & reopen terminal after installing Ionic CLI |
| Angular version conflicts | Use `npm install --legacy-peer-deps` |
| Permission errors | Run PowerShell as Administrator |
