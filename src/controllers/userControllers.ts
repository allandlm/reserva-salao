import { Request, Response } from "express";
import userService from "../services/userServices";
import { User } from "../generated/prisma";

const userController = {
  async getUsers(req: Request, res: Response): Promise<void> {
    const users: User[] = await userService.getUsers();
    res.json(users);
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
      return;
    }

    const user: User | null = await userService.getUserById(id);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.json(user);
  },

  async createUser(req: Request, res: Response): Promise<void> {
    const { nome, email, telefone, apartamento } = req.body;

    if (!nome || !email || !telefone || apartamento === undefined) {
      res.status(400).json({ message: "Todos os campos são obrigatórios." });
      return;
    }

    try {
      const user: User = await userService.createUser({
        nome,
        email,
        telefone,
        apartamento,
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(409).json({ message: "Erro ao criar usuário. Email pode já estar cadastrado.", error });
    }
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    const { nome, email, telefone, apartamento } = req.body;

    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "ID inválido." });
      return;
    }

    const dataToUpdate: {
      nome?: string;
      email?: string;
      telefone?: string;
      apartamento?: number;
    } = {};

    if (nome) dataToUpdate.nome = nome;
    if (email) dataToUpdate.email = email;
    if (telefone) dataToUpdate.telefone = telefone;
    if (apartamento !== undefined) dataToUpdate.apartamento = apartamento;

    if (Object.keys(dataToUpdate).length === 0) {
      res.status(400).json({ message: "Nenhum campo para atualizar fornecido." });
      return;
    }

    try {
      const user: User = await userService.updateUser(id, dataToUpdate);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: "Usuário não encontrado ou erro ao atualizar.", error });
    }
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "ID inválido." });
      return;
    }

    try {
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: "Usuário não encontrado.", error });
    }
  },
};

export default userController;