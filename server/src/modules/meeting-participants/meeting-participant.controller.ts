// src/modules/meeting-participants/meeting-participant.controller.ts
import { Request, Response } from 'express';
import { MeetingParticipantService } from './meeting-participant.service';

const service = new MeetingParticipantService();

export class MeetingParticipantController {
  async add(req: Request, res: Response) {
    try {
      const { userId, role } = req.body;
      const { meetingId } = req.params;
      const participant = await service.addParticipant(meetingId, userId, role);
      res.status(201).json(participant);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    const { meetingId } = req.params;
    const participants = await service.listParticipants(meetingId);
    res.json(participants);
  }

  async update(req: Request, res: Response) {
    const { meetingId, userId } = req.params;
    const participant = await service.updateParticipant(meetingId, userId, req.body);
    res.json(participant);
  }

  async remove(req: Request, res: Response) {
    const { meetingId, userId } = req.params;
    await service.removeParticipant(meetingId, userId);
    res.json({ message: 'Participant removed' });
  }
}
