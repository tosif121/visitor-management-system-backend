const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

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
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

signinSchema.methods.isValidPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

signinSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    username: this.username,
  };
};

signinSchema.index({ username: 1 });

const Auth = mongoose.model('Auth', signinSchema);

module.exports = Auth;
