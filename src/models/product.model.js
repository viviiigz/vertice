import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  nombre_producto: { type: String, required: true, maxlength: 50 },
  descripcion: { type: String },
  precio_original: { type: Number, required: true, min: 0 },
  precio_descuento: { type: Number, min: 0 },
  fecha_caducidad_cercana: { type: Date },
  cantidad_disponible: { type: Number, default: 0, min: 0 },
  foto_url: { type: String },
  categoria: { type: String },
  commerce: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  status: { type: String, enum: ['active', 'inactive', 'sold', 'reserved'], default: 'active' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  expiryDate: { type: Date }
}, { timestamps: true });

ProductSchema.index({ 'location': '2dsphere' });

export default mongoose.model('Product', ProductSchema);