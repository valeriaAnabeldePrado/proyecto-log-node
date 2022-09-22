//DEPENDECIAS
const express = require ('express')
const mysql = require ('mysql')
const {engine} = require ('express-handlebars')//Metodo para solicitar hbs
const myconnection = require ('express-myconnection') //metodo para conectar la base de datos
const session = require ('express-session')
const bodyParser = require('body-parser')
const path = require ('path')
const dotendev = require ('dotenv')
const logRoutes = require ('./routes/loginRoutes')


//EXPRESS Y PUERTO
const app = express()
const port = 4000 //si no anda tirarle otros puertos

//Une el css
const css = path.join(__dirname, '../public')
app.use(express.static(css))

app.set(path.join(__dirname,'views')) //direccion a las views para renderizar

//Para procesar el motor de plantilla hbs
app.engine('hbs', engine({
    extraname: 'hbs',
    defaultLayout: false //hbs siempre busca el main.hbs x eso le tengo q activar la pcion defautlLayaut: false
}))
app.set('view engine', 'hbs')
//Para poder visualizar el falso dom o body del documento hbs
app.use(bodyParser.urlencoded({
    extended: "true"
}))
app.use(bodyParser.json())

//EL PUERTO
app.listen(port, ()=>{ console.log(`Este es el puerto: ${port}`)})

//DATABASE
//dotendev.config({path: "./.env"}) //union con env
 const database = myconnection(mysql , {
    user: 'root',
    host: 'localhost',
    database: 'loginconnodejs',
    password: ""
 })
 app.use(database)
 app.use(session ({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
 }))

app.use('/', logRoutes)

//LA RUTA AL HOME
app.get( '/home', (req,res)=>{ 
    //res.send("home")
    res.render('./home')
    //  if(req.session.loggedin == true){
    //      res.render('../home')
    //  } else {
    //      res.redirect('./login/index')
    //  }
})
//const direccionesrandom = require ("")