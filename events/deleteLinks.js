const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,

  async execute(message) {
    if (message.author.id === process.env.OWNER_ID) return;
    if (message.member.roles.cache.size === 1) {
      if (
        message.content.match(
          /(http|https):\/\/[^\s]+|discord\.com\/invite\/\w+/gi,
        )
      ) {
        await message.delete();
      }
    }
  },
};
