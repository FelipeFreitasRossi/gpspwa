import os
import math
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

geolocator = Nominatim(user_agent="gps_pwa")

def haversine(coord1, coord2):
    return geodesic((coord1[1], coord1[0]), (coord2[1], coord2[0])).meters

@app.route('/api/geocode', methods=['GET'])
def geocode():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Missing query'}), 400
    try:
        location = geolocator.geocode(query)
        if not location:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({
            'lat': location.latitude,
            'lon': location.longitude,
            'display_name': location.address
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/route-intelligence', methods=['POST'])
def route_intelligence():
    data = request.get_json()
    coords = data.get('coordinates', [])
    if len(coords) < 2:
        return jsonify({'error': 'Need at least 2 points'}), 400

    total_distance = 0.0
    segments = []
    for i in range(len(coords) - 1):
        p1 = coords[i]
        p2 = coords[i+1]
        dist = haversine(p1, p2)
        total_distance += dist
        segments.append({
            'from': p1,
            'to': p2,
            'distance_meters': round(dist, 2)
        })

    elevation_gain = total_distance * 0.02
    speed_kmh = 5
    estimated_time_min = round((total_distance / 1000) / speed_kmh * 60, 2)

    return jsonify({
        'total_distance_km': round(total_distance / 1000, 2),
        'total_distance_meters': round(total_distance, 2),
        'segments': segments,
        'elevation_gain_meters': round(elevation_gain, 2),
        'estimated_time_min': estimated_time_min,
        'message': '✅ Dados enriquecidos pelo motor Python com sucesso!',
        'speed_assumed_kmh': speed_kmh
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'python-intelligence'})

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)