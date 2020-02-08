const express = require("express");
const convert = require("xml-js");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const stage = require("./models/stage.js");

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

// app.use(bodyParser.json());
app.use(bodyParser.text({ limit: "50mb" }));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => res.render("input.ejs"));

app.post("/", (req, res) => {
    console.log("POST ROUTE CALLED");

    var fieldOperationsJSON = convert.xml2json(req.body, {
        compact: true,
        spaces: 4
    });
    let fieldOperations = JSON.parse(fieldOperationsJSON);

    console.log(fieldOperations);

    extractData(fieldOperations);

    res.redirect("/");
});

function extractData(fieldOperations) {
    // let fieldName = fieldOperations.GridData.Field._text;
    let stages = [];

    fieldOperations.AnalysisData.Row.forEach(row => {
        let step;

        if (~row.Heading_x0020_Group._text.indexOf("Sowing")) {
            step = stage.STEPS.PLANTING;
        } else if (row.Heading_x0020_Group._text == "Seed / Plants") {
            step = stage.STEPS.PLANTING;
        } else if (row.Heading_x0020_Group._text == "Fertiliser") {
            step = stage.STEPS.FERTILIZING;
        } else if (row.Heading_x0020_Group._text == "Insecticides") {
            step = stage.STEPS.PESTICIDES;
        } else if (row.Heading_x0020_Group._text == "Herbicides") {
            step = stage.STEPS.PESTICIDES;
        } else if (row.Heading_x0020_Group._text == "Molluscicides") {
            step = stage.STEPS.PESTICIDES;
        } else if (row.Heading_x0020_Group._text == "Fungicides") {
            step = stage.STEPS.PESTICIDES;
        } else if (row.Heading_x0020_Group._text == "Primary Output") {
            step = stage.STEPS.HARVESTING;
        }

        if (step) {
            let newStage = new stage.Stage(
                row.Field_x0020_Defined_x0020_Name._text,
                step,
                row.Product_x0020_Name._text,
                row.Actual_x002F_Issued_x0020_Date._text
            );

            stages.push(newStage);
        }
    });

    console.log("********");
    console.log(stages);
}

app.listen(port, () => console.log(`Listening on port ${port}!`));