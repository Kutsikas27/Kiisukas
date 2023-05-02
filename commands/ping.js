const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const humanizeDuration = require('humanize-duration');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Näitab kaua Kiisukas ärkvel on olnud'),

	async execute(interaction) {
		const uptime = humanizeDuration(process.uptime() * 1000, {
			language: 'et',
			round: true,
			conjunction: ' ja ',
			largest: 2,
			serialComma: false,
		});

		const sent = await interaction.reply({
			content: 'Pinging...',
			fetchReply: true,
		});
		await interaction.editReply(
			`Kiisukas on ärkvel olnud **${uptime}**, ping: **${
				sent.createdTimestamp - interaction.createdTimestamp
			} ms** `,
		);

		await wait(20000);
		await interaction.deleteReply().catch((err) => console.log(err));
	},
};
