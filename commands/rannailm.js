const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const { DateTime } = require('luxon');
const choices = [
  'Pirita rand',
  'Stroomi rand',
  'Kakumäe rand',
  'Harku järv',
  'Pikakari rand',
  'Paralepa rand',
  'Vasikaholmi rand',
  'Pärnu rand',
  'Emajõgi',
  'Anne kanal',
  'Verevi järv',
  'Viljandi järv',
  'Viljandi Paala järv',
  'Tõrva Riiska rand',
  'Tõrva Vanamõisa rand',
  'Kuressaare rand',
  'Paide tehisjärv',
  'Põlva paisjärv',
  'Pühajärv',
].map((e) => ({ name: e, value: e }));

const flagMap = {
  yellow: '<:yellow:1136634248904851627>',
  red: '<:red:1136634224464646174>',
  green: '<:green:1136634168474873888>',
  purple: '<:purple:1136634234178646136>',
  Default: '<:grey:1136634185528901672>',
};
const getOneBeachDescription = (searchString, beaches) => {
  const beach = beaches.find((el) => el.name === searchString);
  if (!beach) return null;

  return getBeachRow(beach);
};

const getBeachListDescription = (beaches) => {
  return beaches
    .filter((el) => el.name !== null)
    .map(getBeachRow)
    .join('\n');
};
const getBeachRow = (beach) => {
  const beachinfo = beach.forecast.beach[0];
  const date = DateTime.fromISO(beachinfo.dateTime)
    .setZone('Europe/Tallinn')
    .toFormat('dd.MM HH:mm');
  const flag = flagMap[beachinfo.flag] || flagMap.Default;
  if (beachinfo.temperature === null)
    return `${flag} **${beach.name}**: andmed puuduvad`;
  else {
    return ` ${flag} **${date} ${beach.name}** õhk: **${beachinfo.temperature} **°C vesi: **${beachinfo.waterTemperature} **°C  inimesi: **${beachinfo.crowd}** `;
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rannailm')
    .setDescription('näitab veetemperatuure supelrandades')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('rand')
        .setDescription('vali üks rand')
        .addStringOption((option) =>
          option
            .setName('rand')
            .setDescription('sisesta ranna nimi')
            .setRequired(true)
            .addChoices(...choices),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('rannad').setDescription('näita kõiki randu'),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const beaches = await request(
      'https://services.postimees.ee/weather/v4/groups/beach/forecast?type=beach&language=et',
    )
      .then((result) => result.body.json())
      .catch((error) => {
        console.error('rannailm', error);
        return null;
      });

    if (!beaches) {
      interaction.followUp('tekkis viga');
      return;
    }

    const subCommand = interaction.options.getSubcommand();
    const searchString = interaction.options.getString('rand');
    const description =
      subCommand === 'rand'
        ? getOneBeachDescription(searchString, beaches)
        : getBeachListDescription(beaches);
    if (!description) {
      return interaction.followUp('Randa ei leitud');
    }
    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setDescription(description);

    interaction.followUp({ embeds: [embed] });
  },
};
