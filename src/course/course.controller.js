import Course from "../course/course.model.js";
import User from "../user/user.model.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Permitir que el teacher venga del body o del token JWT
    const teacher = await User.findById(req.body.teacher || req.user.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (teacher.role !== "TEACHER_ROLE") {
      return res.status(403).json({ message: "You are not authorized to create a course" });
    }

    const newCourse = new Course({
      title,
      description,
      teacher: teacher._id,
    });

    await newCourse.save();

    return res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Course creation failed",
      error: err.message,
    });
  }
};


export const getCoursesByTeacher = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);
    if (teacher.role !== "TEACHER_ROLE") {
      return res.status(403).json({
        message: "You are not authorized to view courses",
      });
    }

    const courses = await Course.find({ teacher: teacher._id });

    return res.status(200).json({
      courses,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to retrieve courses",
      error: err.message,
    });
  }
};

export const getCoursesByStudent = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (student.role !== "STUDENT_ROLE") {
      return res.status(403).json({
        message: "You are not authorized to view courses",
      });
    }

    const courses = await Course.find({ students: student._id });

    return res.status(200).json({
      courses,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to retrieve courses",
      error: err.message,
    });
  }
};

export const assignStudentToCourse = async (req, res) => {
  const { courseId } = req.body;

  try {
    const student = await User.findById(req.user.id);
    if (student.role !== "STUDENT_ROLE") {
      return res.status(403).json({
        message: "You are not authorized to assign yourself to a course",
      });
    }

    if (student.assignedCourses.length >= 3) {
      return res.status(400).json({
        message: "You can only be assigned to 3 courses at most",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (course.students.includes(student._id)) {
      return res.status(400).json({
        message: "You are already assigned to this course",
      });
    }

    course.students.push(student._id);
    await course.save();

    student.assignedCourses.push(courseId);
    await student.save();

    return res.status(200).json({
      message: "Student assigned to course successfully",
      course,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to assign student to course",
      error: err.message,
    });
  }
};

export const editCourse = async (req, res) => {
  const { courseId, title, description } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const teacher = await User.findById(req.user.id);
    if (course.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to edit this course",
      });
    }

    course.title = title || course.title;
    course.description = description || course.description;

    await course.save();

    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Course update failed",
      error: err.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  const { courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const teacher = await User.findById(req.user.id);
    if (course.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this course",
      });
    }

    for (let studentId of course.students) {
      const student = await User.findById(studentId);
      student.assignedCourses.pull(courseId);
      await student.save();
    }

    await course.remove();

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Course deletion failed",
      error: err.message,
    });
  }
};
