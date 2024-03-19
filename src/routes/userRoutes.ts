import { signin, signup } from "../controllers/authController";
import {
   createUser,
   deleteUser,
   getUsers,
   updateUser,
} from "../controllers/userController";
import express from "express";

const router = express.Router();

router.route("/").get(getUsers).post(createUser);
router.post("/signup", signup);
router.post("/signin", signin);

router.route("/:id").patch(updateUser).delete(deleteUser);

module.exports = router;
