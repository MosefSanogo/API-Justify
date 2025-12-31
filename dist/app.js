import express from "express";
import tokenRoute from "./routes/token.route.js";
import justifyRoute from "./routes/justify.route.js";
const app = express();
app.use(express.text());
app.use(express.json());
app.use("/api", tokenRoute);
app.use("/api", justifyRoute);
export default app;
