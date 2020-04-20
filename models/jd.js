const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.promise = Promise;

const jdSchema = new Schema({
  For: {
    type: "String",
  },
  "Job Description": {
    type: "Array",
  },
  "Person Specification": {
    type: ["Array"],
  },
});

const Jd = mongoose.model("jds", jdSchema);
module.exports = Jd;
