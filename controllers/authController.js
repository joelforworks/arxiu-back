const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findUserByUsername(username);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: 'Auth error',data :err  });
  }
};

exports.status = async (req, res) => {
  const { token } = req.body;
  try {

    const decode = jwt.verify(token,JWT_SECRET)
    const user = await userModel.findUserBy('id',decode.id)
    res.json(user);

  } catch (err) {
    res.status(400).json({ error: 'Auth error',data :err });
  }
}
