const express = require("express");
const router = express.Router();
const Purchasedetails = require("../model/purchase");
const { errormessage, successmessage } = require("../response/Response");
const Authenticate = require("../Middleware/Authenticate");
const CountermodleforPurchase = require("../model/CountermodleforPurchase");
const MainPurchasetable = require("../model/MainPurchasetable");

router.get("/purchase_list", Authenticate, async (req, res) => {
  Purchasedetails.find({}, null, { sort: { date: -1 } })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.get("/purchasemaintbl_list", Authenticate, async (req, res) => {
  MainPurchasetable.find({}, null, { sort: { date: -1 } })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/purchasedetails_add", Authenticate, async (req, res) => {
  let { name, quantity, rate, expiry, party, totalAmount, record } = req.body;
  let error = [];
  // if (!name || !quantity || !rate || !party || !expiry || !totalamt) {
  //   if (!name) {
  //     error.push("Required");
  //   }
  //   if (!quantity) {
  //     error.push("Required");
  //   }
  //   if (!rate) {
  //     error.push("Required");
  //   }
  //   if (!party) {
  //     error.push("Required");
  //   }
  //   if (!expiry) {
  //     error.push("Required");
  //   }
  //   if (!totalamt) {
  //     error.push("Required");
  //   }
  //   return res.status(402).json(errormessage(error));
  // } else {
  //   Purchasedetails.create({
  //     name,
  //     quantity,
  //     rate,
  //     party,
  //     expiry,
  //     totalamt,
  //   })
  //     .then((result) => {
  //       // console.log(result);
  //       return res.status(200).send(successmessage(["Add Successfully"]));
  //     })
  //     .catch((error) => {
  //       return res.status(500).send(errormessage(error));
  //     });
  // }

  let cd = await CountermodleforPurchase.findOneAndUpdate(
    { titles: "autoval" },
    { $inc: { id: 1 } },
    { new: true }
  );

  let sqid;
  if (cd === null) {
    const newval = new CountermodleforPurchase({ titles: "autoval", id: 1 });
    await newval.save();
    sqid = 1;
  } else {
    sqid = cd.id;
  }
  console.log(record)
  let result = record.map(async (data) => {
    // let find_party = await productdetails.findById(data.proname);
    // var updadtedqty = find_party.quantity - data.qty;

    medicalid = data.medicalname;
    // console.log(data);
    Purchasedetails.create({
      name:data.name,
      quantity:data.quantity,
      invoiceId: sqid,
      rate:data.rate,
      party:data.party,
      expiry:data.expiry,
      totalamt:data.totalamt,
      sellingRate: data.srate,
    })
      .then((result) => {
        // console.log("add in bill table", result);
      })
      .catch((err) => {
        // console.log(err);
      });
    // productdetails
    //   .updateOne({ _id: data.proname }, { $set: { quantity: updadtedqty } })
    //   .then((result) => {
    //     // console.log("add in bill table", result);
    //   })
    //   .catch((err) => {
    //     // console.log(err);
    //   });
  });

  MainPurchasetable.create({
    invoiceId: sqid,
    party: record[0].party,
    totalamt: totalAmount,
  })
    .then((result) => {
      // console.log(result);
      return res.status(200).send(successmessage(["Create Successfully"]));
    })
    .catch((error) => {
      // console.log(error);
      return res.status(402).send(errormessage(error));
    });
});

router.get(
  "/purchasedetails_update_detail/:id",
  Authenticate,
  async (req, res) => {
    let id = req.params.id;
    Purchasedetails.findById(id, { __v: 0 })
      .then((result) => {
        return res.status(200).send(successmessage(result));
      })
      .catch((error) => {
        return res.status(500).send(errormessage(error));
      });
  }
);

router.post("/purchasedetails_update/:id", Authenticate, async (req, res) => {
  let { name, quantity, rate, expiry, party, totalamt } = req.body;
  let id = req.params.id;
  // var jsondata;
  // if (typeof req.body.responsibility === "string") {
  //   jsondata = JSON.parse(responsibility);
  // }
  let error = [];
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    if (!name || !quantity || !rate || !party || !expiry || !totalamt) {
      if (!name) {
        error.push("Required");
      }
      if (!quantity) {
        error.push("Required");
      }
      if (!rate) {
        error.push("Required");
      }
      if (!party) {
        error.push("Required");
      }
      if (!expiry) {
        error.push("Required");
      }
      if (!totalamt) {
        error.push("Required");
      }
      return res.status(402).json(errormessage(error));
    } else {
      let find_party = await Purchasedetails.findById(id);
      var updadtedqty = find_party.quantity - quantity;
      if (updadtedqty > 0) {
        updadtedqty = -updadtedqty;
      } else if (updadtedqty < 0) {
        updadtedqty = Math.abs(updadtedqty);
      } else {
        updadtedqty = updadtedqty;
      }

      let new_data = {};
      if (name) {
        new_data.name = name;
      }
      if (quantity) {
        new_data.quantity = quantity;
      }
      if (rate) {
        new_data.rate = rate;
      }
      if (party) {
        new_data.party = party;
      }
      if (expiry) {
        new_data.expiry = expiry;
      }
      if (totalamt) {
        new_data.totalamt = totalamt;
      }

      Purchasedetails.findByIdAndUpdate(id, { $set: new_data }, { new: true })
        .then((result) => {
          return res.status(200).send(successmessage(result));
        })
        .catch((err) => {
          return res.status(402).send(errormessage(error));
        });
    }
  }
});

router.delete("/purchasedetails_delete/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  // console.log(id)
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    Purchasedetails.findByIdAndDelete(id)
      .then((result) => {
        // console.log(result)
        return res.status(200).send(successmessage("Delete Successfully"));
      })
      .catch((err) => {
        // console.log(err)
        return res.status(402).send(errormessage(err));
      });
  }
});
module.exports = router;
