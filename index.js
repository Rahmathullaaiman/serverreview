
//1)POSTMAN URL FOR GET AND POST
// http://localhost:5000/reviewarray


const express = require('express');
const jsonServer = require('json-server');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

app.use(express.json());


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const reviewserver = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

reviewserver.use(middlewares);
reviewserver.use(router);

app.post('/reviewarray', upload.single('image'), (req, res) => {
  const { id, name, review, star } = req.body;
  const imagePath = req.file ? req.file.path : null;

  const newReview = {
    id: id,
    name: name,
    review: review,
    star: star,
    image: imagePath
  };

  router.db.get('reviewarray').push(newReview).write();

  res.json(newReview);
});

app.use('/', reviewserver);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
