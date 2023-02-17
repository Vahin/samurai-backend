import express from "express";
import { DataBaseTypes } from "../database/db";
import { HTTP_STATUSES } from "../utils";

export const getTestsRouter = (db: DataBaseTypes) => {
  const router = express.Router();

  router.delete("/clear", (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });

  return router;
};
