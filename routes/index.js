const express = require("express");
const router = express.Router();
const Jd = require("../models/jd");

const EasyDocx = require("node-easy-docx");

const easyDocx = new EasyDocx({
  path: "file\\Project Manager Job Description Template.docx",
});

let jobFor = "";

let finalData = [
  { title: "Job Description", content: [] },
  { title: "Person Specification", content: [] },
  { title: "Knowledge & Qualifications", content: [] },
  { title: "Essential", content: [] },
  { title: "Desirable", content: [] },
  { title: "Skills and Experience", content: [] },
  { title: "Aptitudes", content: [] },
];

const submit = function () {
  console.log("IN SUBMIT");

  let dbData = {
    For: jobFor,
    "Job Description": finalData[0].content,
    "Person Specification": [
      {
        "Knowledge & Qualifications": [
          { Essential: finalData[3].content },
          { Desirable: finalData[4].content },
        ],
      },
      { "Skills and Experience": finalData[5].content },
      { Aptitudes: finalData[6].content },
    ],
  };

  Jd.create(dbData);
};

const extJobDesc = (fData) => {
  let jd = [];
  for (
    let i = fData.indexOf("Job Description") + 1;
    i < fData.indexOf("Person Specification");
    i++
  ) {
    jd.push(fData[i]);
  }

  finalData[0].content = jd;
};

const extEssential = (fData) => {
  let jd = [];
  for (
    let i = fData.indexOf("Essential") + 1;
    i < fData.indexOf("Desirable");
    i++
  ) {
    jd.push(fData[i]);
  }

  finalData[3].content = jd;
};

const extDesirable = (fData) => {
  let jd = [];
  for (
    let i = fData.indexOf("Desirable") + 1;
    i < fData.indexOf("Skills and Experience");
    i++
  ) {
    jd.push(fData[i]);
  }

  finalData[4].content = jd;
};

const extSkill = (fData) => {
  let jd = [];
  for (
    let i = fData.indexOf("Skills and Experience") + 1;
    i < fData.indexOf("Aptitudes");
    i++
  ) {
    jd.push(fData[i]);
  }

  finalData[5].content = jd;
};

const extApt = (fData) => {
  let jd = [];
  for (let i = fData.indexOf("Aptitudes") + 1; i < fData.length; i++) {
    jd.push(fData[i]);
  }

  finalData[6].content = jd;
};

router.get("/", function (req, res, next) {
  easyDocx
    .parseDocx()
    .then((data) => {
      // JSON data as result

      let fData = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].text) {
          fData.push(data[i].text.trim());
        } else if (data[i].items) {
          let items = data[i].items;
          let item = "";
          for (let j = 0; j < items.length; j++) {
            item += items[j].text.trim();
          }
          fData.push(item);
        }
      }

      jobFor = fData[0];
      extJobDesc(fData);
      extEssential(fData);
      extDesirable(fData);
      extSkill(fData);
      extApt(fData);

      res.render("index", { data: finalData, submit: submit });
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/save", function (req, res, next) {
  console.log("In Save Route");
  submit();
  res.json("Data Updated ");
});
module.exports = router;
