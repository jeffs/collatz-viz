"use strict";

var Jeff = (function () {

    const FRAME_DELAY = 0;    // ms

    // CHART

    function Chart(elementId, cellSize, endX, endY) {
        var canvas = document.getElementById(elementId)
        canvas.width = cellSize * endX + 1;
        canvas.height = cellSize * endY + 1;
        this.context = canvas.getContext("2d");
        this.cellSize = cellSize;
        this.endX = endX;
        this.endY = endY;
        this.init();
    }

    Chart.prototype.init = function () {
        //this.context.fillStyle = 'gray';
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
    };

    Chart.prototype.set = function (x, y, z) {
        if (x < 0 || this.endX <= x || y < 0 || this.endY <= y)
            return false;
        // this.context.fillStyle = (
        //     z === undefined ? 'white'
        //   : z < 100 ? 'blue'
        //   : z < 200 ? 'green'
        //   : z < 256 ? 'red'
        //   : 'white');
        var intensity = Math.min(255, z);
        this.context.fillStyle =
            `rgb(${intensity}, ${intensity}, ${intensity})`;
        //console.log(z);
        this.context.fillRect(
            x * this.cellSize,
            (this.endY - y) * this.cellSize,
            this.cellSize,
            this.cellSize);
        return true;
    };

    Chart.prototype.post = function (y, z) {
        return this.set(this.x++, y, z);
    };

    // COLLATZ

    var Collatz = { };

    Collatz.next = function (y) {
        return y % 2 === 0 ? y / 2 : y * 3 + 1;
    };

    // TITLE

    function Title(elementId) {
        this.element = document.getElementById('title');
    };

    Title.prototype.add = function (s) {
        this.element.innerText += s;
    };

    Title.prototype.set = function (s) {
        this.element.innerText = s;
    };

    // JEFF

    function Jeff() {
        this.collatz = new Chart('collatz', 2, 1000, 150);
        this.lengths = new Chart('lengths', 2, 1000, 300);
        this.title = new Title('title');

        this.state = { };
        this.state.y0 = 1;
        this.state.maxY = 1;      // highest value seen in current path
        this.state.x = 0;
        this.state.y = 1;
    }

    Jeff.prototype.showCollatz = function (x, y, z) {
        var STRETCH = 4;
        return this.collatz.set(x, STRETCH * Math.log2(y), z);
    };

    Jeff.prototype.tick = function () {
        if (this.state.x < 1) {
            this.collatz.init();
            this.title.set(`${this.state.y0}`);
        }
        if (this.showCollatz(this.state.x, this.state.y, this.state.y)) {
            if (this.state.y >= 2) {
                this.state.maxY = Math.max(this.state.maxY, this.state.y);
                ++this.state.x;
                this.state.y = Collatz.next(this.state.y);
            } else {
                this.lengths.post(this.state.x, this.state.maxY);
                ++this.state.y0;
                this.state.maxY = 1;
                this.state.x = 0;
                this.state.y = this.state.y0;
            }
        } else {
            this.title.add(` went out of bounds at ${this.state.y}`);
        }
    };

    Jeff.prototype.loop = function () {
        if (!this.paused) {
            this.tick();
            var self = this;
            window.setTimeout(function () { self.loop(); }, FRAME_DELAY);
        }
    };

    Jeff.main = function () {
        window.jeff = new Jeff();
        window.jeff.loop();
    };

    Jeff.prototype.pause = function () {
        this.paused = true;
    };

    Jeff.prototype.resume = function() {
        if (this.paused) {
            this.paused = false;
            this.loop();
        }
    };

    return Jeff;

})();
