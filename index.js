'use strict';
const opencv = require('opencv');
const EventEmitter = require('events');
const path = require('path');

const greenColor = [0, 255, 0];
const blueColor = [255, 0, 0];
const redColor = [0, 0, 255];
const rectThickness = 2;
const faceClassifier = new opencv.CascadeClassifier(opencv.FACE_CASCADE);
const smileClassifier = new opencv.CascadeClassifier(path.join(__dirname, './data/haarcascade_smile.xml'));
const defaultFaceScale = 1.05;
const defaultFaceNeighbor = 8;
const defaultSmileScale = 1.7;
const defaultSmileNeighbor = 22;

class SmileFaceDetector extends EventEmitter {

  constructor(obj) {
    super();
    if (!obj) obj = {};
    this.faceScale = obj.faceScale || defaultFaceScale;
    this.faceNeighbor = obj.faceNeighbor || defaultFaceNeighbor;
    this.smileScale = obj.smileScale || defaultSmileScale;
    this.smileNeighbor = obj.smileNeighbor || defaultSmileNeighbor;
  }

  load(image) {
    return new Promise((resolve, reject) => {
      opencv.readImage(image, (err, image) => {
        if (err) return reject(err);
        resolve(image);
      });
    });
  }

  detect(image) {
    faceClassifier.detectMultiScale(image, (err, faces) => {
      if (err) this.emit('error', err);
      faces.forEach((face, faceIndex) => {
        const halfHeight = parseInt(face.height / 2);
        const faceImage = image.roi(face.x, face.y + halfHeight, face.width, halfHeight);
        faceImage.convertGrayscale();
        faceImage.equalizeHist();
        if (faces && faces.length) {
          this.emit('face', faces, image);
        }
        smileClassifier.detectMultiScale(faceImage, (err, smiles) => {
          if (err) {
            this.emit('error', err);
          }
          if (smiles && smiles.length) {
            this.emit('smile', smiles, face, image);
          }
        }, this.smileScale, this.smileNeighbor, face.width/4, face.height/4);
      });
    }, this.faceScale, this.faceNeighbor);
  }

  drawRectangle(rects, color) {
    const rectangles = !Array.isArray(rects) ? [rects] : rects;
    rectangles.forEach((rect) => {
      image.rectangle([rect.x, rect.y], [rect.width, rect.height], color, rectThickness);
    });
  }

  getImage() {
    return image;
  }
}

SmileFaceDetector.red = redColor;
SmileFaceDetector.green = greenColor;
SmileFaceDetector.blue = blueColor;

module.exports = SmileFaceDetector;
