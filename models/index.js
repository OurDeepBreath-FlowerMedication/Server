const Sequelize = require('sequelize');

const Device = require('./tables/device');
const Medication = require('./tables/medication');
const Routin = require('./tables/routin');
const RoutinDone = require('./tables/routinDone');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.dadtabase, config.username, config.password, config);

db.sequelize = sequelize;

db.Device = Device;
db.Medication = Medication;
db.Routin = Routin;
db.RoutinDone = RoutinDone;

Device.init(sequelize);
Medication.init(sequelize);
Routin.init(sequelize);
RoutinDone.init(sequelize);

module.exports = db;