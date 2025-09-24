const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

module.exports = async () => {
  console.log(chalk.cyan('📝 AYPackage Prompts'));
  console.log(chalk.gray('Browse and copy proven prompts from the community\n'));
  
  try {
    const promptsDir = path.join(__dirname, '../../prompts');
    
    // Check if prompts directory exists
    if (!await fs.pathExists(promptsDir)) {
      console.log(chalk.yellow('⚠️  No prompts available yet.'));
      console.log(chalk.gray('Prompts will be added in future updates.'));
      return;
    }
    
    const promptFiles = await fs.readdir(promptsDir);
    
    if (promptFiles.length === 0) {
      console.log(chalk.yellow('⚠️  No prompts available yet.'));
      console.log(chalk.gray('Prompts will be added in future updates.'));
      return;
    }
    
    console.log(chalk.green(`Found ${promptFiles.length} prompt(s):\n`));
    
    promptFiles.forEach((file, index) => {
      const fileName = file.replace(/\.(txt|md|yaml|yml)$/, '');
      console.log(chalk.blue(`${index + 1}. ${fileName}`));
    });
    
    console.log(chalk.gray('\n💡 Future: Interactive prompt browser with copy-to-clipboard functionality'));
    
  } catch (error) {
    console.error(chalk.red('Error reading prompts:'), error.message);
  }
};
