export interface TeamAttributes {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TeamCreationAttributes {
    name: string;
}

export interface UpdateTeamRequest {
}