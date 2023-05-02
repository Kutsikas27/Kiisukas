const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

const trim = (str, max) =>
  str.length > max ? `${str.slice(0, max - 3)}...` : str;

function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const pageNr = generateRandomInteger(1, 10);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('film')
    .setDescription('Soovitab filmi valitud kategooriast.')
    .addStringOption((option) =>
      option
        .setName('kategooria')
        .setDescription('filmi kategooria ')
        .setRequired(true)
        .addChoices(
          { name: 'Märul', value: '28' },
          { name: 'Seiklus', value: '12' },
          { name: 'Animatsioon', value: '16' },
          { name: 'Komöödia', value: '35' },
          { name: 'Krimi', value: '80' },
          { name: 'Dokumentaal', value: '99' },
          { name: 'Fantaasia', value: '14' },
          { name: 'Ajalugu', value: '36' },
          { name: 'Õudus', value: '27' },
          { name: 'Müsteerium', value: '9648' },
          { name: 'Armastus', value: '10749' },
          { name: 'Ulme', value: '878' },
          { name: 'Sõda', value: '10752' },
          { name: 'Põnevik', value: '53' },
          { name: 'Vestern', value: '37' },
          { name: 'Draama', value: '18' },
        ),
    ),

  async execute(interaction) {
    const category = interaction.options.getString('kategooria');
    const response = await request(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${category}&sort_by=vote_count.desc&page=${pageNr}&api_key=${process.env.MOVIEDB_API_KEY}`,
    );

    const movieResult = await response.body.json();
    const randomIndex = Math.floor(Math.random() * movieResult.results.length);
    const movie = movieResult.results[randomIndex];
    const movieId = movie.id;
    const movieTitle = movie.title;
    const movieRating = movie.vote_average;
    const movieOverview = movie.overview;
    const posterPath = movie.poster_path;
    const date = movie.release_date;
    const releaseYear = new Date(date).getFullYear();

    const response2 = await request(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=d4dc10e0dd89fc2a4733d4661e0ba26c`,
    );

    const movieResult2 = await response2.body.json();
    const movieGenre = movieResult2.genres[0].name;
    const imdbId = movieResult2.imdb_id;
    const runTimeMinutes = movieResult2.runtime;
    const runTimeHours = Math.floor(runTimeMinutes / 60);
    const remainingMinutes = runTimeMinutes % 60;

    const embed = new EmbedBuilder()
      .setTitle(movieTitle)
      .setURL(`https://www.imdb.com/title/${imdbId}?ref_=ttls_li_tt`)

      .setDescription(
        `**${releaseYear}** • **${runTimeHours}h${remainingMinutes}m** • **${movieGenre}**  \n⭐ **${movieRating}**   \n${trim(
          movieOverview,
          150,
        )},`,
      )
      .setThumbnail(`https://image.tmdb.org/t/p/original${posterPath}`)

      .setColor('#FF0000');

    await interaction.reply({ embeds: [embed] });
  },
};
