import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityType'
  },
  exercises: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
      },
      sets: [
        {
          reps: Number,
          load: Number
        }
      ]
    }
  ],
  date: Date,
  duration: Number
});
