
import express from "express";

import { PrismaClient } from '@prisma/client'
import userRoute from "./routes/route.js";
import bodyParser from "body-parser";


  



const app = express();

const port = 3003;

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const prisma = new PrismaClient()

async function main() {
    try {
      await prisma.$connect();
      console.log('Connexion à la base de données établie');
    } catch (error) {
      console.error('Erreur de connexion à la base de données:',error);
    }
  }
main()

app.use("/api", userRoute);




app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})