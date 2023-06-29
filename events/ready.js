const { Events, ActivityType } = require('discord.js');
const { DateTime } = require('luxon');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    const uptime = DateTime.fromJSDate(client.readyAt)
      .setZone('Europe/Tallinn')
      .toFormat('dd.MM HH:mm');

    console.log(uptime);
    client.user.setActivity(`online since ${uptime}`, {
      type: ActivityType.Playing,
    });
  },
};
