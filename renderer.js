const { ipcRenderer } = require("electron");
const MODEL_URL = "./model";

faceapi.nets.ssdMobilenetv1.load(MODEL_URL);
this.loadModel();

async function loadModel() {
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

const video = document.querySelector("#inputVideo");
const canvas = document.querySelector("#overlay");

async function onPlay() {
  if (video.paused || video.ended) return setTimeout(() => onPlay());

  const result = await faceapi
    .detectAllFaces(
      video,
      new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (result) {
    const resultLength = result.length;
    if (resultLength > 1) {
      ipcRenderer.send("watcher-detected");
    }
    if (resultLength === 1) {
      ipcRenderer.send("you-are-safe");
    }
    if (!resultLength) {
      ipcRenderer.send("user-afk");
    }
    const dims = faceapi.matchDimensions(canvas, video, true);
    const resizedResults = faceapi.resizeResults(result, dims);
    faceapi.draw.drawDetections(canvas, resizedResults);
  }

  setTimeout(() => onPlay());
}

async function run() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  faceapi.env.monkeyPatch({
    Canvas: HTMLCanvasElement,
    Image: HTMLImageElement,
    ImageData: ImageData,
    Video: HTMLVideoElement,
    createCanvasElement: () => document.createElement("canvas"),
    createImageElement: () => document.createElement("img")
  });
  video.srcObject = stream;
  video.play();
  onPlay();
}
run();
