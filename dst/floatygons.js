'use strict'; //Floatygons.js
//By Styn van de Haterd @ 2019

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Floatygons = function Floatygons() {
  var _this = this;

  _classCallCheck(this, Floatygons);

  _defineProperty(this, "extendDefaults", function (source, properties) {
    var property;

    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }

    return source;
  });

  _defineProperty(this, "getRandom", function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  });

  _defineProperty(this, "increaseBrightness", function (hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, "");

    if (hex.length < 6) {
      hex = hex.replace(/(.)/g, '$1$1');
    }

    lum = lum || 0;
    var rgb = "#",
        c;

    for (var i = 0; i < 3; ++i) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }

    return rgb;
  });

  _defineProperty(this, "spawnDot", function () {
    return {
      x: _this.getRandom(0, _this.canvasWidth),
      y: _this.getRandom(0, _this.canvasHeight),
      vx: _this.getRandom(-_this.options.maxDotSpeed, _this.options.maxDotSpeed),
      vy: _this.getRandom(-_this.options.maxDotSpeed, _this.options.maxDotSpeed),
      markedForDeletion: false,
      connections: []
    };
  });

  _defineProperty(this, "manhattanDistance", function (dotA, dotB) {
    return Math.abs(dotB.x - dotA.x) + Math.abs(dotB.y - dotA.y);
  });

  _defineProperty(this, "seekConnection", function (dot) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var other = _step.value;
        if (other === dot) return "continue";

        var distance = _this.manhattanDistance(dot, other);

        if (distance < _this.options.maxDistance && other.connections.filter(function (d) {
          return d === dot;
        }).length === 0 && dot.connections.filter(function (d) {
          return d === other;
        }).length === 0) {
          return {
            v: other
          };
        }
      };

      for (var _iterator = _this.dots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ret = _loop();

        switch (_ret) {
          case "continue":
            continue;

          default:
            if (_typeof(_ret) === "object") return _ret.v;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return undefined;
  });

  _defineProperty(this, "setup", function () {
    _this.canvas = document.querySelector(_this.options.canvasId);
    _this.ctx = _this.canvas.getContext("2d");
    var parent = _this.canvas.parentElement;

    if (_this.options.rescaleToParent) {
      _this.ctx.canvas.width = parent.clientWidth;
      _this.ctx.canvas.height = parent.clientHeight;
    }

    _this.canvasWidth = _this.ctx.canvas.width;
    _this.canvasHeight = _this.ctx.canvas.height;

    for (var i = 0; i < _this.options.maxDotsAlive; ++i) {
      _this.dots.push(_this.spawnDot());
    }
  });

  _defineProperty(this, "clearScreen", function () {
    _this.ctx.fillStyle = _this.options.clearColor;

    _this.ctx.fillRect(0, 0, _this.canvasWidth, _this.canvasHeight);
  });

  _defineProperty(this, "drawLine", function (dotA, dotB) {
    _this.ctx.strokeStyle = _this.increaseBrightness(_this.options.lineColor, -(_this.manhattanDistance(dotA, dotB) / _this.options.maxDistance) + 0.075);

    _this.ctx.beginPath();

    _this.ctx.moveTo(dotA.x + _this.options.dotSize / 2, dotA.y + _this.options.dotSize / 2);

    _this.ctx.lineTo(dotB.x + _this.options.dotSize / 2, dotB.y + _this.options.dotSize / 2);

    _this.ctx.stroke();
  });

  _defineProperty(this, "drawDot", function (dot) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = dot.connections[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var connection = _step2.value;

        _this.drawLine(dot, connection);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    _this.ctx.fillStyle = _this.options.dotColor;

    _this.ctx.fillRect(dot.x, dot.y, _this.options.dotSize, _this.options.dotSize);
  });

  _defineProperty(this, "updateDot", function (dot) {
    dot.x += dot.vx * (_this.options.interval / 1000.0);
    dot.y += dot.vy * (_this.options.interval / 1000.0); //Check positioning for deletion

    if (dot.x > _this.canvasWidth || dot.x < 0 || dot.y > _this.canvasHeight || dot.y < 0) {
      dot.markedForDeletion = true;
      return;
    } //Check if new connections available


    if (dot.connections.length < _this.options.maxConnections) {
      var connection = _this.seekConnection(dot);

      if (connection !== undefined) {
        dot.connections.push(connection);
      }
    } //Check existing connections


    var i = dot.connections.length - 1;

    while (i >= 0) {
      if (dot.connections[i].markedForDeletion || _this.manhattanDistance(dot, dot.connections[i]) > _this.options.maxDistance) {
        dot.connections.splice(i, 1);
      }

      --i;
    }
  });

  _defineProperty(this, "update", function () {
    _this.clearScreen();

    var i = _this.dots.length - 1;
    var dotsRemoved = 0;

    while (i >= 0) {
      var dot = _this.dots[i]; //Update

      _this.updateDot(dot); //Remove dot if needed.


      if (dot.markedForDeletion) {
        _this.dots.splice(i, 1);

        ++dotsRemoved;
        --i;
        continue;
      } //Draw


      _this.drawDot(dot);

      --i;
    }

    for (var n = 0; n < dotsRemoved; ++n) {
      _this.dots.push(_this.spawnDot());
    }
  });

  _defineProperty(this, "start", function () {
    _this.setup();

    _this.clearScreen();

    setInterval(_this.update, _this.options.interval);
  });

  _defineProperty(this, "stop", function () {
    _this.options.interval = 0;
  });

  _defineProperty(this, "resume", function () {
    _this.options.interval = 1000 / _this.options.fps;
  });

  var defaults = {
    canvasId: "#floatygonCanvas",
    clearColor: "#1b1b1b",
    dotColor: "#FFFFFF",
    lineColor: "#FFFFFF",
    maxDotsAlive: 128,
    dotSize: 3,
    maxDotSpeed: 20,
    maxConnections: 3,
    maxDistance: 200,
    fps: 144,
    rescaleToParent: true
  };

  if (arguments[0] && _typeof(arguments[0]) === "object") {
    this.options = this.extendDefaults(defaults, arguments[0]);
  } else {
    this.options = defaults;
  }

  this.options.interval = 1000 / this.options.fps;
  this.dots = [];
};