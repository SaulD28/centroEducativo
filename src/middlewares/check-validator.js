import { body, param } from "express-validator";
import { emailExists, usernameExists, userExists } from "../helpers/db-validator.js";
import { validarCampos } from "./validar-campos.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js";

export const registerValidator = [
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("username").notEmpty().withMessage("El username es requerido"),
  body("email").notEmpty().withMessage("El email es requerido"),
  body("email").isEmail().withMessage("No es un email válido"),
  body("email").custom(emailExists),
  body("username").custom(usernameExists),
  body("password").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }).withMessage("La contraseña debe ser más fuerte"),
  validarCampos,
  deleteFileOnError,
  handleErrors
];

export const loginValidator = [
  body("email").optional().isEmail().withMessage("No es un email válido"),
  body("username").optional().isString().withMessage("Username es en formato erróneo"),
  body("password").isLength({ min: 8 }).withMessage("El password debe contener al menos 8 caracteres"),
  validarCampos,
  handleErrors
];

export const getUserByIdValidator = [
  param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  param("uid").custom(userExists),
  validarCampos,
  handleErrors
];

export const deleteUserValidator = [
  param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  param("uid").custom(userExists),
  validarCampos,
  handleErrors
];

export const updatePasswordValidator = [
  param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  param("uid").custom(userExists),
  body("newPassword").isLength({ min: 8 }).withMessage("El password debe contener al menos 8 caracteres"),
  validarCampos,
  handleErrors
];

export const updateUserValidator = [
  param("id", "No es un ID válido").isMongoId(),
  param("id").custom(userExists),
  validarCampos,
  handleErrors
];
