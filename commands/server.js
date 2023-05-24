const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DateTime } = require('luxon');
const humanizeDuration = require('humanize-duration');
const { request } = require('undici');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Kuvab informatsiooni serveri kohta'),

  async execute(interaction) {
    const guild = interaction.guild;
    const getMemberCount = guild.memberCount;
    const getGuildLogo = guild.iconURL();
    const serverCreationDate = DateTime.fromJSDate(guild.createdAt)
      .setZone('Europe/Tallinn')
      .setLocale('et')
      .toFormat('d.MMMM yyyy HH:mm');

    const timePassedSinceCreation = humanizeDuration(
      guild.createdTimestamp - Date.now(),
      {
        language: 'et',
        round: true,
        conjunction: ' ja ',
        largest: 2,
        serialComma: false,
      },
    );
    const idResult = await request(
      `https://discord.com/api/guilds/1065024077884047481/widget.json`,
    );

    const body = await idResult.body.json();

    const onlineMembers = body.presence_count;

    const embed = new EmbedBuilder()
      .setColor('#71368A')
      .setTitle('KOODIJUTUD')
      .setURL('https://koodijutud.ee/')
      .setThumbnail(getGuildLogo)
      .addFields({
        name: `👥 **${getMemberCount} Kasutajat**`,
        value: `🟢 **${onlineMembers} Online**`,
      })
      .addFields({
        name: '🕙 ** Server Loodud** ',
        value: `${serverCreationDate} (${timePassedSinceCreation} tagasi)`,
        inline: true,
      });

    await interaction.reply({ embeds: [embed] });
  },
};
