from flask import Flask, jsonify, render_template
import requests
import urllib
import bs4
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/linggle/<query>")
def linggleit(query):
    url = 'http://linggle.com/query/{}'.format(urllib.quote(query, safe=''))
    r = requests.get(url)
    return jsonify(r.text)


@app.route("/writeahead/<query>")
def writeaheadit(query):
    url ='http://www.writeahead.org/add?text={}'.format(urllib.quote(query, safe=''))
    r = requests.get(url)
    soup = bs4.BeautifulSoup(r.text, "html.parser")
    grammarPatternBlock = soup.find('div', {'id': 'gp_block'}).decode()
    return grammarPatternBlock

if __name__ == "__main__":
    app.run()
