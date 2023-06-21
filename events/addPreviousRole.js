const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'userRoles.json');

module.exports = {
  name: Events.GuildMemberAdd,

  async execute(member) {
    fs.readFile(filePath, 'utf8', (err, fileData) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        return;
      }

      const userRoles = JSON.parse(fileData);
      const memberID = member.id;

      if (memberID in userRoles) {
        const roleIDs = userRoles[memberID];

        for (let i = 0; i < roleIDs.length; i++) {
          const roleID = roleIDs[i];

          const foundRole = member.guild.roles.cache.find(
            (r) => r.id === roleID,
          );
          console.log(foundRole.name);
          if (!foundRole) {
            continue;
          }

          member.roles.add(roleID);
        }
      }
    });
  },
};
