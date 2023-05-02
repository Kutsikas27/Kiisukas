const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,

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

		await channel.send(`**${member.displayName}** liitus serveriga! 👋`);
	},
};
