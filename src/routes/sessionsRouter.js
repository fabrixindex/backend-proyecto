import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import { createHash } from '../utils/utils.js';
import passport from 'passport';
//import { authToken, generateToken } from '../utils/utils.js';
//FALTA SUMAR JWT

const sessionRouter = Router();

sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), async (req, res) => { res.send({ status: "success", message: "User registered" });
});

    /* VIEJO CODIGO
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({ email });

    if (exists) {
        return res.status(400).send({ status: "error", error: "User already exists" });
    };

    const isAdmin = email === "adminCoder@coder.com" && password === "adminCod3r123";

    const user = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        userRole: isAdmin ? 'admin' : 'user'
    };

    let result = await userModel.create(user);
    res.send({ status: "success", message: "User registered" });
});
*/

sessionRouter.get('/api/sessions/failregister', async (req, res) => {
        res.status(400).send({ status: "error", error: "Registry fail"});
});

sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin'}), 
    async (req, res) => {
        if (!req.user) return res.status(400).send({ status: "error", error: "Incorrect credentials"})

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.userRole
        }; 

        res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });

    /* VIEJO CODIGO
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).send({ status: "error", error: "User not found" });
    };

    if (!isValidPassword(user, password)) {
        return res.status(400).send({ status: "error", error: "Incorrect password"})
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.userRole
    };

    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" }); */
});

sessionRouter.get('/api/sessions/faillogin', (req, res) => {
    res.status(400).send({ status: "error", error: "Login fail" });
});

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: "error", error: "Couldn't logout" });
        res.redirect('/login');
    });
});

sessionRouter.put('/restartPassword', async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).send({status: "error", error: "Couldn't find"})
        };

        const user = await userModel.findOne({email})
        if(!user) {
            return res.status(404).send({status: "error", error: "user not found"})
        };

        const newHashedPassword = createHash(password);
        await userModel.updateOne({_id:user._id},{$set:{password: newHashedPassword}});
        res.send({status:"success", message: "contraseña restaurada"})
    }catch(error){
        console.log(error)
    }
});

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async(req, res) => { });

sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/api/sessions/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

export default sessionRouter;