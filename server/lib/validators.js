import { body, validationResult, check, param, query } from 'express-validator';
import ErrorHandler from '../utils/utility.js';

const registerValidator = () => [
  body("name", "enter name").notEmpty(),
  body("username", "enter username").notEmpty(),
  body("bio", "enter bio").notEmpty(),
  body("password", "enter password").notEmpty(),
];

const loginValidator = () => [
  body("username", "enter username").notEmpty(),
  body("password", "enter password").notEmpty(),
];

const newGroupValidator = () => [
  body("name", "enter name").notEmpty(),
  body("members")
    .notEmpty().withMessage("enter members")
    .isArray({ min: 2, max: 100 }).withMessage("members must be 2-100"),
];

const addMemberValidator = () => [
  body("name", "enter name").notEmpty(),
  body("members")
    .notEmpty().withMessage("enter members")
    .isArray({ min: 1, max: 97 }).withMessage("members must be 1-97"),
];

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const errorMessages = errors.array().map((error) => error.msg).join(", ");
  next(new ErrorHandler(errorMessages, 400));
};

const leaveGroupValidator = () => [
  param("id", "enter id").notEmpty(),
];

const removeMemberValidator = () => [
  body("chatId", "enter chatId").notEmpty(),
  body("userId", "enter userId").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "enter chatId").notEmpty(),
];

const getMessagesValidator = () => [
  param("id", "enter id").notEmpty(),
  query("limit", "enter limit").notEmpty(),
];

const adminLoginValidator= ()=>[
  body("secret", "enter secret").notEmpty(),
]


export {
  registerValidator,
  validateHandler,
  loginValidator,
  newGroupValidator,
  addMemberValidator,
  removeMemberValidator,
  leaveGroupValidator,
  sendAttachmentsValidator,
  getMessagesValidator,
  adminLoginValidator,
};
