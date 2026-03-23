const mongoose = require('mongoose');
const type = require('mongoose/lib/schema/operators/type');
const { Schema } = mongoose;

const ItemMasterSchema = new mongoose.Schema({
  ItemCode: { type: String},
  ItemName: { type: String },
  UOM: { type: String }, // Unit of Measurement
  Rate: { type: Number },
  Category: { type: String },
  SubCategory: { type: String },
  ItemImage: { type: String},
  ItemType: { type: String },
  Void: { type: String },
     OpeningStock: {
      type: Number,
      default: 0,
      min: 0
    }
  
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  versionKey: false // Removes __v field
});


const TableMasterSchema = new mongoose.Schema({
  TableNo: { type: String},
  TableName: { type: String },
  TableStatus: { type: String }, 
  TableCapacity: { type: Number },
  TableFromTime: { type: Number },
  TableToTime: { type: String },
  Void: { type: String },
}, {
  timestamps: true, 
  versionKey: false 
});




module.exports = {
    TableMaster: mongoose.model('POS_TableMaster', TableMasterSchema),
    ItemMaster: mongoose.model('POS_ItemMaster', ItemMasterSchema)
};
