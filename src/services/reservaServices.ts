import prisma from "../db/prisma";
import { Reserva } from "../generated/prisma";

const reservaService = {
  async getReservas(): Promise<Reserva[]> {
    return prisma.reserva.findMany({
      include: { usuario: true }, // inclui dados do usuário relacionado
    });
  },

  async getReservaById(id: number): Promise<Reserva | null> {
    return prisma.reserva.findUnique({
      where: { id },
      include: { usuario: true },
    });
  },

  async createReserva(data: {
    data: Date;
    horaInicio: Date;
    horaFim: Date;
    observacao?: string;
    userId: number;
  }): Promise<Reserva> {
    return prisma.reserva.create({ data });
  },

  async updateReserva(
    id: number,
    data: {
      data?: Date;
      horaInicio?: Date;
      horaFim?: Date;
      observacao?: string;
      userId?: number;
    }
  ): Promise<Reserva> {
    return prisma.reserva.update({
      where: { id },
      data,
    });
  },

  async deleteReserva(id: number): Promise<void> {
    await prisma.reserva.delete({ where: { id } });
  },
};

export default reservaService;