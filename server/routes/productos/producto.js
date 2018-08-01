const express =   require('express');

let {verificarToken, verificarAdmin_Role} = require ('../../middlewares/autenticacion');

let app = express();

let Producto = require('../../models/producto');

// ===================================
// Obtener todos los productos
// ===================================
app.get('/productos', verificarToken, (req, res) => {
    let desde = req.query.desde || process.env.DESDE ;
    desde = Number(desde);

    let  limite = req.query.limite || process.env.LIMITE;
    limite = Number(limite);

    let condicion = {estado:true};

    Producto.find(condicion, 'nombre precioUni descripcion disponible categoria usuarioIngreso fechaIngreso usuarioActualizacion fechaActualizacion estado')
    .sort('nombre')
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
        Producto.count(condicion, (err, cuantos) =>{
           if (err){
               return res.status(400).json({
                   ok: false,
                   err
               });
           }
           res.json({
                ok:true,
                productos,
                cuantos
            });
        });
   });
});

// ===================================
// Obtener producto por un id
// ===================================
app.get('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
    .populate('categoria')
    .populate('usuarioIngreso')
    .populate('usuarioActualizacion')
    .exec((err, producto) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto
        });
   });
});

// ===================================
// crear un producto
// ===================================
app.post('/productos', verificarToken, (req, res) => {
    let body = req.body;
    let usuario = req.usuario;
    let producto = new Producto({
        precioUni: body.precioUni,
        nombre: body.nombre,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuarioIngreso: usuario._id,
        fechaIngreso: Date.now()
    });
    console.log(body);
    producto.save((err, productoDB) =>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
          }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ===================================
// actualizar un producto
// ===================================
app.put('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let usuario = req.usuario;
    body.fechaActualizacion = Date.now();
    body.usuarioActualizacion = usuario._id;

    Producto.findByIdAndUpdate(id, body,{new: true, runValidators: true}, (err, productoDB) => {
      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }
      res.json({
          ok: true,
          producto: productoDB
      });
    });
});

// ===================================
// eliminar un producto
// ===================================
app.delete('/productos/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    let id =  req.params.id;
    let body = {estado:false};
    Producto.findByIdAndUpdate(id, body,{new: true}, (err, productoBorrado) =>{
      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }
      if (productoBorrado === null){
          return res.status(400).json({
              ok: false,
              err:  {message:"producto no encontrado"}
          });
      }
      res.json({
          ok: true,
          producto: productoBorrado
      });
    });
});

module.exports = app;