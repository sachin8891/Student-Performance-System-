# ============================================================================
# AI-Powered Student Performance Tracker - Single Command Launcher
# Tech Stack: Python, Pandas, SQL, MySQL, Java, React.js, Generative AI APIs
# ============================================================================

$root = $PSScriptRoot
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Starting AI-Powered Student Performance Tracker System    " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Ensure PATH has Node.js and OpenJDK
$env:PATH = "C:\Users\HP\.tools\node;C:\Users\HP\.tools\jdk\bin;$env:PATH"

# 2. Initialize / Verify Database
Write-Host "`n[1/4] Verifying Relational Database & Seed Data..." -ForegroundColor Yellow
python "$root\database\db_setup.py"

# 3. Start Java 21 Backend Service (Port 8080)
Write-Host "[2/4] Starting Java Backend Microservice on port 8080..." -ForegroundColor Yellow
$javaBin = "$root\backend-java\bin"
Start-Process -FilePath "C:\Users\HP\.tools\jdk\bin\java.exe" -ArgumentList "-cp `"$javaBin`" com.tracker.JavaBackendApplication" -WindowStyle Hidden

# 4. Start Python Analytics & GenAI REST API (Port 5000)
Write-Host "[3/4] Starting Python & Pandas Analytics API on port 5000..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "`"$root\analytics-python\app.py`"" -WindowStyle Hidden

# 5. Start React.js Dashboard (Port 3000)
Write-Host "[4/4] Starting React.js Frontend on http://localhost:3000..." -ForegroundColor Green
Write-Host "`nAll services active!" -ForegroundColor Cyan
Write-Host "  - React Dashboard:  http://localhost:3000" -ForegroundColor White
Write-Host "  - Python Analytics: http://localhost:5000/api/analytics/overview" -ForegroundColor White
Write-Host "  - Java REST API:    http://localhost:8080/api/java/students" -ForegroundColor White

Set-Location "$root\frontend-react"
& "C:\Users\HP\.tools\node\npm.cmd" run dev
