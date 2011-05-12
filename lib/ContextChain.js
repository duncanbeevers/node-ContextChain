function ContextChain(context) {
  this.context = context;
}

var setters = ["fillStyle", "font", "globalAlpha", "globalCompositeOperation", "lineCap", "lineJoin", "lineWidth", "miterLimit", "shadowBlur", "shadowColor", "shadowOffsetX", "shadowOffsetY", "strokeStyle", "textAlign", "textBaseline"];

var funcs = ["arc", "arcTo", "beginPath", "bezierCurveTo", "canvas", "clearRect", "clearShadow", "clip", "closePath", "createImageData", "createLinearGradient", "createPattern", "createRadialGradient", "drawImage", "drawImageFromRect", "fill", "fillRect", "fillText", "getImageData", "isPointInPath", "lineTo", "measureText", "moveTo", "putImageData", "quadraticCurveTo", "rect", "restore", "rotate", "save", "scale", "setAlpha", "setCompositeOperation", "setFillColor", "setLineCap", "setLineJoin", "setLineWidth", "setMiterLimit", "setShadow", "setStrokeColor", "setTransform", "stroke", "strokeRect", "strokeText", "transform", "translate"];

var i, prototype = {};

// Prepare setters
for (i = setters.length; i >= 0; i--) {
  function callSetterWithArgs(instance, setterName, setterValue) {
    instance.context[setterName] = setterValue;
    return instance;
  }

  prototype[setters[i]] = (function(i) {
    return function() {
      return callSetterWithArgs(this, setters[i], arguments[0]);
    };
  }(i));
}

// Prepare functions
for (i = funcs.length; i >= 0; i--) {
  function callFuncWithArgs(instance, funcName, funcArguments) {
    context = instance.context;
    context[funcName].apply(context, funcArguments);
    return instance;
  }

  prototype[funcs[i]] = (function(i) {
    return function() {
      return callFuncWithArgs(this, funcs[i], arguments);
    };
  })(i);

}

ContextChain.prototype = prototype;

module.exports = ContextChain;


