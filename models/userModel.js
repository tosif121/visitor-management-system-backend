const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const signinSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

signinSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

signinSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

signinSchema.index({ username: 1 });

const SignIn = mongoose.model('SignIn', signinSchema);

module.exports = SignIn;
