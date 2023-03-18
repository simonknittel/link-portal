export function getTeamBySlug(slug = "teamSlug") {
  const teams = [
    {
      name: "Personal",
      slug: "teamSlug",
    },
    {
      name: "Team A",
      slug: "team-a-12345",
    },
  ];

  const team = teams.find((team) => team.slug === slug);

  return team;
}
