# src/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from math import radians, sin, cos, sqrt, atan2

app = Flask(__name__)
CORS(app)

PROPERTIES_FILE = os.path.join(os.path.dirname(__file__), "properties.json")

# UB (University at Buffalo) coordinates - hardcoded for performance
UB_NORTH_LAT = 43.0015
UB_NORTH_LON = -78.7876

def haversine_miles(lat1, lon1, lat2, lon2):
    """Return great-circle distance in miles between two lat/lon points."""
    R = 6371000.0  # meters
    phi1 = radians(lat1)
    phi2 = radians(lat2)
    dphi = radians(lat2 - lat1)
    dlambda = radians(lon2 - lon1)
    
    a = sin(dphi / 2) ** 2 + cos(phi1) * cos(phi2) * sin(dlambda / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    meters = R * c
    miles = meters * 0.000621371
    return miles

def precompute_distances(data):
    """
    Precompute distances from UB for all properties.
    Adds 'distance' field to each property.
    """
    for prop in data:
        # Check if property already has lat/lon
        lat = prop.get("latitude") or prop.get("lat")
        lon = prop.get("longitude") or prop.get("lon") or prop.get("lng")
        
        if lat is not None and lon is not None:
            try:
                distance = haversine_miles(float(lat), float(lon), UB_NORTH_LAT, UB_NORTH_LON)
                prop["distance"] = round(distance, 2)
            except Exception as e:
                app.logger.warning(f"Distance calc error for {prop.get('address')}: {e}")
                prop["distance"] = 0
        else:
            # If no coordinates, set distance to 0 (or you could geocode here)
            prop["distance"] = 0
    
    return data

def filter_properties(filters, data):
    """
    Filter properties by:
    - priceRange [min, max]
    - maxDistance (miles from UB)
    - bedrooms (exact match or minimum)
    - petsAllowed boolean
    """
    app.logger.info(f"Received filters: {filters}")
    
    results = []
    
    # Extract filter values with safe defaults
    price_range = filters.get("priceRange", [0, 10000])
    min_price = price_range[0] if isinstance(price_range, list) and len(price_range) > 0 else 0
    max_price = price_range[1] if isinstance(price_range, list) and len(price_range) > 1 else 10000
    
    max_distance = filters.get("maxDistance")  # in miles
    bedrooms_filter = filters.get("bedrooms")  # exact match or None
    pets_required = filters.get("petsAllowed", False)
    
    app.logger.info(f"Filtering: price {min_price}-{max_price}, maxDist: {max_distance}, bedrooms: {bedrooms_filter}, pets: {pets_required}")
    
    for prop in data:
        # Price filter
        try:
            price = float(prop.get("price", 0))
        except (ValueError, TypeError):
            price = 0
        
        if not (min_price <= price <= max_price):
            continue
        
        # Distance filter
        if max_distance is not None:
            try:
                distance = float(prop.get("distance", 0))
                if distance > float(max_distance):
                    continue
            except (ValueError, TypeError):
                continue
        
        # Bedrooms filter (exact match)
        if bedrooms_filter is not None:
            try:
                prop_bedrooms = int(prop.get("bedrooms", 0))
                if prop_bedrooms != int(bedrooms_filter):
                    continue
            except (ValueError, TypeError):
                continue
        
        # Pets filter
        if pets_required:
            if not prop.get("pet", False):  # Note: your data uses "pet" not "petsAllowed"
                continue
        
        results.append(prop)
    
    app.logger.info(f"Returning {len(results)} results")
    return results

@app.route("/properties", methods=["GET", "POST"])
def properties_endpoint():
    try:
        with open(PROPERTIES_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        return jsonify({"error": "properties.json not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON"}), 500
    
    # Precompute distances from UB if not already present
    data = precompute_distances(data)
    
    if request.method == "POST":
        filters = request.get_json() or {}
        filtered = filter_properties(filters, data)
        return jsonify(filtered)
    
    # GET -> return all properties with computed distances
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)