const container = document.getElementById("flex-container");
const changeGridSize = document.getElementById("changeGridSize");
let isMouseDown = false;

let rainbowMode = false;

const RandomGridColors = document.getElementById('rainbowColor');

const standardGridSize = 16;

const resetButton = document.getElementById('resetButton');

document.addEventListener('mousedown', () => isMouseDown = true);
document.addEventListener('mouseup', () => isMouseDown = false);

window.onload = () => createGrid(16);

changeGridSize.addEventListener('click', () => {
  const newGridSize = prompt("Please choose a grid size (standard is 16x16)");
  createGrid(newGridSize);
});

resetButton.addEventListener('click', () => {
  createGrid(standardGridSize);
});

function getRandomHex() {
  return ('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));
}

function createGrid(gridSize) {
  const maxSize = 100;

  container.innerHTML = '';
  const squareWidth = 960 / gridSize;
  const squareHeight = squareWidth / 2;
  const gridTotalSize = gridSize * gridSize;
  
  if (gridSize > maxSize) {
    alert('Grid is too big. the grid cannot be bigger than 100.');
  } 

  else {
  for (let i = 0; i < gridTotalSize; i++) {
    const grid = document.createElement('div');
    grid.classList.add('grid');
    grid.style.width = `${squareWidth}px`;
    grid.style.height = `${squareHeight}px`;
    grid.addEventListener('mouseover', () => {
      if (rainbowMode == false) {
        if (isMouseDown) grid.classList.add('colored');
      } else {
        if (isMouseDown) grid.style.backgroundColor = getRandomHex();
      }
    });
    // grid.addEventListener('mousedown', () => grid.classList.add('colored'));
    container.appendChild(grid);
  }
  }
}

RandomGridColors.addEventListener('click', () => {
  rainbowMode = true;
})