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
            },
            error: function(err) {
                console.log("error: " + err);
            }
        });
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