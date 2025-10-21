// src/seedData.js
import mongoose from "mongoose";
import "dotenv/config.js";
import Truck from "./models/Truck.js";
import Driver from "./models/Driver.js";

const trucks = [
  { economicNumber: "213", vin: "3HSDZAPR5LN859301", model: "International", year: 2020, plateMx: "98ER4D", plateUsa: "ZP48564" },
  { economicNumber: "444", vin: "4V4NC9EH2EN161173", model: "Volvo", year: 2014, plateMx: "35ER6C", plateUsa: "ZP46117" },
  { economicNumber: "460", vin: "1FUJHPDV4KLKH6411", model: "International", year: 2019, plateMx: "31ER5C", plateUsa: "ZP41148" },
  { economicNumber: "461", vin: "1XKYDP9X9GJ476353", model: "Kenworth", year: 2016, plateMx: "40ER1D", plateUsa: "ZP09751" },
  { economicNumber: "462", vin: "1XKYD49X4HJ171830", model: "Kenworth", year: 2017, plateMx: "30ER9A", plateUsa: "ZP48569" },
  { economicNumber: "463", vin: "4V4NC9EH2GN180843", model: "Volvo", year: 2016, plateMx: "29ER9A", plateUsa: "9H28340" },
  { economicNumber: "812", vin: "1XPBD4XXHD415124", model: "Peterbilt", year: 2017, plateMx: "36ER8C", plateUsa: "ZP48567" },
  { economicNumber: "713", vin: "3HSDZAPR3KN409841", model: "International", year: 2019, plateMx: "60ES6R", plateUsa: "ZP48586" },
  { economicNumber: "134", vin: "3HSDZAPR6LN859307", model: "International", year: 2020, plateMx: "96ES4R", plateUsa: "ZP48570" },
  { economicNumber: "888", vin: "3HSDZAPR5LN175820", model: "International", year: 2020, plateUsa: "ZP48583" },
  { economicNumber: "469", vin: "3AKJGLDROHSHV1023", model: "Freighliner", year: 2017, plateMx: "74ER9B", plateUsa: "9H08244" },
  { economicNumber: "470", vin: "3AKJGLDROHSHV1040", model: "Freighliner", year: 2017, plateMx: "72EP5H", plateUsa: "YP23839" },
  { economicNumber: "480", vin: "1FUJGHDV5CSBA4908", model: "Freighliner", year: 2014, plateMx: "50ER2C", plateUsa: "9619378" },
  { economicNumber: "490", vin: "4V4NC9EJ58N262974", model: "Freighliner", year: 2005, plateMx: "15EN1E", plateUsa: "9E63045" },
  { economicNumber: "777", vin: "3HSDZTZR7KN560710", model: "International", year: 2019, plateMx: "43ER6D", plateUsa: "ZP48567" },
];

const drivers = [
  { name: "AGUIRRE CUEVAS ISRAEL", licenseNumber: "BC202406276392", type: "CRUCE", badge: "DF00161923" },
  { name: "AVILA CELIS FRANK NOE", licenseNumber: "DF00161923", type: "CRUCE" },
  { name: "CAMACHO VERON JOEL", licenseNumber: "LFD01098031", type: "CRUCE" },
  { name: "CAMPOS CABRERA YOVANY A.", licenseNumber: "LFD00092533", type: "CRUCE" },
  { name: "CASTRO DUARTE GABRIEL A", licenseNumber: "DF001146378", type: "CRUCE" },
  { name: "CASTRO MORALES DAVID", licenseNumber: "BCN0220324", type: "CRUCE" },
  { name: "CHAVIRA VEGA ELDY", licenseNumber: "BCN0217026", type: "CRUCE" },
  { name: "CISNEROS RUBIO JOSE F", licenseNumber: "BC202306258491", type: "CRUCE" },
  { name: "COVARRUBIAS PEREIRA ROGELIO", licenseNumber: "BC202528003192", type: "LOCAL" },
  { name: "CRUZ CRUZ JUAN", licenseNumber: "BCN0212731", type: "CRUCE" },
  { name: "GERARDO RIOS WILFREDO", licenseNumber: "BCN0218723", type: "CRUCE" },
  { name: "GONZALEZ HERNANDEZ MARCO", licenseNumber: "DF001135515", type: "CRUCE" },
  { name: "GONZALES HERNANDEZ MARTIN", licenseNumber: "LFD00074192", type: "CRUCE" },
  { name: "GONZALEZ MIGUEL REY DAVID", licenseNumber: "LFD01193967", type: "LOCAL" },
  { name: "LOPEZ BECERRA JOSUE", licenseNumber: "BCN0216911", type: "CRUCE" },
  { name: "LUNA LEDESMA FRANCISCO", licenseNumber: "BC202107033498", type: "CRUCE" },
  { name: "MALDONADO ALFONSIN ISRAEL", licenseNumber: "BCN0218394", type: "CRUCE" },
  { name: "NAVA CASTRO BRYAN ALBERTO", licenseNumber: "LFD00090760", type: "CRUCE" },
  { name: "PEÑA OSUNA MAYOLO E", licenseNumber: "BCN0220548", type: "CRUCE" },
  { name: "TRONCOSO PESTAÑA JOSE A", licenseNumber: "EFD01186043", type: "LOCAL" },
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    await Truck.deleteMany();
    await Driver.deleteMany();

    await Truck.insertMany(trucks);
    await Driver.insertMany(drivers);

    console.log("🚛 Camiones insertados:", trucks.length);
    console.log("👨‍🔧 Choferes insertados:", drivers.length);
    console.log("✅ Proceso completado correctamente");
  } catch (err) {
    console.error("❌ Error en seed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedData();
