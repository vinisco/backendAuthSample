const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Rota pro authConfig
const authConfig = require("../../config/auth");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {
  async store(req, res) {
    const { name, email, password } = req.body;

    try {
      if (await User.findOne({ where: { email: email } }))
        return res.status(400).send({ error: "User already exists" });

      const hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name: name,
        email: email,
        password: hash,
      });

      user.password = undefined;

      res.send({ user, token: generateToken({ id: user.id }) });
    } catch (err) {
      console.log(err);

      return res.status(400).send({ error: "Registration failed" });
    }
  },

  async authenticate(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) return res.status(400).send({ error: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ error: "Invalid password" });

    user.password = undefined;

    res.send({ user, token: generateToken({ id: user.id }) });
  },
};
