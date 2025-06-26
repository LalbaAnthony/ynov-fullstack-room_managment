import Room from '../models/room'; // Importe le modèle Room
import { RoomAttributes, RoomCreationAttributes } from '../types'; // <-- Importe les types d'ici

export const createRoom = async (roomData: RoomCreationAttributes) => {
  const room = await Room.create(roomData);
  return room;
};

export const getAllRooms = async () => {
  const rooms = await Room.findAll();
  return rooms;
};

export const getRoomById = async (id: string) => {
  const room = await Room.findByPk(id);
  return room;
};

export const updateRoom = async (id: string, roomData: Partial<RoomAttributes>) => {
  const room = await Room.findByPk(id);
  if (!room) {
    throw new Error('Room not found.');
  }
  await room.update(roomData);
  return room;
};

export const deleteRoom = async (id: string) => {
  const room = await Room.findByPk(id);
  if (!room) {
    throw new Error('Room not found.');
  }
  await room.destroy();
  return { message: 'Room deleted successfully.' };
};