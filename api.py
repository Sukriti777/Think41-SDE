from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # Enable CORS

DB_FILE = 'products.db'

# Helper to fetch from DB
def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    conn.close()
    return (dict(rv[0]) if rv else None) if one else [dict(row) for row in rv]

# GET /api/products - all products
@app.route('/api/products', methods=['GET'])
def get_products():
    products = query_db("SELECT * FROM products LIMIT 50")
    return jsonify(products), 200

# GET /api/products/<id> - product by ID
@app.route('/api/products/<id>', methods=['GET'])
def get_product_by_id(id):
    product = query_db("SELECT * FROM products WHERE id = ?", [id], one=True)
    if product:
        return jsonify(product), 200
    return jsonify({"error": "Product not found"}), 404

# Start the server
if __name__ == '__main__':
    app.run(debug=True)
