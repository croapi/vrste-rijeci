/*
const displacy = new displaCy('http://localhost:17777', {
    container: '#displacy',
    format: 'spacy',
    distance: 150,
    offsetX: 100,
    bg: 'inherit'
});
*/

function doPOSTag() {
    $('#displacyLoader').show();

    inputSentence = $('#sentenceInput').val();
    
    $.ajax({
        type: "POST",
        url: "https://y23blf12y4.execute-api.eu-central-1.amazonaws.com/prod/pos",
        data: {
            "sentence": inputSentence
        },
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        headers: {
            'x-api-key': 'TwWmLpW0Xj9Kkheo5UpHB6c01ZR7RxAd3BZyfLmS'
        },
        success: function(data, textStatus, jqXHR) {
            parse = data
            displacy.render(parse, {
                color: '#ff0000'
            });
            $('#sentenceInput').blur();
            $('#scrollInfo').show();
        },
        error: function() {
            alert('Došlo je do pogreške. Molimo pokušajte ponovo.');
        },
        complete: function() {
            $('#displacyLoader').hide();
        }
    });
    return false; // very important
};


var predictionsWrapper = document.getElementById('predictions-wrapper');
var predictionsBody = $("#predictions-body");

const colorMap = {
    "IMENICA": "inherit",
    "GLAGOL": "#1779ba",
    "PRIDJEV": "#009933",
    "ZAMJENICA": "#bb0073",
    "BROJ": "#4800bb",
    "PRILOG": "#bb5400",
    "PRIJEDLOG": "#657c00",
    "VEZNIK": "#8c00bb",
    "ČESTICA": "#636060",
    "USKLIK": "#00818a",
    "KRATICA": "#800000",
    "OSTALO": "#aa9901",
    "INTERPUNKCIJA": "#c91b1b",
    "REČENIČNA INTERPUNKCIJA": "#c91b1b"
};

function renderPredictions(predictions) {
    predictionsBody.empty();

    $.each(predictions.words, function(i, word) {
        
        let word_text = word.text;
        let word_tags = word.tag.split('\n');
        
        var word_type = 'OSTALO';
        if (word_tags.length > 0) {
            word_type = word_tags[0];
        }

        var color = "#c91b1b";
        if (word_type in colorMap) {
            color = colorMap[word_type];
        }

        var row = $(`<div class="col-4" style="display: inline-block; float: none; color: ${color};"></div>`);

        row.append(`<div>` + word_text + `</div>`);
        
        $.each(word_tags, function(j, tag) {
            row.append(`<div>` + tag + `</div>`);
        });

        predictionsBody.append(row);
    });

    predictionsWrapper.style.display = 'block';
}

var errorReport = {
    'predictions': [],
    'sentence': '',
    'description': ''
};

let baseURL = 'https://scentalytics.com'; //'http://127.0.0.1:5002';
let apiKey = 'TwWmLpW0Xj9Kkheo5UpHB6c01ZR7RxAd3BZyfLmS';

function doPOSTagNew() {

    inputSentence = $('#sentenceInput').val().trim();

    if (inputSentence.length <= 0) {
        return false;
    }

    $('#displacyLoader').show();
    
    $.ajax({
        type: "POST",
        //url: "/croapi/get-predictions",
        url: baseURL + "/croapi/get-predictions",
        data: JSON.stringify({
            "sentence": inputSentence
        }),
        contentType: "application/json",
        dataType: "json",
        headers: {
            'X-Api-Key': apiKey
        },
        success: function(data, textStatus, jqXHR) {
            predictions = data['predictions'];
            renderPredictions(predictions);
            $('#sentenceInput').trigger("blur");
            $('#currentSentence').val(inputSentence);
            $('#error-description').val('');
            $('#scrollInfo').show();
            errorReport['predictions'] = data['predictions']['words'];

        },
        error: function() {
            alert('Došlo je do pogreške. Molimo pokušajte ponovo.');
        },
        complete: function() {
            $('#displacyLoader').hide();
        }
    });
    return false; // very important
};

$('#report-error-button').on('click', function() {

    errorReport['sentence'] = $('#currentSentence').val();
    errorReport['description'] = $('#error-description').val();
    
    $.ajax({
        type: "POST",
        url: baseURL + "/croapi/report-error",
        data: JSON.stringify(errorReport),
        contentType: "application/json",
        dataType: "json",
        headers: {
            'X-Api-Key': apiKey
        },
        error: function() {
            alert('Došlo je do pogreške. Molimo pokušajte ponovo.');
        },
        complete: function() {
            $('#reportErrorModal').modal('hide');
        }
    });
    
});

//$('#postag').click(doPOSTag);

//$('#displacyLoader').hide();
//$('#scrollInfo').hide();
//$(document).foundation();
//$('#inputForm').on('submit', doPOSTag);
$('#inputForm').on('submit', doPOSTagNew);
