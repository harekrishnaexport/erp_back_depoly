const express = require("express");
const router = express.Router();
const { errormessage, successmessage } = require("../response/Response");
const Authenticate = require("../Middleware/Authenticate");
const Countermodle = require("../model/meta");
const MainBilltable = require("../model/maniBillTable");
const Billgeneratesub = require("../model/billgeneratesub");
const productdetails = require("../model/productDetails");
const { ObjectId } = require("mongodb");

router.post("/mainbill_list", Authenticate, async (req, res) => {
  let { startDate, endDate, medical, status, salesmen } = req.body;
  const criteria = {};
  const endDateAsDate = new Date(endDate);
  var dateToQuery = endDateAsDate.setHours(23, 59, 59, 999);
  var finalenddate = new Date(dateToQuery);

  if (startDate && endDate) {
    criteria.date = {
      $gte: new Date(startDate),
      $lte: finalenddate,
    };
  }
  if (status == true || status == "true") {
    criteria.status = true;
  } else if (!status) {
  } else {
    criteria.status = false;
  }

  if (medical) {
    criteria.medical = medical;
  }

  if (salesmen) {
    criteria.salesmen = salesmen;
  }

  MainBilltable.find(criteria, null, { sort: { date: -1 } })
    .then((result) => {
      const groupedData = result.reduce((result, record) => {
        const existingGroup = result.find(
          (group) => group.medical === record.medical
        );
        if (existingGroup) {
          existingGroup.record.push(record);
        } else {
          result.push({
            medical: record.medical,
            record: [record],
          });
        }
        return result;
      }, []);
      let senddata = JSON.stringify(groupedData, null, 2);
      let data = {
        senddata,
        result,
      };
      return res.status(200).json(successmessage(data));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });

  // .then((result) => {
  //   return res.status(200).json(successmessage(result));
  // })
  // .catch((error) => {
  //   return res.status(500).send(errormessage(error));
  // });
});

router.get("/subbill_list/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  // console.log(id);
  MainBilltable.find({ medical: id }, { __v: 0 })
    .then((result) => {
      // console.log(result);
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      // console.log(error);
      return res.status(500).send(errormessage(error));
    });
});

router.get("/subbill_list_model/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  // console.log(id);
  Billgeneratesub.find({ invoiceId: id }, { __v: 0 })
    .then((result) => {
      // console.log(result);
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      // console.log(error);
      return res.status(500).send(errormessage(error));
    });
});

router.post("/createbill", Authenticate, async (req, res) => {
  // const title = req.body;
  let totalamt = req.body.totalAmount;
  let record = req.body.rows;
  let discount = req.body.discount;
  let totalPayable = req.body.totalPayable;
  let medicalid;

  try {
    let cd = await Countermodle.findOneAndUpdate(
      { titles: "autoval" },
      { $inc: { id: 1 } },
      { new: true }
    );

    let sqid;
    if (cd === null) {
      const newval = new Countermodle({ titles: "autoval", id: 1 });
      await newval.save();
      sqid = 1;
    } else {
      sqid = cd.id;
    }

    let result = record.map(async (data) => {
      let find_party = await productdetails.findById(data.proname);
      var updadtedqty = find_party.quantity - data.qty;

      medicalid = data.medicalname;
      // console.log(data);
      Billgeneratesub.create({
        medical: data.medicalname,
        product: data.proname,
        invoiceId: sqid,
        rate: data.rate,
        mrp: find_party.mrp,
        qty: data.qty,
        amount: data.amount,
        salesmen: data.salesmen,
      })
        .then((result) => {
          // console.log("add in bill table", result);
        })
        .catch((err) => {
          // console.log(err);
        });
      productdetails
        .updateOne({ _id: data.proname }, { $set: { quantity: updadtedqty } })
        .then((result) => {
          // console.log("add in bill table", result);
        })
        .catch((err) => {
          // console.log(err);
        });
    });

    MainBilltable.create({
      invoiceId: sqid,
      medical: record[0].medicalname,
      totalamt,
      totalPayable,
      discount,
      salesmen: record[0].salesmen,
    })
      .then((result) => {
        // console.log(result);
        return res.status(200).send(successmessage(["Create Successfully"]));
      })
      .catch((error) => {
        // console.log(error);
        return res.status(402).send(errormessage(error));
      });
  } catch (error) {
    // console.log(error);
    return res.status(500).json(errormessage(error));
  }
});

