import { Router } from "express";
import {createCourse,getCoursesByTeacher,getCoursesByStudent,assignStudentToCourse,editCourse,deleteCourse} from "./course.controller.js";
import { validateCourse } from "../middlewares/course-validator.js";

const router = Router();


router.post("/courses", validateCourse, createCourse);
router.put("/courses", validateCourse, editCourse);

router.get("/courses/teacher", getCoursesByTeacher);
router.get("/courses/student", getCoursesByStudent);
router.post("/courses/assign", assignStudentToCourse);
router.delete("/courses", deleteCourse);

export default router;