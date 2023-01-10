const express = require('express')
const session = require('express-session')
const app = express()

const server = app.listen(3000, () => console.log('Server Up!'))

app.use(express.json())
app.use(session({
    secret: 'c0d3r',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}))

app.get('/connect', (req, res) => {
    if (req.session.contador) {
        req.session.contador++
    } else {
        req.session.contador = 1
    }
    res.send({ message: `Bienvenido, es su visita ${req.session.contador}` })
})

app.get('/login', (req, res) => {
    let { username, password } = req.query
    //simulacion de la obtencion de un user/pwd de la BD
    let userBD = "alex"
    let pwdBD = "coder"
    if (username !== userBD || password !== pwdBD) {
        return res.send({ message: "Usuario o contraseña no validos" })
    }
    req.session.user = {
        username,
        role: 'admin'
    }
    res.send({ message: "Usuario logueado "})
})

app.get('/currentUser', (req, res) => {
    res.send(req.session.user)
})

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role==="admin") {
        return next()
    }
    return res.status(401).send({ message: "No Autorizado!" })
}

app.get('/rutaSecreta', isAdmin, (req, res) => {
    res.send({ message: "Autorizado!" })
})