const teams = [
  {
    name: "Personal",
    slug: "simonknittel-12345",
  },
  {
    name: "Team A",
    slug: "team-a-12345",
  },
];

export function getTeamBySlug(slug: string) {
  return teams.find((team) => team.slug === slug);
}

export function getAllTeams() {
  return teams;
}
