const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('börs')
    .setDescription('Näitab balti börsi suurimaid muutujaid')
    .addStringOption((option) =>
      option
        .setName('turg')
        .setDescription('vali turg')

        .addChoices(
          { name: 'Tallinna Börs', value: 'TALLINN' },
          { name: 'Riia Börs', value: 'RIGA' },
          { name: 'Vilniuse Börs', value: 'VILNIUS' },
          { name: 'Krüpto', value: 'CRYPTO' },
          { name: 'USA Börs', value: 'USA' },
        ),
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const dictResult = await request(
      'https://api.delfi.ee/finance-api/v1/query/quotes-with-chart',
    );

    const body = await dictResult.body.json();
    const quotes = body.data.quotes;
    const linnaValik = interaction.options.getString('turg') || 'TALLINN';
    const description = quotes
      .filter((el) => el.group === linnaValik)
      .sort(
        (a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent,
      )
      .map((item) => {
        const marketChangeRounded =
          Math.round(item.regularMarketChangePercent * 100) / 100;

        let emoji = '<:green:1101471005312024667>';

        if (marketChangeRounded === 0) emoji = '<:yellow:1101471020860313640>';
        if (marketChangeRounded < 0) emoji = '<:red:1101471038132465724>';

        return `${emoji}  ${item.shortName} • **${marketChangeRounded}** %`;
      })
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(0xef0f00)
      .setDescription(description);

    interaction.followUp({ embeds: [embed] });
  },
};
