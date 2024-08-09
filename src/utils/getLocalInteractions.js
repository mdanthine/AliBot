const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (folder, exceptions = []) => {
  let localInteractions = [];

  const interactionCategories = getAllFiles(
    path.join(__dirname, '..', folder),
    true
  );

  for (const interactionCategory of interactionCategories) {
    const interactionFiles = getAllFiles(interactionCategory);

    for (const interactionFile of interactionFiles) {
      const interactionObject = require(interactionFile);

      if (exceptions.includes(interactionObject.name)) {
        continue;
      }

      localInteractions.push(interactionObject);
    }
  }

  return localInteractions;
};