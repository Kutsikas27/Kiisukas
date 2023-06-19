const { userRoles } = require('./getUserArray');

module.exports = {
  name: 'guildMemberUpdate',

  async execute(oldMember, newMember) {
    const roles = newMember.roles.cache;
    const rolesId = roles.map((role) => role.id);

    userRoles[newMember.id] = rolesId;
  },
};
