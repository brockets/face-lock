const { ipcRenderer } = require("electron");
const MODEL_URL = "./model";

faceapi.nets.ssdMobilenetv1.load(MODEL_URL);
loadModel();

async function loadModel() {
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

const video = document.querySelector("#inputVideo");
const canvas = document.querySelector("#overlay");
const reference = document.querySelector("#reference");

ipcRenderer.on("take-photo", () => {
  const snap = document.createElement("canvas");
  snap.width = video.videoWidth;
  snap.height = video.videoHeight;
  snap.getContext("2d").drawImage(video, 0, 0);
  reference.src = snap.toDataURL("image/png");

  onPlay();

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
      const resultLength = result.length;
      if (resultLength) {
        const referenceMatch = new faceapi.FaceMatcher(referenceResult);
        const allMatches = result.map(obj =>
          referenceMatch.findBestMatch(obj.descriptor)
        );

        const userDetected = Boolean(
          allMatches.filter(obj => obj._label !== "unknown").length
        );
        const watcherDetected = Boolean(
          allMatches.filter(obj => obj._label === "unknown").length
        );

        if (userDetected && resultLength === 1) {
          ipcRenderer.send("you-are-safe");
        }
        if (!userDetected) {
          ipcRenderer.send("user-afk");
        }
        if (watcherDetected) {
          ipcRenderer.send("watcher-detected");
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
});

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
}
run();
