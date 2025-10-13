// src/modules/meetings/meeting.controller.ts
import { Request, Response } from 'express';
import { MeetingService } from './meeting.service';

const service = new MeetingService();

export class MeetingController {
  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const meeting = await service.createMeeting({
        ownerId: user.sub,
        createdBy: user.sub,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        startAt: new Date(req.body.startAt),
        endAt: new Date(req.body.endAt),
      });
      res.status(201).json(meeting);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    const meetings = await service.listMeetings();
    res.json(meetings);
  }

  async get(req: Request, res: Response) {
    const meeting = await service.getMeetingById(req.params.id);
    if (!meeting) return res.status(404).json({ error: 'Not found' });
    res.json(meeting);
  }

  async update(req: Request, res: Response) {
    const meeting = await service.updateMeeting(req.params.id, req.body);
    res.json(meeting);
  }

  async delete(req: Request, res: Response) {
    await service.deleteMeeting(req.params.id);
    res.json({ message: 'Meeting deleted' });
  }
}
