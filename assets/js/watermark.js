const fileInput = document.querySelector("#fileInput");
const uploadedImage = document.querySelector("#uploadedImage");
const dragArea = document.querySelector("#dragArea");
const uploadedArea = document.querySelector("#uploadedArea");
let waterMark = null;
let totalFileCount = 0;
let renderedFileCount = 0;

init();

function loadWatermarkImage() {
  var img = new Image();
  img.src = "../assets/images/watermark.png";
  img.onload = function () {
    waterMark = img;
  };
}

function init() {
  loadWatermarkImage();
  setEventListeners();
}

//#region Cropper

function downloadImage(croppedImage) {
  var a = document.createElement("a");
  a.href = croppedImage;
  a.download = fileName;
  a.click();
}

//#endregion

//#region UI Helpers

function renderWatermark() {
  var images = document.querySelectorAll("#uploadedArea img");
  images.forEach((img) => {
    let canvas = $("<canvas />")[0];
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    canvas.width = iw;
    canvas.height = ih;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    ctx.drawImage(waterMark, 0, 0);
    img.src = canvas.toDataURL();
  });
}

function triggerCountCheckForWatermark() {
  var timer = setInterval(function () {
    if (renderedFileCount == totalFileCount) {
      
      renderWatermark();
      clearInterval(timer);
    }
  }, 20);
}

function renderImage(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    var img = document.createElement("img");
    img.src = reader.result;
    uploadedArea.appendChild(img);
    renderedFileCount++;
  };
}

function fileInputLoader() {
  Array.from(fileInput.files).forEach((file) => {
    if (file.type.split("/")[0] == "image") {
      totalFileCount++;
      renderImage(file);
    }
  });
  triggerCountCheckForWatermark();
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
      fileInputLoader(files);
    },
    false
  );

  fileInput.addEventListener("change", fileInputLoader);
  dragArea.addEventListener("click", () => fileInput.click());
}

//#endregion
