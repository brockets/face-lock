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
const reference = document.querySelector("#reference");

function takeSnapshot() {
  var hidden_canvas = document.querySelector("overlay"),
    video = document.querySelector("inputVideo"),
    image = document.querySelector("img.photo"),
    // Get the exact size of the video element.
    width = video.videoWidth,
    height = video.videoHeight,
    // Context object for working with the canvas.
    context = hidden_canvas.getContext("2d");

  // Set the canvas to the same dimensions as the video.
  hidden_canvas.width = width;
  hidden_canvas.height = height;

  // Draw a copy of the current frame from the video on the canvas.
  context.drawImage(video, 0, 0, width, height);

  // Get an image dataURL from the canvas.
  var imageDataURL = hidden_canvas.toDataURL("image/png");

  // Set the dataURL as source of an image element, showing the captured photo.
  image.setAttribute("src", imageDataURL);

  // Set the href attribute of the download button.
  document.querySelector("#dl-btn").href = imageDataURL;
}

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

  const referenceResult = await faceapi
    .detectAllFaces(
      reference,
      new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (result && referenceResult) {
    let bestMatch;
    const resultLength = result.length;
    if (resultLength) {
      const referenceMatch = new faceapi.FaceMatcher(referenceResult);
      const allMatches = result.map(obj =>
        referenceMatch.findBestMatch(obj.descriptor)
      );

      const userDetected = Boolean(
        allMatches.filter(obj => obj._label !== "unknown").length
      );

      if (resultLength === 1 && userDetected) {
        ipcRenderer.send("you-are-safe");
      }
      if (
        (resultLength > 1 && userDetected) ||
        (resultLength === 1 && !userDetected)
      ) {
        ipcRenderer.send("watcher-detected");
      }
      if (!userDetected) {
        ipcRenderer.send("user-afk");
      }
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
