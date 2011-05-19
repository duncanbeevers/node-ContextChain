function ContextChain(context) {
  this.context = context;
}

var setters = "fillStyle,font,globalAlpha,globalCompositeOperation,lineCap,lineJoin,lineWidth,miterLimit,shadowBlur,shadowColor,shadowOffsetX,shadowOffsetY,strokeStyle,textAlign,textBaseline".split(',');

var funcs = "arc,arcTo,beginPath,bezierCurveTo,canvas,clearRect,clearShadow,clip,closePath,drawImage,drawImageFromRect,fill,fillRect,fillText,lineTo,measureText,moveTo,putImageData,quadraticCurveTo,rect,restore,rotate,save,scale,setAlpha,setCompositeOperation,setFillColor,setLineCap,setLineJoin,setLineWidth,setMiterLimit,setShadow,setStrokeColor,setTransform,stroke,strokeRect,strokeText,transform,translate".split(',');

var terminators = "createImageData,createLinearGradient,createPattern,createRadialGradient,getImageData,isPointInPath".split(',');

var sl = setters.length,
    fl = funcs.length,
    tl = terminators.length,
    i = Math.max(sl, fl, tl),
    prototype = {};


function callSetterWithArgs(instance, setterName, setterValue) {
  var context = instance.context;
  if (context) context[setterName] = setterValue;
  return instance;
}

function callFuncWithArgs(instance, funcName, funcArguments) {
  var context = instance.context;
  if (context) context[funcName].apply(context, funcArguments);
  return instance;
}

function callTerminatorWithArgs(instance, terminatorName, originalTerminatorArguments) {
  var context = instance.context,
      terminatorArguments = [].splice.call(originalTerminatorArguments, 0),
      fn = terminatorArguments.pop(), ret;

  if (!(fn instanceof Function)) {
    terminatorArguments.push(fn);
    fn = null;
  }
  if (context) {
    ret = context[terminatorName].apply(context, terminatorArguments);
    fn && fn(ret);
    return ret;
  }
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

var compositeOperations = 'source-over,source-in,source-out,source-atop,destination-over,destination-in,destination-out,destination-atop,lighter,darker,xor,copy'.split(',');

compositeOperations.forEach(function(compositeOperation) {
  var cm = 'composite', gco = 'globalCompositeOperation';
  var opName = cm + compositeOperation.replace(
    /(^.)|(?:-(.))/g,
    function(_, m0, m1) { return (m0 || m1).toUpperCase(); }
  );
  prototype[opName] = function() {
    var context = this.context;
    if (context) this.context[gco] = compositeOperation;
    return this;
  };
});

ContextChain.prototype = prototype;

module.exports = ContextChain;

