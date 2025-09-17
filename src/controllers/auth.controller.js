import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/db.js';
import { config } from '../config/config.js';

export async function register(req, res, next) {
  try {
    const { email, password, nombre, apellido } = req.body;
    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({ message: 'Faltan campos' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email ya registrado' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, nombre, apellido },
      select: { id: true, email: true, nombre: true, apellido: true }
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.cookieSecure,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
    });

    res.json({ message: 'Login exitoso' });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: config.cookieSecure });
    res.json({ message: 'Logout correcto' });
  } catch (err) {
    next(err);
  }
}
