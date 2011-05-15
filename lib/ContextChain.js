function ContextChain(context) {
  this.context = context;
}

var setters = "fillStyle,font,globalAlpha,globalCompositeOperation,lineCap,lineJoin,lineWidth,miterLimit,shadowBlur,shadowColor,shadowOffsetX,shadowOffsetY,strokeStyle,textAlign,textBaseline".split(',');

var funcs = "arc,arcTo,beginPath,bezierCurveTo,canvas,clearRect,clearShadow,clip,closePath,drawImage,drawImageFromRect,fill,fillRect,fillText,lineTo,measureText,moveTo,putImageData,quadraticCurveTo,rect,restore,rotate,save,scale,setAlpha,setCompositeOperation,setFillColor,setLineCap,setLineJoin,setLineWidth,setMiterLimit,setShadow,setStrokeColor,setTransform,stroke,strokeRect,strokeText,transform,translate".split(',');

var terminators = "createImageData,createLinearGradient,createPattern,createRadialGradient,getImageData,isPointInPath".split(',');

function isort(a, b) { return a > b ? 1 : a < b ? -1 : 0; }

var sl = setters.length,
    fl = funcs.length,
    tl = terminators.length,
    i = [ sl, fl, tl ].sort(isort)[2],
    prototype = {};


function callSetterWithArgs(instance, setterName, setterValue) {
  instance.context[setterName] = setterValue;
  return instance;
}

function callFuncWithArgs(instance, funcName, funcArguments) {
  context = instance.context;
  context[funcName].apply(context, funcArguments);
  return instance;
}

function callTerminatorWithArgs(instance, terminatorName, terminatorArguments) {
  var context = instance.context;
  return context[terminatorName].apply(context, terminatorArguments);
}

for (; i >= 0; i--) {
  // Close over i
  (function(i) {
    if (i < sl)
      prototype[setters[i]] = function() { return callSetterWithArgs(this, setters[i], arguments[0]); };
    if (i < fl)
      prototype[funcs[i]] = function() { return callFuncWithArgs(this, funcs[i], arguments); };
    if (i < tl)
      prototype[terminators[i]] = function() { return callTerminatorWithArgs(this, terminators[i], arguments); };
  }(i));
}

ContextChain.prototype = prototype;

module.exports = ContextChain;

