let blockCount = 0;
let singleUsed = 0;
let bundleUsed = 0;

function initDraggable(el) {
  el.setAttribute("draggable", true);
  el.addEventListener("dragstart", (e) => {
    const type = el.dataset.type;
    e.dataTransfer.setData("type", type);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.dropEffect = "copy";
    e.dataTransfer.setData("text/plain", "");
    el.style.opacity = "0";

    const img = new Image();
    img.src = el.src + "?v=" + new Date().getTime();
    img.className = "ghost";
    img.style.position = "absolute";
    img.style.top = "-1000px";
    img.style.left = "-1000px";
    img.style.opacity = "0";
    img.style.pointerEvents = "none";
    img.style.width = "144px";
    img.style.height = "74px";
    e.dataTransfer.setDragImage(img, 0, 0);

    document.body.appendChild(ghost);
  });

  el.addEventListener("dragend", () => {
    el.style.opacity = "1";

    const ghost = document.querySelector(".ghost");
    if (ghost) {
      ghost.remove();
    }
  });
}

function setupDraggables() {
  document.querySelectorAll(".draggable").forEach(initDraggable);
}

function createBundleImage() {
  if (bundleUsed >= 4) return;

  const newImg = document.createElement("img");
  newImg.src = "../../common_contents/img/EMA616_03_SU/peace0502.png";
  newImg.className = "draggable peace";
  newImg.dataset.type = "bundle";
  document.querySelector(".peace_stack").appendChild(newImg);
  initDraggable(newImg);
}

function dropPiece(type) {
  const stackArea = document.querySelector(".droppable_box");

  const piece = document.createElement("div");
  piece.classList.add("stack_piece");

  if (type === "single") {
    piece.classList.add("peace0501");

    blockCount += 6;
    singleUsed++;

    // peace0501 이미지 제거
    const targets = document.querySelectorAll(".peace_row img");
    if (targets.length > 0) targets[0].remove();

    if (singleUsed === 4) {
      document.querySelector(".peace_stack").style.display = "block";
      createBundleImage();
    }
  } else if (type === "bundle") {
    if (blockCount < 24 || bundleUsed >= 4) return;

    piece.classList.add("peace0502");

    blockCount += 24;
    bundleUsed++;

    const targets = document.querySelectorAll(".peace_stack img");
    if (targets.length > 0) targets[0].remove();

    if (bundleUsed < 4) createBundleImage();
  }

  stackArea.appendChild(piece);
}

function initDropArea() {
  const dropArea = document.querySelector(".droppable_box");

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");

    if (type === "single" && singleUsed < 4) {
      dropPiece("single");
    } else if (type === "bundle" && bundleUsed < 4) {
      dropPiece("bundle");
    }
  });
}

function resetAll() {
  blockCount = 0;
  singleUsed = 0;
  bundleUsed = 0;

  // 쌓인 블록 초기화
  document.querySelector(".droppable_box").innerHTML = "";

  // peace0501 다시 생성
  const peaceRow = document.querySelector(".peace_row");
  peaceRow.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const img = document.createElement("img");
    img.src = "../../common_contents/img/EMA616_03_SU/peace0501.png";
    img.className = "draggable peace";
    img.dataset.type = "single";
    peaceRow.appendChild(img);
    initDraggable(img);
  }

  // peace0502 제거
  const stack = document.querySelector(".peace_stack");
  stack.innerHTML = "";
  stack.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  setupDraggables();
  initDropArea();
  document.getElementsByClassName("btnReset").item(0).addEventListener("click", resetAll);
});
