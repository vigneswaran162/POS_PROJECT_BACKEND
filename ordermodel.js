const mongoose = require("mongoose");

/* ------------------ COUNTER SCHEMA ------------------ */

const CounterSchema = new mongoose.Schema({
  prefix: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", CounterSchema);

/* ------------------ ORDER DETAIL SCHEMA ------------------ */

const OrderDetailSchema = new mongoose.Schema(
  {
    ItemCode: String,
    ItemName: String,
    Qty: Number,
    Rate: Number,
    Amount: Number,
    Discount: Number,
    TaxPercent: Number,
    TaxAmount: Number,
    TotalAmount: Number
  },
  { _id: false }
);

/* ------------------ ORDER MASTER SCHEMA ------------------ */

const OrderMasterSchema = new mongoose.Schema(
  {
    OrderNo: { type: String, unique: true },
    OrderDate: { type: Date, default: Date.now },
    CustomerName: String,
    PaymentType: String,
    PaymentStatus: String,
    TotalAmount: Number,
    DiscountAmount: Number,
    TaxAmount: Number,
    GrandTotal: Number,
    OrderStatus: String,
    CustomerPhoneNo: String,
    OrderType: String,
    TableNo: String,
    DeliveryAddress: String,
    OrderDetails: [OrderDetailSchema]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

/* ------------------ AUTO GENERATE ORDER NUMBER ------------------ */

OrderMasterSchema.pre("save", async function (next) {
  // If already has OrderNo, skip
  if (this.OrderNo) return next();

  // Format: ORD20251207
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");
  const prefix = `ORD${datePart}`;

  try {
    const counter = await Counter.findOneAndUpdate(
      { prefix },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqStr = counter.seq.toString().padStart(3, "0");

    this.OrderNo = `${prefix}-${seqStr}`;
    next();
  } catch (err) {
    console.error("OrderNo generation error:", err);
    next(err);
  }
});

module.exports = mongoose.model("OrderMaster", OrderMasterSchema);
