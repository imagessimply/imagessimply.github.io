const fileInput = document.querySelector("#fileInput");
const uploadedImage = document.querySelector("#uploadedImage");
const dragArea = document.querySelector("#dragArea");
const btnCropper = document.querySelector("#btnCropper");
const cropperOptions = document.querySelector("#cropper-options");

let fileName = Date.now();

init();

function init() {
  setEventListeners();
}

//#region Cropper

let cropper = null;
let image = null;
let isCropperEnabled = false;

function setCropper(aspectRatio = 16 / 9) {
  isCropperEnabled = true;
  image = document.querySelector("#uploadedImage");
  cropper && cropper.destroy();
  cropper = new Cropper(image, {
    aspectRatio: aspectRatio,
    background: false,
    autoCrop: true,
  });
}

function cropImage() {
  var croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");
  downloadImage(croppedImage);
}

function downloadImage(croppedImage) {
  var a = document.createElement("a");
  a.href = croppedImage;
  a.download = fileName;
  a.click();
}

//#endregion

//#region UI Helpers

function renderImage(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    uploadedImage.src = reader.result;
    uploadedImage.onload = function () {
      setCropper();
    };
  };
}

function fileInputLoader() {
  if (isCropperEnabled) return;
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

  function onCropperSizeChange(e) {
    var value = e.currentTarget.value;
    var option = 16 / 9;
    switch (value) {
      case "16/9":
        option = 16 / 9;
        break;
      case "4/3":
        option = 4 / 3;
        break;
      case "1/1":
        option = 1 / 1;
        break;
      case "2/3":
        option = 2 / 3;
        break;
      case "free":
        option = NaN;
        break;
    }
    setCropper(option);
  }

  fileInput.addEventListener("change", fileInputLoader);
  dragArea.addEventListener("click", () => {
    if (isCropperEnabled) return;
    fileInput.click();
  });
  btnCropper.addEventListener("click", cropImage);
  cropperOptions.addEventListener("change", onCropperSizeChange);
}

//#endregion
