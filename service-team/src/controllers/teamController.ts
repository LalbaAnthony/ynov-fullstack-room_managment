import { Request, Response } from 'express';
import { TeamService } from '../services/teamService';
import { UpdateTeamRequest } from '../types';

export class TeamController {
    static async getTeams(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query?.page as string) || 1;
            const limit = parseInt((req.query?.limit as string) ?? '10') || 10;

            const result = await TeamService.getTeams(page, limit);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getTeam(req: Request, res: Response): Promise<void> {
        try {
            const teamId = parseInt(req.params?.id || '0');
            if (!teamId) {
                res.status(400).json({ error: 'Team ID is required' });
                return;
            }

            const result = await TeamService.getTeam(teamId);
            res.json(result);
        } catch (error: any) {
            res.status(error.message === 'Team not found' ? 404 : 500)
                .json({ error: error.message });
        }
    }

    static async updateTeam(req: Request, res: Response): Promise<void> {
        try {
            const teamId = parseInt(req.params?.id || '0');
            const updateData: UpdateTeamRequest = req?.body

            const result = await TeamService.updateTeam(teamId, updateData);
            res.json(result);
        } catch (error: any) {
            res.status(error.message === 'Team not found' ? 404 : 500)
                .json({ error: error.message });
        }
    }

    static async deleteTeam(req: Request, res: Response): Promise<void> {
        try {
            const teamId = parseInt(req.params?.id || '0');
            const result = await TeamService.deleteTeam(teamId);
            res.json(result);
        } catch (error: any) {
            const status = error.message === 'Team not found' ? 404 :
                error.message === 'Cannot delete own account' ? 400 : 500;
            res.status(status).json({ error: error.message });
        }
    }
}
