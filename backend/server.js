import app from "./src/app.js";
import connectDB from './src/config/database.js';
import config from "./src/config/config.js";

connectDB();

app.listen(config.PORT, () => {
    console.log(`Server is running at PORT: ${config.PORT}`);
})