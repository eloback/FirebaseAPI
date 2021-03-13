// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const express = require('express');
const app = express();

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });

  const db = admin.firestore();
  

app.get('/api', async function(req, res){
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await db.collection('messages').add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  });


  
app.get('/test', async function(req, res){
    const docRef = await db.collection('users').doc('alovelace');

    docRef.set({
        first: 'Ada',
        last: 'Lovelace',
        born: 1815
    });
    res.send("succesfully created!");
});

app.get('/users', async(req, res) =>{
    const snapshot = await db.collection('users').get();
    snapshot.forEach((doc) => {
        res.write(doc.data());
      });
    res.send();
});

exports.app = functions.https.onRequest(app);
// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
/*exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);

      const uppercase = original.toUpperCase();

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });*/
