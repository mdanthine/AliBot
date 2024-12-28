const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (folder, exceptions = []) => {
  let localInteractions = [];

  try {
    const interactionCategories = getAllFiles(path.join(__dirname, '..', folder), true);

    for (const interactionCategory of interactionCategories) {
      const interactionFiles = getAllFiles(interactionCategory);

      for (const interactionFile of interactionFiles) {
        try {
          const interactionObject = require(interactionFile);

          if (exceptions.includes(interactionObject.name)) {
            continue;
          }

          localInteractions.push(interactionObject);
        } catch (error) {
          console.error(`Error loading interaction file ${interactionFile}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error loading interaction categories: ${error.message}`);
  }

  return localInteractions;
};