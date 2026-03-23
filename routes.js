const express = require("express");
const mongose = require("mongoose");
const router = express.Router();

const OrderMaster = require("./ordermodel")
const {TableMaster,ItemMaster} = require("./model")

router.get("/", (req, res) => {
  res.send("Hello, World!");
});
// ✅ CREATE Item
router.post("/Itemcreate", async (req, res) => {
  try {
   
    let entity = req.body;
     console.log(entity,'hellooo');
    const item = new ItemMaster(entity);
    await item.save();

    res.status(201).json({BoolVal:true});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/GetItem", async (req, res) => {
  try {
    const items = await ItemMaster.find(); // fetch all documents
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




router.get("/GetOrderAll", async (req, res) => {
  try {
    const items = await OrderMaster.find(); // fetch all documents
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/SalesReport", async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const filter = {};

    // Date filter only
    if (fromDate && toDate) {
      filter.OrderDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      };
    }

    const orders = await OrderMaster.find(filter).select(
      "OrderNo OrderDate OrderType PaymentType TotalAmount OrderStatus OrderDetails"
    );

    const result = orders.map(o => ({
      OrderNo: o.OrderNo,
      OrderDate: o.OrderDate,
      OrderType: o.OrderType,
      PaymentType: o.PaymentType,
      OrderStatus: o.OrderStatus,
      TotalAmount: o.TotalAmount,
      ItemCount: o.OrderDetails.length
    }));

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/GetTables", async (req, res) => {
  try {
    const items = await TableMaster.find(); // fetch all documents
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.put("/update-table-status", async (req, res) => {
  try {
    const { tableNo, status } = req.body;

    const result = await TableMaster.findOneAndUpdate(
      { TableNo: tableNo },              // ✅ find by TableNo
      { $set: { TableStatus: status } }, // ✅ update only status
      { new: true }                      // ✅ return updated doc
    );

    if (!result) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json({
      message: "Table status updated successfully",
      data: result
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/GetOrderTypeCount", async (req, res) => {
  try {
const result = await OrderMaster.aggregate([
  {
    $group: {
      _id: "$OrderType",
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      OrderType: "$_id",
      count: 1
    }
  }
]);

const result2 = await OrderMaster.aggregate([
  {
    $group: {
      _id: null,
      grandTotal: {
        $sum: {
          $add: ["$TotalAmount", "$TaxAmount"]
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      grandTotal: 1
    }
  }
]);


const result3 = await OrderMaster.aggregate([
  {
    $group: {
      _id: "$OrderType",
      grandTotal: {
        $sum: {
          $add: ["$TotalAmount", "$TaxAmount"]
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      OrderType: "$_id",
      grandTotal: 1
    }
  }
]);


const last7DaysSales = await OrderMaster.aggregate([
  {
    $match: {
      OrderDate: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7))
      }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$OrderDate" }
      },
      totalSales: {
        $sum: {
          $add: ["$TotalAmount", "$TaxAmount"]
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      date: "$_id",
      totalSales: 1
    }
  },
  {
    $sort: { date: 1 }
  }
]);

const topSellingFood = await OrderMaster.aggregate([
  {
    $unwind: "$OrderDetails"
  },
  {
    $group: {
      _id: {
        ItemCode: "$OrderDetails.ItemCode",
        ItemName: "$OrderDetails.ItemName"
      },
      totalQtySold: { $sum: "$OrderDetails.Qty" },
      totalRevenue: { $sum: "$OrderDetails.TotalAmount" }
    }
  },
  {
    $sort: { totalQtySold: -1 }
  },
  {
    $limit: 4   // Top 10 items
  }
]);



    res.send({
      response1:result,
      response2:result2,
      response3:result3,
      response4:last7DaysSales,
      response5:topSellingFood,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/update", async (req, res) => {
  try {
    const { _id } = req.query;
    const updatedItem = await ItemMaster.findByIdAndUpdate(
      new mongoose.Types.ObjectId(_id),
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/delete", async (req, res) => {
  try {
    const { _id } = req.query;
    const deletedItem = await ItemMaster.findByIdAndDelete(new mongoose.Types.ObjectId(_id));

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.post("/OrderCreate", async (req, res) => {
  try {
   
    let entity = req.body;
    console.log(entity)
    const item = new OrderMaster(entity);
    await item.save();
    res.status(201).json({BoolVal:true});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/OrderStatusupdate", async (req, res) => {
  try {
    const { _id, OrderStatus } = req.query;

    if (!_id || !OrderStatus) {
      return res
        .status(400)
        .json({ message: "Missing _id or OrderStatus" });
    }

    const updatedItem = await OrderMaster.findByIdAndUpdate(
      _id,
      { OrderStatus: OrderStatus },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      updatedItem
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/sales-report", async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const match = {};

    // ✅ Date filter (FULL DAY FIX)
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      match.OrderDate = { $gte: from, $lte: to };
    }

    const result = await OrderMaster.aggregate([
      ...(Object.keys(match).length ? [{ $match: match }] : []),

      { $unwind: "$OrderDetails" },

      {
        $group: {
          _id: "$OrderDetails.ItemName",
          TotalQty: { $sum: "$OrderDetails.Qty" },
          TotalAmount: { $sum: "$OrderDetails.Amount" }
        }
      },

      {
        $project: {
          _id: 0,
          ItemName: "$_id",
          TotalQty: 1,
          TotalAmount: 1
        }
      },

      { $sort: { ItemName: 1 } }
    ]);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

