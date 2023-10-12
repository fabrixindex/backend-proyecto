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
      documents: req.user.documents,
      last_connection: req.user.last_connection,
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

/*Modificar el endpoint /api/users/premium/:uid   para que sólo actualice al usuario a premium si ya ha cargado los siguientes documentos:
Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
*/

export const changeUserRoleToPremiumController = async (req, res) => {
  try{
    const userId = req.params.uid;

    const user = await userModel.findById(userId);

    console.log("USUARIO COMPLETO:", user)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.userRole = user.userRole === 'user' ? 'premium' : 'user';

    if (user.userRole === 'user'){
      const requiredDocuments = ['id', 'address', 'account'];
      const userDocuments = user.documents || [];

      const hasAllDocuments = requiredDocuments.every(requiredDocument => {
        return userDocuments.some(userDocument => userDocument.name.includes(requiredDocument))
    });
    console.log("Nombres de doc:", userDocuments)

    if (!hasAllDocuments) throw new Error('User must have all documents');
    };

    await user.save();

    res.status(200).json({ message: 'Rol de usuario actualizado con éxito', newUserRole: user.userRole });
  }catch(error){
    console.log(error)
    res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
  }
};

/*Crear un endpoint en el router de usuarios api/users/:uid/documents con el método POST que permita subir uno o múltiples archivos. Utilizar el middleware de Multer para poder recibir los documentos que se carguen y actualizar en el usuario su status para hacer saber que ya subió algún documento en particular.
*/

export const sendDocumentsToUser = async (req, res) => {
  try{
    const userId = req.params.uid;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const documents = user.documents || [];
    const files = req.files;

    const newDocuments = [
      ...documents,
      ...files.map(file => ({ name: file.originalname, reference: file.path }))
  ];

  await userModel.findByIdAndUpdate(userId, { documents: newDocuments });

  return res.status(200).json({ message: 'Documentos enviados exitosamente' });

  }catch(error){
    console.log(error)
    res.status(500).json({ message: 'Error al enviar documento' });
  }
}

/*El middleware de multer deberá estar modificado para que pueda guardar en diferentes carpetas los diferentes archivos que se suban.
Si se sube una imagen de perfil, deberá guardarlo en una carpeta profiles, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products, mientras que ahora al cargar un documento, multer los guardará en una carpeta documents.
*/