# Automatic Package Updates Setup Guide

This guide explains how to set up automatic npm package publishing when changes are made to the main branch.

## 🚀 Quick Setup (Recommended)

### Step 1: Choose Your Workflow

I've created 3 different GitHub Actions workflows for you:

1. **`publish.yml`** - Simple automatic publishing
2. **`auto-release.yml`** - Advanced with automatic version bumping
3. **`simple-publish.yml`** - Simple with manual control

### Step 2: Set Up NPM Token

1. **Create NPM Token:**
   ```bash
   npm login
   npm token create --read-only=false
   ```

2. **Add to GitHub Secrets:**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your NPM token

### Step 3: Enable the Workflow

1. **Choose one workflow** (I recommend `simple-publish.yml` for beginners)
2. **Delete the other two** workflow files
3. **Commit and push** to enable the workflow

## 📋 Workflow Options Explained

### Option 1: Simple Publish (`publish.yml`)
- ✅ Publishes on every push to main
- ✅ No version bumping
- ✅ Good for development/testing

### Option 2: Auto Release (`auto-release.yml`)
- ✅ Automatic version bumping based on commit messages
- ✅ Creates GitHub releases
- ✅ More sophisticated
- ⚠️ Requires careful commit message conventions

### Option 3: Simple Publish with Control (`simple-publish.yml`)
- ✅ Only publishes when source files change
- ✅ Manual version bumping
- ✅ More control over releases
- ✅ Recommended for production

## 🎯 Recommended Setup

For your first launch, I recommend **Option 3** (`simple-publish.yml`):

```bash
# Keep only this file:
.github/workflows/simple-publish.yml

# Delete these:
.github/workflows/publish.yml
.github/workflows/auto-release.yml
```

## 🔧 Manual Version Bumping

When you want to release a new version:

1. **Update version in package.json:**
   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```

2. **Commit and push:**
   ```bash
   git add package.json
   git commit -m "chore: bump version to 1.0.1"
   git push
   ```

3. **GitHub Actions will automatically publish to NPM**

## 🚨 Important Notes

### Before First Launch:
1. **Test locally first:**
   ```bash
   npm pack  # Creates a tarball to test
   ```

2. **Make sure package.json is correct:**
   - Name is unique on NPM
   - Version starts at 1.0.0
   - All required fields are filled

3. **Test the workflow:**
   - Push a small change
   - Check GitHub Actions tab
   - Verify it publishes to NPM

### Security:
- Never commit NPM tokens to code
- Use GitHub Secrets only
- Consider using read-only tokens for CI

## 🔄 How It Works

1. **You push to main branch**
2. **GitHub Actions detects the change**
3. **Workflow runs automatically**
4. **Package gets published to NPM**
5. **Users can update with:**
   ```bash
   npm install -g aypackage@latest
   ```

## 🛠️ Troubleshooting

### Common Issues:

1. **"NPM_TOKEN not found"**
   - Check GitHub Secrets are set correctly
   - Make sure secret name is exactly `NPM_TOKEN`

2. **"Package already exists"**
   - Version number needs to be incremented
   - Run `npm version patch` before pushing

3. **"Workflow not running"**
   - Check file is in `.github/workflows/` directory
   - Make sure YAML syntax is correct
   - Check GitHub Actions tab for errors

## 📈 Advanced Features

### Automatic Version Bumping (Option 2):
Uses commit message conventions:
- `feat:` → minor version bump
- `fix:` → patch version bump
- `BREAKING CHANGE:` → major version bump

### Manual Triggers:
All workflows support manual triggering:
- Go to Actions tab
- Select your workflow
- Click "Run workflow"

## 🎉 Ready to Launch!

Once you've set up the workflow:

1. **Test it with a small change**
2. **Verify it publishes to NPM**
3. **Share your package with the world!**

```bash
# Users can install your package:
npm install -g aypackage

# And it will auto-update when you push changes!
```
