import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma';

export class AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailable(employeeId: string, start: Date, end: Date) {
    return this.prisma.appointment.findFirst({
      where: {
        AND: [
          {
            employeeId,
          },
          {
            status: {
              not: 'CANCELLED',
            },
          },
          {
            OR: [
              {
                start: {
                  gte: start,
                  lte: end,
                },
              },
              {
                end: {
                  gte: start,
                  lte: end,
                },
              },
            ],
          },
        ],
      },
    });
  }

  async create(data: Prisma.AppointmentCreateInput) {
    return this.prisma.appointment.create({ data });
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput) {
    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.appointment.findFirst({ where: { id } });
  }

  async count(args?: Prisma.AppointmentCountArgs) {
    return this.prisma.appointment.count(args);
  }

  async findAll(args: Prisma.AppointmentFindManyArgs) {
    return this.prisma.appointment.findMany(args);
  }
}
