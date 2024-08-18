const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const SensorTopic = require('./models/sensorTopicModel'); 

const sourceUri = 'mongodb://162.19.25.155:27017';
const targetUri = 'mongodb://host.docker.internal:27017/smartinnov';

const sourceDbName = 'iotsense';
const sourceCollectionName = 'sensors';

const sourceClient = new MongoClient(sourceUri);
let lastCheckedId = null;

async function pollForChanges() {
    try {
        await sourceClient.connect();
        await mongoose.connect(targetUri, { useNewUrlParser: true, useUnifiedTopology: true });

        const sourceDb = sourceClient.db(sourceDbName);
        const sourceCollection = sourceDb.collection(sourceCollectionName);

        setInterval(async () => {
            const query = lastCheckedId ? { _id: { $gt: lastCheckedId } } : {};
            const newDocuments = await sourceCollection.find(query).toArray();

            if (newDocuments.length > 0) {
                lastCheckedId = newDocuments[newDocuments.length - 1]._id;

                for (const doc of newDocuments) {
                    await SensorTopic.updateOne(
                        { _id: doc._id },
                        { $set: doc },
                        { upsert: true }
                    );
                }

                console.log('Processed documents:', newDocuments);
            }
        }, 5000);

    } catch (error) {
        console.error('Error:', error);
    }
}

pollForChanges();

process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await sourceClient.close();
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = pollForChanges;
