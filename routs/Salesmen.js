const express = require("express");
const router = express.Router();
const Salesmendetails = require("../model/salesmen");
const { errormessage, successmessage } = require("../response/Response");
const Authenticate = require("../Middleware/Authenticate");

router.get("/salesmendetails_list", Authenticate,async (req, res) => {
    Salesmendetails
    .find({}, { __v: 0 })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/salesmendetails_add", Authenticate, async (req, res) => {
  let {name ,email , mobile  } = req.body;

  let error = [];
  if (!name || !email || !mobile) {
    if (!name) {
      error.push("Required");
    }
    if (!email) {
      error.push("Required");
    }
    if (!mobile) {
      error.push("Required");
    }

    return res.status(402).json(errormessage(error));
  } else {
    Salesmendetails
      .create({
        name,
        email,
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

router.get("/salesmendetails_update_detail/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  Salesmendetails
    .findById(id, { __v: 0 })
    .then((result) => {
      return res.status(200).send(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/salesmendetails_update/:id",Authenticate, async (req, res) => {
  let { name, email, mobile } = req.body;
  let id = req.params.id;
  // var jsondata;
  // if (typeof req.body.responsibility === "string") {
  //   jsondata = JSON.parse(responsibility);
  // }
  let error = [];
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    if (!name || !email || !mobile) {
      if (!name) {
        error.push("Required");
      }
      if (!email) {
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
      if (email) {
        new_data.email = email;
      }
      if (mobile) {
        new_data.mobile = mobile;
      }

      Salesmendetails
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

router.delete("/salesmendetails_delete/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    Salesmendetails
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
