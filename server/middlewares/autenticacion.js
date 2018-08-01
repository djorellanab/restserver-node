const jwt = require('jsonwebtoken');

// ===============
// Verificar token
// ===============
let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){ 
            return res.status(401).json({
            ok: false,
            err: {
                message: 'Acceso denegado'
            }
        })}
        req.usuario = decoded.usuario;
        next();
    } );
};

// ===============
// Verificar Admin_role
// ===============

let verificarAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role !== "ADMIN_ROLE"){
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
    next();
};

module.exports = {verificarToken, verificarAdmin_Role};