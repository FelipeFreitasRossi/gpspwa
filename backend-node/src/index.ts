import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_URL = process.env.PYTHON_SERVICE_URL!;
const OSRM_URL = process.env.OSRM_API_URL!;

app.use(cors());
app.use(express.json());

// Geocoding via Python
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  try {
    const response = await axios.get(`${PYTHON_URL}/api/geocode`, { params: { q: query } });
    res.json(response.data);
  } catch (error: any) {
    console.error('Geocode error:', error.message);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

// Rota principal
app.post('/api/route', async (req, res) => {
  const { origin, destination } = req.body;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination required' });
  }

  const coordStr = `${origin.lon},${origin.lat};${destination.lon},${destination.lat}`;

  try {
    // 1. OSRM
    const osrmResponse = await axios.get(
      `${OSRM_URL}/route/v1/driving/${coordStr}?overview=full&geometries=geojson&steps=true`
    );

    if (osrmResponse.data.code !== 'Ok') {
      return res.status(400).json({ error: 'OSRM failed to find route' });
    }

    const route = osrmResponse.data.routes[0];
    const geometry = route.geometry.coordinates;
    const distanceKm = (route.distance / 1000).toFixed(2);
    const durationMin = Math.round(route.duration / 60);

    // 2. Python intelligence
    const pythonPayload = { coordinates: geometry };
    const pythonResponse = await axios.post(`${PYTHON_URL}/api/route-intelligence`, pythonPayload);

    // 3. Resposta final
    res.json({
      status: 'success',
      route: {
        geometry: geometry,
        distance_km: distanceKm,
        duration_min: durationMin,
        steps: route.legs[0].steps.map((step: any) => ({
          distance: step.distance,
          duration: step.duration,
          instruction: step.maneuver.instruction || 'Siga em frente',
          name: step.name || '',
        })),
      },
      intelligence: pythonResponse.data,
    });

  } catch (error: any) {
    console.error('Route error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'node-gateway' });
});

app.listen(PORT, () => {
  console.log(`🚀 Node gateway running on http://localhost:${PORT}`);
});