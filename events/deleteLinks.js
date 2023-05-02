const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,

	async execute(message) {
		if (message.author.id === process.env.OWNER_ID) return;
		if (message.member.roles.cache.size === 1) {
			// Check if the message contains a link
			if (
				message.content.match(
					/(http|https):\/\/[^\s]+|discord\.com\/invite\/\w+/gi,
				)
			) {
				// Delete the message
				await message.delete();
			}
		}
		message.member.roles.cache.map((r) => console.log(r.name));
	},
};
