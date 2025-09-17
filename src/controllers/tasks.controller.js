import prisma from '../db/db.js';

export async function listTasks(req, res, next) {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ message: 'nombre es requerido' });

    const task = await prisma.task.create({
      data: { nombre, descripcion, userId: req.userId }
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function completeTask(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ message: 'Tarea no encontrada o no autorizada' });
    }
    const updated = await prisma.task.update({
      where: { id },
      data: { esta_completa: true }
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
