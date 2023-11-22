const express = require("express");
const router = express.Router();
const productdetails = require("../model/productDetails");
const productdetailsSeperate = require("../model/productchangestatus");
const { errormessage, successmessage } = require("../response/Response");
const Authenticate = require("../Middleware/Authenticate");
const ProductList = require("../model/ProductList");

router.get("/product_list", Authenticate, async (req, res) => {
  productdetails
    .find({}, null, { sort: { date: -1 } })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.get("/productdetailsSeperate_list", Authenticate, async (req, res) => {
  productdetailsSeperate
    .find({}, null, { sort: { date: -1 } })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});

router.post("/productdetails_add", Authenticate, async (req, res) => {
  let { name, quantity, rate, expiry, mrp } = req.body;
  // console.log(req.body);
  let error = [];
  if (!name || !quantity || !rate || !mrp || !expiry) {
    if (!name) {
      error.push("Required");
    }
    if (!quantity) {
      error.push("Required");
    }
    if (!rate) {
      error.push("Required");
    }
    if (!mrp) {
      error.push("Required");
    }
    if (!expiry) {
      error.push("Required");
    }
    return res.status(402).json(errormessage(error));
  } else {
    productdetails
      .create({
        name,
        quantity,
        rate,
        mrp,
        expiry,
      })
      .then((result) => {
        // console.log(result._id);
        productdetailsSeperate
          .create({
            product_ref: result._id,
            name,
            quantity,
            rate,
            mrp,
            expiry,
          })
          .then((result) => {
            return res.status(200).send(successmessage(["Add Successfully"]));
          })
          .catch((error) => {
            return res.status(500).send(errormessage(error));
          });
        // return res.status(200).send(successmessage(["Add Successfully"]));
      })
      .catch((error) => {
        return res.status(500).send(errormessage(error));
      });
  }
});


router.get("/productdetails_update_detail/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  productdetails
    .findById(id, { __v: 0 })
    .then((result) => {
      return res.status(200).send(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
}
);

router.post("/productdetails_update/:id", Authenticate, async (req, res) => {
  let { name, quantity, rate, expiry, mrp } = req.body;
  let id = req.params.id;
  // var jsondata;
  // if (typeof req.body.responsibility === "string") {
  //   jsondata = JSON.parse(responsibility);
  // }
  let error = [];
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    if (!name || !quantity || !rate || !mrp || !expiry) {
      if (!name) {
        error.push("Required");
      }
      if (!quantity) {
        error.push("Required");
      }
      if (!rate) {
        error.push("Required");
      }
      if (!mrp) {
        error.push("Required");
      }
      if (!expiry) {
        error.push("Required");
      }
      return res.status(402).json(errormessage(error));
    } else {
      let find_party = await productdetails.findById(id);
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
      if (mrp) {
        new_data.mrp = mrp;
      }
      if (expiry) {
        new_data.expiry = expiry;
      }

      productdetails
        .findByIdAndUpdate(id, { $set: new_data }, { new: true })
        .then((result) => {
          return res.status(200).send(successmessage(result));
        })
        .catch((err) => {
          return res.status(402).send(errormessage(error));
        });

      productdetailsSeperate
        .create({
          product_ref: find_party._id,
          name,
          quantity: updadtedqty,
          rate,
          mrp,
          expiry,
        })
        .then((result) => {
          // console.log(result);
          // return res.status(200).send(successmessage(["Add Successfully"]));
        })
        .catch((error) => {
          // console.log(error);
          // return res.status(500).send(errormessage(error));
        });
    }
  }
});

router.delete("/productdetails_delete/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    productdetails
      .findByIdAndDelete(id)
      .then((result) => {
        return res.status(200).send(successmessage("Delete Successfully"));
      })
      .catch((err) => {
        return res.status(402).send(errormessage(err));
      });

    productdetailsSeperate
      .deleteMany({ product_ref: id })
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        // console.log(err);
      });
  }
});



// list of name poduct
router.get("/product_list_seperate", Authenticate, async (req, res) => {
  ProductList
    .find({}, null, { sort: { date: -1 } })
    .then((result) => {
      return res.status(200).json(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
});


router.post("/productlist_add", Authenticate, async (req, res) => {
  let { name } = req.body;
  // console.log(req.body);
  let error = [];
  if (!name) {
    return res.status(402).json(errormessage(error));
  } else {
    try {
      const result = await ProductList.create({ name });
      return res.status(200).send(successmessage(["Add Successfully"]));
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
        return res.status(402).json(errormessage("Name must be unique."));
      } else {
        return res.status(500).send(errormessage(error));
      }
    }
  }
});

router.get("/productdetails_update_list/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  ProductList
    .findById(id, { __v: 0 })
    .then((result) => {
      return res.status(200).send(successmessage(result));
    })
    .catch((error) => {
      return res.status(500).send(errormessage(error));
    });
}
);

router.post("/productdetails_update_list/:id", Authenticate, async (req, res) => {
  let { name } = req.body;
  let id = req.params.id;

  let error = [];
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    if (!name) {
      return res.status(402).json(errormessage('Required'));
    } else {
      try {
        const result = await ProductList.findByIdAndUpdate(id, { $set: name }, { new: true });
        return res.status(200).send(successmessage(["Update Successfully"]));
      } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
          return res.status(402).json(errormessage("Name must be unique."));
        } else {
          return res.status(500).send(errormessage(error));
        }
      }
    }
  }
});

router.delete("/productdetails_delete_list/:id", Authenticate, async (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.status(402).send(errormessage("Required"));
  } else {
    ProductList
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
