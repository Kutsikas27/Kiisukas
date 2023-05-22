const { Events } = require('discord.js');

const humanizeDuration = require('humanize-duration');

module.exports = {
  name: Events.GuildMemberRemove,

  async execute(member) {
    const channel = member.guild.channels.cache.get(
      process.env.MAIN_CHANNEL_ID,
    );

    if (!channel) {
      console.log(
        this.name,
        `Ei leidnud kanalit: ${process.env.MAIN_CHANNEL_ID} `,
      );
      return;
    }
    if (!member.joinedAt)
      return await channel.send(
        `**${member.displayName}** lahkus meie hulgast.`,
      );

    const duration = Date.now() - member.joinedAt.getTime();
    await channel.send(
      `**${
        member.displayName
      }** lahkus meie hulgast. Tema elueaks jäi ${humanizeDuration(duration, {
        language: 'et',
        round: true,
        conjunction: ' ja ',
        largest: 2,
        serialComma: false,
      })}! Aamen! 🙏`,
    );
  },
};
