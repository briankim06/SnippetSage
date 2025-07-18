import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ValidationError, AuthError } from '../lib/errors';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

type UserCredentials = Pick<IUser, 'email'> & { password?: string };


class AuthService {
  public async registerUser(userData: UserCredentials): Promise<IUser> {

    const { email, password } = userData;
    if (!email || !password) throw new ValidationError({ message: 'Email and password are required' });
    
    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ email, passwordHash });
      return user;
    } catch (error: any) {
      if (error.code === 11000) throw new AuthError('Email already exists');
      throw error;
    }
  }

  public async loginUser(credentials: UserCredentials): Promise<{token: string, refreshToken: string}> {
    const { email, password } = credentials;
    if (!email || !password) throw new ValidationError({ message: 'Email and password are required' });
    

    const user = await User.findOne({ email });
    if (!user) throw new AuthError('Invalid credentials');
    

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new AuthError('Invalid credentials');


    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
    
    const refreshToken = generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, refreshToken };

    
  }

  public async validateRefreshToken(refreshToken: string): Promise<{ newToken: string, newRefreshToken: string }> {
    const user = await User.findOne({refreshToken});
    if (!user) throw new AuthError('Invalid token');
    if(!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');

    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = generateRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save();

    return { newToken, newRefreshToken };
}
}

export function generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex')
}

export default new AuthService(); 