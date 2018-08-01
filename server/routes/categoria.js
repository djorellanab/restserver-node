const express =   require('express');

let {verificarToken, verificarAdmin_Role} = require ('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', verificarToken, (req, res) => {
    let desde = req.query.desde || process.env.DESDE ;
    desde = Number(desde);

    let  limite = req.query.limite || process.env.LIMITE;
    limite = Number(limite);

    let condicion = {estado:true};

    Categoria.find(condicion, 'nombre estado usuarioIngreso')
    .sort('nombre')
    .populate('usuarioIngreso','nombre','Usuario')
    .limit(limite)
    .skip(desde)
    .exec((err, categorias) => {
         if (err){
             return res.status(400).json({
                 ok: false,
                 err
             });
         }
         Categoria.count(condicion, (err, cuantos) =>{
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                 ok:true,
                 categorias,
                 cuantos
             });
         });
    });
});

// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) =>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
          }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Crear una nueva categoria
// ============================
app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;
    let usuario = req.usuario;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuarioIngreso: usuario._id,
        fechaIngreso: Date.now()
    });
    categoria.save((err, categoriaDB) =>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
          }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Actualizar una categoria
// ============================
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let usuario = req.usuario;
    body.fechaActualizacion = Date.now();
    body.UsuarioActualizacion = usuario._id;

    Categoria.findByIdAndUpdate(id, body,{new: true, runValidators: true}, (err, categoriaDB) => {
      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }
      res.json({
          ok: true,
          categoria: categoriaDB
      });
    });
});

// ============================
// Eliminar una categoria
// ============================
app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    let id =  req.params.id;
    let body = {estado:false};
    Categoria.findByIdAndUpdate(id, body,{new: true}, (err, categoriaBorrado) =>{
      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }
      if (categoriaBorrado === null){
          return res.status(400).json({
              ok: false,
              err:  {message:"categoria no encontrado"}
          });
      }
      res.json({
          ok: true,
          categoria: categoriaBorrado
      });
    });
});

module.exports = app;