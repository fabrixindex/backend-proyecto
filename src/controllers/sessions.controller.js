import userModel from "../dao/models/user.model.js";
import { createHash } from "../utils/utils.js";
import userDTO from "../dto/users.dto.js";
import { generateResetToken } from "../utils/generateResetToken.js";
import { transportMail } from "../app.js";

export const registerController = async (req, res) => {
  try {
    req.logger.info(`Nuevo usuario registrado! 😁`)
    res.send({ status: "success", message: "User registered" });
  } catch (error) {
    console.log(error);
  }
};

export const loginController = async (req, res) => {
  try {
    if (!req.user){
      return res
        .status(400)
        .send({ status: "error", error: "Incorrect credentials" });
    };
        
    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      age: req.user.age,
      role: req.user.userRole,
      cart: req.user.cart,
    };

    req.logger.info(`Logueo Realizado! Usuario conectado: ${req.session.user.name} 😁`)

    res.send({
      status: "success",
      user: req.session.user,
      message: "¡Primer logueo realizado! :)",
    });
  } catch (error) {
    console.log(error);
  }
};

export const logoutController = (req, res) => {
  req.session.destroy((err) => {
    req.logger.info(`Logout Realizado! 😢`)
    if (err)
      return res
        .status(500)
        .send({ status: "error", error: "Couldn't logout" });
    res.redirect("/login");
  });
};

export const sendEmailToRestartPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const codeToRestart = generateResetToken()

    const sendEmail = transportMail()
  }catch {
    console.log(error)
  }
}

export const restartPasswordController = async (req, res) => {
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

    req.logger.info(`Contraseña cambiada! 😁`)

    res.send({ status: "success", message: "contraseña restaurada" });
  } catch (error) {
    console.log(error);
  }
};

export const githubCallbackController = async (req, res) => {
  try {
    req.session.user = req.user;

    res.redirect("/products");
  } catch (error) {
    console.log(error);
  }
};

export const currentController = async (req, res) => {
  try {
    
    if (!req.user) {
      return res
        .status(401)
        .send({ status: "error", error: "User not authenticated" });
    }

    res.send({
      status: "success",
      payload: new userDTO(user),
    });
  } catch (error) {
    console.log(error);
  }
};
