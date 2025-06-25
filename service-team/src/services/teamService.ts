import Team from '../models/team';
import { UpdateTeamRequest } from '../types';

export class TeamService {
    static async getTeams(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await Team.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return {
            teams: rows,
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit)
            }
        };
    }

    static async getTeam(teamId: number) {
        const team = await Team.findByPk(teamId);

        if (!team) {
            throw new Error('Team not found');
        }

        return {
            team: {
                id: team.id,
                name: team.name,
            }
        };
    }

    static async updateTeam(teamId: number, updateData: UpdateTeamRequest) {
        const team = await Team.findByPk(teamId);
        if (!team) {
            throw new Error('Team not found');
        }

        await team.update(updateData);

        return {
            team: {
                id: team.id,
                name: team.name,
            }
        };
    }

    static async deleteTeam(teamId: number) {
        const deleted = await Team.destroy({ where: { id: teamId } });

        if (!deleted) {
            throw new Error('Team not found');
        }

        return { message: 'Team deleted' };
    }
}
