import userModel from "../dao/models/user.model.js";
import { createHash } from "../utils/utils.js";
import userDTO from "../dto/user.dto.js";
import { transportMail } from "../config/mailing.config.js";
import variables from "../config/dotenv.config.js";
import jwt from "jsonwebtoken";
import { isValidPassword } from "../utils/utils.js";
import allUsersDTO from "../dto/allUsers.dto.js";
import { usersService } from "../services/users.service.js";

const UsersService = new usersService();

const MAIL_AUTH_USER = variables.MAIL_AUTH_user;
const BASE_URL = variables.BASE_url;
const PORT = variables.port;
const PRIVATE_KEY = variables.PRIVATE_key;

export const registerController = async (req, res) => {
  try {
    req.logger.info(`Nuevo usuario registrado! 😁`);
    res.status(200).send({ status: "success", message: "User registered" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

export const loginController = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Incorrect credentials" });
    }

    req.session.user = {
      _id: req.user._id,
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      age: req.user.age,
      role: req.user.userRole,
      cart: req.user.cart,
      documents: req.user.documents,
      last_connection: req.user.last_connection,
      profile: req.user.profile,
    };

    req.logger.info(
      `Logueo Realizado! Usuario conectado: ${req.session.user.name} 😁`
    );

    res.status(200).send({
      status: "success",
      user: req.session.user,
      message: "¡Primer logueo realizado! :)",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

export const logoutController = (req, res) => {
  req.session.destroy((err) => {
    req.logger.info(`Logout Realizado! 😢`);
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

    const token = jwt.sign({ email }, `${PRIVATE_KEY}`, { expiresIn: "1h" });

    const emailToSend = {
      from: `${MAIL_AUTH_USER}`,
      to: email,
      subject: `CatsBook || Reset your Password`,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
        <h1 style="color: #333; font-size: 24px;">Recuperar Contraseña</h1>
        <hr style="border: 1px solid #ccc;">
        <p style="font-size: 16px;">Para recuperar tu contraseña, haz clic en el botón de abajo:</p>
        <a href="${BASE_URL}:${PORT}/restore-pass/${token}" style="text-decoration: none;">
          <button style="background-color: #007BFF; color: #fff; padding: 10px 20px; font-size: 18px; border: none; border-radius: 5px;">CLICK AQUÍ</button>
        </a>
      </div>
    `,
    };

    const info = await transportMail.sendMail(emailToSend);

    res.send({ message: "Mail sent!" });
  } catch (error) {
    console.log(error);
  }
};

export const passChanged = async (req, res) => {
  try {
    const { password } = req.body;
    const { email } = req;
    const newHashedPassword = createHash(password);

    const user = await UsersService.getUserByEmail(email);

    if (!user) {
      return res.status(404).send({ status: "error", error: "user not found" });
    }

    if (isValidPassword(user, password)) {
      return res.status(400).send({ status: "error", error: "same password" });
    }

    await UsersService.updatePassword(user._id, {
      password: newHashedPassword,
    });

    req.logger.info(`Contraseña cambiada! 😁`);

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
    if (!req.session.user) {
      return res
        .status(401)
        .send({ status: "error", error: "User not authenticated" });
    }

    const user = req.session.user;

    res.send({
      status: "success",
      payload: new userDTO(user),
    });
  } catch (error) {
    console.log(error);
  }
};

export const changeUserRoleToPremiumController = async (req, res) => {
  try {
    const userId = req.params.uid;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const missingDocuments = [];
    const loadedDocuments = [];

    if (user.userRole === "user") {
      const requiredExtensions = [".jpg", ".jpeg", ".png", ".gif"];
      const userDocuments = user.documents || [];
      const requiredDocuments = ["id", "address", "account"];

      requiredDocuments.forEach((requiredDocument) => {
        const hasValidExtension = userDocuments.some((userDocument) => {
          return requiredExtensions.some((requiredExtension) =>
            userDocument.name.endsWith(requiredDocument + requiredExtension)
          );
        });

        if (!hasValidExtension) {
          missingDocuments.push(requiredDocument);
        } else {
          loadedDocuments.push(requiredDocument);
        }
      });

      if (missingDocuments.length > 0) {
        const missingDocumentsMessage = missingDocuments
          .map((doc) => `falta cargar el documento: ${doc}`)
          .join(", ");

        return res.status(400).json({
          message:
            "El usuario debe tener todos los documentos en un formato de imagen válido",
          missingDocuments: missingDocuments,
          loadedDocuments: loadedDocuments,
          missingDocumentsMessage: missingDocumentsMessage,
        });
      }
    }

    user.userRole = user.userRole === "user" ? "premium" : "user";

    await user.save();

    res.status(200).json({
      message: "Rol de usuario actualizado con éxito",
      newUserRole: user.userRole,
      missingDocuments: missingDocuments,
      loadedDocuments: loadedDocuments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el rol del usuario" });
  }
};

export const sendDocumentsToUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = userId;

    const documents = user.documents || [];
    const files = req.files;

    const currentDate = new Date(Date.now()).toISOString().split("T")[0];
    const fileName = `${currentDate}-${files[0].originalname}`;

    const duplicateFiles = [];

    for (const file of files) {
      const isFileAlreadyUploaded = documents.some(
        (document) => document.name === file.originalname
      );
      if (isFileAlreadyUploaded) {
        duplicateFiles.push(file.originalname);
      }
    }

    if (duplicateFiles.length > 0) {
      return res.status(400).json({
        message: "Los siguientes archivos ya han sido cargados:",
        duplicateFiles,
      });
    }

    const newDocuments = [
      ...documents,
      ...files.map((file) => ({
        name: fileName,
        reference: file.path,
      })),
    ];

    await UsersService.sendDocumentsToUser(userId, newDocuments);

    return res
      .status(200)
      .json({ message: "Documentos enviados exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al enviar documento" });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await UsersService.getAllUsers();
    res
      .status(200)
      .json({ status: "success", payload: new allUsersDTO(users) });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener todos los usuarios" });
  }
};

export const markAsDeletedIfInactiveController = async (req, res) => {
  try {
    const now = new Date();
    const users = await UsersService.getAllUsers();

    const inactivityPeriodInDays = 2;
    const inactivityPeriodInMilliseconds =
      inactivityPeriodInDays * 24 * 60 * 60 * 1000;

    for (const user of users) {
      if (user.email === "adminCoder@coder.com") {
        continue;
      }

      if (
        user.last_connection &&
        now - user.last_connection > inactivityPeriodInMilliseconds
      ) {
        user.deleted = true;
        await user.save();

        const emailToSendUserDeleted = {
          from: `${MAIL_AUTH_USER}`,
          to: user.email,
          subject: `CatsBook || Your CatsBook account has been deleted`,
          html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
            <h1 style="color: #FF0000; font-size: 24px;">ATENCIÓN</h1>
            <p style="font-size: 16px; color: #333;">Your CatsBook account has been deleted due to inactivity.</p>
          </div>
        `,
        };

        const info = await transportMail.sendMail(emailToSendUserDeleted);
      }
    }

    res.status(200).json({
      status: "success",
      payload: "Usuarios marcados como eliminados si corresponde",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener todos los usuarios" });
  }
};

export const sendProfileImageToUserController = async (req, res) => {
  try {
    const userId = req.params.uid;
    const file = req.files[0];

    if (!file) {
      return res
        .status(400)
        .json({ message: "No se proporcionó un archivo de imagen" });
    }

    const currentDate = new Date(Date.now()).toISOString().split("T")[0];
    const fileName = `${currentDate}-${file.originalname}`;

    const newProfile = { name: fileName, reference: file.path };

    await UsersService.sendProfileImage(userId, newProfile);

    return res.status(200).json({ message: "Imagen de perfil actualizada" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al subir la imagen de perfil" });
  }
};
