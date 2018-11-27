const db = require('../db/connection');

/**
 * [Generate one user id]
 * @return {Promise} [promise that represents the generated id]
 */
const generateOne = () => {
  return db.info()
  .then(info => {
    const id = info.doc_count + 1;
    return id.toString();
  })
  .catch(error => {
    const err = new Error(error.message);
    err.statusCode = error.status;
    return Promise.reject(err);
  })
}

/**
 * [Generate a number of required ids]
 * @param  {Number} numIdsRequired [required number ids number to generate]
 * @return {Promise} [promise that represents the list of generated ids]
 */
const generateMany = numIdsRequired => {
  return db.info()
  .then(info => {
    return info.doc_count + 1;
  })
  .then(idBase => {
    return new Promise((resolve, reject) => {
      const idsGenerated = [];
      (function generate() {
        if(numIdsRequired == idsGenerated.length){
          return resolve(idsGenerated);
        } else {
          idsGenerated.push(idBase.toString());
          idBase += 1;
          setTimeout(generate, 0);
        }
      })();
    });
  })
  .catch(error => {
    const err = new Error(error.message);
    err.statusCode = error.status;
    return Promise.reject(err);
  })
};

module.exports = {
  generateOne,
  generateMany
}
