const express = require("express");
const router = express.Router();
const { errormessage, successmessage } = require("../response/Response");
const Authenticate = require("../Middleware/Authenticate");
const PaymentDeatails = require("../model/payment");
const MainpaymentDetails = require("../model/mainPaymentable");
const MainBilltable = require("../model/maniBillTable");

router.post("/payment_list", Authenticate, async (req, res) => {
  let { startDate, endDate, medical, status, id, salesmen } = req.body;
  const criteria = {};
  // console.log(req.body)
  const endDateAsDate = new Date(endDate);
  var dateToQuery = endDateAsDate.setHours(23, 59, 59, 999);
  var finalenddate = new Date(dateToQuery)


  if (status == true || status == "true") {
    criteria.status = true;
  } else if (!status) {
  } else {
    criteria.status = false;
  }

  if (startDate && endDate) {
    criteria.date = {
      $gte: new Date(startDate),
      $lte: finalenddate,
    };
  }

  if (medical) {
    criteria.medical = medical;
  }
  if (id) {
    criteria.invoiceId = id;
  }
  if (salesmen) {
    criteria.salesmen = salesmen;
  }


  // console.log(criteria)
  if (criteria.status === true) {
    MainpaymentDetails.find(criteria, null, { sort: { date: -1 } })

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
  } else {
    MainBilltable.find(criteria, null, { sort: { date: -1 } })
      .then((result) => {
        // // console.log(result)
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
        // console.log(error);
        return res.status(500).json(errormessage(error));
      });
  }
});

router.get("/payment_list_seperate/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  // console.log(id);
  PaymentDeatails.find(
    {
      invoiceId: id,
    },
    { __v: 0 }
  )
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/paymentreceive", Authenticate, async (req, res) => {
  let record = req.body.sending_data;
  try {
    let error = 0;
    let createPromises = [];
    record.forEach((data) => {
      let medicalid = data.medical;
      let paymentCreatePromise = PaymentDeatails.create({
        medical: medicalid,
        invoiceId: data.invoiceId,
        totalamount: data.totalPayable,
        payamount: data.payamount,
        pandingamount: data.difference,
        status: data.paymentDone,
        amount: data.amount,
      }).then(() => {
        return (error = 0);
      });
      createPromises.push(paymentCreatePromise);
      if (data.paymentDone === true) {
        let mainPaymentCreatePromise = MainpaymentDetails.create({
          medical: medicalid,
          invoiceId: data.invoiceId,
          totalamount: data.totalPayable,
          returnamt: data.returnamt,
          status: data.paymentDone,
          receiveamount: data.payamount,
          salesmen: data.salesmen
        }).then(() => {
          return (error = 0);
        });
        createPromises.push(mainPaymentCreatePromise);
      }
    });

    // Wait for all promises to resolve
    await Promise.all(createPromises);

    return res.status(200).json({ message: "Records inserted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
