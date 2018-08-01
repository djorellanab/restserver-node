var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuarioIngreso: { type: Schema.Types.ObjectId, ref: 'Usuario',  required: [true, 'el usuario que ingresa el producto es necesario'] },
    fechaIngreso: { type: Date, required: [true, 'la fecha de ingreso de producto es necesario'] },
    usuarioActualizacion: { type: Schema.Types.ObjectId, ref: 'Usuario'},
    fechaActualizacion: { type: Date },
    estado: { type: Boolean, default: true }
});


module.exports = mongoose.model('Producto', productoSchema);