router.post("/mainbill_receive", Authenticate, async (req, res) => {
  let sendingData = req.body;
  try {
    sendingData.forEach(async (data) => {
      MainBilltable.findOneAndUpdate(
        { _id: data._id }, // Use the _id to identify the document
        {
          $set: {
            invoiceId: data.invoiceId,
            receiveamt: data.payamount,
            pendingamount: data.difference,
            status: data.paymentDone,
          },
        },
        { new: true } // To return the updated document
      )
        .then((resu) => {
          // console.log(resu);
          return res.status(200).json(successmessage(["Update Successfully"]));
        })
        .catch((err) => {
          return res.status(402).json(errormessage("Server Error"));
        });
    });
  } catch (error) {
    return res.status(500).json(successmessage(error));
  }
});

router.get("/billdetails_update_detail/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  // console.log(id);
  Billgeneratesub.find({ invoiceId: id }, { __v: 0 })
    .then((result) => {
      // // console.log(result)
      return res.status(200).send(successmessage(result));
    })
    .catch((error) => {
      // console.log(error);
      return res.status(500).send(errormessage(error));
    });
});

router.post("/billdetails_update/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  let totalamt = req.body.totalAmount;
  let record = req.body.rows;

  try {
    if (!id) {
      return res.status(500).send(errormessage("Id Mismatch"));
    } else {
      for (const data of record) {
        const findProduct = await Billgeneratesub.find({
          invoiceId: data.invoiceId,
        });
        let find_party = await productdetails.findById(data.product);
        if (data.new === true) {
          // console.log("new true");
          Billgeneratesub.create({
            medical: record[0].medical,
            product: data.product,
            invoiceId: record[0].invoiceId,
            rate: data.rate,
            mrp: find_party.mrp,
            qty: data.qty,
            amount: data.amount,
            salesmen: record[0].salesmen,
          })
            .then((result) => {
              // console.log("add in bill table", result);
            })
            .catch((err) => {
              // console.log(err);
            });
          var updadtedqtyfornew = find_party.quantity - data.qty;
          productdetails
            .updateOne(
              { _id: data.proname },
              { $set: { quantity: updadtedqtyfornew } }
            )
            .then((result) => {
              // console.log("add in bill table", result);
            })
            .catch((err) => {
              // console.log(err);
            });
        } else {
          // console.log("inside else");
          findProduct.map((e) => {
            if (new ObjectId(e._id).equals(data._id)) {
              let new_data = {};
              // console.log("selected profuct", e);
              if (data.medical) {
                if (
                  !new ObjectId(e.medical).equals(new ObjectId(data.medical))
                ) {
                  new_data.medical = data.medical;
                }
              }
              if (!new ObjectId(e.product).equals(new ObjectId(data.product))) {
                new_data.product = data.product;
              }
              if (data.salesmen) {
                if (
                  !new ObjectId(e.salesmen).equals(new ObjectId(data.salesmen))
                ) {
                  new_data.salesmen = data.salesmen;
                }
              }
              if (e.qty !== data.qty) {
                let updateqty = e.qty - data.qty;
                if (updateqty > 0) {
                  updateqty = parseInt(find_party.quantity, 10) + updateqty;
                  new_data.qty = data.qty;
                  // console.log("updtqty if", updateqty);
                  productdetails
                    .updateOne(
                      { _id: data.product },
                      { $set: { quantity: updateqty } }
                    )
                    .then((result) => {
                      // console.log("add in product table", result);
                    })
                    .catch((err) => {
                      // console.log(err);
                    });
                } else {
                  updateqty = parseInt(find_party.quantity, 10) + updateqty;
                  new_data.qty = data.qty;
                  // console.log("updtqty else", updateqty);

                  productdetails
                    .updateOne(
                      { _id: data.product },
                      { $set: { quantity: updateqty } }
                    )
                    .then((result) => {
                      // console.log("add in product table", result);
                    })
                    .catch((err) => {
                      // console.log(err);
                    });
                }
              }
              if (data.amount) {
                new_data.amount = data.amount;
              }
              // console.log("new data", new_data);
              Billgeneratesub.findByIdAndUpdate(data._id, { $set: new_data })
                .then((result) => {
                  // console.log("add in bill sub table", result);
                })
                .catch((err) => {
                  // console.log(err);
                });
            } else {
              // console.log("else entry for delete colum", e._id);
            }
          });
        }
      }

      let new_data = {};
      if (record[0].invoiceId) {
        new_data.invoiceId = record[0].invoiceId;
      }
      if (record[0].medical) {
        new_data.medical = record[0].medical;
      }
      if (record[0].salesmen) {
        new_data.salesmen = record[0].salesmen;
      }
      if (totalamt) {
        new_data.totalPayable = totalamt;
      }
      // // console.log("main table", new_data);
      const findProduct = await Billgeneratesub.find({ invoiceId: id });
      // console.log(findProduct);
      // console.log(record);

      var result = findProduct
        .filter(function (o1) {
          return !record.some(function (o2) {
            return new ObjectId(o1._id).equals(o2._id);
          });
        })
        .map(async (deleterecord) => {
          let find_party = await productdetails.findById(deleterecord.product);
          let updtqty = parseInt(find_party.quantity, 10) + deleterecord.qty;
          Billgeneratesub.findByIdAndDelete(deleterecord._id)
            .then((result) => {
              // console.log("add in bill sub table", result);
            })
            .catch((err) => {
              // console.log(err);
            });
          productdetails
            .updateOne(
              { _id: deleterecord.product },
              { $set: { quantity: updtqty } }
            )
            .then((result) => {
              // console.log("add in product table", result);
            })
            .catch((err) => {
              // console.log(err);
            });
        });
      MainBilltable.updateOne(
        { invoiceId: record[0].invoiceId },
        { $set: new_data },
        { new: true }
      )
        .then((result) => {
          // console.log("add in bill  main table", result);
          return res.status(200).send(successmessage(["Update Successfully"]));
        })
        .catch((err) => {
          return res.status(401).send(errormessage(err));
        });
    }
  } catch (error) {
    return res.status(500).json(errormessage(error));
  }
});

router.delete("/billdetails_delete/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  try {
    if (!id) {
      return res.status(402).send(errormessage("Required"));
    } else {
      let recordsubbill = await Billgeneratesub.find({ invoiceId: id });
      recordsubbill.map(async (data) => {
        let find_party = await productdetails.findById(data.product);

        var updadtedqty =
          parseInt(find_party.quantity, 10) + parseInt(data.qty, 10);
        productdetails
          .updateOne({ _id: data.product }, { $set: { quantity: updadtedqty } })
          .then((result) => {
            // console.log("add in bill table", result);
          })
          .catch((err) => {
            // console.log(err);
          });

        Billgeneratesub.findOneAndDelete({ invoiceId: data.invoiceId })
          .then((result) => {
            // console.log(result);
          })
          .catch((err) => {
            // console.log(err);
          });
      });

      MainBilltable.deleteOne({ invoiceId: recordsubbill[0].invoiceId })
        .then((result) => {
          return res.status(200).send(successmessage("Delete Successfully"));
        })
        .catch((err) => {
          return res.status(402).send(errormessage(err));
        });
    }
  } catch (error) {
    return res.status(500).send(errormessage(error));
  }
});

module.exports = router;
