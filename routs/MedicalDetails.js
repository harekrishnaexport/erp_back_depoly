const express = require("express");
const router = express.Router();
const medicaldetails = require("../model/medicaldetails");
const { errormessage, successmessage } = require("../response/Response");
const Authenticate = require("../Middleware/Authenticate");

router.get("/medical_list", Authenticate,async (req, res) => {
  medicaldetails
    .find({}, { __v: 0 })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/medicaldetails_add", Authenticate, async (req, res) => {
  let {name ,address , mobile  } = req.body;

  let error = [];
  if (!name || !address || !mobile) {
    if (!name) {
      error.push("Required");
    }
    if (!address) {
      error.push("Required");
    }
    if (!mobile) {
      error.push("Required");
    }

    return res.status(402).json(errormessage(error));
  } else {
    medicaldetails
      .create({
        name,
        address,
        mobile,
       
      })
      .then((result) => {
        return res.status(200).send(successmessage(["Add Successfully"]));
      })
      .catch((error) => {
        return res.status(500).send(errormessage(error));
      });
  }
});

router.get("/medicaldetails_update_detail/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  medicaldetails
    .findById(id, { __v: 0 })
    .then((result) => {
      return res.status(200).send(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/medicaldetails_update/:id", Authenticate,async (req, res) => {
  let { name, address, mobile } = req.body;
  let id = req.params.id;
  // var jsondata;
  // if (typeof req.body.responsibility === "string") {
  //   jsondata = JSON.parse(responsibility);
  // }
  let error = [];
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    if (!name || !address || !mobile) {
      if (!name) {
        error.push("Required");
      }
      if (!address) {
        error.push("Required");
      }
      if (!mobile) {
        error.push("Required");
      }
  
      return res.status(402).json(errormessage(error));
    } else {
      // let find_party = await medicaldetails.findById(id);
      let new_data = {};
      if (name) {
        new_data.name = name;
      }
      if (address) {
        new_data.address = address;
      }
      if (mobile) {
        new_data.mobile = mobile;
      }

      medicaldetails
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

router.delete("/medicaldetails_delete/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    medicaldetails
      .findByIdAndDelete(id)
      .then((result) => {
        return res.status(200).send(successmessage("Delete Successfully"));
      })
      .catch((err) => {
        return res.status(402).send(errormessage(err));
      });
  }
});
module.exports = router;
