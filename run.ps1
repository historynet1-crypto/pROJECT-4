Param(
    [switch]$NoRun
)

$projectPath = Join-Path $PSScriptRoot 'SecLogWeb\SecLogWeb.csproj'

Write-Host "Stopping running SecLogWeb processes (if any)..."

# Stop processes named SecLogWeb (apphost)
Get-Process -Name 'SecLogWeb' -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Stopping process SecLogWeb Id:$($_.Id)"
    try { Stop-Process -Id $_.Id -Force -ErrorAction Stop } catch { }
}

# Additionally try to stop dotnet processes that were started for this project (matches command line)
try {
    $dotnetProcs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and $_.CommandLine -match 'SecLogWeb.csproj' }
    foreach($p in $dotnetProcs) {
        Write-Host "Stopping dotnet process Id:$($p.ProcessId)"
        try { Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop } catch { }
    }
} catch { }

if ($NoRun) {
    Write-Host "Stopped processes. Not starting app because -NoRun specified."
    exit 0
}

Write-Host "Starting SecLogWeb..."
cd $PSScriptRoot
dotnet run --project $projectPath
