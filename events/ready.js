const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.user.setActivity('Fight Club', {
      type: ActivityType.Watching,
    });
  },
};
