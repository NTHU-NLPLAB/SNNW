from flask import Flask, jsonify
import requests
import urllib
app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/linggle/<query>")
def linggleit(query):
    url = 'http://linggle.com/query/{}'.format(urllib.quote(query, safe=''))
    r = requests.get(url)
    return jsonify(r.text)

if __name__ == "__main__":
    app.run()
