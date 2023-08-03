const { SlashCommandBuilder } = require('discord.js');

const diceEmojis = [
  '<:dicesixfacesone1:1136634862435057675>',
  '<:dicesixfacestwo:1136635283543162890>',
  '<:dicesixfacesthree:1136635295605989376>',
  '<:dicesixfacesfour:1136635306448265276>',
  '<:dicesixfacesfive:1136635314761371709>',
  '<:dicesixfacessix:1136635330041233489>',
];
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  data: new SlashCommandBuilder()

    .setName('roll')
    .setDescription('veereta')
    .addIntegerOption((option) =>
      option
        .setName('number')
        .setDescription('panusta täringule')
        .setMinValue(2)
        .setMaxValue(12),
    ),

  async execute(interaction) {
    const randomInt1 = randomIntFromInterval(1, 6);
    const randomInt2 = randomIntFromInterval(1, 6);
    const intSum = randomInt1 + randomInt2;
    const twoDiceEmojis =
      diceEmojis[randomInt1 - 1] + diceEmojis[randomInt2 - 1];
    const betDice = interaction.options.getInteger('number');
    await interaction.deferReply();
    if (betDice == intSum) {
      const message = await interaction.followUp({
        content: `panustasid ${betDice}, Kiisukas veeretab ${twoDiceEmojis} silma! Hurra! `,
        fetchReply: true,
      });
      message.react('🇻');
      message.react('🇦');
      message.react('🇺');
      message.react('💋');
    }

    if (betDice != intSum) {
      const message = await interaction.followUp({
        content: `panustasid ${betDice}, kiisukas veeretab ${twoDiceEmojis} silma `,
        fetchReply: true,
      });
      message.react('🇻');
      message.react('🇦');
      message.react('🇱');
      message.react('🇪');
    }
  },
};
