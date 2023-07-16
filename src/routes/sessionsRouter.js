import { Router } from 'express';
import userModel from '../dao/models/user.model.js';

const sessionRouter = Router();

sessionRouter.post('/register', async (req, res) => {
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
        password,
        userRole: isAdmin ? 'admin' : 'user'
    };

    let result = await userModel.create(user);
    res.send({ status: "success", message: "User registered" });
})

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });

    if (!user) {
        return res.status(400).send({ status: "error", error: "Incorrect credentials" });
    };


    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.userRole
    };

    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
});

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: "error", error: "Couldn't logout" });
        res.redirect('/login');
    });
});

export default sessionRouter;