const express = require("express"),
  router = express.Router();

router.get("/", async (req, res, next) => {
  res.render("home", { title: "727" });
});

module.exports = router;
