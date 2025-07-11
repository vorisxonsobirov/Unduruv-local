import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './map.css';

function MapViewer() {
  const [location, setLocation] = useState(null);
  const [logTable, setLogTable] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [error, setError] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const navigate = useNavigate();
  const mapRef = useRef(null); // ✅ FIXED ESLINT ERROR

  const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  const manualIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchRoute = async (points) => {
    const filteredPoints = points.filter((point, index, arr) =>
      index === 0 || !(point.latitude === arr[index - 1].latitude && point.longitude === arr[index - 1].longitude)
    );
    if (filteredPoints.length < 2) {
      setRouteCoordinates([]);
      setTotalDistance(0);
      return;
    }
    try {
      const coordinates = filteredPoints.map(p => `${p.longitude},${p.latitude}`).join(';');
      const url = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
      const response = await axios.get(url);
      const data = response.data;
      if (data.code === 'Ok') {
        const route = data.routes[0].geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
          timestamp: Date.now(),
          isManual: false,
        }));
        setRouteCoordinates(route);
        const distances = [];
        for (let i = 1; i < route.length; i++) {
          distances.push(calculateDistance(route[i - 1].latitude, route[i - 1].longitude, route[i].latitude, route[i].longitude));
        }
        setTotalDistance(distances.reduce((sum, dist) => sum + dist, 0));
      } else {
        console.error('Ошибка OSRM:', data.code);
        setRouteCoordinates(filteredPoints);
        setTotalDistance(0);
      }
    } catch (e) {
      console.error('Ошибка запроса маршрута:', e);
      setRouteCoordinates(filteredPoints);
      setTotalDistance(0);
    }
  };

  useEffect(() => {
    const savedLogTable = localStorage.getItem('logTable');
    if (savedLogTable) setLogTable(JSON.parse(savedLogTable));

    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 30000,
      };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log('Успешно определено местоположение:', { latitude, longitude });
          setLocation({ latitude, longitude });
          const entry = { latitude, longitude, timestamp: Date.now(), isManual: false };
          setLogTable([entry]);
          fetchRoute([entry]);
          setError(null);
        },
        (err) => {
          console.error('Ошибка геолокации:', err);
          setError(`Ошибка геолокации: ${err.message}. Убедитесь, что разрешение дано и GPS включён.`);
        },
        options
      );

      const watcher = navigator.geolocation.watchPosition(
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          const distance = location ? calculateDistance(location.latitude, location.longitude, latitude, longitude) : 0;
          if (distance >= 10) {
            const entry = { latitude, longitude, timestamp: Date.now(), isManual: false };
            setLogTable(prev => {
              const newTable = [...prev, entry].slice(-100);
              fetchRoute(newTable);
              return newTable;
            });
            setLocation({ latitude, longitude });
          }
        },
        (err) => {
          console.error('Ошибка отслеживания:', err);
          setError(`Ошибка отслеживания: ${err.message}`);
        },
        options
      );

      return () => navigator.geolocation.clearWatch(watcher);
    } else {
      setError('Геолокация не поддерживается вашим браузером');
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem('logTable', JSON.stringify(logTable));
  }, [logTable]);

  const addManualMarker = (e) => {
    e.preventDefault();
    if (location) {
      const entry = { ...location, timestamp: Date.now(), isManual: true };
      setLogTable(prev => {
        const newTable = [...prev, entry].slice(-100);
        fetchRoute(newTable);
        return newTable;
      });
    }
  };
  const focusOnLocation = () => {
    if (mapRef.current && location) {
      mapRef.current.setView([location.latitude, location.longitude], 16); // плавный переход
    }
  };

  const clearLogTable = (e) => {
    e.preventDefault();
    setLogTable([]);
    setRouteCoordinates([]);
    setTotalDistance(0);
  };

  const viewCoordinates = (e) => {
    e.preventDefault();
    navigate('/coordinates', { state: { logTable, totalDistance } });
  };

  return (

    <div className="map-container">
      {error && <p style={{ color: 'red', position: 'absolute', top: 10, zIndex: 1000 }}>{error}</p>}
      {location ? (
        <MapContainer
          center={
            location
              ? [location.latitude, location.longitude]
              : [41.3111, 69.2797]
          }
          zoom={13}
          style={{ height: '80vh', width: '100%' }}
          whenCreated={(map) => (mapRef.current = map)}        >
          <TileLayer attribution='© OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.latitude, location.longitude]} icon={defaultIcon}>
            <Popup>you here</Popup>
          </Marker>
          {logTable.map((p, i) => (
            <Marker key={i} position={[p.latitude, p.longitude]} icon={p.isManual ? manualIcon : defaultIcon}>
              <Popup>{p.isManual ? `Моя метка ${i + 1}` : `Точка ${i + 1}`}<br />{new Date(p.timestamp).toLocaleTimeString()}</Popup>
            </Marker>
          ))}
          {routeCoordinates.length > 1 && (
            <Polyline positions={routeCoordinates.map(p => [p.latitude, p.longitude])} color="red" />
          )}
        </MapContainer>
      ) : (
        <p>Please allow access to your location</p>
      )}
      <div className="button-container">
        <button className="button" onClick={addManualMarker}>Put a mark</button>
        <button className="button button-history" onClick={viewCoordinates}>Show coordinates</button>
        <button className="button button-focus" onClick={focusOnLocation}>My location</button>
        <button className="button button-clear" onClick={clearLogTable}>Cleare coordinates</button>
      </div>
    </div>
  );
}

export default MapViewer;
