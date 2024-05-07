const express = require("express");
const app =  express();
const bcrypt = require('bcrypt');
const User = require('./models/User');
const hashPassword = require('./middlewares/hashPassword');
const port = 3000;
const db = require('./db');
const {generateToken} = require('./middlewares/authService');
app.use(express.json());

db.sync();

app.get("/", (req, res) => {
    res.send("Hello World!");

});
app.post('/register', 
hashPassword ,
async (req, res) => {
        
    const user = await User.create(
        {...req.body}

    );
    res.send(user);

});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}});  
    if (!user) {
    return res.status(401)
    .send('Email ou senha invalidos');
}
const passwordMatch =  bcrypt.
compareSync(password, user.password);
if(!passwordMatch) {
    return res.status(401).send('Email ou senha invalidos');
    }
    const token = generateToken(user.dataValues);    
    delete user.dataValues.password;
res.send({user, token});

});

app.listen(port, () => {
    console.log(`app on http:// localhost:${port}`);
});