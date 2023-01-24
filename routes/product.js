var Product = require("../models/product.js");
var Joi = require("joi");
var express = require("express");
var router = express.Router();

router.post("/", (req, res) => {
  const validate = validateProduct(req.body).error;
  if (validate) return res.status(400).send(validate.message);

  const post = new Product({
    Produs: req.body.Produs,
    Pret: req.body.Pret,
    Description: req.body.Description,
  });

  post
    .save()
    .then((result) => res.send(result))
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/", (req, res) => {
  try {
    Product.find()
      .sort({ Pret: req.query.orderBy })
      .then((products) => res.send(products))
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => res.send(product))
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});

router.put("/:id", (req, res) => {
  if (
    req.body.Produs === "" ||
    req.body.Pret <= 0 ||
    req.body.Description == ""
  ) {
    res.status(400).send("Invalid input data");
    return;
  }

  Product.findByIdAndUpdate(req.params.id, {
    Produs: req.body.Produs,
    Pret: req.body.Pret,
    Description: req.body.Description,
  })
    .then((result) => {
      if (result === null) {
        return res.status(404).send("Product not found");
      }
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

//product body validation

function validateProduct(product) {
  const schema = Joi.object({
    Produs: Joi.string().required(),
    Pret: Joi.number().required().greater(0),
    Description: Joi.string().required(),
  });
  return schema.validate(product);
}

module.exports = router;
