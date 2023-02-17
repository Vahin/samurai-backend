import express from "express";
import { db } from "./database/db";

import { getCoursesRouter } from "./routes/courses";
import { getTestsRouter } from "./routes/tests";

export const app = express();

app.use(express.json()); // express body middleware

app.use("/courses", getCoursesRouter(db));
app.use("/__test__", getTestsRouter(db));
