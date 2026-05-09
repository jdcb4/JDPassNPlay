import { EditableName } from "@/components/EditableName";
import { IconArrowLeft, IconPlus, IconTrash } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  addPlayerToTeam,
  MAX_PLAYERS_PER_TEAM,
  MIN_PLAYERS_PER_TEAM,
  removePlayerFromTeam,
  updatePlayerName,
  updateTeamName,
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
  const team = teams[teamIndex];
  if (!team) {
    return null;
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="keyboard-safe-form min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto pb-4">
        <button
          className="flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground"
          onClick={onBack}
          type="button"
        >
          <IconArrowLeft className="size-4" aria-hidden="true" />
          Back
        </button>

        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">
            Team {teamIndex + 1} of {settings.teamCount}
          </p>
          <h2 className="text-2xl font-semibold tracking-normal">
            Name this team
          </h2>
        </div>

        <EditableName
          label="Team name"
          value={team.name}
          onChange={(value) => onTeamsChange(updateTeamName(teams, team.id, value))}
        />

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Players</h3>
            <p className="text-sm text-muted-foreground">
              {team.players.length}/{MAX_PLAYERS_PER_TEAM}
            </p>
          </div>

          {team.players.map((player, playerIndex) => (
            <div
              key={player.id}
              className="flex min-w-0 max-w-full items-center gap-2"
            >
              <span className="w-7 shrink-0 text-right text-sm font-semibold text-muted-foreground">
                {playerIndex + 1}.
              </span>
              <div className="min-w-0 flex-1">
                <EditableName
                  className="w-full"
                  hideLabel
                  label={`Player ${playerIndex + 1}`}
                  value={player.name}
                  onChange={(value) =>
                    onTeamsChange(updatePlayerName(teams, team.id, player.id, value))
                  }
                />
              </div>
              {playerIndex >= MIN_PLAYERS_PER_TEAM && (
                <Button
                  aria-label={`Remove ${player.name}`}
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    onTeamsChange(removePlayerFromTeam(teams, team.id, player.id))
                  }
                >
                  <IconTrash className="size-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="grid w-full gap-3 border-t border-border bg-background/95 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur">
        <Button
          className="h-11 w-full"
          variant="outline"
          disabled={team.players.length >= MAX_PLAYERS_PER_TEAM}
          onClick={() => onTeamsChange(addPlayerToTeam(teams, team.id))}
        >
          <IconPlus className="size-4" aria-hidden="true" />
          Add player
        </Button>
        <Button className="h-12 w-full" onClick={onNext}>
          {teamIndex === settings.teamCount - 1
            ? "Start local round"
            : `Next: Team ${teamIndex + 2}`}
        </Button>
      </div>
    </section>
  );
}
