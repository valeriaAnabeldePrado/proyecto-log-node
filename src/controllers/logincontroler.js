// const controllers = {}

// controllers.login = (req,res)=>{
//     res.render('login/index')
// }

// controllers.register = (req,res)=>{
//     res.render('login/register')
// }

//////////////////////////////////////////////////////////////////////////
//ANTES DE INICIAR RECORDAR ESTAR EN LA CARPETA Y START AL ADMIN DE XAMP//
//////////////////////////////////////////////////////////////////////////

// module.exports = controllers
const encryptado = require ('bcrypt') //para encriptar el password

 const loguin = (req,res)=>{
    //res.render('./login/index')
     if(req.session.loggedin != true){
         res.render('./login/index')
     } else {
         res.redirect('../home')
     }
 }

const register = (req,res)=>{
   // res.render('./login/register')
     if(req.session.loggedin != true){
         res.render('./login/register')
     } else {
         res.redirect('../home')
     }
    
}

//VALIDACION DE INGRESO AL USUARIO
const auth = (req,res)=>{
    const dataUsuarioOk = req.body
    
    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM usuarios WHERE email = ?', [dataUsuarioOk.email], (err, userdata) =>{
            if (userdata.length>0){
                
                //comparar contraseñas con la db y lo ingresado x el input
                userdata.forEach(element => {
                    encryptado.compare(dataUsuarioOk.password, element.password, (err, coinciden)=>{
                         
                        if(!coinciden){
                            res.render('./login/index', {error: 'La contraseña ingresada no es correcta'})
                        }else {
                     req.session.loggedin = true
                     req.session.name = element.name
                     res.render('../home')
                            
                        }
                    })
                })
            } else {
                res.render('./login/index', { error: 'El mail ingresado no pertenece a ningun usuario registrado' })
            }
        })
    })
}


const usuarioRegistrado = (req,res)=>{
    const data = req.body //recupero la data de los input del form
    encryptado.hash(data.password, 12).then(hash =>{ //con esta funcion encripto los datos del password y me devuelve la data como un objeto
        data.password = hash 

        //getConnection()Intenta establecer una conexión con el origen de datos que representa este objeto
        req.getConnection((err, conn)=>{
            conn.query('SELECT * FROM usuarios WHERE email = ?', [data.email], (err, userdata)=>{
                if (userdata.length>0) {
                    res.render('./login/register', {error: 'El correo ingresado ya existe'}) //Esto es para que me renderice en la plantilla dinamica del form que el usuario ya existe
                } else {
    
                    req.getConnection((err, conn) =>{
                        conn.query('INSERT INTO usuarios SET ?', [data], (err, rows)=>{
                            res.redirect('../home')
                            //conn.query(es pasarle una consulta a la database)
                            //esta sentencia con este tipo de funcion indica al codigo introducir estos datos (data) a la base de datos sql y luego redireccionar al home
                        })
                    })
                }
            })
        })

    })
    
}

 const logout = (req, res)=>{
     if(req.session.loggedin == true){
         req.session.destroy()
     } else {
         res.redirect('./login/index')
     }
 }
module.exports = {
    login: loguin,
    register,
    usuarioRegistrado,
    auth,
    logout
}