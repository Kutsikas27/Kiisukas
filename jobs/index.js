const { EmbedBuilder } = require('discord.js');
const { getJobOfferings } = require('./getJobOfferings');
const cron = require('node-cron');
const client = require('../bot');

cron.schedule(
  '* * * * *',
  () => {
    sendMessageInterval(client);
  },
  {
    scheduled: true,
    timezone: 'Europe/Tallinn',
  },
);

const delay = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const sendMessageToChannel = async (channel, job) => {
  const embed = new EmbedBuilder()
    .setColor('#ff7b00')
    .setTitle(`${job.company_name} - ${job.title} `)
    .setURL(job.url)
    .setDescription(job.company_description)
    .setThumbnail(`${job.company_logo_url}`);

  return await channel.send({ embeds: [embed] });
};
let isFirstRunDone = false;
const jobOffers = [];

const sendMessageInterval = async (client) => {
  const jobChannel = await client.channels.fetch(process.env.JOB_CHANNEL_ID);
  const { output: companies } = await getJobOfferings();
  for (const company of companies) {
    for (const job of company.jobs) {
      const currentJob = {
        company_name: company.name,
        company_logo_url: company.logo_url,
        company_description: company.description,
        job_id: job.job_id,
        title: job.title,
        url: job.url,
      };
      const found = jobOffers.find((j) => j.job_id === currentJob.job_id);
      if (!found) {
        jobOffers.push(currentJob);
        if (isFirstRunDone) {
          await delay(1000);
          await sendMessageToChannel(jobChannel, currentJob);
        }
      }
    }
  }

  isFirstRunDone = true;
};
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});
