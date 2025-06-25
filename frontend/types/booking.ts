export type BookingRequest = {
  id: string;
  groupId: string;
  groupName: string;
  requestedRoomId: string;
  requestedRoomNumber: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  membersCount: number;
};
