import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

import { ActivityTypes } from '../enum/activityTypes.enum';
import { ActivitySchema } from '../models/types/activity.types';
import { CreateUserDto, EditUserDto } from '../models/types/user.types';
import { User } from '../models/user';

export class UsersService {
  async getAllUsers() {
    return User.find().populate('activities').sort('name');
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async createUser(userDto: CreateUserDto) {
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

  async editUserInfo(user: Express.User, editUserInfoDto: EditUserDto) {
    const updateUserInfo = await user.updateOne(editUserInfoDto, { new: true });

    return updateUserInfo;
  }

  async getUserActivities(user: Express.User, type?: ActivityTypes) {
    let userActivities = await user
      .populate<{ activities: ActivitySchema[] }>('activities')
      .then((user) => user.activities);

    if (type) {
      userActivities = userActivities.filter((activity) => activity.type === type);
    }

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
