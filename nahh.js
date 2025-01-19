function nah(data) {
  const title = data.title || data.name;
  const tagline = data.tagline || "";
  const overview = data.overview || "";
  const genre = data.genres[0] || "";
  const genreName = genre.name || "";
  const vote = data.vote_average || "";
  const season = data.seasons || "";
  const yearReleased =
    (data.release_date || data.first_air_date)?.split("-")[0] || "Unknown";

  const runtimeInMinutes = data.runtime;
  const runtime = runtimeInMinutes
    ? `${Math.floor(runtimeInMinutes / 60)}h ${runtimeInMinutes % 60}m`
    : `S${data.number_of_seasons}E${data.number_of_episodes}`;

  return {
    title,
    tagline,
    overview,
    genreName,
    yearReleased,
    runtime,
    vote,
    season,
  };
}
