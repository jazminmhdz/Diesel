// src/seedData.js
import mongoose from "mongoose";
import "dotenv/config.js";
import Truck from "./models/Truck.js";
import Driver from "./models/Driver.js";

const MONGO_URI = process.env.MONGO_URI;

const trucks = [
  {
    economicNumber: "213",
    vin: "3HSDZAPR5LN859301",
    brand: "International",
    year: 2020,
    platesMx: "98ER4D",
    platesUsa: "ZP48564",
  },
  {
    economicNumber: "444",
    vin: "4V4NC9EH2EN161173",
    brand: "Volvo",
    year: 2014,
    platesMx: "35ER6C",
    platesUsa: "ZP46117",
  },
  {
    economicNumber: "460",
    vin: "1FUJHPDV4KLKH6411",
    brand: "International",
    year: 2019,
    platesMx: "31ER5C",
    platesUsa: "ZP41148",
  },
  {
    economicNumber: "461",
    vin: "1XKYDP9X9GJ476353",
    brand: "Kenworth",
    year: 2016,
    platesMx: "40ER1D",
    platesUsa: "ZP09751",
  },
  {
    economicNumber: "462",
    vin: "1XKYD49X4HJ171830",
    brand: "Kenworth",
    year: 2017,
    platesMx: "30ER9A",
    platesUsa: "ZP48569",
  },
  {
    economicNumber: "463",
    vin: "4V4NC9EH2GN180843",
    brand: "Volvo",
    year: 2016,
    platesMx: "29ER9A",
    platesUsa: "9H28340",
  },
  {
    economicNumber: "812",
    vin: "1XPBD4XXHD415124",
    brand: "Peterbilt",
    year: 2017,
    platesMx: "36ER8C",
    platesUsa: "ZP48567",
  },
  {
    economicNumber: "713",
    vin: "3HSDZAPR3KN409841",
    brand: "International",
    year: 2019,
    platesMx: "60ES6R",
    platesUsa: "ZP48586",
  },
  {
    economicNumber: "134",
    vin: "3HSDZAPR6LN859307",
    brand: "International",
    year: 2020,
    platesMx: "96ES4R",
    platesUsa: "ZP48570",
  },
  {
    economicNumber: "888",
    vin: "3HSDZAPR5LN175820",
    brand: "International",
    year: 2020,
    platesMx: "ZP48583",
  },
  {
    economicNumber: "469",
    vin: "3AKJGLDROHSHV1023",
    brand: "Freightliner",
    year: 2017,
    platesMx: "74ER9B",
    platesUsa: "9H08244",
  },
  {
    economicNumber: "470",
    vin: "3AKJGLDROHSHV1040",
    brand: "Freightliner",
    year: 2017,
    platesMx: "72EP5H",
    platesUsa: "YP23839",
  },
  {
    economicNumber: "480",
    vin: "1FUJGHDV5CSBA4908",
    brand: "Freightliner",
    year: 2014,
    platesMx: "50ER2C",
    platesUsa: "9619378",
  },
  {
    economicNumber: "490",
    vin: "4V4NC9EJ58N262974",
    brand: "Freightliner",
    year: 2005,
    platesMx: "15EN1E",
    platesUsa: "9E63045",
  },
  {
    economicNumber: "777",
    vin: "3HSDZTZR7KN560710",
    brand: "International",
    year: 2019,
    platesMx: "43ER6D",
    platesUsa: "ZP48567",
  },
];

const drivers = [
  { fullName: "AGUIRRE CUEVAS ISRAEL", licenseNumber: "BC202406276392", type: "CRUCE", badge: "DF00161923" },
  { fullName: "AVILA CELIS FRANK NOE", licenseNumber: "DF00161923", type: "CRUCE" },
  { fullName: "CAMACHO VERON JOEL", licenseNumber: "LFD01098031", type: "CRUCE" },
  { fullName: "CAMPOS CABRERA YOVANY A.", licenseNumber: "LFD00092533", type: "CRUCE" },
  { fullName: "CASTRO DUARTE GABRIEL A", licenseNumber: "DF001146378", type: "CRUCE" },
  { fullName: "CASTRO MORALES DAVID", licenseNumber: "BCN0220324", type: "CRUCE" },
  { fullName: "CHAVIRA VEGA ELDY", licenseNumber: "BCN0217026", type: "CRUCE" },
  { fullName: "CISNEROS RUBIO JOSE F", licenseNumber: "BC202306258491", type: "CRUCE" },
  { fullName: "COVARRUBIAS PEREIRA ROGELIO", licenseNumber: "BC202528003192", type: "LOCAL" },
  { fullName: "CRUZ CRUZ JUAN", licenseNumber: "BCN0212731", type: "CRUCE" },
  { fullName: "GERARDO RIOS WILFREDO", licenseNumber: "BCN0218723", type: "CRUCE" },
  { fullName: "GONZALEZ HERNANDEZ MARCO", licenseNumber: "DF001135515", type: "CRUCE" },
  { fullName: "GONZALES HERNANDEZ MARTIN", licenseNumber: "LFD00074192", type: "CRUCE" },
  { fullName: "GONZALEZ MIGUEL REY DAVID", licenseNumber: "LFD01193967", type: "LOCAL" },
  { fullName: "LOPEZ BECERRA JOSUE", licenseNumber: "BCN0216911", type: "CRUCE" },
  { fullName: "LUNA LEDESMA FRANCISCO", licenseNumber: "BC202107033498", type: "CRUCE" },
  { fullName: "MALDONADO ALFONSIN ISRAEL", licenseNumber: "BCN0218394", type: "CRUCE" },
  { fullName: "NAVA CASTRO BRYAN ALBERTO", licenseNumber: "LFD00090760", type: "CRUCE" },
  { fullName: "PEÑA OSUNA MAYOLO E", licenseNumber: "BCN0220548", type: "CRUCE" },
  { fullName: "TRONCOSO PESTAÑA JOSE A", licenseNumber: "EFD01186043", type: "LOCAL" },
];


async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    await Truck.deleteMany({});
    await Driver.deleteMany({});

    await Truck.insertMany(trucks);
    await Driver.insertMany(drivers);

    console.log("🚚 Camiones y 👨‍🔧 Choferes insertados correctamente");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en seed:", err);
    process.exit(1);
  }
}

seed();
