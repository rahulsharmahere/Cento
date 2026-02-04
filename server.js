const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const JWT_SECRET = 'CHANGE_THIS_SECRET';

// Dummy user (replace with DB)
const USER = {
  username: 'admin',
  passwordHash: bcrypt.hashSync('secret', 10),
};

// PUBLIC INFO
app.get('/api/info', (req, res) => {
  res.json({
    app_name: 'Stash Server',
    version: '1.0.0',
    auth_required: true,
  });
});

// LOGIN
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== USER.username) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const ok = bcrypt.compareSync(password, USER.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({ token });
});

// AUTH MIDDLEWARE
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

// PROTECTED ROUTE
app.get('/api/secure', auth, (req, res) => {
  res.json({ message: 'Secure data' });
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});
