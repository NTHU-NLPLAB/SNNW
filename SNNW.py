import bs4
import requests
import string
from flask import Flask, jsonify, render_template

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASKR_SETTINGS', silent=True)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/linggle/<query>")
def linggleit(query):
    # url = 'http://linggle.com/query/{}'.format(query)
    url = 'http://ironman.nlpweb.org:9487/?search={}'.format(query)
    r = requests.get(url)
    return r.text


@app.route("/writeahead/<query>")
def writeaheadit(query):
    url = 'http://www.writeahead.org/add?text={}'.format(query)
    r = requests.get(url)
    soup = bs4.BeautifulSoup(r.text, "html.parser")
    grammarPatternBlock = soup.find('div', {'id': 'gp_block'}).decode()
    return grammarPatternBlock


# @app.route("/writeaheadd/<query>")
# def writeahead(query):
#     text = request.args['text'].lower().encode('utf8').translate(string.maketrans("",""), string.punctuation).strip().split()
#     r = requests.get(url)
#     return r.text


@app.route("/rephraser/<query>")
def rephraseit(query):
    query = ' '.join(query.split()[-4:])
    url = 'http://ironman.nlpweb.org:13142/get_paraphrases/{}'.format(query)
    r = requests.get(url)
    return jsonify(r.json())


@app.route("/example/<resource>/<query>")
def get_example(resource, query):
    url = 'http://ironman.nlpweb.org:3440/api/{}/{}'.format(resource, query)
    examples = requests.get(url).json()
    examples = set(sent.strip().strip(string.punctuation).capitalize() for sent in examples)
    return jsonify({'query': query, 'resource': resource, 'examples': list(examples)})


if __name__ == "__main__":
    app.run(debug=True)
