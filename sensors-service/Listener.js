// // listener.js

// const { MongoClient } = require('mongodb');
// const fs = require('fs');

// async function main() {
//   const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

//   const remoteClient = new MongoClient(config.remoteUri);
//   const localClient = new MongoClient(config.localUri);

//   try {
//     await remoteClient.connect();
//     const remoteDb = remoteClient.db(config.remoteDbName);
//     const remoteCollection = remoteDb.collection(config.remoteCollectionName);

//     await localClient.connect();
//     const localDb = localClient.db(config.localDbName);
//     const localCollection = localDb.collection(config.localCollectionName);

//     console.log('Listening for changes in the remote sensors collection...');

//     const changeStream = remoteCollection.watch();

//     changeStream.on('change', async (change) => {
//       if (change.operationType === 'insert') {
//         const data = change.fullDocument;

//         // Transform data if needed
//         const transformedData = {
//           timestamp: new Date(data.timestamp),
//           deviceInfo: {
//             MAC: data.payload.MAC,
//             topic: data.topic
//           },
//           readings: {
//             EC: data.payload.EC,
//             Temperature_PCTZB: data.payload.Temperature_PCTZB,
//             Salinity: data.payload.Salinity,
//             PH: data.payload.PH,
//             ORP: data.payload.ORP,
//             Oxygen_Percent: data.payload.Oxygen_Percent,
//             Oxygen_mgL: data.payload.Oxygen_mgL,
//             Battery: data.payload.Battery
//           },
//           qos: data.qos,
//           retain: data.retain,
//           _msgid: data._msgid
//         };

//         await localCollection.insertOne(transformedData);
//         console.log('Data inserted into local collection:', transformedData);
//       }
//     });

//   } catch (err) {
//     console.error('Error:', err);
//   }
// }

// main();
