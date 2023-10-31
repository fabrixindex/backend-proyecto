import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import GitHubStrategy from "passport-github2";
import variables from "../config/dotenv.config.js"
//import CustomError from "../utils/errorHandler/customError.js";
//import { generateUserErrorInfo } from "../utils/errorHandler/info.js";
//import EnumErrors from "../utils/errorHandler/enum.js";
import { cartService } from "../services/cart.service.js";

const CartService = new cartService();

const CLIENT_GITHUB_ID = variables.CLIENT_GITHUB_id;
const CLIENT_GITHUB_SECRET = variables.CLIENT_GITHUB_secret;
const CALL_BACK_GITHUB_URL = variables.CALL_BACK_GITHUB_url;

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;

          if(!first_name || !last_name || !email){
            console.log('error')
          }

          let user = await userModel.findOne({ email: username });

          if (user)
            return done(null, false, { message: "User already exists" });

          const isAdmin =
            email === "adminCoder@coder.com" && password === "adminCod3r123";
          
          const isUserTest =
            email === "test@test.com" && password === "testpass";

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password), 
            userRole: isAdmin ? "admin" : (isUserTest ? "test" : "user"),
          };

          user = await userModel.create(newUser);

          const cart = await CartService.addCart();
          user.cart = cart._id;
          await user.save();

          return done(null, user);
        } catch (error) {
          return done("Error al obtener el usuario: " + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) return done(null, false, { message: "User not found" });

          if (!isValidPassword(user, password)) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done({ message: "Error logging in" });
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: `${CLIENT_GITHUB_ID}`,
        clientSecret: `${CLIENT_GITHUB_SECRET}`,
        callBackURL: `${CALL_BACK_GITHUB_URL}`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("clientID:", `${CLIENT_GITHUB_ID}`, "clientSecret:", `${CLIENT_GITHUB_SECRET}`, "callBackURL:", `${CALL_BACK_GITHUB_URL}`)
          console.log({ profile });
          let user = await userModel.findOne({ email: profile._json.email });
          if (user) return done(null, user);
          const newUser = {
            first_name: profile._json.name,
            last_name: "🐱‍👤",
            email: profile._json.email,
            age: 0,
            password: ' ',
            profile: [
              {
                name: profile._json.avatar_url,
                path: profile._json.avatar_url,
              }
            ]
          };
          console.log("NUEVO USUARIO GIT:", newUser)
          user = await userModel.create(newUser);

          return done(null, user);
        } catch (error) {
          return done({ message: "Error creating user!" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await userModel.findOne({ _id });
      return done(null, user);
    } catch {
      return done({ msg: "Error deserializing user" });
    }
  });
};

export default initializePassport;
