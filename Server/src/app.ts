import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

import express from "express";
import TrainRoutes from "./routes/TrainRoutes";
import FlightRoutes from "./routes/FlightRoutes";
import UserRoutes from "./routes/UserRoutes";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

app.use("/trains", TrainRoutes);
app.use("/flights", FlightRoutes);
app.use("/users", UserRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
