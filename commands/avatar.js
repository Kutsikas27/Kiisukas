const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Näitab kasutaja avatari täissuuruses')
    .addUserOption((option) =>
      option
        .setName('kasutaja')
        .setDescription('Vali kasutaja')
        .setRequired(true),
    ),
  async execute(interaction) {
    const member = interaction.options.getMember('kasutaja');
    const embed = new EmbedBuilder()
      .setTitle(`${member.displayName} avatar.`)
      .setImage(member.displayAvatarURL({ dynamic: true, size: 1024 }));

    await interaction.reply({ embeds: [embed] });
  },
};
