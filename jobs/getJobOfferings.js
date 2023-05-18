const { request } = require('undici');

const getJobOfferings = async () => {
  const requestOptions = {
    method: ' POST',
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
  const { body } = await request('https://techscene.ee/api', requestOptions);
  const responseBody = await body.json();
  return responseBody;
};

module.exports = { getJobOfferings };
