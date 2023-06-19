const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('liitu')
    .setDescription('v2ike valve liitub serveriga')
    .addUserOption((option) =>
      option
        .setName('kasutaja')
        .setDescription('Vali kasutaja')
        .setRequired(true),
    ),
  async execute(interaction) {
    const member = interaction.options.getMember('kasutaja');
    interaction.client.emit('guildMemberAdd', member);
  },
};
