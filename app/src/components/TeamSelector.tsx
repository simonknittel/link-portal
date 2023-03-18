import { getTeamBySlug } from "~/services/team";
import Avatar from "./Avatar";

interface Props {
  teamSlug: string;
}

const TeamSelector = ({ teamSlug }: Props) => {
  const team = getTeamBySlug(teamSlug)!;

  return (
    <div className="flex items-center justify-between border-b-2 border-slate-800 px-8 py-4">
      <div className="flex items-center gap-4">
        <div className="overflow-hidden rounded">
          <Avatar name={team.name} />
        </div>

        <p className="text-xl font-bold">{team.name}</p>
      </div>
    </div>
  );
};

export default TeamSelector;
