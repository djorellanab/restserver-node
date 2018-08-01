const express =   require('express');

let {verificarToken, verificarAdmin_Role} = require ('../../../middlewares/autenticacion');

let app = express();

let Producto = require('../../../models/producto');

// ===================================
// Obtener todos los productos
// ===================================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    let desde = req.query.desde || process.env.DESDE ;
    desde = Number(desde);

    let  limite = req.query.limite || process.env.LIMITE;
    limite = Number(limite);

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    let condicion = {estado:true, nombre:regex};

    Producto.find(condicion)
    .populate('categoria')
    .populate('usuarioIngreso')
    .populate('usuarioActualizacion')
    .limit(limite)
    .skip(desde)
    .exec((err, productos) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            productos
        });
   });;
});

module.exports = app;