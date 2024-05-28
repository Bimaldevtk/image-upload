const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(require('./social-photo-manager-67c93-firebase-adminsdk-qmuxz-9537d9e33d.json')),
  storageBucket: "social-photo-manager-67c93.appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const upload = multer({
  storage: multer.memoryStorage(),
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const fileName = uuidv4() + path.extname(file.originalname);
    const fileRef = bucket.file(fileName);

    await fileRef.save(file.buffer);
    const fileURL = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    await db.collection('photos').add({
      url: fileURL[0],
      createdAt: new Date(),
      views: 0,
    });

    res.status(200).send({ url: fileURL[0] });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/photos', async (req, res) => {
  try {
    const photosSnapshot = await db.collection('photos').get();
    const photos = photosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(photos);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post('/photo/:id/view', async (req, res) => {
  try {
    const photoId = req.params.id;
    const photoRef = db.collection('photos').doc(photoId);
    const photoDoc = await photoRef.get();

    if (!photoDoc.exists) {
      return res.status(404).send({ error: 'Photo not found' });
    }

    const currentViews = photoDoc.data().views || 0;
    await photoRef.update({ views: currentViews + 1 });

    res.status(200).send({ views: currentViews + 1 });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
