# Change to project root
Set-Location -Path (Join-Path $PSScriptRoot "..")

# Build the project
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Error "Build failed!"
  exit 1
}

# Create a temporary directory for deployment
$deployDir = "$pwd\gh-pages-temp"
Remove-Item -Recurse -Force $deployDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $deployDir

# Copy build output to the temp directory
Copy-Item -Path .\dist\* -Destination $deployDir -Recurse -Force

# Initialize a temporary git repo (or reuse .git if you prefer)
Set-Location $deployDir
git init
git config user.name "GitHub Actions"
git config user.email "actions@github.com"

# Commit and force push to gh-pages branch
git add .
git commit -m "Deploy"
git branch -M gh-pages
git remote add origin (git -C .. remote get-url origin)
git push origin gh-pages --force

# Cleanup and return
Set-Location ..
Remove-Item -Recurse -Force $deployDir