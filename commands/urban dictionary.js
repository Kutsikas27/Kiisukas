const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const trim = (str, max) =>
  str.length > max ? `${str.slice(0, max - 3)}...` : str;
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ud')
    .setDescription('urban dictionary')
    .addStringOption((option) =>
      option
        .setName('termin')
        .setRequired(true)
        .setDescription('urban dictionary'),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const term = interaction.options.getString('termin');
    const query = new URLSearchParams({ term });

    const dictResult = await request(
      `https://api.urbandictionary.com/v0/define?${query}`,
    );
    const { list } = await dictResult.body.json();

    if (!list.length) {
      return interaction.editReply(`Ei leidnud vastet sõnale **${term}**.`);
    }
    const [answer] = list;

    const fixAnswer = answer.definition.replace(/\[|\]/g, '');

    const embed = new EmbedBuilder()
      .setColor(0xefff00)
      .setTitle(answer.word)
      .setURL(answer.permalink)
      .setDescription(trim(fixAnswer, 200));
    interaction.editReply({ embeds: [embed] });
  },
};
