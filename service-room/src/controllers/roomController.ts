// service-room/src/controllers/roomController.ts
import { NextFunction, Request, Response } from 'express';
import * as roomService from '../services/roomService';

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newRoom = await roomService.createRoom(req.body);
    res.status(201).json(newRoom);
  } catch (error: any) {
    console.error('Error creating room:', error);
    res.status(400).json({ message: error.message || 'Error creating room.' });
  }
};

export const getRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(rooms);
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: error.message || 'Error fetching rooms.' });
  }
};

export const getRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) {
      res.status(404).json({ message: 'Room not found.' });
      return;
    }
    res.status(200).json(room);
  } catch (error: any) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: error.message || 'Error fetching room.' });
  }
};

export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedRoom = await roomService.updateRoom(req.params.id, req.body);
    res.status(200).json(updatedRoom);
  } catch (error: any) {
    console.error('Error updating room:', error);
    res.status(400).json({ message: error.message || 'Error updating room.' });
  }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await roomService.deleteRoom(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error deleting room:', error);
    res.status(400).json({ message: error.message || 'Error deleting room.' });
  }
};