const mongoose = require('mongoose');

const CATEGORIES = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Powder', 'Other'];
const whole = { validator: Number.isInteger, message: 'Must be a whole number' };

const medicineSchema = new mongoose.Schema(
  {
    medicineName: { type: String, required: [true, 'Medicine name is required'], trim: true, maxlength: 120 },
    company: { type: String, required: [true, 'Company is required'], trim: true, maxlength: 120 },
    category: { type: String, required: [true, 'Category is required'], enum: { values: CATEGORIES, message: 'Invalid category' } },
    batchNumber: { type: String, required: [true, 'Batch number is required'], trim: true, unique: true, maxlength: 60 },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'], max: 1000000 },
    quantity: { type: Number, required: [true, 'Quantity is required'], min: [0, 'Quantity cannot be negative'], max: 10000000, validate: whole },
    minimumStock: { type: Number, required: [true, 'Minimum stock is required'], min: [0, 'Minimum stock cannot be negative'], max: 10000000, validate: whole },
    manufacturingDate: { type: Date, required: [true, 'Manufacturing date is required'] },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
      validate: {
        validator(v) { return !this.manufacturingDate || v > this.manufacturingDate; },
        message: 'Expiry date must be after the manufacturing date',
      },
    },
    description: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true, collection: 'medicines' }
);

module.exports = mongoose.model('Medicine', medicineSchema);
module.exports.CATEGORIES = CATEGORIES;
