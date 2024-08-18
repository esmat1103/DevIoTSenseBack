// createTimeSeriesCollection.js

const { MongoClient } = require('mongodb');

async function createTimeSeriesCollection() {
  const uri = 'mongodb://host.docker.internal:27017'; 
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('smartinnov');
    
    await db.createCollection('sensortopics', {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'deviceInfo',
        granularity: 'minutes'
      }
    });
    console.log('Time-series collection created successfully!');
  } catch (err) {
    console.error('Error creating time-series collection:', err);
  } finally {
    await client.close();
  }
}

createTimeSeriesCollection();
