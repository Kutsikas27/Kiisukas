const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

const flagMap = {
  Yellow: '<:yellow:1101471020860313640>',
  Red: '<:red:1101471038132465724>',
  Green: '<:green:1101471005312024667>',
  Purple: '<:purple:1105437530368778300>',
  Default: '<:grey:1105458610126987355>',
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

    getBeachRow = (beach) => {
      const flag = flagMap[beach.flag] || flagMap.Default;
      if (beach.water_temp === null)
        return `${flag} **${beach.name}**: andmed puuduvad`;
      else {
        return ` ${flag} **${beach.day_only} ${beach.time} ${beach.name}** õhk: **${beach.air_temp} **°C vesi: **${beach.water_temp} **°C  inimesi: **${beach.peoples}** `;
      }
    };

    funktsioonNr1 = (rannaNimi, rannad) => {
      const rand = rannad.find((el) => el.name === rannaNimi);

      return getBeachRow(rand);
    };

    funktsioonNr2 = (rannad) => {
      return rannad
        .filter((el) => el.name !== null)
        .map(getBeachRow)
        .join('\n');
    };

    const subCommand = interaction.options.getSubcommand();
    const rannaNimi = interaction.options.getString('rand');
    const description =
      subCommand === 'rand'
        ? funktsioonNr1(rannaNimi, rannad)
        : funktsioonNr2(rannad);

    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setDescription(description);

    interaction.followUp({ embeds: [embed] });
  },
};
