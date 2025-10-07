
import prisma from "../db/prisma";
import { User } from "../generated/prisma";

const userService = {
  async getUsers(): Promise<User[]> {
    return prisma.user.findMany({
      include: { reservas: true }, // inclui as reservas do usuário
    });
  },

  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { reservas: true },
    });
  },

  async createUser(data: {
    nome: string;
    email: string;
    telefone: string;
    apartamento: number;
  }): Promise<User> {
    return prisma.user.create({ data });
  },

  async updateUser(
    id: number,
    data: {
      nome?: string;
      email?: string;
      telefone?: string;
      apartamento?: number;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async deleteUser(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  },
};

export default userService;
