const express = require("express");
const router = express.Router();
const Purchasedetails = require("../model/purchase");
const { errormessage, successmessage } = require("../response/Response");
const Authenticate = require("../Middleware/Authenticate");
const CountermodleforPurchase = require("../model/CountermodleforPurchase");
const MainPurchasetable = require("../model/MainPurchasetable");
const { ObjectId } = require("mongodb");
const productdetails = require("../model/productDetails");

router.get("/purchase_list/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  Purchasedetails.find({ invoiceId: id }, null, { sort: { date: -1 } })
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
  let { totalAmount, record } = req.body;
  let error = [];

  try {
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
    let result = record.map(async (data) => {

      let find_party = await productdetails.find({name:data.name});
      if (find_party === null) {
        Purchasedetails.create({
          name: data.name,
          quantity: data.quantity,
          invoiceId: sqid,
          rate: data.rate,
          party: data.party,
          expiry: data.expiry,
          totalamt: data.totalamt,
          sellingRate: data.srate,
        })
          .then((result) => {
            // console.log("add in bill table", result);
          })
          .catch((err) => {
            // console.log(err);
          });
          productdetails
          .create({
            name:data.name,
            quantity:data.quantity,
            rate:data.rate,
            mrp:data.mrp,
            expiry:data.expiry,
          })
          .then((result) => {
            console.log(result);
          }).catch((err) => {
            console.log(err);
          })
      } else {
        Purchasedetails.create({
          name: data.name,
          quantity: data.quantity,
          invoiceId: sqid,
          rate: data.rate,
          party: data.party,
          expiry: data.expiry,
          totalamt: data.totalamt,
          sellingRate: data.srate,
        })
          .then((result) => {
            // console.log("add in bill table", result);
          })
          .catch((err) => {
            // console.log(err);
          });

        var updadtedqty = parseInt(find_party.quantity, 10) + parseInt(data.quantity, 10);

        let new_data = {};
        if (data.name) {
          new_data.name = data.name;
        }
        if (data.quantity) {
          new_data.quantity = updadtedqty;
        }
        if (data.rate) {
          new_data.rate = data.rate;
        }
        if (data.mrp) {
          new_data.mrp = data.mrp;
        }
        if (data.expiry) {
          new_data.expiry = data.expiry;
        }
        productdetails
        .findOneAndUpdate({name:data.name}, { $set: new_data }, { new: true })
        .then((result) => {
          return res.status(200).send(successmessage(result));
        })
        .catch((err) => {
          return res.status(402).send(errormessage(error));
        });
      }
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
        return res.status(402).send(errormessage(error));
      });
  } catch (error) {
    return res.status(500).send(errormessage("Server Error"));
  }
});

router.get(
  "/purchasedetails_update_detail/:id",
  Authenticate,
  async (req, res) => {
    let id = req.params.id;
    Purchasedetails.find({ invoiceId: id }, { __v: 0 })
      .then((result) => {
        return res.status(200).send(successmessage(result));
      })
      .catch((error) => {
        return res.status(500).send(errormessage(error));
      });
  }
);

