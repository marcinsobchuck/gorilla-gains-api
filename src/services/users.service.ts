import bcrypt from 'bcrypt';

import { HTMLTemplate } from './templates/forgotPassword';
import { transporter } from '..';
import { CreateUserDto, EditUserDto, UserCredentials } from '../models/types/user.types';
import { User } from '../models/user';

export class UsersService {
  async getAllUsers() {
    return User.find().populate('activities').sort('name');
  }

  async getCurrentUser(user: Express.User) {
    return await User.findById(user.id).select({ activities: 0, password: 0 });
  }

  private async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  async register(userDto: CreateUserDto) {
    const { email, password } = userDto;
    let user = await this.findByEmail(email);

    if (user) {
      throw new Error('User already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      ...userDto,
      password: hashedPassword
    });

    const token = user.generateAuthToken();

    await user.save();

    return token;
  }

  async login(userCredentials: UserCredentials) {
    const { email, password } = userCredentials;
    const user = await this.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

    const token = user.generateAuthToken();

    return token;
  }

  async editUserInfo(user: Express.User, editUserInfoDto: EditUserDto) {
    if (editUserInfoDto.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(editUserInfoDto.password, salt);
      editUserInfoDto.password = hashedPassword;
    }

    const newUser = await User.findOneAndUpdate({ _id: user.id }, editUserInfoDto, {
      new: true
    }).select({ password: 0 });
    return newUser;
  }

  async verifyUserPassword(user: Express.User, password: string) {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid ? isPasswordValid : false;
  }

  async forgotPassword(email: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = user.generateAuthToken(15);

    try {
      await transporter.sendMail({
        from: 'gorillagainsclub@gmail.com',
        to: email,
        subject: 'Gorilla gains - password reset requested',
        html: HTMLTemplate(resetToken)
      });

      return `E-mail with the verification link was sent to ${email}.`;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeUserPassword(user: Express.User, password: string) {
    try {
      user.passwordChangedAt = new Date();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      await user.save();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
