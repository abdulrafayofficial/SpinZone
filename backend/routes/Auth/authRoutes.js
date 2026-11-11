import express from "express";
import { signupUser } from "../../controllers/User/add_User.js";
import { loginUser } from "../../controllers/User/login_User.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

export default router;
