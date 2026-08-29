param(
  [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'
$pluginRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $pluginRoot

if (-not $SkipInstall -and -not (Test-Path -LiteralPath (Join-Path $pluginRoot 'node_modules'))) {
  npm install
  if ($LASTEXITCODE -ne 0) {
    throw "npm install failed with exit code $LASTEXITCODE"
  }
}

npm run dev
if ($LASTEXITCODE -ne 0) {
  throw "npm run dev failed with exit code $LASTEXITCODE"
}
