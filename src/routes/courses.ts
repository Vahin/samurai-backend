import express from "express";
import { CourseViewModel } from "./../models/CourseViewModel";
import { QueryCourseModel } from "./../models/QueryCourseModel";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types/request.types";
import { Response } from "express";
import { CreateCourseModel } from "../models/CreateCourseModel";
import { URIParamsCourseIdModel } from "../models/URIParamsCourseIdModel";
import { UpdateCourseModel } from "../models/UpdateCourseModel";
import { CourseType, DataBaseTypes } from "../database/db";
import { HTTP_STATUSES } from "../utils";

export const getCoursesRouter = (db: DataBaseTypes) => {
  const coursesRouter = express.Router();

  const getCourseViewModel = (course: CourseType): CourseViewModel => {
    return {
      id: course.id,
      title: course.title,
    };
  };

  coursesRouter.get(
    "/",
    (
      req: RequestWithQuery<QueryCourseModel>,
      res: Response<CourseViewModel[]>
    ) => {
      let foundCourses = db.courses;

      if (req.query.title) {
        foundCourses = foundCourses.filter(
          (course) => course.title.indexOf(req.query.title as string) > -1
        );
      }

      res.json(foundCourses.map(getCourseViewModel));
    }
  );

  coursesRouter.get(
    "/:id",
    (
      req: RequestWithParams<{ id: string }>,
      res: Response<CourseViewModel>
    ) => {
      const course = db.courses.find((course) => course.id === +req.params.id);

      if (!course) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      }

      res.status(HTTP_STATUSES.OK_200).json(getCourseViewModel(course));
    }
  );

  coursesRouter.post(
    "/",
    (
      req: RequestWithBody<CreateCourseModel>,
      res: Response<CourseViewModel>
    ) => {
      const title = req.body.title;

      if (!title) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      }

      const newCourse: CourseType = {
        id: +Date.now(),
        title,
        studentsCount: 0,
      };

      db.courses.push(newCourse);

      res.status(HTTP_STATUSES.CREATED_201).json(getCourseViewModel(newCourse));
    }
  );

  coursesRouter.delete(
    "/:id",
    (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
      db.courses = db.courses.filter((course) => course.id !== +req.params.id);

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
  );

  coursesRouter.put(
    "/:id",
    (
      req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>,
      res: Response<CourseViewModel>
    ) => {
      if (!req.body.title) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      }

      let foundCourse = db.courses.find(
        (course) => course.id === +req.params.id
      );

      if (!foundCourse) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      }

      foundCourse.title = req.body.title;

      res.status(HTTP_STATUSES.OK_200).json(getCourseViewModel(foundCourse));
    }
  );

  return coursesRouter;
};
