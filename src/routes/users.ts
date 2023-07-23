import bcrypt from 'bcrypt';
import express from 'express';

import { User, validateUser } from '../models/user';

export const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
  const user = await User.find().sort('name');
  res.send(user);
});

// usersRouter.get('/:id', async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (!user) return res.status(404).send('There is no user with the given ID');

//   res.send(user);
// });

usersRouter.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send('User already registered');

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res.header('X-auth-token', token).send({
    id: user._id,
    name: user.name,
    email: user.email
  });
});

usersRouter.put('/:id', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    },
    { new: true }
  );

  if (!user) return res.status(404).send('There is no user with the given ID');

  res.send(user);
});

usersRouter.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('There is no user with the given ID');

  res.send(user);
});
