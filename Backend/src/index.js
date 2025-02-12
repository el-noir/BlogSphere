import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";

dotenv.config({
  path: "./.env", 
});

connectDB()
  .then(() => {
    console.log("Database connection successful");

    app.on("error", (error) => {
      console.error("Error: ", error);
    });

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed: ", err);
  });
