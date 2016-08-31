
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

$('.ui.modal')
    .modal('attach events', '#help-btn', 'show');

$('#input').on('input', function() {
    var query = this.value.trim();
    if (query !== '' && query !== current_query) {
        $('#search_bar').addClass("loading");
        current_query = query;
        resetAutoSearchTimer(query.match(linggle_regex) ? 100:800);
        // search();
    }
});

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
                $('.example_btn').on('click', function() {
                    var query = $(this).parent().parent().find('td:first').text().replace(/\s+/g, " ").trim()
                    $(this).children('i').toggleClass('minus')
                    $(this).parent().parent().find('~ .content:first').toggle();
                    var test = $('tr.content[attr="' + query + '"] .ui.segment p')
                    if(test.length == 0) {
                        search_example(query)
                    }
                })
            } else {
                console.log('An error occurred during your linggle: ' + this.status + ' ' + this.statusText);
            }
        }

    }
    linggle.open('GET', '/linggle/' + encodeURIComponent(query).replace(/%2F/g, "@"), true);
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
                $('.example_btn').on('click', function() {
                    var query = $(this).parent().parent().find('td:first').text().replace(/\s+/g, " ").trim()
                    $(this).children('i').toggleClass('minus')
                    $(this).parent().parent().find('~ .content:first').toggle();
                    var test = $('tr.content[attr="' + query + '"] .ui.segment p')
                    if(test.length == 0) {
                        search_example(query)
                    }
                })
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

function search_example(query) {
    var example = new XMLHttpRequest();
    example.onreadystatechange = function() {
        if (this.readyState === 4) {

            if (this.status === 200) {
                var result = JSON.parse(this.response);
                // var result_content = $('tr.content[attr="' + result.query + '"] .ui.segment');
                var htmlFrag = ''
                result.examples.forEach(function(example) {
                    htmlFrag += '<p>' + example + '</p>';
                });
                $('tr.content[attr="' + result.query + '"] .ui.segment').html(htmlFrag);
                // example_area.find('.example_result').removeClass("loading");
            } else {
                console.log('An error occurred during your Example: ' + this.status + ' ' + this.statusText);
            }
        }


    }
    example.open('GET', '/example/nyt/' + encodeURIComponent(query), true);
    example.send();
    return example;
}

function showResult(blockid) {
    // $('#result_area').children(':not(#' + blockid + ')').addClass('visible').removeClass('hidden').hide().end()
    //     .children('#' + blockid).addClass('hidden').removeClass('visible').show()
    $('#result_area').children(':not(#' + blockid + ')').hide().end().children('#' + blockid).show()
}

function renderLinggleResult(data) {
    var html = '<tr><td>No result</td></tr>';
    if (data.length !== 0) {
        html = '';
        data.forEach(function(element) {
            var phrase = element.phrase.join(' ').replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
            html +=
                '<tr class="title">' +
                '<td>' + element.phrase.join(' ') +
                '<div class="ui bottom red attached progress" data-percent="' + /[0-9]+/g.exec(element.percent)[0] + '">' +
                '<div class="bar"></div>' +
                '</div>' +

                '</td>' +
                '<td>' + element.percent + '</td>' +
                '<td>' + element.count_str + '</td>' +
                '<td class="center aligned">' +
                '<button class="ui icon button example_btn">' +
                    '<i class="icon plus"></i>' +
                '</button>' +
                '</td>' +
                '</tr>' +
                // example
                '<tr class="content" attr="' + phrase + '" style="display:none;">' +
                '<td colspan="4">' +
                '<div class="ui segment">' +
                '<div class="ui active inverted dimmer">' +
                '<div class="ui text tiny loader">Loading</div>' +
                '</div>' +
                '<img class="ui wireframe image" style="width: 100%;" src="/static/img/short-paragraph.png">' +
                '</div>' +
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
                '<td class="center aligned">' +
                '<button class="ui icon button example_btn">' +
                '<i class="icon plus"></i>' +
                '</button>' +
                '</td>' +
                // example
                '<tr class="content" attr="' + element[0] + '" style="display:none;">' +
                '<td colspan="4">' +
                '<div class="ui segment">' +
                '<div class="ui active inverted dimmer">' +
                '<div class="ui text tiny loader">Loading</div>' +
                '</div>' +
                '<img class="ui wireframe image" style="width: 100%;" src="/static/img/short-paragraph.png">' +
                '</div>' +
                '</td>' +
                '</tr>';
        });
    }
    return html;
};
