import { Request, Response } from "express";
import reservaService from "../services/reservaServices";
import { Reserva } from "../generated/prisma";

const reservaController = {
  async getReservas(req: Request, res: Response): Promise<void> {
    const reservas: Reserva[] = await reservaService.getReservas();
    res.json(reservas);
  },

  async getReservaById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo." });
      return;
    }

    const reserva: Reserva | null = await reservaService.getReservaById(id);
    if (!reserva) {
      res.status(404).json({ message: "Reserva não encontrada" });
      return;
    }

    res.json(reserva);
  },

  async createReserva(req: Request, res: Response): Promise<void> {
    const { data, horaInicio, horaFim, observacao, userId } = req.body;

    if (!data || !horaInicio || !horaFim || !userId) {
      res.status(400).json({ message: "Campos obrigatórios não fornecidos." });
      return;
    }

    try {
      const reserva: Reserva = await reservaService.createReserva({
        data: new Date(data),
        horaInicio: new Date(horaInicio),
        horaFim: new Date(horaFim),
        observacao,
        userId,
      });
      res.status(201).json(reserva);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar reserva.", error });
    }
  },

  async updateReserva(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    const { data, horaInicio, horaFim, observacao, userId } = req.body;

    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "ID inválido." });
      return;
    }

    try {
      const reserva: Reserva = await reservaService.updateReserva(id, {
        data: data ? new Date(data) : undefined,
        horaInicio: horaInicio ? new Date(horaInicio) : undefined,
        horaFim: horaFim ? new Date(horaFim) : undefined,
        observacao,
        userId,
      });
      res.json(reserva);
    } catch (error) {
      res.status(404).json({ message: "Reserva não encontrada ou erro ao atualizar.", error });
    }
  },

  async deleteReserva(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "ID inválido." });
      return;
    }

    try {
      await reservaService.deleteReserva(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: "Reserva não encontrada.", error });
    }
  },
};

export default reservaController;