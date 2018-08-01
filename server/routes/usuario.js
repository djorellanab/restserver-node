const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const Usuario = require('../models/usuario');
const _ = require('underscore');
const {verificarToken, verificarAdmin_Role} = require('../middlewares/autenticacion');

app.get('/usuario', verificarToken, function (req, res) {
    let desde = req.query.desde || process.env.DESDE ;
    desde = Number(desde);

    let  limite = req.query.limite || process.env.LIMITE;
    limite = Number(limite);

    let condicion = {estado:true};

    Usuario.find(condicion, 'nombre email role estado google img')
           .limit(limite)
           .skip(desde)
           .exec((err, usuarios) => {
                if (err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Usuario.count(condicion, (err, cuantos) =>{
                    res.json({
                        ok:true,
                        usuarios,
                        cuantos
                    });
                });
           });
  });
   
  app.post('/usuario', [verificarToken, verificarAdmin_Role], function (req, res) {
      let body = req.body;
      let usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: bcrypt.hashSync(body.password,10),
          role: body.role
      });

      usuario.save((err, usuarioDB) => {
          if (err){
            return res.status(400).json({
                ok: false,
                err
            });
          }
          res.json({
              ok: true,
              usuario: usuarioDB
          });
      });
  });
  
  app.put('/usuario/:id', [verificarToken, verificarAdmin_Role], function (req, res) {
      let id = req.params.id;
      let body = _.pick(req.body, [
        'nombre',
        'img',
        'role',
        'estado']);

      Usuario.findByIdAndUpdate(id, body,{new: true, runValidators: true}, (err, usuarioDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
      });
  });
  
  app.delete('/usuario/:id',  [verificarToken, verificarAdmin_Role], function (req, res) {
      let id =  req.params.id;
      let body = {estado:false};
      Usuario.findByIdAndUpdate(id, body,{new: true}, (err, usuarioBorrado) =>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (usuarioBorrado === null){
            return res.status(400).json({
                ok: false,
                err:  {message:"Usuario no encontrado"}
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
      });
  });
  
  module.exports = app;