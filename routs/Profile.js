const express = require("express");
const router = express.Router();
const Profiledetails = require("../model/profileDetails");
const { errormessage, successmessage } = require("../response/Response");
const Authenticate = require("../Middleware/Authenticate");
const CompanyDetail = require('../model/profileCompany')

router.get("/profile_list",Authenticate, async (req, res) => {
  Profiledetails
    .find({}, { __v: 0 })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/Profiledetails_bank_add", Authenticate, async (req, res) => {
  let { bankname, holdername, account ,ifsc} = req.body;

  let error = [];
  if (!bankname || !holdername || !account || !ifsc) {
    if (!bankname) {
      error.push("Required");
    }
    if (!holdername) {
      error.push("Required");
    }
    if (!account) {
      error.push("Required");
    }
    if (!ifsc) {
      error.push("Required");
    }

    return res.status(402).json(errormessage(error));
  } else {
    Profiledetails
      .create({
        bankname,
        holdername,
        account,
        ifsc

      })
      .then((result) => {
        return res.status(200).send(successmessage(["Add Successfully"]));
      })
      .catch((error) => {
        return res.status(500).send(errormessage(error));
      });
  }
});

router.get("/Profiledetails_bank_update_detail/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  Profiledetails
    .findById(id, { __v: 0 })
    .then((result) => {
      return res.status(200).send(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/Profiledetails_bank_update/:id",Authenticate, async (req, res) => {
  let { bankname, holdername, account, ifsc } = req.body;
  let id = req.params.id;
  // var jsondata;
  // if (typeof req.body.responsibility === "string") {
  //   jsondata = JSON.parse(responsibility);
  // }
  let error = [];
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    if (!bankname || !holdername || !account || !ifsc) {
      if (!bankname) {
        error.push("Required");
      }
      if (!holdername) {
        error.push("Required");
      }
      if (!account) {
        error.push("Required");
      }
      if (!ifsc) {
        error.push("Required");
      }

      return res.status(402).json(errormessage(error));
    } else {
      // let find_party = await Profiledetails.findById(id);
      let new_data = {};
      if (bankname) {
        new_data.bankname = bankname;
      }
      if (holdername) {
        new_data.holdername = holdername;
      }
      if (account) {
        new_data.account = account;
      }
      if (ifsc) {
        new_data.ifsc = ifsc;
      }

      Profiledetails
        .findByIdAndUpdate(id, { $set: new_data }, { new: true })
        .then((result) => {
          return res.status(200).send(successmessage(result));
        })
        .catch((err) => {
          return res.status(402).send(errormessage(error));
        });
    }
  }
});

router.delete("/Profiledetails_delete/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    Profiledetails
      .findByIdAndDelete(id)
      .then((result) => {
        return res.status(200).send(successmessage("Delete Successfully"));
      })
      .catch((err) => {
        return res.status(402).send(errormessage(err));
      });
  }
});

router.get("/profile_company_list",Authenticate, async (req, res) => {
  CompanyDetail
    .find({}, { __v: 0 })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/Profiledetails_profile_add", Authenticate, async (req, res) => {
  let { comname, comnumber } = req.body;

  let error = [];
  if (!comname || !comnumber) {
    if (!comname) {
      error.push("Required");
    }
    if (!comnumber) {
      error.push("Required");
    }

    return res.status(402).json(errormessage(error));
  } else {
    CompanyDetail
      .create({
        comname,
        comnumber
      })
      .then((result) => {
        return res.status(200).send(successmessage(["Add Successfully"]));
      })
      .catch((error) => {
        return res.status(500).send(errormessage(error));
      });
  }
});


router.post("/Profiledetails_profile_update/:id", async (req, res) => {
  let { comname,comnumber } = req.body;
  console.log(req.body)
  let id = req.params.id;
  let error = [];
  if (!id) {
    console.log('hi')
    return res.status(402).send(errormessage("Required"));
  } else {
    console.log('hidsd')

    if (!comname || !comnumber) {
      if (!comname) {
        error.push("Required");
      }
      if (!comnumber) {
        error.push("Required");
      }
         return res.status(402).json(errormessage(error));
    } else {
      // let find_party = await Profiledetails.findById(id);
      let new_data = {};
      if (comname) {
        new_data.comname = comname;
      }
      if (comnumber) {
        new_data.comnumber = comnumber;
      }
      
      CompanyDetail
        .findByIdAndUpdate(id, { $set: new_data }, { new: true })
        .then((result) => {
          return res.status(200).send(successmessage(result));
        })
        .catch((err) => {
          return res.status(402).send(errormessage(error));
        });
    }
  }
});
module.exports = router;
