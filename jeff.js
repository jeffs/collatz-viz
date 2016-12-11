"use strict";

var Jeff = (function () {

    const FRAME_DELAY = 0;    // ms

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
        this.context.fillStyle = "gray";
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

    Chart.prototype.set = function (x, y) {
        this.context.fillStyle = "white";
        this.context.fillRect(
            x * this.cellSize,
            (this.endY - y) * this.cellSize,
            this.cellSize,
            this.cellSize);
    };

    Chart.prototype.post = function (y) {
        this.set(this.x++, y);
    };

    function Jeff() {
        this.collatz = new Chart("collatz", 2, 1000, 150);
        this.lengths = new Chart("lengths", 1, 2000, 300);
    }

    Jeff.prototype.addTitle = function (s) {
        document.getElementById("title").innerText += s;
    };

    Jeff.prototype.setTitle = function (s) {
        document.getElementById("title").innerText = s;
    };

    Jeff.prototype.imp = function (y0) {
        this.setTitle(`${y0}`);
        var self = this;
        function next(y) {
            return y % 2 === 0 ? y / 2 : y * 3 + 1;
        }
        function show(y) {
            self.collatz.post(y);
        }
        function loop(y) {
            var logY = Math.log2(y) * 4;
            if (y < 2) {
                show(logY);
                self.lengths.post(self.collatz.x);
                window.setTimeout(
                    function () {
                        self.collatz.init();
                        self.imp(y0 + 1);
                    },
                    FRAME_DELAY);
            } else if (logY < self.collatz.endY) {
                show(logY);
                window.setTimeout(loop, FRAME_DELAY, next(y));
            } else {
                self.addTitle(` went out of bounds at ${y}`);
            }
        }
        loop(y0);
    };

    Jeff.main = function () {
        new Jeff().imp(1);
    };

    return Jeff;

})();
