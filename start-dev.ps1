$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendRoot = Join-Path $projectRoot "python-server"
$frontendRoot = Join-Path $projectRoot "frontend"
$activateScript = Join-Path $backendRoot ".venv\Scripts\Activate.ps1"

$backendCommand = "Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned; & '$activateScript'; Set-Location '$backendRoot'; uvicorn main:app --reload --port 8000"
$frontendCommand = "Set-Location '$frontendRoot'; npm run dev"

Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    $backendCommand
)

Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    $frontendCommand
)

Write-Host "FastAPI and Next.js are starting in separate PowerShell windows."
Write-Host "Frontend: http://localhost:3000"
Write-Host "FastAPI docs: http://127.0.0.1:8000/docs"