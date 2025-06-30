import Team from "../models/team";
import { TeamAttributes, TeamCreationAttributes } from "../types";

export const createTeam = async (teamData: TeamCreationAttributes) => {
  const team = await Team.create(teamData);
  return team;
};

export const getAllTeams = async () => {
  const teams = await Team.findAll();
  return teams;
};

export const getTeamById = async (id: string) => {
  const team = await Team.findByPk(id);
  return team;
};

export const updateTeam = async (
  id: string,
  teamData: Partial<TeamAttributes>,
) => {
  const team = await Team.findByPk(id);
  if (!team) {
    throw new Error("Team not found.");
  }
  await team.update(teamData);
  return team;
};

export const deleteTeam = async (id: string) => {
  const team = await Team.findByPk(id);
  if (!team) {
    throw new Error("Team not found.");
  }
  await team.destroy();
  return { message: "Team deleted successfully." };
};
