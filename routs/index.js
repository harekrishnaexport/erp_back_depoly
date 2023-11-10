const router = require("express").Router();
// router.use("/authers", require("./SendMail"));
router.use("/return", require("./ReturnOdr"));
router.use("/purchase", require("./Purchase"));
router.use("/auth", require("./auth"));
router.use("/meta", require("./Meta"));
router.use("/forget", require("./Forgetpass"));
router.use("/product", require("./Product"));
router.use("/profile", require("./Profile"));
router.use("/bill", require("./BillGenerate"));
router.use("/medical", require("./MedicalDetails"));
router.use("/sales", require("./Salesmen"));
router.use("/payment", require("./Payment"));



module.exports = router;
