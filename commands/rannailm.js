const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

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
            .addChoices(
              { name: 'Pirita rand', value: 'Pirita rand' },
              {
                name: 'Pelgurand / Stroomi rand',
                value: 'Pelgurand / Stroomi rand',
              },
              { name: 'Kakumäe rand', value: 'Kakumäe rand' },
              { name: 'Harku järv', value: 'Harku järv' },
              { name: 'Pikakari rand', value: 'Pikakari rand' },
              { name: 'Paralepa rand', value: 'Paralepa rand' },
              { name: 'Vasikaholmi rand', value: 'Vasikaholmi rand' },
              { name: 'Pärnu rand', value: 'Pärnu rand' },
              { name: 'Emajõe vabaujula', value: 'Emajõe vabaujula' },
              { name: 'Emajõe linnaujula', value: 'Emajõe linnaujula' },
              { name: 'Anne kanal', value: 'Anne kanal' },
              { name: 'Verevi järv', value: 'Verevi järv' },
              { name: 'Viljandi järv', value: 'Viljandi järv' },
              { name: 'Tõrva Riiska rand', value: 'Tõrva Riiska rand' },
              { name: 'Tõrva Vanamõisa rand', value: 'Tõrva Vanamõisa rand' },
              { name: 'Kuressaare rand', value: 'Kuressaare rand' },
              { name: 'Pühajärv', value: 'Pühajärv' },
              { name: 'Põlva paisjärv', value: 'Põlva paisjärv' },
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('rannad').setDescription('näita kõiki randu'),
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const dictResult = await request(
      'https://www.g4s.ee/beachesweather2.php?format=json&lang=&extended=true',
    );

    const body = await dictResult.body.json();
    const rannad = body.beaches;
    let description;

    if (interaction.options.getSubcommand() === 'rand') {
      const rannaNimi = interaction.options.getString('rand');
      const rand = rannad.find((el) => el.name === rannaNimi);
      const emoji =
        rand.flag === 'Yellow'
          ? '<:yellow:1101471020860313640>'
          : rand.flag === 'Red'
          ? '<:green:1101471005312024667>'
          : '<:red:1101471038132465724>';
      const waterTemp = rand.water_temp ?? '-';
      const airTemp = rand.air_temp ?? '-';
      const people = rand.peoples ?? '-';
      description = ` ${emoji} **${rand.name}** õhk: **${airTemp}** °C vesi: **${waterTemp}** °C  inimesi: ~ **${people}** `;
    }

    if (interaction.options.getSubcommand() === 'rannad') {
      description = rannad
        .filter((el) => el.name !== null)
        .map((item) => {
          const emoji =
            item.flag === 'Yellow'
              ? '<:yellow:1101471020860313640>'
              : item.flag === 'Red'
              ? '<:green:1101471005312024667>'
              : '<:red:1101471038132465724>';
          const waterTemp = item.water_temp ?? '-';
          const airTemp = item.air_temp ?? '-';
          const people = item.peoples ?? '-';
          return ` ${emoji} **${item.name}** õhk: **${waterTemp} **°C vesi: **${airTemp} **°C  inimesi: **${people}** `;
        })
        .join('\n');
    }

    const embed = new EmbedBuilder()
      .setColor(0xef0f00)
      .setDescription(description);

    interaction.followUp({ embeds: [embed] });
  },
};