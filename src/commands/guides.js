const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

module.exports = async () => {
  console.log(chalk.cyan('📚 AYPackage Guides'));
  console.log(chalk.gray('Access framework-specific instruction guides\n'));
  
  try {
    const guidesDir = path.join(__dirname, '../../guides');
    
    // Check if guides directory exists
    if (!await fs.pathExists(guidesDir)) {
      console.log(chalk.yellow('⚠️  No guides available yet.'));
      console.log(chalk.gray('Guides will be added in future updates.'));
      return;
    }
    
    const guideFiles = await fs.readdir(guidesDir);
    
    if (guideFiles.length === 0) {
      console.log(chalk.yellow('⚠️  No guides available yet.'));
      console.log(chalk.gray('Guides will be added in future updates.'));
      return;
    }
    
    console.log(chalk.green(`Found ${guideFiles.length} guide(s):\n`));
    
    guideFiles.forEach((file, index) => {
      const fileName = file.replace(/\.(txt|md)$/, '');
      console.log(chalk.blue(`${index + 1}. ${fileName}`));
    });
    
    console.log(chalk.gray('\n💡 Future: Interactive guide browser with step-by-step instructions'));
    
  } catch (error) {
    console.error(chalk.red('Error reading guides:'), error.message);
  }
};
