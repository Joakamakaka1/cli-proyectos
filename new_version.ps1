[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Leer package.json
$pkgPath = Join-Path $PSScriptRoot "package.json"
if (-not (Test-Path $pkgPath)) {
    Write-Error "No se encontró package.json en $PSScriptRoot"
    exit 1
}

$packageJson = Get-Content -Path $pkgPath -Raw | ConvertFrom-Json
$currentVersion = $packageJson.version

if (-not ($currentVersion -match '^(\d+)\.(\d+)\.(\d+)$')) {
    Write-Error "Versión inválida en package.json: $currentVersion"
    exit 1
}

$major = [int]$Matches[1]
$minor = [int]$Matches[2]
$patch = [int]$Matches[3]

Write-Host "Versión actual: $currentVersion" -ForegroundColor Cyan
Write-Host ""
Write-Host "¿Qué tipo de bump quieres hacer?"
Write-Host "  1) patch  →  $major.$minor.$($patch + 1)"
Write-Host "  2) minor  →  $major.$($minor + 1).0"
Write-Host "  3) major  →  $($major + 1).0.0"

$bumpChoice = Read-Host "Elige (1/2/3)"

switch ($bumpChoice) {
    "1" { $patch++;                             $newVersion = "$major.$minor.$patch" }
    "2" { $minor++; $patch = 0;                 $newVersion = "$major.$minor.$patch" }
    "3" { $major++; $minor = 0; $patch = 0;     $newVersion = "$major.$minor.$patch" }
    default { Write-Error "Opción inválida"; exit 1 }
}

Write-Host ""
Write-Host "Nueva versión: $newVersion" -ForegroundColor Green

# Actualizar versión en package.json preservando el formato original
$rawContent = Get-Content -Path $pkgPath -Raw
$updatedContent = $rawContent -replace '("version":\s*)"[^"]+"', "`$1`"$newVersion`""
Set-Content -Path $pkgPath -Value $updatedContent -NoNewline

# Commit fijo de chore
$fullMessage = "chore 🔧: bump version to $newVersion"

git -C $PSScriptRoot add "package.json"
git -C $PSScriptRoot commit -m $fullMessage

Write-Host ""
Write-Host "Commit creado: $fullMessage" -ForegroundColor Cyan
Write-Host "Recuerda hacer push cuando estés listo."