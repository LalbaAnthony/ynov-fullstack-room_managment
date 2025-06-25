import Room from '../models/room';
import { UpdateRoomRequest } from '../types';

export class RoomService {
    static async getRooms(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await Room.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return {
            rooms: rows,
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit)
            }
        };
    }

    static async createRoom(roomData: { name: string }) {
        if (!roomData.name) {
            throw new Error('Room name is required');
        }

        const room = await Room.create(roomData);

        return {
            room: {
                id: room.id,
                name: room.name,
            }
        };
    }

    static async getRoom(roomId: number) {
        const room = await Room.findByPk(roomId);

        if (!room) {
            throw new Error('Room not found');
        }

        return {
            room: {
                id: room.id,
                name: room.name,
            }
        };
    }

    static async updateRoom(roomId: number, updateData: UpdateRoomRequest) {
        const room = await Room.findByPk(roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        await room.update(updateData);

        return {
            room: {
                id: room.id,
                name: room.name,
            }
        };
    }

    static async deleteRoom(roomId: number) {
        const deleted = await Room.destroy({ where: { id: roomId } });

        if (!deleted) {
            throw new Error('Room not found');
        }

        return { message: 'Room deleted' };
    }
}
