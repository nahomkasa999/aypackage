#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const versionType = process.argv[2] || 'patch';

if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error('❌ Invalid version type. Use: patch, minor, or major');
  process.exit(1);
}

console.log(`🚀 Releasing ${versionType} version...`);
console.log(`📦 Current version: ${packageJson.version}`);

try {
  // Bump version
  execSync(`pnpm version ${versionType} --no-git-tag-version`, { stdio: 'inherit' });
  
  // Get new version
  const newPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const newVersion = newPackageJson.version;
  
  console.log(`✅ Version bumped to: ${newVersion}`);
  console.log(`📝 Committing changes...`);
  
  // Commit changes
  execSync('git add package.json pnpm-lock.yaml', { stdio: 'inherit' });
  execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });
  
  console.log(`🚀 Pushing to GitHub...`);
  execSync('git push', { stdio: 'inherit' });
  
  console.log(`🎉 Release process started!`);
  console.log(`📋 GitHub Actions will automatically publish to NPM.`);
  console.log(`🔗 Check: https://github.com/nahomkasa999/aypackage/actions`);
  
} catch (error) {
  console.error('❌ Release failed:', error.message);
  process.exit(1);
}
