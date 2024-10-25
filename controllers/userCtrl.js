import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'; // Importation de Prisma

// Importation du SECRET pour JWT
import { SECRET } from "../config/config.js";

// Initialisation de Prisma Client
const prisma = new PrismaClient();

// Inscription
export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Vérifier que tous les champs sont fournis
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Veuillez remplir tous les champs' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    res.status(201).json({ message: 'Utilisateur créé avec succès', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de l\'inscription' });
  }
};





// Connexion
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier que tous les champs sont fournis
    if (!email || !password) {
      return res.status(400).json({ error: 'Veuillez remplir tous les champs' });
    }

    // Vérifier l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Comparer les mots de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la connexion' });
  }
};

//les modifs################################################################################################
export const getLoggedInUserData = async (req, res) => {
  try {
    const user = req.user;

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error recuperations users' });
  }
};

// Obtenir un utilisateur par ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error user' });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, phone_number, email, password } = req.body;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await prisma.user.update({
      where: { id },
      data: { name, phone_number, email, password: hashedPassword },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error de mise a jour du user' });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error de suppression du user' });
  }
};