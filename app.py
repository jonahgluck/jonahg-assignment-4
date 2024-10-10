from flask import Flask, render_template, request, jsonify
import numpy as np
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load dataset
newsgroups = fetch_20newsgroups(subset='all')
documents = newsgroups.data

# Vectorize documents using TF-IDF
vectorizer = TfidfVectorizer(stop_words='english')
doc_term_matrix = vectorizer.fit_transform(documents)

# Apply SVD for LSA
svd = TruncatedSVD(n_components=100)
lsa_matrix = svd.fit_transform(doc_term_matrix)

# Function to process query and return top 5 documents
def search_lsa(query):
    query_vector = vectorizer.transform([query])
    query_lsa = svd.transform(query_vector)
    similarities = cosine_similarity(query_lsa, lsa_matrix)
    top_indices = np.argsort(similarities[0])[::-1][:5]
    top_docs = [(documents[i], similarities[0][i]) for i in top_indices]
    return top_docs

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.form['query']
    results = search_lsa(query)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)

