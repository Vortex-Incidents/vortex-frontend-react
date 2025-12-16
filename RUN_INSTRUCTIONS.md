# How to Run Vortex Frontend

## Prerequisites
- Node.js installed.
- Git installed.

> **⚠️ IMPORTANTE: Si recibes un error en PowerShell**
> Si ves "No se puede cargar el archivo... porque la ejecución de scripts está deshabilitada", ejecuta este comando en tu terminal primero:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```
> O usa **Command Prompt (CMD)** en lugar de PowerShell.

## 1. Install Dependencies
Open your terminal (Command Prompt or PowerShell) in this folder:
`c:\Users\samya\OneDrive\Documentos\GitHub\vortex-frontend-react`

Run:
```bash
npm install
```
*Note: If you see errors about missing modules, this step is crucial.*

## 2. Start the Development Server
To run the app locally:
```bash
npm run dev
```
or
```bash
npm start
```

The app should open at `http://localhost:5173` (or `http://localhost:3000` depending on Vite/CRA).

## 3. Login Credentials
Since the app now uses the *real* Java backend:
- **Email**: `tech1@example.com`
- **Password**: `password123`
*(As provided in the API documentation)*

## Troubleshooting
- **"Running scripts is disabled..."**: If you see this error in PowerShell, try running this command first:
  `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
  Or use "Command Prompt" (cmd.exe) instead of PowerShell.
- **Charts Empty**: The admin dashboard charts will be empty until you create some incidents via the "New Incident" button (logged in as Employee).
