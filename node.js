const https = require('https');
const prompt = require("prompt-sync")();
console.log("Trova Bus Trentino Trasporti\n(C) 2025 Wower3201\nMostra solo le matricole utilizzate in giornata.\nEscluso il servizio intracomunale di Lavis.\nIl servizio urbano Alto Garda e quello di Pergine va usato il numero extraurbano per trovare matricole.")
const type = prompt("Inserire tipologia di linea. E per Extraurbano, U per Urbano: ").trim();
const id = prompt("Inserisci la linea (es. B101; 17)(!PER LE LINEE URBANE DI ROVERETO METTI UNA R PRIMA DEL NUMERO O LETTERA ES. 1 = R1, A = RA): ").trim();
const linee = new Map([
    ["B101", 1],
    ["B102", 3],
    ["B103", 120],
    ["B104", 55],
    ["B105", 60],
    ["B106", 343],
    ["B107", 340],
    ["B109", 65],
    ["B111", 67],
    ["B112", 117],
    ["B113", 136],
    ["B114", 7],
    ["B115", 300],
    ["B116", 151],
    ["B120", 604],
    ["B121", 63],
    ["B122", 130],
    ["B123", 316],
    ["B140", 638],
    ["B201", 71],
    ["B202", 76],
    ["B203", 78],
    ["B204", 175],
    ["B205", 134],
    ["B206", 80],
    ["B208", 161],
    ["B209", 159],
    ["B210", 155],
    ["B211", 153],
    ["B212", 167],
    ["B213", 164],
    ["B214", 171],
    ["B215", 157],
    ["B216", 73],
    ["B218", 322],
    ["B221", 665],
    ["B230", 229],
    ["B231", 636],
    ["B261", 687],
    ["B301", 110],
    ["B302", 181],
    ["B303", 186],
    ["B305", 231],
    ["B306", 196],
    ["B307", 200],
    ["B310", 220],
    ["B311", 194],
    ["B312", 215],
    ["B314", 203],
    ["B315", 198],
    ["B318", 235],
    ["B319", 233],
    ["B329", 526],
    ["B332", 634],
    ["B334", 507],
    ["B335", 503],
    ["B336", 580],
    ["B401", 520],
    ["B402", 69],
    ["B403", 494],
    ["B404", 138],
    ["B405", 522],
    ["B406", 169],
    ["B407", 184],
    ["B408", 86],
    ["B409", 132],
    ["B410", 98],
    ["B413", 94],
    ["B415", 90],
    ["B417", 179],
    ["B418", 177],
    ["B423", 188],
    ["B425", 309],
    ["B428", 96],
    ["B429", 84],
    ["B450", 717],
    ["B461", 549],
    ["B462", 551],
    ["B463", 556],
    ["B464", 554],
    ["B465", 562],
    ["B466", 552],
    ["B468", 640],
    ["B501", 102],
    ["B503", 618],
    ["B504", 106],
    ["B506", 116],
    ["B507", 227],
    ["B511", 311],
    ["B512", 108],
    ["B514", 123],
    ["B601", 713],
    ["B611", 345],
    ["B615", 395],
    ["B620", 366],
    ["B621", 703],
    ["B623", 397],
    ["B624", 354],
    ["B625", 401],
    ["B627", 368],
    ["B630", 375],
    ["B631", 371],
    ["B632", 364],
    ["B633", 378],
    ["B634", 357],
    ["B640", 324],
    ["B641", 330],
    ["B642", 326],
    ["B643", 334],
    ["B644", 328],
    ["B645", 336],
    ["B646", 332],
    ["B863", 417],
    ["B861", 420],
    ["B862", 423],
    ["B869", 672],
    ["R25", 691],
    ["R26", 693],
    ["R35", 352],
    ["1", 536],
    ["2", 538],
    ["3", 396],
    ["4", 539],
    ["5", 400],
    ["5/", 535],
    ["6", 541],
    ["7", 402],
    ["8", 404],
    ["9", 406],
    ["10", 408],
    ["11", 568],
    ["12", 411],
    ["13", 466],
    ["14", 415],
    ["15", 478],
    ["16", 484],
    ["17", 629],
    ["19", 623],
    ["A", 614],
    ["C", 533],
    ["N", 621],
    ["P", 617],
    ["G", 568],
    ["M", 615],
    ["R1", 578],
    ["R2", 582],
    ["R3", 590],
    ["R4", 592],
    ["R5", 594],
    ["R6", 580],
    ["R7", 512],
    ["RA", 562],
    ["RB", 563],
    ["RP", 601],
    ["RS", 602],
    ["RAB", 566],
    ["RV", 598]
]);

const routeId = linee.get(id);
if (!routeId) {
    console.error("Linea non trovata o non ancora supportata.");
    process.exit(1);
}

