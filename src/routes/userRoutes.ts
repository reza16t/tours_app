import {
   forgotPassword,
   protect,
   resetPassword,
   signin,
   restrictTo,
   signup,
   updatePassword,
} from "../controllers/authController";
import {
   DelMyUser,
   deleteUser,
   getMe,
   getUser,
   getUsers,
   updateMyUser,
   updateUser,
} from "../controllers/userController";
import express from "express";
import { Role } from "../types";

const router = express.Router();

router.route("/").get(protect, restrictTo(Role.Admin), getUsers);
router.post("/signup", signup);
router.post("/signin", signin);
router.patch("/update-password", protect, updatePassword);
router.patch("/update-me", protect, updateMyUser);
router.delete("/delete-me", protect, DelMyUser);
router.get("/get-me", protect, getMe, getUser);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);

router
   .route("/:id")
   .patch(protect, restrictTo(Role.Admin), updateUser)
   .delete(protect, restrictTo(Role.Admin), deleteUser)
   .get(protect, restrictTo(Role.Admin), getUser);

module.exports = router;
