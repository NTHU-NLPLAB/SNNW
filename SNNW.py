from flask import Flask, jsonify, render_template
import requests
import urllib
import bs4

app = Flask(__name__)
app.config.from_object(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/linggle/<query>")
def linggleit(query):
    url = 'http://linggle.com/query/{}'.format(urllib.quote(query, safe=''))
    r = requests.get(url)
    return r.text


@app.route("/writeahead/<query>")
def writeaheadit(query):
    url = 'http://www.writeahead.org/add?text={}'.format(urllib.quote(query, safe=''))
    r = requests.get(url)
    soup = bs4.BeautifulSoup(r.text, "html.parser")
    grammarPatternBlock = soup.find('div', {'id': 'gp_block'}).decode()
    return grammarPatternBlock


@app.route("/rephraser/<query>")
def rephraseit(query):
    url = 'http://ironman.nlpweb.org:13142/get_paraphrases/{}'.format(urllib.quote(query, safe=''))
    r = requests.get(url)
    return jsonify(r.json())

if __name__ == "__main__":
    app.run(debug=True)
