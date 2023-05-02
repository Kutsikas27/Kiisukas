const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const getWeatherEmoji = (icon) =>
	({
		clear: '☀️',
		'partly-cloudy': '⛅️',
		cloudy: '☁️',
		snow: '🌨',
		rain: '🌧',
		thunder: '⛈',
		lightning: '🌩',
		fog: ':fog:',
		hail: '🌨',
		sleet: '🌧',
		thunderstorm: '⛈️',
		wind: '🌬️',
	}[icon] || '❓');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ilm')
		.setDescription('Hetke ilm eesti/maailma eri paigus')
		.addStringOption((option) =>
			option
				.setName('linn')
				.setDescription('Sisesta linna nimi')
				.setRequired(true),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const linn = interaction.options.getString('linn');

		const idResult = await request(
			`https://services.postimees.ee/places/v1/autocomplete/${linn}?language=et`,
		);

		const id = await idResult.body.json();
		if (!id || !id.length) {
			return interaction.editReply(`Ei leidnud vastet asukohale **${linn}**.`);
		}
		const getId = id[0].id;
		const getDescription = id[0].description;

		const ilmResult = await request(
			`https://services.postimees.ee/weather/v4/testing/place/${getId}/forecast?type=currently&language=et`,
		);

		const { forecast } = await ilmResult.body.json();
		const {
			summary,
			temperature,
			apparentTemperature,
			windSpeed,
			dateTime,
			icon,
		} = forecast.currently[0];
		const eestiAeg = new Date(dateTime).toLocaleString('et-EE');
		const embed = new EmbedBuilder()
			.setColor(0xefff00)
			.setTitle(`${getDescription} ${getWeatherEmoji(icon)}`)
			.setDescription(
				`${summary}, **${Math.round(temperature)}°C** (tajutav **${Math.round(
					apparentTemperature,
				)}°C**), tuulekiirus **${Math.round(windSpeed)} m/s**`,
			)
			.setFooter({
				text: `Aeg ${eestiAeg}`,
			});

		interaction.followUp({ embeds: [embed] });
	},
};
