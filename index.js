import express from "express";
import userRouter from "./routes/route.js";



const app = express()
const port = 3003 

app.use("/api", userRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})