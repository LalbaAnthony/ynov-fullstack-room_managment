export type Group = {
  id: string;
  name: string;
  members: string[];
  capacity: number;
  roomId?: string;
};