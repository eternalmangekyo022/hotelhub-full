import { Router } from "express";
import * as users from "../controllers/users.controller";

export default (use: UseFn, app: Express) => {
  const router = Router({ mergeParams: true });
  router.post("/login", use(users.login));
  router.delete("/logout", use(users.logout));
  router.post("/register", use(users.register));
  router.post("/check", use(users.check));

  const userRouter = Router({ mergeParams: true });
  userRouter.delete("/:userId", use(users.deleteUser));
  userRouter.patch("/:userId", use(users.patchUser));
  userRouter.get("/:userId", use(users.getUserById));
  userRouter.put("/:userId/change-password", use(users.changePassword));
  //delete user
  //update user
  //get user
  //patch user
  router.use("/users", userRouter);
  app.use("/", router);
};