const { Events } = require('discord.js');
const { userRoles } = require('./getUserArray');

module.exports = {
  name: Events.GuildMemberAdd,

  async execute(member) {
    if (member.id in userRoles) {
      const values = userRoles[member.id];
      for (let i = 0; i < values.length; i++) {
        const roleID = values[i];
        const foundRole = member.guild.roles.cache.has(roleID);
        if (!foundRole) continue;
        member.roles.add(roleID);
      }
    }
  },
};
