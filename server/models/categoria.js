const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = moongose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoria es necesario']
    },
    usuarioIngreso: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario quien ingreso la categoria necesario']
    },
    fechaIngreso: {
        type: Date,
        required: [true, 'La fecha de ingreso de la categoria necesario']
    },
    UsuarioActualizacion: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    fechaActualizacion: {
        type: Date,
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    }
});

categoriaSchema.plugin( uniqueValidator, { message:  '{PATH} debe ser unico'} );

module.exports = moongose.model('Categoria', categoriaSchema);