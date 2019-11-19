// https://dev.to/miku86/nodejs-postgresql-orm-overview-3mcn

const Sequelize = require('sequelize');
const database = require('./database');

const WeatherData = database.define(
  'weather_data',
  {
    timestamp: {
      type: Sequelize.TEXT
    }
  },
  { timestamps: false }
);

WeatherData.readAll = async (req, res) => {
  try {
    const all_weather_data = await WeatherData.findAll();
    return res.send({ all_weather_data });
  } catch (error) {
    return res.send(error);
  }
};

module.exports = WeatherData;

