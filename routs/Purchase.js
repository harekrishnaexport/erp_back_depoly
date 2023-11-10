const express = require("express");
const router = express.Router();
const Purchasedetails = require("../model/purchase");
const { errormessage, successmessage } = require("../response/Response");
const Authenticate = require("../Middleware/Authenticate");

router.get("/purchase_list",Authenticate, async (req, res) => {
  Purchasedetails.find({}, null, { sort: { date: -1 } })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/purchasedetails_add", Authenticate, async (req, res) => {
  let { name, quantity, rate, expiry, party, totalamt } = req.body;
  let error = [];
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
    Purchasedetails.create({
      name,
      quantity,
      rate,
      party,
      expiry,
      totalamt,
    })
      .then((result) => {
        // console.log(result);
        return res.status(200).send(successmessage(["Add Successfully"]));
      })
      .catch((error) => {
        return res.status(500).send(errormessage(error));
      });
  }
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

router.post("/purchasedetails_update/:id",Authenticate, async (req, res) => {
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
    Purchasedetails
      .findByIdAndDelete(id)
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
