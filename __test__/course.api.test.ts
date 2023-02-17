import { UpdateCourseModel } from "./../src/models/UpdateCourseModel";
import { CourseViewModel } from "./../src/models/CourseViewModel";
import { CreateCourseModel } from "./../src/models/CreateCourseModel";
import request from "supertest";
import { app } from "../src/app";
import { HTTP_STATUSES } from "../src/utils";

describe("/course", () => {
  beforeAll(async () => {
    await request(app).delete("/__test__/clear");
  });

  it("Should return status 200 and empty array", async () => {
    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  it("Should return status 404 for not existing course", async () => {
    await request(app).get("/courses/1").expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("Shouldn't create course with incorrect input data", async () => {
    const data: CreateCourseModel = { title: "" };

    await request(app)
      .post("/courses")
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  let newCourse: CourseViewModel = { id: 0, title: "" };

  it("Should create course with correct input data", async () => {
    const data: CreateCourseModel = { title: "New Course" };

    const response = await request(app)
      .post("/courses")
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);

    newCourse = response.body;
    expect(newCourse).toEqual({
      id: expect.any(Number),
      title: data.title,
    });

    await request(app).get("/courses").expect([newCourse]);
  });

  it("Shouldn't update course with incorrect input data", async () => {
    const data: UpdateCourseModel = { title: "" };

    await request(app)
      .put("/courses/" + newCourse.id)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app).get("/courses").expect([newCourse]);
  });

  it("Shouldn't update not existing course", async () => {
    const data: UpdateCourseModel = { title: "Correct" };

    await request(app)
      .put("/courses/-100")
      .send(data)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app).get("/courses").expect([newCourse]);
  });

  it("Should update course with correct input data", async () => {
    const data: UpdateCourseModel = { title: "Updated Course" };

    await request(app)
      .put("/courses/" + newCourse.id)
      .send(data)
      .expect({ id: newCourse.id, title: data.title });

    await request(app)
      .get("/courses")
      .expect([{ id: newCourse.id, title: data.title }]);

    newCourse.title = data.title;
  });

  it("Shouldn't delete courses with incorrect request", async () => {
    await request(app)
      .delete("/courses/-100")
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app).get("/courses").expect([newCourse]);
  });

  it("Should delete course with correct id", async () => {
    await request(app)
      .delete("/courses/" + newCourse.id)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app).get("/courses").expect([]);
  });
});
