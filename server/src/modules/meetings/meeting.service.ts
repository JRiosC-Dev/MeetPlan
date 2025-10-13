// src/modules/meetings/meeting.service.ts
import { prisma } from '../../lib/prisma';

export class MeetingService {
  async createMeeting(data: {
    ownerId: string;
    createdBy: string;
    title: string;
    description?: string;
    location?: string;
    startAt: Date;
    endAt: Date;
  }) {
    return prisma.meetings.create({
      data: {
        owner_id: data.ownerId,
        created_by: data.createdBy,
        title: data.title,
        description: data.description,
        location: data.location,
        start_at: data.startAt,
        end_at: data.endAt,
      },
    });
  }

  async listMeetings() {
    return prisma.meetings.findMany({
      include: {
        users_meetings_owner_idTousers: true,
        users_meetings_created_byTousers: true,
        meeting_participants: true,
        tasks: true,
      },
    });
  }

  async getMeetingById(id: string) {
    return prisma.meetings.findUnique({
      where: { id },
      include: {
        users_meetings_owner_idTousers: true,
        users_meetings_created_byTousers: true,
        meeting_participants: true,
        tasks: true,
      },
    });
  }

  async updateMeeting(id: string, data: Partial<{
    title: string;
    description: string;
    location: string;
    startAt: Date;
    endAt: Date;
    status: string;
  }>) {
    return prisma.meetings.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        start_at: data.startAt,
        end_at: data.endAt,
        status: data.status as any,
      },
    });
  }

  async deleteMeeting(id: string) {
    return prisma.meetings.delete({ where: { id } });
  }
}
