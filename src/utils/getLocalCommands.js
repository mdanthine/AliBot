const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
  let localCommands = [];

  try {
    const commandCategories = getAllFiles(
      path.join(__dirname, '..', 'commands'),
      true
    );

    for (const commandCategory of commandCategories) {
      try {
        const commandFiles = getAllFiles(commandCategory);
        for (const commandFile of commandFiles) {
          try {
            const commandObject = require(commandFile);

            if (exceptions.includes(commandObject.name)) {
              continue;
            }

            localCommands.push(commandObject);
          } catch (error) {
            console.error(`Error loading command file ${commandFile}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error reading command category ${commandCategory}:`, error);
      }
    }
  } catch (error) {
    console.error('Error reading command categories:', error);
  }

  return localCommands;
};