[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Leer versión actual de package.json
$pkgPath = Join-Path $PSScriptRoot "package.json"
if (-not (Test-Path $pkgPath)) {
    Write-Error "No se encontró package.json en $PSScriptRoot"
    exit 1
}

$packageJson = Get-Content -Path $pkgPath -Raw | ConvertFrom-Json
$version     = $packageJson.version
$tag         = "v$version"

Write-Host "Versión a publicar: $tag" -ForegroundColor Cyan

# Comprobar si el tag ya existe (local o remoto)
$existingLocal = git -C $PSScriptRoot tag -l $tag
$existingRemote = git -C $PSScriptRoot ls-remote --tags origin "refs/tags/$tag" 2>$null

if ($existingLocal -or $existingRemote) {
    Write-Host "El tag $tag ya existe. No se creará de nuevo." -ForegroundColor Yellow
    exit 0
}

# Detectar rama principal (main o master)
$branches = git -C $PSScriptRoot branch -a 2>$null
$mainBranch = $null
foreach ($line in $branches) {
    $b = $line.Trim() -replace '^\* ', '' -replace '^remotes/origin/', ''
    if ($b -eq 'main' -or $b -eq 'master') {
        $mainBranch = $b
        break
    }
}

if (-not $mainBranch) {
    Write-Error "No se encontró la rama main ni master."
    exit 1
}

Write-Host "Cambiando a $mainBranch y haciendo pull..." -ForegroundColor Cyan

git -C $PSScriptRoot checkout $mainBranch
if ($LASTEXITCODE -ne 0) { Write-Error "Error al cambiar a $mainBranch"; exit 1 }

git -C $PSScriptRoot pull origin $mainBranch
if ($LASTEXITCODE -ne 0) { Write-Error "Error al hacer pull de $mainBranch"; exit 1 }

# Crear tag anotado
git -C $PSScriptRoot tag -a $tag -m "Release $tag"
if ($LASTEXITCODE -ne 0) { Write-Error "Error al crear el tag $tag"; exit 1 }

Write-Host ""
Write-Host "Tag $tag creado correctamente en $mainBranch." -ForegroundColor Green
Write-Host "Para publicarlo ejecuta: git push origin $tag"