import * as dotenv from "dotenv";
import config from "config";
import express from "express";

dotenv.config();

const port: number = config.get("port");
const app = express();
app.listen(port, () => console.log(`listening port ${port}`));
