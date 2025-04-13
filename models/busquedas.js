import axios from 'axios';

import fs from 'fs';

export class Busquedas{
    historial=['Madrid', 'Monterrey', 'Juarez'];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {
            return lugar.split(' ')
                        .map(p => p[0].toUpperCase() + p.substring(1))
                        .join(' ');
        });
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'  // 🔧 corregido "languag" -> "language"
        };
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang':'es'
        };
    }


    async ciudad(lugar = '') {
        console.log('Búsqueda de', lugar);
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(lugar)}.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (err) {
            console.log('Error al buscar ciudad:', err);
            return [];
        }
    }

    async climaPorLugar(lat,lng){
        try{
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon: lng }       
            });
            const resp = await instance.get();
            const { weather, main } = resp.data;
            return {
                desc: weather[0].description,
                temp: main.temp,
                temp_min: main.temp_min,
                temp_max: main.temp_max,
                feels_like: main.feels_like
            };
        }
        catch(err){
            console.log('Error al buscar clima:', err);
            return [];
        }
    }

    agregarHistoria(lugar = '') {
        lugar = lugar.toLowerCase();
        if (this.historial.includes(lugar)) return;

        this.historial.unshift(lugar);
        this.historial = this.historial.slice(0, 5); // Limita a 5 elementos
        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        this.historial = data.historial || [];
    }
}