
var send_btn = document.getElementById("send_btn");
var input = document.getElementById("input")
var linggle_area = document.getElementById("linggle_area")
var linggle_results = document.getElementById("linggle_results")
var wirteahead_results = document.getElementById("wirteahead_results")
var last_request = undefined
linggle_regex = /_|~|#\d+|\?|\*|\/|(v|n|adj|adv|prep|det|conj|pron|interj)\./

send_btn.onclick = function() {
    search(input.value)
};

$('#input').on('input', function() {
    var query = this.value;
    if (query !== '') {
        search(query);
    }
});

function search(query) {
    test = query.match(linggle_regex)
    // abort pending request
    if (last_request) {
      // last_request.abort();
    }
    if (test) {
        last_request = search_linggle(query);
    } else {
        last_request = search_writeahead(query);
    }
}

function renderSearchResult(data) {
    var html = '<tr><td>No result</td></tr>';
    if (data.length !== 0) {
        html = '';
        data.forEach(function(element) {
            html +=
                '<tr>' +
                '<td>' + element.phrase.join(' ') +
                '<div class="ui bottom red attached progress" data-percent="' + /[0-9]+/g.exec(element.percent)[0] + '">' +
                '<div class="bar"></div>' +
                '</div>' +
                '</td>' +
                '<td>' + element.percent + '</td>' +
                '<td>' + element.count_str + '</td>' +
                '<td class="center aligned">' +
                '<button class="ui icon button">' +
                '<i class="icon plus"></i>' +
                '</button>' +
                '</td>' +
                '</tr>';
        });
    }
    return html;
};

function search_linggle(query) {
    linggle = new XMLHttpRequest();
    linggle.onreadystatechange = function() {
        if (this != last_request) {
          return;
        }
        if (linggle.readyState === 4) {

            if (linggle.status === 200) {
                console.log(linggle.response);
                // results = eval('(' + linggle.response + ')');
                results = JSON.parse(eval(linggle.response));

                linggle_results.innerHTML = renderSearchResult(results);
                // $('#wirteahead_results').hide()
                // $('#linggle_area').show()
                addClass(wirteahead_results, 'visible');
                removeClass(wirteahead_results, 'hidden');
                removeClass(linggle_area, 'visible');
                addClass(linggle_area, 'hidden');
                $('.ui.bottom.red.attached.progress').progress();
            } else {
                console.log('An error occurred during your linggle: ' + linggle.status + ' ' + linggle.statusText);
            }
        }


    }
    linggle.open('GET', '/linggle/' + query, true);
    linggle.send();
    return linggle;
}


function search_writeahead(query) {
    var writeahead = new XMLHttpRequest();
    last_request = writeahead
    writeahead.onreadystatechange = function() {
        if (this != last_request) {
          return;
        }
        if (writeahead.readyState === 4) {

            if (writeahead.status === 200) {
                console.log(writeahead.responseText);
                wirteahead_results.innerHTML = writeahead.responseText;
                // $('#linggle_area').hide()
                // $('#wirteahead_results').show()
                addClass(linggle_area, 'visible');
                removeClass(linggle_area, 'hidden');
                removeClass(wirteahead_results, 'visible');
                addClass(wirteahead_results, 'hidden');
            } else {
                console.log('An error occurred during your linggle: ' + writeahead.status + ' ' + writeahead.statusText);
            }
        }


    }
    writeahead.open('GET', '/writeahead/' + query, true);
    writeahead.send();
    return writeahead;
}
