
var send_btn = document.getElementById("send_btn");
var input = document.getElementById("input")
var wirteahead_results = document.getElementById("wirteahead_results")
var linggle_results = document.getElementById("linggle_results")
var rephraser_results = document.getElementById("rephraser_results")
var last_request = {}
var current_query = ''
var timeoutId = '';
linggle_regex = /_|~|#\d+|\?|\*|\/|(v|n|adj|adv|prep|det|conj|pron|interj)\./

  // send_btn.onclick = function() {
  //     search(input.value)
  // };

$('#input').on('input', function() {
    var query = this.value.trim();
    if (query !== '' && query !== current_query) {
        $('#search_bar').addClass("loading");
        current_query = query
        resetAutoSearchTimer(800);
        // search(query);
    }
});

$('.ui.modal')
    .modal('attach events', '#help-btn', 'show');

function resetAutoSearchTimer(ms) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(search, ms);
};

function search() {
    query = current_query;
    test = query.match(linggle_regex);
    // abort pending request
    // if (last_request) {
    //   last_request.abort();
    // }
    if (test) {
        last_request['linggle'] = search_linggle(query);
        showResult('l_results');
    } else {
        last_request['writeahead'] = search_writeahead(query);
        last_request['rephraser'] = search_rephraser(query);
        showResult('wr_results');
    }
}

function search_linggle(query) {
    linggle = new XMLHttpRequest();
    linggle.onreadystatechange = function() {
        if (this != last_request['linggle']) {
          return;
        }
        $('#search_bar').removeClass("loading");
        if (this.readyState === 4) {

            if (this.status === 200) {
                console.log(this.response);
                // results = eval('(' + this.response + ')');
                results = JSON.parse(this.response);

                linggle_results.innerHTML = renderLinggleResult(results);
                $('.ui.bottom.red.attached.progress').progress();
            } else {
                console.log('An error occurred during your linggle: ' + this.status + ' ' + this.statusText);
            }
        }


    }
    linggle.open('GET', '/linggle/' + encodeURIComponent(query), true);
    linggle.send();
    return linggle;
}


function search_writeahead(query) {
    var writeahead = new XMLHttpRequest();
    writeahead.onreadystatechange = function() {
        if (this != last_request['writeahead']) {
          return;
        }
        $('#search_bar').removeClass("loading");
        if (this.readyState === 4) {

            if (this.status === 200) {
                console.log(this.responseText);
                wirteahead_results.innerHTML = this.responseText;
            } else {
                console.log('An error occurred during your linggle: ' + this.status + ' ' + this.statusText);
            }
        }


    }
    writeahead.open('GET', '/writeahead/' + encodeURIComponent(query), true);
    writeahead.send();
    return writeahead;
}

function search_rephraser(query) {
    var rephraser = new XMLHttpRequest();
    // last_request = rephraser
    rephraser.onreadystatechange = function() {
        if (this != last_request['rephraser']) {
          return;
        }
        $('#search_bar').removeClass("loading");
        $('#rephraser_area').removeClass("loading");
        if (this.readyState === 4) {

            if (this.status === 200) {
                console.log(this.responseText);
                results = JSON.parse(this.response);

                rephraser_results.innerHTML = renderRephraserResult(results);
                $('.ui.bottom.blue.attached.progress').progress();
            } else {
                console.log('An error occurred during your linggle: ' + this.status + ' ' + this.statusText);
            }
        }


    }
    rephraser.open('GET', '/rephraser/' + encodeURIComponent(query), true);
    rephraser.send();
    $('#rephraser_area').addClass("loading");
    return rephraser;
}

function showResult(blockid) {
    $('#result_area').children(':not(#' + blockid + ')').addClass('visible').removeClass('hidden').end()
        .children('#' + blockid).addClass('hidden').removeClass('visible')
}

function renderLinggleResult(data) {
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

function renderRephraserResult(data) {
    var html = '<tr><td>No result</td></tr>';
    if (data.length !== 0) {
        html = '';
        data.forEach(function(element) {
            html +=
                '<tr>' +
                '<td>' + element[0]  +
                '<div class="ui bottom blue attached progress" data-percent="' +element[2] + '">' +
                '<div class="bar"></div>' +
                '</div>' +
                '</td>' +
                '<td>' + element[2] + '%</td>' +
                '<td>' + element[1] + '</td>' +
                '</tr>';
        });
    }
    return html;
};
