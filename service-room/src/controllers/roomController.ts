import { Request, Response } from 'express';
import { RoomService } from '../services/roomService';
import { UpdateRoomRequest } from '../types';

export class RoomController {
    static async getRooms(res: Response): Promise<void> {
        try {
            const result = await RoomService.getRooms();
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getRoom(req: Request, res: Response): Promise<void> {
        try {
            const roomId = parseInt(req.params?.id);
            if (!roomId) {
                res.status(400).json({ error: 'Room ID is required' });
                return;
            }

            const result = await RoomService.getRoom(roomId);
            res.json(result);
        } catch (error: any) {
            res.status(error.message === 'Room not found' ? 404 : 500)
                .json({ error: error.message });
        }
    }

    static async createRoom(req: Request, res: Response): Promise<void> {
        try {
            const roomData = req.body;
            if (!roomData || !roomData.name) {
                res.status(400).json({ error: 'Room name is required' });
                return;
            }

            const result = await RoomService.createRoom(roomData);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateRoom(req: Request, res: Response): Promise<void> {
        try {
            const roomId = parseInt(req.params?.id || '0');
            const updateData: UpdateRoomRequest = req?.body

            const result = await RoomService.updateRoom(roomId, updateData);
            res.json(result);
        } catch (error: any) {
            res.status(error.message === 'Room not found' ? 404 : 500)
                .json({ error: error.message });
        }
    }

    static async deleteRoom(req: Request, res: Response): Promise<void> {
        try {
            const roomId = parseInt(req.params?.id || '0');
            const result = await RoomService.deleteRoom(roomId);
            res.json(result);
        } catch (error: any) {
            const status = error.message === 'Room not found' ? 404 :
                error.message === 'Cannot delete own account' ? 400 : 500;
            res.status(status).json({ error: error.message });
        }
    }
}
