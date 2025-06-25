export interface RoomAttributes {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RoomCreationAttributes {
    name: string;
}

export interface UpdateRoomRequest {
}