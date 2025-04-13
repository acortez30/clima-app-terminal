import { inquirerMenu, inquirerPause, leerInput, listarLugares } from "./helpers/inquirer.js"
import { Busquedas } from "./models/busquedas.js";
import dotenv from 'dotenv';
dotenv.config();
const main  = async() => {
    const busqueda = new Busquedas();
    let opt =null;



   
    do {
        console.clear();
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                const lugar = await leerInput('Ciudad: ');
                const lugares = await busqueda.ciudad(lugar.desc);
                const idSeleccionado = await listarLugares(lugares);
                if(idSeleccionado === '0'){
                    continue
                }
                const lugarSeleccionado = lugares.find(l => l.id === idSeleccionado );
                busqueda.agregarHistoria(lugarSeleccionado.nombre);

                const clima = await busqueda.climaPorLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                console.clear();
                console.log('\nInformacion de la ciudad');
                console.log('Ciudad:', lugarSeleccionado.nombre);
                console.log('Latitud:', lugarSeleccionado.lat);
                console.log('Longitud', lugarSeleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Maxima:', clima.temp_max);
                console.log('Minima:', clima.temp_min);
                console.log('Temperatura se siente como:',clima.feels_like);
                console.log('Como esta el clima:',clima.desc);
            break;
            case 2:
                busqueda.historialCapitalizado.forEach((lugar, i) => {
                    const idx = i + 1;
                    console.log(`${idx}. ${lugar}`);
                });
            break;
            default:
            break;
        }

        if (opt !== '0') await inquirerPause();
    }
    while (opt !== 0);
}

main();