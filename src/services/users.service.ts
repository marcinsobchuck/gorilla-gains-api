import bcrypt from 'bcrypt';

import { User } from '../models/user';

export class UserService {
  async getAllUsers() {
    return User.find().sort('name');
  }

  async createUser(name: string, email: string, password: string) {
    let user = await User.findOne({ email });

    if (user) {
      throw new Error('User already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword
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
