import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import GitHubStrategy from "passport-github2";

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
            
            let user = await userModel.findOne({ email: username });
  
            if (user) return done(null, false, { message: "User already exists" });
  
            const isAdmin = email === "adminCoder@coder.com" && password === "adminCod3r123";
  
            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
              userRole: isAdmin ? "admin" : "user",
            };
  
            user = await userModel.create(newUser);
            return done(null, user);
          } catch (error) {
            return done("Error al obtener el usuario: " + error);
          }
        }
      )
    );

    passport.use(
        'login', 
        new LocalStrategy({ 
        usernameField: 'email',
        passReqToCallback: true, 
    }, 
    async (req, username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });

            if (!user) return done(null, false, { message: "User not found" });

            if (!isValidPassword(user, password)) return done(null, false);

            /*req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: user.userRole
            };
            */
            return done(null, user);
        } catch (error) {
            return done({ message: "Error logging in" });
        }
    }));

    passport.use('github', new GitHubStrategy ({
        clientID: 'Iv1.6fc66a7c71c28f84',
        clientSecret: '2717cea459b668017fa43af2dedca106aec722e9',
        callBackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async(accessToken, refreshToken, profile, done) =>{
        try{
            console.log({profile})
            let user = await userService.findOne({ email: profile._json.email });
            if(user) return done (null,false);
            const newUser = {
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                age: 0,
                password: ''
            }
            user = await userModel.create(newUser);
            return done(null, user);
        }catch(error){
            return done ({ message: "Error creating user!"});
        }
    }));

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