import {
  type RosterTeamRow,
  TeamRosterSetupScreen,
} from "@/components/team-setup/TeamRosterSetupScreen";
import {
  addPlayerToTeam,
  removePlayerFromTeam,
} from "@/domain/whowhatwhere/setup";
import type { GameSettings, TeamSetup } from "@/domain/whowhatwhere/types";

export function TeamSetupScreen({
  settings,
  teamIndex,
  teams,
  error,
  onTeamsChange,
  onBack,
  onNext,
}: {
  readonly settings: GameSettings;
  readonly teamIndex: number;
  readonly teams: readonly TeamSetup[];
  readonly error: string;
  readonly onTeamsChange: (teams: TeamSetup[]) => void;
  readonly onBack: () => void;
  readonly onNext: () => void;
}) {
  return (
    <TeamRosterSetupScreen
      addPlayerToRoster={(rows, teamId) =>
        addPlayerToTeam(rows as readonly TeamSetup[], teamId) as RosterTeamRow[]
      }
      error={error}
      lastTeamPrimaryLabel="Start local round"
      removePlayerFromRoster={(rows, teamId, playerId) =>
        removePlayerFromTeam(
          rows as readonly TeamSetup[],
          teamId,
          playerId,
        ) as RosterTeamRow[]
      }
      teamCount={settings.teamCount}
      teamIndex={teamIndex}
      teams={teams as readonly RosterTeamRow[]}
      onBack={onBack}
      onNext={onNext}
      onTeamsChange={(next) => onTeamsChange(next as TeamSetup[])}
    />
  );
}
