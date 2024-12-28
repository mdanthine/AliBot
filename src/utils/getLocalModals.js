const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
  let localModals = [];

  try {
    const modalCategories = getAllFiles(path.join(__dirname, '..', 'modals'), true);

    for (const modalCategory of modalCategories) {
      const modalFiles = getAllFiles(modalCategory);

      for (const modalFile of modalFiles) {
        try {
          const modalObject = require(modalFile);

          if (exceptions.includes(modalObject.name)) {
            continue;
          }

          localModals.push(modalObject);
        } catch (error) {
          console.error(`Error loading modal file ${modalFile}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error loading modal categories: ${error.message}`);
  }

  return localModals;
};