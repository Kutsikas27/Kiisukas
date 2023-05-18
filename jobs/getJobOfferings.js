const { request } = require('undici');

const getJobOfferings = async () => {
  const { body } = await request('https://techscene.ee/api', {
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
  });

  const responseBody = await body.json();
  return responseBody;
};

module.exports = { getJobOfferings };
