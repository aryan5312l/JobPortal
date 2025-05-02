import { check } from "express-validator";

export const registerValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Enter a valid email").isEmail().normalizeEmail(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
];

export const loginValidation = [
  check("email", "Enter a valid email").isEmail().normalizeEmail(),
  check("password", "Password is required").exists(),
];
