import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

# Database configuration (Replace with real credentials)
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'agro_market'
}

def get_recommendations(user_id):
    """
    Placeholder logic for Collaborative Filtering.
    Will be updated once we have access to the real MySQL schema.
    """
    # Logic will involve:
    # 1. Fetching Orders/Items from MySQL
    # 2. Creating a pivot table (User-Product interaction)
    # 3. Calculating similarity
    # 4. Returning top 5 products
    
    # Return mock for now
    return [
        {"id": 6, "name": "Sweet Bell Peppers", "price": 75},
        {"id": 7, "name": "Organic Spinach", "price": 30}
    ]

@app.route('/recommendations/<int:user_id>', methods=['GET'])
def recommend(user_id):
    try:
        recommendations = get_recommendations(user_id)
        return jsonify({
            "user_id": user_id,
            "recommendations": recommendations,
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
