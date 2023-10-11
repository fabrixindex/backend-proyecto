import userModel from "../dao/models/user.model.js";
import { createHash } from "../utils/utils.js";
import userDTO from "../dto/users.dto.js";
import { transportMail } from "../app.js";
import variables from "../config/dotenv.config.js"
import jwt from 'jsonwebtoken';
import { isValidPassword } from "../utils/utils.js";

const MAIL_AUTH_USER = variables.MAIL_AUTH_user;
const BASE_URL = variables.BASE_url;
const PORT = variables.port;
const PRIVATE_KEY = variables.PRIVATE_key;

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
    const email = req.params.email;

    const token = jwt.sign({ email }, `${PRIVATE_KEY}`, { expiresIn: '1h' });

    const emailToSend = {
      from: `${MAIL_AUTH_USER}`,
      to: email,
      subject: `Recuperar pass`,
      html: `<h1> Para recuperar tu pass, haz click en el boton de abajo </h1>
              <hr>
              <a href="${BASE_URL}:${PORT}/restore-pass/${token}"> CLICK AQUI </a>
            `,
    };

    console.log("TOKEN:", `${token}`)
    const info = await transportMail.sendMail(emailToSend);

    res.send({ message: "Mail sent!"})
  }catch(error) {
    console.log(error)
  }
}

//PONERLE UN MEJOR NOMBRE
export const passChanged = async (req, res) => {
  try{
    const { password } = req.body;
    const { email } = req;
    const newHashedPassword = createHash(password)

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ status: "error", error: "user not found" });
    };
    
    if (isValidPassword(user, password)) {
      return res.status(400).send({ status: "error", error: "same password" });
    }

    await userModel.updateOne(
      { _id: user._id },
      { $set: { password: newHashedPassword } }
    );
  
    req.logger.info(`Contraseña cambiada! 😁`)
  
    res.send({ status: "success", message: "contraseña restaurada" });
  }catch(error){
    console.log(error)
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
    
    if (!req.session.user) {
      return res
        .status(401)
        .send({ status: "error", error: "User not authenticated" });
    }
    
    const user = req.session.user
    
    res.send({
      status: "success",
      payload: new userDTO(user),
    });
  } catch (error) {
    console.log(error);
  }
};

export const changeUserRoleToPremiumController = async (req, res) => {
  try{
    const userId = req.params.uid;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.userRole = user.userRole === 'user' ? 'premium' : 'user';

    await user.save();

    res.status(200).json({ message: 'Rol de usuario actualizado con éxito', newUserRole: user.userRole });
  }catch(error){
    console.log(error)
    res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
  }
};