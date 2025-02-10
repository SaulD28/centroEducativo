import { body, validationResult } from "express-validator";


export const validateCourse = [
  body("title")
    .notEmpty().withMessage("Course title is required")
    .isLength({ max: 100 }).withMessage("Course title cannot exceed 100 characters"),
  
  body("description")
    .notEmpty().withMessage("Course description is required"),

  body("teacher")
    .notEmpty().withMessage("Teacher ID is required")
    .isMongoId().withMessage("Invalid Teacher ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];