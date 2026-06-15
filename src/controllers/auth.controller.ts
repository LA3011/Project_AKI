import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository.js';
import { generateRefreshToken, generateToken, handleForgotPassword, handleResetPassword, verifyRefreshToken } from '../services/auth.service.js';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserRepository.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas!' });

    const payload = {
      id_usuario: user.id_usuario,
      correo: user.correo,
      tipo_usuario: user.tipo_usuario
    };

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
      id_usuario: decoded.id_usuario,
      correo: decoded.correo,
      tipo_usuario: decoded.tipo_usuario
    });

    res.json({ token: newToken });

  } catch (error: any) {
    res.status(403).json({ message: 'Token inválido', error: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const {
    tipo_usuario, nombres, apellidos, correo, password,
    id_estado, id_municipio, id_ciudad, telefono, foto_perfil
  } = req.body;

  try {
    const existingUser = await UserRepository.findByEmail(correo);
    if (existingUser)
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await UserRepository.create({
      tipo_usuario: tipo_usuario || 'user',
      id_estado,
      id_municipio,
      id_ciudad,
      nombres,
      apellidos,
      correo,
      password_hash: hashedPassword,
      telefono,
      foto_perfil
    });

    const payload = {
      id_usuario: newUser.id_usuario,
      correo: newUser.correo,
      tipo_usuario: newUser.tipo_usuario
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id_usuario,
        correo: newUser.correo,
        tipo_usuario: newUser.tipo_usuario
      },
      token,
      refreshToken
    });

  } catch (error: any) {
    console.error('[Auth-Controller] Error en register:', error.message);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'El correo electrónico es requerido.'
    });
  }

  try {
    await handleForgotPassword(email);
    return res.status(200).json({
      success: true,
      message: 'Si el correo está registrado, se enviará un enlace de recuperación.'
    });

  } catch (error: any) {
    console.error('[Server] Error en forgotPassword controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error interno en el servidor.'
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {

  const token = req.body?.token || req.query?.token;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'El token y la nueva contraseña son requeridos.'
    });
  }

  try {
    await handleResetPassword(token as string, newPassword);
    return res.status(200).json({
      success: true,
      message: 'Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión.'
    });

  } catch (error: any) {

    if (error.message === 'INVALID_TOKEN') {
      return res.status(400).json({
        success: false,
        message: 'El enlace de recuperación es inválido o ya fue utilizado.'
      });
    }

    if (error.message === 'EXPIRED_TOKEN') {
      return res.status(400).json({
        success: false,
        message: 'El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.'
      });
    }

    console.error('[Server] Error en resetPassword controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error interno en el servidor.'
    });
  }
};