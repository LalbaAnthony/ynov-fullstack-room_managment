"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, CalendarCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

import { Room } from "@/types/room";
import { BookingRequest } from "@/types/booking";
import { Group } from "@/types/group";
import { Student } from "@/types/students";

import { mockRooms } from "@/lib/mockRooms";
import { mockBookings } from "@/lib/mockBookings";
import { mockGroups } from "@/lib/mockGroups";
import { mockStudents } from "@/lib/mockStudents";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const [groups, setGroups] = useState<Group[]>(mockGroups); // Utiliser pour info groupe
  const [students, setStudents] = useState<Student[]>(mockStudents); // Utiliser pour info membres groupe

  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");

  const [isConfirmDeleteRoomOpen, setIsConfirmDeleteRoomOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const [isViewMembersModalOpen, setIsViewMembersModalOpen] = useState(false);
  const [currentGroupMembers, setCurrentGroupMembers] = useState<Student[]>([]);
  const [currentGroupName, setCurrentGroupName] = useState("");

  const pendingBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "pending");
  }, [bookings]);

  const handleAddRoom = () => {
    if (!newRoomNumber.trim()) {
      toast.error("Le numéro de salle ne peut pas être vide.");
      return;
    }

    if (
      rooms.some(
        (r) => r.roomNumber.toLowerCase() === newRoomNumber.trim().toLowerCase()
      )
    ) {
      toast.error("Cette salle existe déjà.");
      return;
    }

    const newRoom: Room = {
      id: `r-${Date.now()}`,
      roomNumber: newRoomNumber.trim(),
      isAvailable: true,
    };

    setRooms((prev) => [...prev, newRoom]);
    setNewRoomNumber("");
    setIsAddRoomModalOpen(false);
    toast.success(`Salle "${newRoom.roomNumber}" ajoutée.`);
  };

  const handleDeleteRoomClick = (room: Room) => {
    setRoomToDelete(room);
    setIsConfirmDeleteRoomOpen(true);
  };

  const confirmDeleteRoom = () => {
    if (!roomToDelete) return;

    if (
      bookings.some(
        (b) => b.requestedRoomId === roomToDelete.id && b.status !== "rejected"
      )
    ) {
      toast.error(
        "Impossible de supprimer la salle : elle a des réservations."
      );
      setIsConfirmDeleteRoomOpen(false);
      setRoomToDelete(null);
      return;
    }

    setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
    setIsConfirmDeleteRoomOpen(false);
    setRoomToDelete(null);
    toast.success(`Salle "${roomToDelete.roomNumber}" supprimée.`);
  };

  const handleViewMembers = (groupId: string, groupName: string) => {
    setCurrentGroupName(groupName);
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      const members = students.filter((student) =>
        group.members.includes(student.id)
      );
      setCurrentGroupMembers(members);
    } else {
      setCurrentGroupMembers([]);
    }
    setIsViewMembersModalOpen(true);
  };

  const handleAcceptBooking = (bookingToAccept: BookingRequest) => {
    setBookings((prevBookings) => {
      return prevBookings.map((b) => {
        if (b.id === bookingToAccept.id) {
          return { ...b, status: "approved" };
        } else if (
          b.requestedRoomId === bookingToAccept.requestedRoomId &&
          b.status === "pending" &&
          !(
            new Date(b.endTime) <= new Date(bookingToAccept.startTime) ||
            new Date(b.startTime) >= new Date(bookingToAccept.endTime)
          )
        ) {
          return { ...b, status: "rejected" };
        }
        return b;
      });
    });
    toast.success(
      `Demande de ${bookingToAccept.groupName} pour la salle ${bookingToAccept.requestedRoomNumber} acceptée !`
    );
  };

  const handleRejectBooking = (bookingToReject: BookingRequest) => {
    setBookings((prevBookings) =>
      prevBookings.map((b) =>
        b.id === bookingToReject.id ? { ...b, status: "rejected" } : b
      )
    );
    toast.loading(
      `Demande de ${bookingToReject.groupName} pour la salle ${bookingToReject.requestedRoomNumber} refusée.`
    );
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Salles</h1>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Salles disponibles</h2>
          <Button onClick={() => setIsAddRoomModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une salle
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro de Salle</TableHead>
                <TableHead>Disponibilité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">
                      {room.roomNumber}
                    </TableCell>
                    <TableCell>{room.isAvailable ? "Oui" : "Non"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRoomClick(room)}
                        title={`Supprimer la salle ${room.roomNumber}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Aucune salle ajoutée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Demandes de Réservation en Attente
        </h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Groupe</TableHead>
                <TableHead>Salle Demandée</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingBookings.length > 0 ? (
                pendingBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.groupName}
                      <Button
                        variant="link"
                        size="sm"
                        className="ml-2 h-auto p-0 text-xs"
                        onClick={() =>
                          handleViewMembers(booking.groupId, booking.groupName)
                        }
                        title={`Voir les membres du ${booking.groupName}`}
                      >
                        (Voir)
                      </Button>
                    </TableCell>
                    <TableCell>{booking.requestedRoomNumber}</TableCell>
                    <TableCell>{formatDate(booking.startTime)}</TableCell>
                    <TableCell>
                      {formatTime(booking.startTime)} -{" "}
                      {formatTime(booking.endTime)}
                    </TableCell>
                    <TableCell>{booking.purpose}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptBooking(booking)}
                        title="Accepter cette demande"
                      >
                        Accepter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectBooking(booking)}
                        title="Refuser cette demande"
                      >
                        Refuser
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Aucune demande de réservation en attente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAddRoomModalOpen} onOpenChange={setIsAddRoomModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle salle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">
                Numéro de Salle
              </Label>
              <Input
                id="roomNumber"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                className="col-span-3"
                placeholder="Ex: S.201"
              />
            </div>
          </div>
          <Button onClick={handleAddRoom} className="w-full">
            Ajouter la salle
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isConfirmDeleteRoomOpen}
        onOpenChange={setIsConfirmDeleteRoomOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmer la suppression de la salle
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la salle{" "}
              <span className="font-bold">{roomToDelete?.roomNumber}</span> ?
              Cette action est irréversible et ne peut pas être effectuée si la
              salle a des réservations en cours ou passées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRoom}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isViewMembersModalOpen}
        onOpenChange={setIsViewMembersModalOpen}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Membres du groupe : {currentGroupName}</DialogTitle>
            <DialogDescription>
              Liste des élèves assignés à ce groupe.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto mt-4 pr-2">
            {currentGroupMembers.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {currentGroupMembers.map((member) => (
                  <li key={member.id}>
                    {member.firstName} {member.lastName} ({member.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                Ce groupe n'a pas de membres assignés.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
