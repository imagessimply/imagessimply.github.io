const fileInput = document.querySelector("#fileInput");
const uploadedImage = document.querySelector("#uploadedImage");
const dragArea = document.querySelector("#dragArea");
const btnFlipHorizontal = document.querySelector("#btnFlipHorizontal");
const btnFlipVertical = document.querySelector("#btnFlipVertical");
const btnRotateClock = document.querySelector("#btnRotateClock");
const btnRotateAntiClock = document.querySelector("#btnRotateAntiClock");
const btnDownload = document.querySelector("#btnDownload");

function init() {
  setEventListeners();
}

function downloadImage() {
  var a = document.createElement("a");
  a.href = uploadedImage.src;
  a.download = fileName;
  a.click();
}

function mirrorImage(x = 0, y = 0, horizontal = false, vertical = false) {
  let canvas = document.createElement("canvas");
  let image = uploadedImage;
  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  canvas.width = iw;
  canvas.height = ih;
  let ctx = canvas.getContext("2d");
  ctx.save();
  ctx.setTransform(
    horizontal ? -1 : 1,
    0,
    0,
    vertical ? -1 : 1,
    x + (horizontal ? iw : 0),
    y + (vertical ? ih : 0)
  );
  ctx.drawImage(image, 0, 0);
  ctx.restore();
  let rotated = canvas.toDataURL();
  image.src = rotated;
}
function rotateImage(clockwise) {
  const degrees = clockwise == true ? 90 : -90;
  let canvas = $("<canvas />")[0];
  let image = uploadedImage;

  const iw = image.naturalWidth;
  const ih = image.naturalHeight;

  canvas.width = ih;
  canvas.height = iw;

  let ctx = canvas.getContext("2d");

  if (clockwise) {
    ctx.translate(ih, 0);
  } else {
    ctx.translate(0, iw);
  }

  ctx.rotate((degrees * Math.PI) / 180);
  ctx.drawImage(image, 0, 0);

  let rotated = canvas.toDataURL();
  image.src = rotated;
}

const flipHorizontal = () => mirrorImage(0, 0, true, false);
const flipVertical = () => mirrorImage(0, 0, false, true);
const rotateClock = () => rotateImage(true);
const rotateAntiClock = () => rotateImage(false);

function renderImage(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    uploadedImage.src = reader.result;
    uploadedImage.onload = function () {};
  };
}

function fileInputLoader() {
  let file = fileInput.files[0];
  if (!file) return;
  fileName = file.name;
  renderImage(file);
}

function dragInputLoader(file, name, type) {
  if (type.split("/")[0] !== "image") {
    alert("Please upload an image file");
    return false;
  }
  fileName = name;
  renderImage(file);
}

function setEventListeners() {
  dragArea.addEventListener(
    "dragenter",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragArea.classList.add("active");
    },
    false
  );

  dragArea.addEventListener(
    "dragleave",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragArea.classList.remove("active");
    },
    false
  );

  dragArea.addEventListener(
    "dragover",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragArea.classList.add("active");
    },
    false
  );

  dragArea.addEventListener(
    "drop",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragArea.classList.remove("active");
      let draggedData = e.dataTransfer;
      let files = draggedData.files;
      dragInputLoader(files[0], files[0].name, files[0].type);
    },
    false
  );

  fileInput.addEventListener("change", fileInputLoader);
  dragArea.addEventListener("click", () => fileInput.click());
  btnFlipHorizontal.addEventListener("click", flipHorizontal);
  btnFlipVertical.addEventListener("click", flipVertical);
  btnRotateClock.addEventListener("click", rotateClock);
  btnRotateAntiClock.addEventListener("click", rotateAntiClock);
  btnDownload.addEventListener("click", downloadImage);
}

init();
