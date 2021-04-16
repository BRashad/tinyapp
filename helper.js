//email look up function
// const emailLookUp = (email) => {
  
//   for (let i in users) {
//     if (users[i]['email'] === email) {
//       return users[i];
//     }
//   }
//   return false;
// };

const emailLookUp = (email, database) => {
  
  for (let user in database) {
    if (database[user]['email'] === email) {
      return database[user];
    }
  }
  return false;
};

module.exports = { emailLookUp };