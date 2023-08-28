import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

import { UserDto } from '../models/types/user.types';
import { User } from '../models/user';

export class UsersService {
  async getAllUsers() {
    return User.find().populate('activities').sort('name');
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async createUser(userDto: UserDto) {
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

    await user.save();

    return user;
  }

  async getUserActivities(user: Express.User) {
    const userActivities = await user.populate('activities').then((user) => user.activities);
    return userActivities;
  }

  async getActivitiesPerUserId(userId: Types.ObjectId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('There is no user with given id');
    }

    const userActivities = await user.populate('activities').then((user) => user?.activities);
    return userActivities;
  }
}
