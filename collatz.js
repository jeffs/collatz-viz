'use strict';

const FRAME_DELAY = 0;    // ms

class Chart {
  constructor(elementId, cellSize, endX, endY) {
    const canvas = document.getElementById(elementId)
    canvas.width = cellSize * endX + 1;
    canvas.height = cellSize * endY + 1;
    canvas.parentElement.scrollTop = canvas.height;
    this.context = canvas.getContext("2d");
    this.cellSize = cellSize;
    this.endX = endX;
    this.endY = endY;
    this.init();
  }

  init() {
    this.context.fillStyle = 'black';
    this.context.fillRect(
      0,
      0,
      this.endX * this.cellSize,
      this.endY * this.cellSize);
    this.context.strokeRect(
      0,
      0,
      this.endX * this.cellSize,
      this.endY * this.cellSize);
    this.x = 0;
  }

  set(x, y, z) {
    if (x < 0 || this.endX <= x || y < 0 || this.endY <= y)
      return false;
    const intensity = (
      z === undefined ? 255 : Math.max(100, Math.floor(z * 255)));
    this.context.fillStyle =
      `rgb(${intensity}, ${intensity}, ${intensity})`;
    this.context.fillRect(
      x * this.cellSize,
      (this.endY - y) * this.cellSize,
      this.cellSize,
      this.cellSize);
    return true;
  }

  post(y, z) {
      return this.set(this.x++, y, z);
  }
}

class Title {
  constructor(elementId) {
    this.element = document.getElementById('title');
  }

  add(s) {
    this.element.innerText += s;
  }

  set(s) {
    this.element.innerText = s;
  }
}

// COLLATZ

function nextCollatz(y) {
      return y % 2 === 0 ? y / 2 : y * 3 + 1;
}

class Collatz {
  constructor() {
    this.collatz = new Chart('collatz', 2, 400, 400);
    this.lengths = new Chart('lengths', 2, 6000, 400);
    this.title = new Title('title');

    this.state = { };
    this.state.y0 = 1;
    this.state.maxY = 1;      // highest value seen in current path
    this.state.x = 0;
    this.state.y = 1;

    this.pauseButton = document.getElementById('pause');
    this.paused = true;
  }

  showCollatz(x, y, z) {
    const STRETCH = 4;
    return this.collatz.set(x, STRETCH * Math.log2(y), z);
  }

  tick() {
    if (this.state.x < 1) {
      this.collatz.init();
      this.title.set(`${this.state.y0}`);
    }
    if (this.showCollatz(this.state.x, this.state.y)) {
      if (this.state.y >= 2) {
        this.state.maxY = Math.max(this.state.maxY, this.state.y);
        ++this.state.x;
        this.state.y = nextCollatz(this.state.y);
      } else {
        this.lengths.post(
          this.state.x,
          1 - this.state.y0 / this.state.maxY);
        ++this.state.y0;
        this.state.maxY = 1;
        this.state.x = 0;
        this.state.y = this.state.y0;
      }
    } else {
      this.title.add(` went out of bounds at ${this.state.y}`);
    }
  }

  loop() {
    if (!this.paused) {
      this.tick();
      window.setTimeout(() => { this.loop(); }, FRAME_DELAY);
    }
  }

  pause() {
    if (this.paused) {
      this.paused = false;
      this.pauseButton.innerText = 'Pause';
      this.loop();
    } else {
      this.paused = true;
      this.pauseButton.innerText = 'Resume';
    }
  }
}

function main() {
  const collatz = new Collatz();
  document.querySelector('button#pause')
    .addEventListener('click', () => { collatz.pause(); });
  collatz.loop();
}

main();
