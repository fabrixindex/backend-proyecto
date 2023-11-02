import { Router } from "express";
import passport from "passport";
import { registerController, loginController, logoutController, githubCallbackController, currentController, sendEmailToRestartPassword, passChanged, changeUserRoleToPremiumController, sendDocumentsToUser, getAllUsersController, markAsDeletedIfInactiveController, sendProfileImageToUserController } from "../controllers/sessions.controller.js";
import { validateToken , setLastConnection} from "../utils/utils.js";
import uploader from "../utils/multerToUsersFiles.js";

const sessionRouter = Router();

sessionRouter.post( "/register", passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  registerController
);

sessionRouter.get("/failregister", async (req, res) => {
  res.status(400).send({ status: "error", error: "Registry fail" });
});

sessionRouter.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  loginController
);

sessionRouter.get("/faillogin", (req, res) => {
  res.status(400).send({ status: "error", error: "Login fail" });
});

sessionRouter.get("/logout", setLastConnection, logoutController);

sessionRouter.get("/send-recover-mail/:email", sendEmailToRestartPassword);
sessionRouter.put("/pass-change/:email", validateToken, passChanged);

sessionRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {} );

sessionRouter.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/api/sessions/githubFailure",
  }),
  githubCallbackController
);

sessionRouter.get("/githubFailure", (req, res) => {
  res.status(400).send({ status: 0, msg: "Github authentication failure" });
});

sessionRouter.get("/current", currentController); 

sessionRouter.put("/premium/:uid", changeUserRoleToPremiumController);

sessionRouter.post("/premium/:uid/documents", uploader('documents').array('documents'), sendDocumentsToUser);

sessionRouter.get("/allUsers", getAllUsersController);

sessionRouter.post("/markAsDeletedIfInactive", markAsDeletedIfInactiveController);

sessionRouter.post("/sendProfileImage/:uid", uploader('profiles').array('profiles'), sendProfileImageToUserController);

export default sessionRouter;