router.post("/purchasedetails_update/:id", Authenticate, async (req, res) => {
  let { name, quantity, rate, expiry, party, totalamt, record, totalAmount } =
    req.body;
  let id = req.params.id;
  try {
    if (!id) {
      return res.status(402).send(errormessage("Required"));
    } else {
      for (const data of record) {
        const findProduct = await Purchasedetails.find({
          invoiceId: data.invoiceId,
        });
        console.log("loop data", data);

        findProduct.map((e) => {
          if (new ObjectId(e._id).equals(new ObjectId(data._id))) {
            console.log("Ids are equal");
            let new_data = {};
            if (data.name) {
              new_data.name = data.name;
            }
            if (data.quantity) {
              new_data.quantity = data.quantity;
            }
            if (data.rate) {
              new_data.rate = data.rate;
            }
            if (data.party) {
              new_data.party = data.party;
            }
            if (data.expiry) {
              new_data.expiry = data.expiry;
            }
            if (data.totalamt) {
              new_data.totalamt = data.totalamt;
            }
            if (data.sellingRate) {
              new_data.sellingRate = data.srate;
            }
            // console.log(e._id)

            Purchasedetails.findByIdAndUpdate(
              e._id,
              { $set: new_data },
              { new: true }
            )
              .then((result) => {
                // return res.status(200).send(successmessage(result));
              })
              .catch((err) => {
                console.log(err);
                // return res.status(402).send(errormessage(err));
              });
          }
        });

        // console.log("inside else");
        // findProduct.map((e) => {
        //   if (new ObjectId(e._id).equals(data._id)) {
        //     let new_data = {};
        //     // console.log("selected profuct", e);
        //     if (data.medical) {
        //       if (
        //         !new ObjectId(e.medical).equals(new ObjectId(data.medical))
        //       ) {
        //         new_data.medical = data.medical;
        //       }
        //     }
        //     if (!new ObjectId(e.product).equals(new ObjectId(data.product))) {
        //       new_data.product = data.product;
        //     }
        //     if (data.salesmen) {
        //       if (
        //         !new ObjectId(e.salesmen).equals(new ObjectId(data.salesmen))
        //       ) {
        //         new_data.salesmen = data.salesmen;
        //       }
        //     }
        //     if (e.qty !== data.qty) {
        //       let updateqty = e.qty - data.qty;
        //       if (updateqty > 0) {
        //         updateqty = parseInt(find_party.quantity, 10) + updateqty;
        //         new_data.qty = data.qty;
        //         // console.log("updtqty if", updateqty);
        //         productdetails
        //           .updateOne(
        //             { _id: data.product },
        //             { $set: { quantity: updateqty } }
        //           )
        //           .then((result) => {
        //             // console.log("add in product table", result);
        //           })
        //           .catch((err) => {
        //             // console.log(err);
        //           });
        //       } else {
        //         updateqty = parseInt(find_party.quantity, 10) + updateqty;
        //         new_data.qty = data.qty;
        //         // console.log("updtqty else", updateqty);

        //         productdetails
        //           .updateOne(
        //             { _id: data.product },
        //             { $set: { quantity: updateqty } }
        //           )
        //           .then((result) => {
        //             // console.log("add in product table", result);
        //           })
        //           .catch((err) => {
        //             // console.log(err);
        //           });
        //       }
        //     }
        //     if (data.amount) {
        //       new_data.amount = data.amount;
        //     }
        //     // console.log("new data", new_data);
        //     Billgeneratesub.findByIdAndUpdate(data._id, { $set: new_data })
        //       .then((result) => {
        //         // console.log("add in bill sub table", result);
        //       })
        //       .catch((err) => {
        //         // console.log(err);
        //       });
        //   } else {
        //     // console.log("else entry for delete colum", e._id);
        //   }
        // });
      }

      const findProduct = await Purchasedetails.find({ invoiceId: id });
      var result = findProduct
        .filter(function (o1) {
          return !record.some(function (o2) {
            return new ObjectId(o1._id).equals(o2._id);
          });
        })
        .map(async (deleterecord) => {
          Purchasedetails.findByIdAndDelete(deleterecord._id)
            .then((result) => {
              // console.log("add in bill sub table", result);
            })
            .catch((err) => {
              // console.log(err);
            });
        });

      MainPurchasetable.updateOne(
        { invoiceId: record[0].invoiceId },
        { $set: { totalamt: totalAmount } },
        { new: true }
      )
        .then((result) => {
          return res.status(200).send(successmessage(["Update Successfully"]));
        })
        .catch((err) => {
          return res.status(401).send(errormessage(err));
        });
    }
  } catch (error) {
    return res.status(500).send(errormessage("Severe Error"));
  }
});

router.delete("/purchasedetails_delete/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  console.log(id)
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    Purchasedetails.findByIdAndDelete(id)
      .then((result) => {
        console.log(result)
        return res.status(200).send(successmessage("Delete Successfully"));
      })
      .catch((err) => {
        console.log(err)
        return res.status(402).send(errormessage(err));
      });
  }
});
module.exports = router;
