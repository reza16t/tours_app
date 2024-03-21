import {
   forgotPassword,
   protect,
   resetPassword,
   signin,
   signup,
   updatePassword,
} from "../controllers/authController";
import {
   createUser,
   deleteUser,
   getUsers,
   updateMyUser,
   updateUser,
} from "../controllers/userController";
import express from "express";

const router = express.Router();

router.route("/").get(getUsers).post(createUser);
router.post("/signup", signup);
router.post("/signin", signin);
router.patch("/update-password", protect, updatePassword);
router.patch("/update-me", protect, updateMyUser);

router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);

router.route("/:id").patch(updateUser).delete(deleteUser);

module.exports = router;
