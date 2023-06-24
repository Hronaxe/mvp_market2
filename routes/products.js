var Product = require("../models/product.js");
var Joi = require("joi");
var express = require("express");
var router = express.Router();

router.post("/products", (req, res) => {
  const validate = validateProduct(req.body).error;
  if (validate) return res.status(400).send(validate.message);

  const product = new Product({
    Produs: req.body.Produs,
    Pret: req.body.Pret,
    Description: req.body.Description,
  });

  product
    .save()
    .then((result) => res.send(result))
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/products", (req, res) => {
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

router.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(400).send("The product with the given ID not found");
  res.status(201).json(product);
});

router.put("/product/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).lean();
    res.send(product);
  } catch {
    res
      .status(404)
      .send({ error: "The listing with the given ID was not found." });
  }
});

router.delete("/product/:id", async (req, res) => {
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
