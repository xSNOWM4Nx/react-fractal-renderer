# Exit immediately if a command exits with a non-zero status
set -e

# Move to project root (one directory up from scripts/)
cd "$(dirname "$0")/.."

# Build the project
npm run build

# Prepare temporary directory for deployment
deploy_dir="gh-pages-temp"
rm -rf "$deploy_dir"
mkdir "$deploy_dir"

# Copy build output to the temporary directory
cp -r dist/* "$deploy_dir"

# Move into the deploy directory
cd "$deploy_dir"

# Initialize a new git repo and configure user info
git init
git config user.name "GitHub Actions"
git config user.email "actions@github.com"

# Add and commit all files
git add .
git commit -m "Deploy"

# Push to gh-pages branch (force overwrite)
git branch -M gh-pages
git remote add origin "$(git -C .. remote get-url origin)"
git push origin gh-pages --force

# Cleanup: Move back to project root and remove temp folder
cd ..
rm -rf "$deploy_dir"