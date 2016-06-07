smile-face-detector
===================

smile-face-detector detects smiles in your image. 

![lenna](https://raw.githubusercontent.com/yosuke-furukawa/smile-face-detector/master/images/Lenna_result.jpg)
![child](https://raw.githubusercontent.com/yosuke-furukawa/smile-face-detector/master/images/child_result.jpg)
![child2](https://raw.githubusercontent.com/yosuke-furukawa/smile-face-detector/master/images/child2_result.jpg)

# How to install 

```
$ npm install smile-face-detector --save
```

# example code

```js
const SmileFaceDetector = require('smile-face-detector');
const detector = new SmileFaceDetector({smileScale: 1.01, smileNeighbor: 10});
detector.on('error', (error) => {
  console.error(error);
});
detector.on('face', (faces, image) => {
  console.log(faces);
  faces.forEach((face) => {
    // write rectangle
    image.rectangle([face.x, face.y], [face.width, face.height], SmileFaceDetector.green, 2);
  });
});
detector.on('smile', (smiles, face, image) => {
  console.log(smiles);
  smiles.forEach((smile) => {
    image.rectangle([smile.x + face.x, smile.y + face.height/2 + face.y], [smile.width, smile.height], SmileFaceDetector.blue, 2);
  });
  image.save('./images/Lenna_result.jpg');
});
detector.load('./images/Lenna.png').then((image) => {
  detector.detect(image);
}).catch((e) => {
  console.error(e);
});
```

# API

## constructor

```js
new SmileFaceDetector({
  // Parameter specifying how much the image size is reduced at each image scale on face detection default: 1.05
  faceScale: 1.01,
  // Parameter specifying how many neighbors each candidate rectangle should have to retain it on face detection default: 8
  faceNeighbor: 2,
  // Parameter specifying how much the image size is reduced at each image scale on smile detection default: 1.7
  smileScale: 1.01,
  // Parameter specifying how many neighbors each candidate rectangle should have to retain it on smile detection default: 22
  smileNeighbor: 2,
});
```

## load

```js
const detector = new SmileFaceDetector();
detector.load('/foo/bar.jpg').then((image) => {
  // image is Matrix instance on opencv
}).catch((e) => {
  // load image failure
});
```

## detect

```js
const detector = new SmileFaceDetector();
detector.on('face', (faces, image) => {
  // faces is an array of face area like face.x, face.y, face.width, face.height
});
detector.on('smile', (smiles, face, image) => {
  // smiles is an array of smile area like smile.x, smile.y, smile.width, smile.height
});
detector.load('/foo/bar.jpg').then((image) => {
  detector.detect(image);
})
```
