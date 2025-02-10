import { Router } from "express";
import { getUserById,getUsers,deleteUser,updatePassword,updateUser,assignCourseToStudent,createCourse,updateCourse,deleteCourse} from "./user.controller.js";
import { getUserByIdValidator,deleteUserValidator,updatePasswordValidator,updateUserValidator} from "../middlewares/check-validator.js";
import { validateRole } from "../middlewares/role-validator.js"; 

const router = Router();

router.get("/findUser/:uid", getUserByIdValidator, getUserById);
router.get("/", getUsers);
router.delete("/deleteUser/:uid", deleteUserValidator, deleteUser);
router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword);
router.put("/updateUser/:uid", updateUserValidator, updateUser);
router.post("/assignCourse/:uid", validateRole("STUDENT_ROLE"), assignCourseToStudent);
router.post("/createCourse", validateRole("TEACHER_ROLE"), createCourse);
router.put("/updateCourse/:courseId", validateRole("TEACHER_ROLE"), updateCourse);
router.delete("/deleteCourse/:courseId", validateRole("TEACHER_ROLE"), deleteCourse);

export default router;