const fasceMatricole = [
    { range: [104, 106], name: "MAN 11.200/3 De Simon SM 35.1" },
    { range: [107, 116], name: "BredaMenariniBus M231 CU" },
    { range: [117, 119], name: "BredaMenariniBus VivaCity CU" },
    { range: [120, 126], name: "BredaMenariniBus Vivacity+ CU" },
    { range: [200, 202], name: "Mercedes-Benz eCitaro 18" },
    { range: [221, 226], name: "Mercedes-Benz eCitaro 12" },
    { range: [303, 305], name: "MAN NG313" },
    { range: [306, 307], name: "VanHool AG300 New" },
    { range: [308, 311], name: "MAN Lion's City A23 G" },
    { range: [321, 339], name: "Otokar Kent C 10m" },
    { range: [369, 370], name: "Irisbus 491.10.24 Cityclass CNG" },
    { range: [372, 384], name: "Scania Omnicity NEW" },
    { range: [385, 393], name: "Otokar Kent C 10m" },
    { range: [405, 414], name: "Irisbus 491.10.25 Cityclass Cursor CNG" },
    { range: [415, 430], name: "Scania CityWide 10.9 LF CNG" },
    { range: [705, 722], name: "Irisbus 491.12.27 Cityclass Cursor CNG" },
    { range: [725, 727], name: "Man Lion's City A37 Hybrid" },
    { range: [728, 730], name: "Van Hool A330 New Hybrid" },
    { range: [731, 744], name: "MAN Lion's City A36 CNG" },
    { range: [745, 752], name: "Scania CityWide 12 LF CNG" },
    { range: [753, 755], name: "MAN Lion's City Efficient Hybrid" },
    { range: [756, 780], name: "Solaris Urbino 12 CNG IV Serie" },
    { range: [801, 814], name: "Otokar Kent C 12m" },
    { range: [870, 899], name: "Scania OmniCity 12m" },
    { range: [951, 954], name: "Otokar Vectio C" },
    { range: [1001, 1002], name: "Iveco DolomiTech Idrogeno" },
    { range: [1050, 1072], name: "Irisbus Daily" },
    { range: [1073, 1079], name: "Iveco Daily Line" },
    { range: [1101, 1105], name: "Magister New Car" },
    { range: [1106, 1116], name: "Iveco Daily MMI Thesi" },
    { range: [1137, 1140], name: "Man 11.220 DE SIMON IDM 230.2" },
    { range: [1325, 1329], name: "Mercedes-Benz O510 Tourino" },
    { range: [1330, 1343], name: "Otokar Vectio 250U" },
    { range: [1400, 1411], name: "SETRA S412UL" },
    { range: [1413, 1417], name: "Iveco Crossway 10m" },
    { range: [1428, 1464], name: "Irisbus Arway 10m" },
    { range: [1472, 1478], name: "Iveco Crossway 10 2017" },
    { range: [1479, 1529], name: "Iveco Crossway 10 2018" },
    { range: [1530, 1531], name: "Iveco Crossway 10 2023" },
    { range: [1553, 1567], name: "Iveco Euroclass 389E10.35" },
    { range: [1568, 1573], name: "De Simon IN3 300L Scania" },
    { range: [1574, 1578], name: "Iveco Euroclass 389.10.35" },
    { range: [1579, 1589], name: "SETRA S412UL" },
    { range: [1601, 1625], name: "Iveco Evadys" },
    { range: [1626, 1635], name: "Iveco Crossway 12" },
    { range: [1642, 1663], name: "Irisbus Euroclass 389E.12.35" },
    { range: [1664, 1673], name: "Mercedes-Benz Integro" },
    { range: [1674, 1674], name: "Irisbus Arway" },
    { range: [1675, 1677], name: "Irisbus Evadys" },
    { range: [1678, 1717], name: "Mercedes-Benz Integro NEW" },
    { range: [1718, 1726], name: "Iveco Crossway 12 2017" },
    { range: [1727, 1810], name: "Iveco Crossway 12" },
    { range: [1811, 1815], name: "Iveco Crossway 12 2023" },
    { range: [1816, 1820], name: "Iveco Crossway 12 CNG"},
    { range: [1859, 1871], name: "Irisbus MyWay 399E.12.35" },
    { range: [1872, 1876], name: "Mercedes-Benz Integro O550" },
    { range: [1877, 1901], name: "Mercedes-Benz O550 NEW" },
    { range: [1956, 1969], name: "SETRA SG321UL" },
    { range: [1970, 1972], name: "Mercedes-Benz O530 G Citaro" },
    { range: [1973, 1975], name: "MAN Lion's City A23 G" },
    { range: [1981, 1989], name: "Irisbus Arway 13" },
    { range: [1991, 1992], name: "Neoplan N 44626/3 Centroliner" },
    { range: [1993, 1993], name: "Neoplan Skyliner PB1" },
    { range: [1994, 1994], name: "Volvo B12B 380 Sideral" }
];

function getBusName(matricola) {
    const entry = fasceMatricole.find(fascia => matricola >= fascia.range[0] && matricola <= fascia.range[1]);
    return entry ? entry.name : "Sconosciuto";
}

const url = `https://app-tpl.tndigit.it/gtlservice/trips_new?type=${type}&limit=9999&routeId=${routeId}`;

const username = "mittmobile";
const password = "ecGsp.RHB3";
const authHeader = Buffer.from(`${username}:${password}`).toString('base64');

const options = {
    headers: {
        "Authorization": `Basic ${authHeader}`,
        "X-Requested-With": "it.tndigit.mit"
    }
};

https.get(url, options, (res) => {
    let data = '';

    // Ricezione dati
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Fine della risposta
    res.on('end', () => {
        try {
            const json = JSON.parse(data);

            // Verifica se la risposta è un array
            if (Array.isArray(json)) {
                const matricole = [...new Set(json
                    .map(trip => trip.matricolaBus)
                    .filter(matricola => matricola !== null))]; // Rimuove duplicati

                if (matricole.length > 0) {
                    console.log(`Autobus usati nel corso della giornata sulla linea ${id}:`);
                    matricole.forEach(matricola => {
                        const nomeBus = getBusName(Number(matricola));
                        console.log(`Matricola: ${matricola}, Bus: ${nomeBus}`);
                    });
                } else {
                    console.log("La linea non ha effettuato corse, sono state effettuate da privati oppure il MITT non ha registrato la corsa.");
                }
            } else {
                console.error("La risposta non è un array. Struttura ricevuta:", json);
            }
        } catch (error) {
            console.error("Errore nel parsing della risposta JSON:", error.message);
        }
    });

}).on('error', (err) => {
    console.error("Errore durante la richiesta:", err.message);
})
;