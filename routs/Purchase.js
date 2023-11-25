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
      console.log(data)
      let find_party = await productdetails.find({ name: data.name });
      if (find_party.length === 0) {
        Purchasedetails.create({
          name: data.name,
          quantity: data.quantity,
          invoiceId: sqid,
          rate: data.rate,
          party: data.party,
          expiry: data.expiry,
          totalamt: data.totalamt,
          sellingRate: data.srate,
          mrp: data.mrp
        })
          .then((result) => {
            // console.log("add in bill table", result);
          })
          .catch((err) => {
            // console.log(err);
          });
        productdetails
          .create({
            name: data.name,
            quantity: data.quantity,
            rate: data.srate,
            mrp: data.mrp,
            expiry: data.expiry,
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
          mrp: data.mrp
        })
          .then((result) => {
            // console.log("add in bill table", result);
          })
          .catch((err) => {
            // console.log(err);
          });
        var updadtedqty = parseInt(find_party[0].quantity, 10) + parseInt(data.quantity, 10);
        let new_data = {};
        if (data.name) {
          new_data.name = data.name;
        }
        if (data.quantity) {
          new_data.quantity = updadtedqty;
        }
        if (data.srate) {
          new_data.rate = data.srate;
        }
        if (data.mrp) {
          new_data.mrp = data.mrp;
        }
        if (data.expiry) {
          new_data.expiry = data.expiry;
        }
        console.log(new_data)
        productdetails
          .findOneAndUpdate({ name: data.name }, { $set: new_data }, { new: true })
          .then((result) => {
            // return res.status(200).send(successmessage(result));
          })
          .catch((err) => {
            console.log(err)
            // return res.status(402).send(errormessage(err));
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
  let { record, totalAmount } = req.body;
  let id = req.params.id;
  try {
    if (!id) {
      return res.status(402).send(errormessage("Required"));
    } else {
      for (const data of record) {
        const findProduct = await Purchasedetails.find({
          invoiceId: data.invoiceId,
        });
        const findProduct_update = await productdetails.find({
          name: data.name,
        });

        findProduct.map((e) => {
          if (new ObjectId(e._id).equals(new ObjectId(data._id))) {
            console.log("Ids are equal", e);
            var updadtedqty;
            var updtqtyin_pro;

            if (e.quantity > data.quantity) {
              updadtedqty = parseInt(e.quantity, 10) - parseInt(data.quantity, 10)
              updtqtyin_pro = parseInt(findProduct_update[0].quantity, 10) - updadtedqty
            } else if (e.quantity < data.quantity) {
              updadtedqty = parseInt(data.quantity, 10) - parseInt(e.quantity, 10)
              updtqtyin_pro = parseInt(findProduct_update[0].quantity, 10) + updadtedqty

            } else {
              updadtedqty = 0
              updtqtyin_pro = parseInt(findProduct_update[0].quantity, 10)

            }

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
              new_data.sellingRate = data.sellingRate;
            }


            let product_data = {};
            if (data.name) {
              product_data.name = data.name;
            }
            if (data.quantity) {
              product_data.quantity = updtqtyin_pro;
            }
            if (data.sellingRate) {
              product_data.rate = data.sellingRate;
            }
            if (data.expiry) {
              product_data.expiry = data.expiry;
            }
            if (data.totalamt) {
              product_data.totalamt = data.totalamt;
            }

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

            productdetails.findOneAndUpdate(
              { name: e.name },
              { $set: product_data },
              { new: true }
            )
              .then((result) => {
                console.log('=======', result)
                // return res.status(200).send(successmessage(result));
              })
              .catch((err) => {
                console.log('============', err);
                // return res.status(402).send(errormessage(err));
              });
          }
        });
      }

      const findProduct = await Purchasedetails.find({ invoiceId: id });
      var result = findProduct
        .filter(function (o1) {
          return !record.some(function (o2) {
            return new ObjectId(o1._id).equals(o2._id);
          });
        })
        .map(async (deleterecord) => {
          console.log('=======',deleterecord)
          let productdetailss = await productdetails.find({ name: deleterecord.name })
          let updtqty = productdetailss[0].quantity - parseInt(deleterecord.quantity, 10)
          console.log(updtqty)
          console.log('0000000000',productdetailss[0]._id)

          productdetails.findOneAndUpdate(
            { name: deleterecord.name },
            { $set: { quantity: updtqty } },
            { new: true }
          )
            .then((result) => {
              console.log('=======', result)
            })
            .catch((err) => {
              console.log('============', err);
            });

          Purchasedetails.findByIdAndDelete(deleterecord._id)
            .then((result) => {
              console.log(" bill ", result);
            })
            .catch((err) => {
              console.log(err);
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
    console.log(error)
    return res.status(500).send(errormessage("Severe Error"));
  }
});

router.delete("/purchasedetails_delete/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  console.log(id)
  try {
    if (!id) {
      return res.status(402).send(errormessage("Required"));
    } else {
      let Purchasedetailss = await Purchasedetails.find({ invoiceId: id })
      console.log(Purchasedetailss)
      for (const e of Purchasedetailss) {
        let qty;
        let productdetailss = await productdetails.find({ name: e.name })
        let updtqty = productdetailss[0].quantity - parseInt(e.quantity, 10)
        console.log(e)
        productdetails.findOneAndUpdate(
          { name: e.name },
          { $set: { quantity: updtqty } },
          { new: true }
        )
          .then((result) => {
            console.log('=======', result)
          })
          .catch((err) => {
            console.log('============', err);
          });


        Purchasedetails.findByIdAndDelete(e._id)
          .then((result) => {
            console.log(result)
            // return res.status(200).send(successmessage("Delete Successfully"));
          })
          .catch((err) => {
            console.log(err)
            // return res.status(402).send(errormessage(err));
          });
      }
      MainPurchasetable.findOneAndDelete({ invoiceId: id })
        .then((result) => {
          console.log(result)
          return res.status(200).send(successmessage("Delete Successfully"));
        })
        .catch((err) => {
          console.log(err)
          return res.status(402).send(errormessage(err));
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(errormessage('Server Error'));
  }
});
module.exports = router;
