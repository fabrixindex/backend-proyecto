import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { createHash } from "../utils/utils.js";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    try {
      res.send({ status: "success", message: "User registered" });
    } catch (error) {
      console.log(error);
    }
  }
);

sessionRouter.get("/api/sessions/failregister", async (req, res) => {
  res.status(400).send({ status: "error", error: "Registry fail" });
});

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    try {
      if (!req.user)
        return res
          .status(400)
          .send({ status: "error", error: "Incorrect credentials" });

      req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        role: req.user.userRole,
      };
      res.send({
        status: "success",
        user: req.session.user,
        message: "¡Primer logueo realizado! :)",
      });
    } catch (error) {
      console.log(error);
    }
  }
);

sessionRouter.get("/api/sessions/faillogin", (req, res) => {
  res.status(400).send({ status: "error", error: "Login fail" });
});

sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .send({ status: "error", error: "Couldn't logout" });
    res.redirect("/login");
  });
});

sessionRouter.put("/restartPassword", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ status: "error", error: "Couldn't find" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ status: "error", error: "user not found" });
    }

    const newHashedPassword = createHash(password);
    await userModel.updateOne(
      { _id: user._id },
      { $set: { password: newHashedPassword } }
    );
    res.send({ status: "success", message: "contraseña restaurada" });
  } catch (error) {
    console.log(error);
  }
});

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/api/sessions/githubFailure",
  }),
  async (req, res) => {
    try {
      req.session.user = req.user;

      res.redirect("/products");
    } catch (error) {
      console.log(error);
    }
  }
);

sessionRouter.get("/githubFailure", (req, res) => {
  res.status(400).send({ status: 0, msg: "Github authentication failure" });
});

export default sessionRouter;
