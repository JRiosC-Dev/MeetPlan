// src/modules/meeting-participants/meeting-participant.service.ts
import { prisma } from '../../lib/prisma';

export class MeetingParticipantService {
  async addParticipant(meetingId: string, userId: string, role: string = 'participant') {
    return prisma.meeting_participants.create({
      data: {
        meeting_id: meetingId,
        user_id: userId,
        role: role as any,
      },
    });
  }

  async listParticipants(meetingId: string) {
    return prisma.meeting_participants.findMany({
      where: { meeting_id: meetingId },
      include: { users: true },
    });
  }

  async updateParticipant(meetingId: string, userId: string, data: {
    role?: string;
    response?: string;
  }) {
    return prisma.meeting_participants.update({
      where: {
        meeting_id_user_id: { meeting_id: meetingId, user_id: userId },
      },
      data: {
        role: data.role as any,
        response: data.response as any,
        responded_at: data.response ? new Date() : undefined,
      },
    });
  }

  async removeParticipant(meetingId: string, userId: string) {
    return prisma.meeting_participants.delete({
      where: {
        meeting_id_user_id: { meeting_id: meetingId, user_id: userId },
      },
    });
  }
}
