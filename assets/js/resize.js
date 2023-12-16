const fileInput = document.querySelector("#fileInput");
const uploadedImage = document.querySelector("#uploadedImage");
const dragArea = document.querySelector("#dragArea");
const tab1 = document.querySelector("#tab1");
const tab2 = document.querySelector("#tab2");
const txtWidth = document.querySelector("#txtWidth");
const txtHeight = document.querySelector("#txtHeight");
const chkAspectRatio = document.querySelector("#chkAspectRatio");
const percentageSlider = document.querySelector("#percentageSlider");
const lblPercentage = document.querySelector("#lblPercentage");

let fileName = Date.now();

init();

function init() {
  setEventListeners();
}

//#region Cropper

let cropper = null;
let image = null;

function setCropper() {
  image = document.querySelector("#uploadedImage");
  cropper && cropper.destroy();
  cropper = new Cropper(image, {
    viewMode: 1,
    background: false,
    autoCrop: true,
    autoCropArea: 1,
    zoomable: false,
    rotatable: false,
    scalable: false,
    zoomOnTouch: false,
    guides: false,
  });
}

function isPercentageTabActive() {
  var tab = document.querySelector(".tab.active");
  return tab.classList.contains("percentage");
}

function resizeImage() {
  var width = txtWidth.value;
  var height = txtHeight.value;
  if (isPercentageTabActive()) {
    var reductionPercentage = percentageSlider.value / 100;
    width = uploadedImage.naturalWidth * reductionPercentage;
    height = uploadedImage.naturalHeight * reductionPercentage;
  }
  var croppedImage = cropper
    .getCroppedCanvas({
      width: parseInt(width),
      height: parseInt(height),
    })
    .toDataURL("image/png");
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
function selectTab(tabIndex, e) {
  var e = e.value;
  document.getElementById("tab1Content").style.display = "none";
  document.getElementById("tab2Content").style.display = "none";
  document.querySelectorAll(".tab").forEach((e) => {
    e.classList.remove("active");
  });
  document.getElementById("tab" + tabIndex + "Content").style.display = "block";
  document.getElementById("tab" + tabIndex + "Content").classList.add("active");
  document.getElementById("tab" + tabIndex ).classList.add("active");
}

function renderImage(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    uploadedImage.src = reader.result;
    uploadedImage.onload = function () {
      txtWidth.value = uploadedImage.naturalWidth;
      txtHeight.value = uploadedImage.naturalHeight;
      setCropper();
    };
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

function onSlide(e) {
  lblPercentage.innerHTML = e.target.value + "%";
}

function onWidthChange(e) {
  var originalWidth = uploadedImage.naturalWidth;
  var originalHeight = uploadedImage.naturalHeight;
  var newWidth = e.target.value;
  if (chkAspectRatio.checked) {
    var newHeight = (originalHeight / originalWidth) * newWidth;
    txtHeight.value = parseInt(newHeight);
  }
}

function onHeightChange(e) {
  var originalWidth = uploadedImage.naturalWidth;
  var originalHeight = uploadedImage.naturalHeight;
  var newHeight = e.target.value;
  if (chkAspectRatio.checked) {
    var newWidth = (originalWidth / originalHeight) * newHeight;
    txtWidth.value = parseInt(newWidth);
  }
}

function setEventListeners() {
  tab1.addEventListener("click", (e) => {
    selectTab(1, e);
  });

  tab2.addEventListener("click", (e) => {
    selectTab(2, e);
  });

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
  btnResize.addEventListener("click", resizeImage);
  percentageSlider.addEventListener("input", onSlide);
  txtWidth.addEventListener("input", onWidthChange);
  txtHeight.addEventListener("input", onHeightChange);
}

//#endregion
