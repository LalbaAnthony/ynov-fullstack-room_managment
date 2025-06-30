import { NextFunction, Request, Response } from "express";
import * as teamService from "../services/teamService";

export const createTeam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newTeam = await teamService.createTeam(req.body);
    res.status(201).json(newTeam);
  } catch (error: any) {
    console.error("Error creating team:", error);
    res.status(400).json({ message: error.message || "Error creating team." });
  }
};

export const getTeams = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teams = await teamService.getAllTeams();
    res.status(200).json(teams);
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: error.message || "Error fetching teams." });
  }
};

export const getTeam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    if (!team) {
      res.status(404).json({ message: "Team not found." });
      return;
    }
    res.status(200).json(team);
  } catch (error: any) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: error.message || "Error fetching team." });
  }
};

export const updateTeam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updatedTeam = await teamService.updateTeam(req.params.id, req.body);
    res.status(200).json(updatedTeam);
  } catch (error: any) {
    console.error("Error updating team:", error);
    res.status(400).json({ message: error.message || "Error updating team." });
  }
};

export const deleteTeam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await teamService.deleteTeam(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error deleting team:", error);
    res.status(400).json({ message: error.message || "Error deleting team." });
  }
};
