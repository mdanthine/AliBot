const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
  let localButtons = [];

  try {
    const buttonCategories = getAllFiles(path.join(__dirname, '..', 'buttons'), true);

    for (const buttonCategory of buttonCategories) {
      const buttonFiles = getAllFiles(buttonCategory);

      for (const buttonFile of buttonFiles) {
        try {
          const buttonObject = require(buttonFile);

          if (exceptions.includes(buttonObject.name)) {
            continue;
          }

          localButtons.push(buttonObject);
        } catch (error) {
          console.error(`Error loading button file ${buttonFile}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error loading button categories: ${error.message}`);
  }

  return localButtons;
};