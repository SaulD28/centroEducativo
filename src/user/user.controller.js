import { hash, compare } from "bcrypt";
import User from "./user.model.js";
import Course from "../course/course.model.js";  // Importamos el modelo de curso

export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid).populate("assignedCourses")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el usuario",
      error: err.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(Number(desde)).limit(Number(limite)),
    ]);

    return res.status(200).json({
      success: true,
      total,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params

    const user = await User.findByIdAndUpdate(uid, { status: false }, { new: true })

    return res.status(200).json({
      success: true,
      message: "Usuario eliminado",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el usuario",
      error: err.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { uid } = req.params
    const { newPassword } = req.body

    const user = await User.findById(uid)

    const matchOldAndNewPassword = await compare(newPassword, user.password)

    if (matchOldAndNewPassword) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña no puede ser igual a la anterior",
      });
    }

    const encryptedPassword = await hash(newPassword, 10);

    await User.findByIdAndUpdate(uid, { password: encryptedPassword }, { new: true })

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar contraseña",
      error: err.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const data = req.body;

    if (data.role === "STUDENT_ROLE" && data.assignedCourses) {
      return res.status(400).json({
        success: false,
        message: "Los estudiantes no pueden modificar su asignación de cursos.",
      });
    }

    const user = await User.findByIdAndUpdate(uid, data, { new: true });

    res.status(200).json({
      success: true,
      message: "Usuario actualizado",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: err.message,
    });
  }
};

export const assignCourseToStudent = async (req, res) => {
  try {
    const { uid } = req.params
    const { courseId } = req.body

    const user = await User.findById(uid);
    if (user.assignedCourses.length >= 3) {
      return res.status(400).json({
        success: false,
        message: "Un estudiante solo puede estar asignado a 3 cursos.",
      });
    }

    if (user.assignedCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Este curso ya está asignado a este estudiante.",
      });
    }

    user.assignedCourses.push(courseId)
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Curso asignado con éxito.",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al asignar el curso.",
      error: err.message,
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const course = await Course.create({ name, description })

    return res.status(201).json({
      success: true,
      message: "Curso creado con éxito",
      course,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al crear el curso.",
      error: err.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, description } = req.body;

    const course = await Course.findByIdAndUpdate(courseId, { name, description }, { new: true })

    return res.status(200).json({
      success: true,
      message: "Curso actualizado con éxito.",
      course,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el curso.",
      error: err.message,
    })
  }
}

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    await User.updateMany(
      { assignedCourses: courseId },
      { $pull: { assignedCourses: courseId } }
    );

    const course = await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Curso eliminado con éxito.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el curso.",
      error: err.message,
    });
  }
};
