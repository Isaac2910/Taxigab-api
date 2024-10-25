import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Créer un conducteur
export const createDriver = async (req, res) => {
  const { name, country, phone_number, email, vehicle_type, registration_number, registration_date, driving_license, vehicle_color } = req.body;

  try {
    const driver = await prisma.driver.create({
      data: { name, country, phone_number, email, vehicle_type, registration_number, registration_date, driving_license, vehicle_color },
    });
    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Error creating driver' });
  }
};

// Obtenir tous les conducteurs
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving drivers' });
  }
};

// Obtenir un conducteur par ID
export const getDriverById = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await prisma.driver.findUnique({
      where: { id },
    });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving driver' });
  }
};

// Mettre à jour un conducteur
export const updateDriver = async (req, res) => {
  const { id } = req.params;
  const { name, country, phone_number, email, vehicle_type, registration_number, registration_date, driving_license, vehicle_color } = req.body;

  try {
    const driver = await prisma.driver.update({
      where: { id },
      data: { name, country, phone_number, email, vehicle_type, registration_number, registration_date, driving_license, vehicle_color },
    });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Error updating driver' });
  }
};

// Supprimer un conducteur
export const deleteDriver = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.driver.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting driver' });
  }
};
