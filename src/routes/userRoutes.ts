import { singup } from "../controllers/authController";
import {
   createUser,
   deleteUser,
   getAllUsers,
   getUser,
   updateUser,
} from "../controllers/userController";
import express from "express";

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);
router.post("/signup", singup);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
