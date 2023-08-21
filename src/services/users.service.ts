import bcrypt from 'bcrypt';

import { User } from '../models/user';

export class UsersService {
  async getAllUsers() {
    return User.find().sort('name');
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    dueDate?: Date,
    age?: number,
    weight?: number,
    desiredWeight?: number,
    goal?: string[]
  ) {
    let user = await this.findByEmail(email);

    if (user) {
      throw new Error('User already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      weight,
      desiredWeight,
      dueDate,
      goal
    });

    await user.save();

    return user;
  }

  async updateUser(id: string, name: string, phone: string) {
    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        phone
      },
      { new: true }
    );

    return user;
  }

  async deleteUser(id: string) {
    const user = await User.findByIdAndRemove(id);
    return user;
  }
}
