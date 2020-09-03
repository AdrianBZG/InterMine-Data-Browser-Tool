// This function will show the image in the lightbox
const zoomImg = function () {
  // Create evil image clone
  const clone = this.cloneNode(true);
  clone.classList.remove("zoom");

  // Put evil clone into lightbox
  let lb = document.getElementById("lb-img");
  lb.innerHTML = "";
  lb.appendChild(clone);

  // Show lightbox
  lb = document.getElementById("lb-back");
  lb.classList.add("show");
};

window.addEventListener("load", function () {
  const container = document.createElement("div");
  container.id = "lb-back";
  container.classList.add("markdown-preview");

  const imgClone = document.createElement("div");
  imgClone.id = "lb-img";

  container.appendChild(imgClone);
  document.body.appendChild(container);

  // Attach on click events to all .zoom images
  const images = document.getElementsByClassName("zoom");
  if (images.length > 0) {
    for (const img of images) {
      img.addEventListener("click", zoomImg);
    }
  }

  // Click event to hide the lightbox
  document.getElementById("lb-back").addEventListener("click", function () {
    this.classList.remove("show");
  });
});
