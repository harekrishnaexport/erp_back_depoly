const express = require("express");
const router = express.Router();
const { errormessage, successmessage } = require("../response/Response");
const Authenticate = require("../Middleware/Authenticate");
const MainReturnTableSchema = require("../model/mainReturnTable");
const ReturnbillsubSchema = require("../model/returnbillsub");
const productdetails = require("../model/productDetails");
const Billgeneratesub = require("../model/billgeneratesub");
const MainBilltable = require("../model/maniBillTable");

router.post("/returnproduct_list", Authenticate, async (req, res) => {
  let { startDate, endDate, medical, salesmen } = req.body;
  const criteria = {};
  // console.log(req.body);
  const endDateAsDate = new Date(endDate);
  var dateToQuery = endDateAsDate.setHours(23, 59, 59, 999);
  var finalenddate = new Date(dateToQuery);

  if (startDate && endDate) {
    criteria.date = {
      $gte: new Date(startDate),
      $lte: finalenddate,
    };
  }

  if (medical) {
    criteria.medical = medical;
  }

  if (salesmen) {
    criteria.salesmen = salesmen;
  }

  // console.log(criteria);
  MainReturnTableSchema.find(criteria, null, { sort: { date: -1 } })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.get("/subreturn_list_model/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  // console.log(id);
  ReturnbillsubSchema.find({ invoiceId: id }, { __v: 0 })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      // console.log(error);
      return res.status(500).send(errormessage(error));
    });
});

router.post("/returnproduct/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  let returnAmount = req.body.returnAmount;
  // console.log(returnAmount);
  let record = req.body.rows;
  // console.log(record);
  try {
    let result = record.map(async (data) => {
      let filter = {
        $and: [{ product: data.product }, { invoiceId: id }],
      };
      // console.log(data);
      let find_party = await productdetails.findById(data.product);
      let find_returnqty = await Billgeneratesub.find(filter);
      var updadtedqty = parseInt(find_party.quantity, 10) + parseInt(data.retunqty, 10);
      medicalid = data.medicalname;
      if (data.update === true) {
        ReturnbillsubSchema.create({
          medical: data.medicalname,
          product: data.product,
          invoiceId: id,
          qty: data.qty,
          amount: data.amount,
          returnqty: data.retunqty,
          returnamt: data.returnamt,
        })
          .then((result) => {
            // console.log("add in result sub table", result);
          })
          .catch((err) => {
            // console.log(err);
          });

        if (find_returnqty[0].return) {
          let updtreturnqty =
            parseInt(data.retunqty) + find_returnqty[0].return;
          // console.log(updtreturnqty);
          // console.log("if", filter);
          Billgeneratesub.updateOne(filter, { $set: { return: updtreturnqty } })
            .then((result) => {
              // console.log("update  in bill sub table yes", result);
            })
            .catch((err) => {
              // console.log(err);
            });
        } else {
          // console.log("else", filter);
          Billgeneratesub.updateOne(filter, { $set: { return: data.retunqty } })
            .then((result) => {
              // console.log("update  in bill sub table", result);
            })
            .catch((err) => {
              // console.log(err);
            });
        }
        productdetails
          .updateOne({ _id: data.product }, { $set: { quantity: updadtedqty } })
          .then((result) => {
            // console.log("add in product table", result);
          })
          .catch((err) => {
            // console.log(err);
          });
      }
    });

    MainBilltable.updateOne(
      { invoiceId: id },
      { $set: { returnstatus: true, returnamt: returnAmount } }
    )
      .then((result) => {
        // console.log("update mainbill  table", result);
      })
      .catch((err) => {
        // console.log(err);
      });

    let find_returnqty = await MainReturnTableSchema.find({ invoiceId: id });
    if (find_returnqty.length === 0) {
      MainReturnTableSchema.create({
        invoiceId: id,
        medical: record[0].medical,
        salesmen: record[0].salesmen,
        returnamt: returnAmount,
      })
        .then((result) => {
          // console.log("main table", result);
          return res.status(200).send(successmessage(["Create Successfully"]));
        })
        .catch((error) => {
          // console.log(error);
          return res.status(402).send(errormessage(error));
        });
    } else {
      let updadteamount = find_returnqty[0].returnamt + returnAmount;
      MainReturnTableSchema.updateOne(
        { invoiceId: id },
        { $set: { returnamt: updadteamount } }
      )
        .then((result) => {
          return res.status(200).send(successmessage(["Create Successfully"]));
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  } catch (error) {
    return res.status(500).json(errormessage(error));
  }
});

module.exports = router;
