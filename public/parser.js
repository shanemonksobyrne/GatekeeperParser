(function($) {
    ("use strict");

    console.log("Gatekeeper parser running...");

    const reader = new FileReader();
    const parser = new DOMParser();

    const startApp = function startApp(xml) {
        return Promise.resolve(xml || doc);
    };

    const fileUpload = document.getElementById("fileupload");
    const label = document.querySelector("label[for=fileupload]");

    const handleAppStart = function handleStartApp(xml) {
        console.log("xml document:", xml);
        label.innerHTML = currentFileName + " successfully uploaded";

        sendXMLFileToServer(xml);
        // do app stuff
    };

    const handleError = function handleError(err) {
        console.error(err);
    };

    let doc;
    let currentFileName = "";

    reader.addEventListener("loadend", handleFileRead);

    reader.addEventListener("error", handleError);

    function handleFileRead(event) {
        label.innerHTML = "";

        try {
            doc = parser.parseFromString(reader.result, "application/xml");
            fileUpload.value = "";

            startApp(doc)
                .then(function(data) {
                    handleAppStart(data);
                })
                .catch(handleError);
        } catch (e) {
            handleError(e);
        }
    }

    function handleFileUpload(event) {
        let file = fileUpload.files[0];
        if (/xml/.test(file.type)) {
            reader.readAsText(file);
            currentFileName = file.name;
        }
    }

    fileUpload.addEventListener("change", handleFileUpload);

    function sendXMLFileToServer(xml) {
        let xmlString = xmlToString(xml);

        //get field name from file name - Only used for single field upload
        // let fieldNameUnfinished = currentFileName.substring(21);
        // let xmlIndex = fieldNameUnfinished.indexOf(".xml");
        // let fieldName = fieldNameUnfinished.substring(0, xmlIndex - 1);

        //add fieldname as xml row
        // let fieldString = "<Field>" + fieldName + "</Field>";
        // var indexOfFirstRow = xmlString.indexOf("Row");

        // var xmlStringWithFieldName =
        //     xmlString.slice(0, indexOfFirstRow - 1) +
        //     fieldString +
        //     xmlString.slice(indexOfFirstRow - 1);

        $.ajax({
            url: "/",
            type: "POST",
            data: xmlString,
            processData: false,
            contentType: false,
            success: function(returned) {
                console.log("Success\n");
                populateTables(returned);
            },
            error: function(err) {
                console.log("error: " + err);
            }
        });
    }

    function populateTables(stages) {
        let plantingStages = [];
        let fertilizingStages = [];
        let pesticidesStages = [];
        let harvestingStages = [];

        stages.forEach(stage => {
            if (stage.step == "PLANTING") {
                plantingStages.push(stage);
            } else if (stage.step == "FERTILIZING") {
                fertilizingStages.push(stage);
            } else if (stage.step == "PESTICIDES") {
                pesticidesStages.push(stage);
            } else if (stage.step == "HARVESTING") {
                harvestingStages.push(stage);
            }
        });

        /******************PLANTING TABLE UPDATE***********************/

        let plantingContent =
            "<tr><th>Field</th><th>Step</th><th>Description</th><th>Date</th></tr>";

        for (var i = 0; i < plantingStages.length; i++) {
            plantingContent += "<tr>";
            plantingContent += "<td>" + plantingStages[i].field + "</td>";
            plantingContent += "<td>" + plantingStages[i].step + "</td>";
            plantingContent += "<td>" + plantingStages[i].description + "</td>";
            plantingContent += "<td>" + plantingStages[i].date + "</td>";
            plantingContent += "</tr>";
        }

        $("#planting-table").html(plantingContent);

        /******************FERTILIZING TABLE UPDATE***********************/

        let fertilizingContent =
            "<tr><th>Field</th><th>Step</th><th>Description</th><th>Date</th></tr>";

        for (var i = 0; i < fertilizingStages.length; i++) {
            fertilizingContent += "<tr>";
            fertilizingContent += "<td>" + fertilizingStages[i].field + "</td>";
            fertilizingContent += "<td>" + fertilizingStages[i].step + "</td>";
            fertilizingContent += "<td>" + fertilizingStages[i].description + "</td>";
            fertilizingContent += "<td>" + fertilizingStages[i].date + "</td>";
            fertilizingContent += "</tr>";
        }

        $("#fertilizing-table").html(fertilizingContent);

        /******************PESTICIDES TABLE UPDATE***********************/

        let pesticidesContent =
            "<tr><th>Field</th><th>Step</th><th>Description</th><th>Date</th></tr>";

        for (var i = 0; i < pesticidesStages.length; i++) {
            pesticidesContent += "<tr>";
            pesticidesContent += "<td>" + pesticidesStages[i].field + "</td>";
            pesticidesContent += "<td>" + pesticidesStages[i].step + "</td>";
            pesticidesContent += "<td>" + pesticidesStages[i].description + "</td>";
            pesticidesContent += "<td>" + pesticidesStages[i].date + "</td>";
            pesticidesContent += "</tr>";
        }

        $("#pesticides-table").html(pesticidesContent);

        /******************HARVESTING TABLE UPDATE***********************/

        let harvestingContent =
            "<tr><th>Field</th><th>Step</th><th>Description</th><th>Date</th></tr>";

        for (var i = 0; i < harvestingStages.length; i++) {
            harvestingContent += "<tr>";
            harvestingContent += "<td>" + harvestingStages[i].field + "</td>";
            harvestingContent += "<td>" + harvestingStages[i].step + "</td>";
            harvestingContent += "<td>" + harvestingStages[i].description + "</td>";
            harvestingContent += "<td>" + harvestingStages[i].date + "</td>";
            harvestingContent += "</tr>";
        }

        $("#harvesting-table").html(harvestingContent);
    }

    function xmlToString(xmlData) {
        var xmlString;
        //IE
        if (window.ActiveXObject) {
            xmlString = xmlData.xml;
        }
        // code for Mozilla, Firefox, Opera, etc.
        else {
            xmlString = new XMLSerializer().serializeToString(xmlData);
        }
        return xmlString;
    }
})(jQuery);