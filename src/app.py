# src/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

PROPERTIES_FILE = os.path.join(os.path.dirname(__file__), "properties.json")

def filter_properties(filters, data):
    """Filter the property list based on form data"""
    result = []
    for p in data:
        # School address match
        if filters.get("schoolAddress") and filters["schoolAddress"].lower() not in p.get("address", "").lower():
            continue
        
        # Price range
        price = p.get("price", 0)
        min_price, max_price = filters.get("priceRange", [0, 1000])
        if not (min_price <= price <= max_price):
            continue

        # Max distance
        max_dist = filters.get("maxCommuteMinutes", 30)
        if p.get("distance", 0) > max_dist:
            continue

        # Boolean options
        for key in ["hasCar", "petsAllowed", "publicTransport"]:
            if filters.get(key) and not p.get(key, False):
                break
        else:
            # All booleans passed
            result.append(p)

    return result

@app.route("/properties", methods=["GET", "POST"])
def get_properties():
    try:
        with open(PROPERTIES_FILE, "r") as f:
            data = json.load(f)

        if request.method == "POST":
            filters = request.json
            data = filter_properties(filters, data)

        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "properties.json not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON"}), 500

if __name__ == "__main__":
    app.run(debug=True)
