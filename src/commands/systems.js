const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

module.exports = async () => {
  console.log(chalk.cyan('🔧 AYPackage Systems'));
  console.log(chalk.gray('Install reusable systems and components\n'));
  
  try {
    const systemsDir = path.join(__dirname, '../../systems');
    
    // Check if systems directory exists
    if (!await fs.pathExists(systemsDir)) {
      console.log(chalk.yellow('⚠️  No systems available yet.'));
      console.log(chalk.gray('Systems will be added in future updates.'));
      return;
    }
    
    const systemDirs = await fs.readdir(systemsDir);
    const validSystems = [];
    
    // Filter only directories
    for (const dir of systemDirs) {
      const dirPath = path.join(systemsDir, dir);
      const stat = await fs.stat(dirPath);
      if (stat.isDirectory()) {
        validSystems.push(dir);
      }
    }
    
    if (validSystems.length === 0) {
      console.log(chalk.yellow('⚠️  No systems available yet.'));
      console.log(chalk.gray('Systems will be added in future updates.'));
      return;
    }
    
    console.log(chalk.green(`Found ${validSystems.length} system(s):\n`));
    
    validSystems.forEach((system, index) => {
      console.log(chalk.blue(`${index + 1}. ${system}`));
    });
    
    console.log(chalk.gray('\n💡 Future: Interactive system installer with framework selection'));
    console.log(chalk.gray('   - Framework selection (Next.js, React, etc.)'));
    console.log(chalk.gray('   - Feature selection (extensions, options)'));
    console.log(chalk.gray('   - Package installation prompts'));
    console.log(chalk.gray('   - Code generation and file creation'));
    
  } catch (error) {
    console.error(chalk.red('Error reading systems:'), error.message);
  }
};

