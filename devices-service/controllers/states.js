const mongoose = require('mongoose');
const broadcast = require('../utils/broadcast');
const State = mongoose.connection.collection('states');

const getStates = async (req, res) => {
  try {
    const states = await State.find().toArray();
    res.json(states);

    broadcast(req.app.locals.wss, { message: 'States fetched', states });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) { 
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

module.exports = {
  getStates
};
