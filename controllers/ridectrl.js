import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour calculer la distance entre deux points géographiques (en kilomètres)
const calculateDistance = (lat1, long1, lat2, long2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Rayon de la Terre en km
    const dLat = toRad(lat2 - lat1);
    const dLong = toRad(long2 - long1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en kilomètres
};

// Commander une course et trouver les chauffeurs les plus proches
export const orderRide = async (req, res) => {
    const { userId, startLat, startLong, endLat, endLong, currentLocationName, destinationLocationName } = req.body;

    if (!userId || !startLat || !startLong || !endLat || !endLong) {
        return res.status(400).json({ message: 'Informations incomplètes.' });
    }

    // Trouver les chauffeurs disponibles
    const availableDrivers = await prisma.driver.findMany({
        where: { isAvailable: true },
    });

    // Calculer la distance entre l'utilisateur et chaque chauffeur
    const driversWithDistance = availableDrivers.map(driver => {
        const distance = calculateDistance(startLat, startLong, driver.lat, driver.long);
        return { ...driver, distance };
    });

    // Trier les chauffeurs par distance
    const sortedDrivers = driversWithDistance.sort((a, b) => a.distance - b.distance);

    // Sélectionner le chauffeur le plus proche
    const closestDriver = sortedDrivers[0];

    if (!closestDriver) {
        return res.status(404).json({ message: "Aucun chauffeur disponible à proximité." });
    }

    // Calcul de la charge de course en fonction de la distance (exemple : 1.5 unités par km)
    const distanceToDestination = calculateDistance(startLat, startLong, endLat, endLong);
    const charge = distanceToDestination * 1.5;

    // Créer la course
    const ride = await prisma.ride.create({
        data: {
            userId,
            driverId: closestDriver.id,
            charge,
            currentLocationName,
            destinationLocationName,
            distance: `${distanceToDestination.toFixed(2)} km`,
            status: "En attente",
        },
    });

    res.status(200).json({
        message: 'Course commandée avec succès.',
        ride,
        driver: closestDriver,
    });
};