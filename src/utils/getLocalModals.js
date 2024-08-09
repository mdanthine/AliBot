const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
  let localModals = [];

  const modalCategories = getAllFiles(
    path.join(__dirname, '..', 'modals'),
    true
  );

  for (const modalCategory of modalCategories) {
    const modalFiles = getAllFiles(modalCategory);

    for (const modalFile of modalFiles) {
      const modalObject = require(modalFile);

      if (exceptions.includes(modalObject.name)) {
        continue;
      }

      localModals.push(modalObject);
    }
  }

  return localModals;
};