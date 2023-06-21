const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'userRoles.json');

let userRoles = {};

// Load existing userRoles from the JSON file if it exists
if (fs.existsSync(filePath)) {
  const fileData = fs.readFileSync(filePath, 'utf8');
  userRoles = JSON.parse(fileData);
}

function saveUserRolesToFile() {
  const jsonData = JSON.stringify(userRoles, null, 2);

  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('JSON file saved successfully');
    }
  });
}

module.exports = {
  name: 'guildMemberUpdate',

  async execute(oldMember, newMember) {
    const roles = newMember.roles.cache;
    const rolesId = roles.map((role) => role.id);

    userRoles[newMember.id] = rolesId;

    saveUserRolesToFile();
  },
};
