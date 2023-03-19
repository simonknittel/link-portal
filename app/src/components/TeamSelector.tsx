import clsx from "clsx";
import { getAllTeams } from "~/server/services/team";
import Avatar from "./Avatar";
import TeamSelectorFlyout from "./TeamSelectorFlyout";

interface Props {
  teamSlug?: string;
}

const TeamSelector = async ({ teamSlug }: Props) => {
  const teams = await getAllTeams();
  const selectedTeam = teams.find((team) => team.slug === teamSlug);

  return (
    <div className="flex items-center justify-between border-b-2 border-slate-800 px-8 py-4 relative">
      <div
        className={clsx("flex items-center", {
          "gap-4": selectedTeam,
          "h-16": !selectedTeam,
        })}
      >
        {selectedTeam && (
          <div className="overflow-hidden rounded">
            <Avatar name={selectedTeam?.name} />
          </div>
        )}

        <p className="text-xl font-bold">
          {selectedTeam ? selectedTeam.name : "Your teams"}
        </p>
      </div>

      {selectedTeam && (
        <TeamSelectorFlyout teams={teams} selectedTeam={selectedTeam} />
      )}
    </div>
  );
};

export default TeamSelector;
