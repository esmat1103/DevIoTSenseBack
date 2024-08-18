const mongoose = require('mongoose');
const broadcast = require('../utils/broadcast');
const Country = mongoose.connection.collection('countries');

const getCountries = async (req, res) => {
  try {
    const countries = await Country.find().toArray();
    res.json(countries);

    // Broadcast the event
    broadcast(req.app.locals.wss, { message: 'Countries fetched', countries });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) { // Ensure headers are not sent multiple times
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

const getCountryById = async (req, res) => {
  const { id } = req.params;
  try {
    const country = await Country.findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.status(200).json(country);

    // Broadcast the event
    broadcast(req.app.locals.wss, { message: 'Country fetched', country });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) { // Ensure headers are not sent multiple times
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  getCountries,
  getCountryById
};
