const { Discord, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

let lastTitle = '';
let lastDescription = '';

async function sendMessageInterval(client, channelId, messageInterval) {
  try {
    const channel = await client.channels.fetch(channelId);

    setInterval(async () => {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          action: 'job_board.get',
          input: {
            domain: [0, 1, 2, 3, 4, 7, 8, 5, 6],
            level: [],
            company: [],
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { body } = await request(
        'https://techscene.ee/api',
        requestOptions,
      );
      const responseBody = await body.json();

      const { title, url } = responseBody.output[0].jobs[0];
      const { description, logo_url } = responseBody.output[0];

      if (title === lastTitle && description === lastDescription) {
        return;
      }

      lastTitle = title;
      lastDescription = description;

      const embed = new EmbedBuilder()
        .setColor('ff7b00')
        .setTitle(`${title}`)
        .setURL(`${url}`)
        .setDescription(`${description}`)
        .setThumbnail(`${logo_url}`);

      channel.send({ embeds: [embed] });
    }, messageInterval * 1000); // Multiply by 1000 to convert to milliseconds
  } catch (error) {
    console.error(`Error sending message: ${error}`);
  }
}

module.exports = sendMessageInterval;
