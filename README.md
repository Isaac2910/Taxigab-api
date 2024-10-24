add README


npm init
npm i express nodemon mongodb  dotenv


npm install prisma --save-dev
npm install @prisma/client
npm install bcryptjs jsonwebtoken

//pour genere les shema prisma :
npx prisma migrate dev --name initial_migration

npx prisma generate



const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const SECRET = 'votre_secret_token'; // À mettre dans .env pour plus de sécurité

// Route d'inscription
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Vérification si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Création d'un nouvel utilisateur
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  res.status(201).json({ message: 'User registered', user });
});

// Route de connexion
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Recherche de l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Comparaison des mots de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Génération d'un token JWT
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

  res.json({ message: 'Login successful', token });
});

// Middleware de protection des routes avec JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Route protégée
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have access to this protected route' });
});

app.listen(3000, ()