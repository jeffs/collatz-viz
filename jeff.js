"use strict";

function Jeff() {
    this.context = document.getElementById("tutorial").getContext("2d");
}

Jeff.prototype.draw = function() {
    this.context.fillStyle = "rgb(200, 0, 0)";
    this.context.fillRect(10, 10, 50, 50);
    this.context.fillStyle = "rgba(0, 0, 200, 0.5)";
    this.context.fillRect(30, 30, 50, 50);
}

Jeff.draw = function() { new Jeff().draw(); };
