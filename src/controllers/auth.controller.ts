import type { Request, Response } from 'express';
import { generateRefreshToken, generateToken, verifyRefreshToken } from '../services/auth.service.js';
import * as userRepository from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.UserRepository.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas!' });

    const payload = { id_user: user.id_user, email: user.email, role: user.role };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      message: 'Login exitoso',
      token,         
      refreshToken   
    });

  } catch (error: any) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: 'No hay token' });

  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    const newToken = generateToken({ 
      id_user: decoded.id_user, 
      email: decoded.email, 
      role: decoded.role 
    });

    res.json({ token: newToken });
    
  } catch (err) {
    res.status(403).json({ message: 'Token inválido' });
  }
};
 
export const register = async (req: Request, res: Response) => {
  const { role, name, lastName, email, password } = req.body;

  try {
    const existingUser = await userRepository.UserRepository.findByEmail(email);
    if (existingUser) 
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userRepository.UserRepository.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'user' // Rol por defecto
    });

    const payload = { id_user: newUser.id_user, email: newUser.email, role: newUser.role };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: { id: newUser.id_user, email: newUser.email, role: newUser.role },
      token,
      refreshToken
    });

  } catch (error: any) {
    console.error('[Auth-Controller] Error en register:', error.message);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};
