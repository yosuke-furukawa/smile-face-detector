const SmileFaceDetector = require('../.');
const detector = new SmileFaceDetector({smileScale: 1.1, smileNeighbor: 30});
detector.on('error', (error) => {
  console.error(error);
});
detector.on('face', (faces, image) => {
  console.log(faces);
  faces.forEach((face) => {
    image.rectangle([face.x, face.y], [face.width, face.height], SmileFaceDetector.green, 2);
  });
});
detector.on('smile', (smiles, face, image) => {
  console.log(smiles);
  smiles.forEach((smile) => {
    image.rectangle([smile.x + face.x, smile.y + face.height/2 + face.y], [smile.width, smile.height], SmileFaceDetector.blue, 2);
  });
  image.save('./images/child_result.jpg');
});
detector.load('./images/child.jpg').then((image) => {
  detector.detect(image);
}).catch((e) => {
  console.error(e);
});

