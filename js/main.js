~function(document)   {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var createCanvas = function() {
    var canvas = document.getElementById('polar-clock') ?
                 document.getElementById('polar-clock') :
                 document.createElement('canvas'),
    cxt = canvas.getContext('2d');
    if(cxt) {
      cxt.canvas.width  = window.innerWidth;
      cxt.canvas.height = window.innerHeight;
      canvas.setAttribute('id', 'polar-clock');
      document.body.appendChild(canvas);
    }
    return cxt || !!cxt;
  },

  getClockDimensions = function(){
    return Math.min(1024/2, (Math.min(window.innerWidth, window.innerHeight)/2));
  },

  createCircle = function(cxt, cp, perc) {
    cxt.lineWidth = 0.095 * getClockDimensions();
    cxt.beginPath();
    cxt.arc(cp.x, cp.y, cp.rad, -(cp.quart), ((cp.circ) * perc) - cp.quart, cp.counterClockwise);
    cxt.stroke();
  },

  createParams = function() {
   var d = new Date(),
      second = (d.getSeconds() + d.getMilliseconds()/1000)/ 60 ,
      minute = (d.getMinutes() + second) / 60,
      hour = (d.getHours() + minute) / 24,
      weekday = (d.getDay() + hour)/ 7,
      date = (d.getDate() - 1 + hour) / days(),
      month = (d.getMonth() + date)/ 12;

   function days() {
     return 32 - new Date(d.getYear(), d.getMonth(), 32).getDate();
   }

   return [
       { value: second,  factor: 0.8},
       { value: minute,  factor: 0.7},
       { value: hour,    factor: 0.6},
       { value: weekday, factor: 0.5},
       { value: date,    factor: 0.4},
       { value: month,   factor: 0.3},
     ];
  },

  generateColor = function(value, factor) {
    return "hsla(" + (360 * value - 180) + ", 50%, 50%, " + 1 +")";
  },

  animate = function(){
    var cxt = createCanvas();
    if (cxt) {
      var paramList = createParams();
      cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
      paramList.forEach(function(el, i, arr) {
        var circleParams = {
          x: window.innerWidth/2,
          y: window.innerHeight/2,
          rad: getClockDimensions() * el.factor - 20,
          counterClockwise: false,
          circ: Math.PI * 2,
          quart: Math.PI / 2
        }
        cxt.strokeStyle = generateColor(el.value, el.factor)
        createCircle(cxt, circleParams, el.value);
      });
      requestAnimationFrame(function(){
        animate(cxt);
      });
    } else {
      document.write("This is an experiment that depends on canvas, which is not supported by your browser. Please try modern browser.")
    }
  };

  window.onload = animate();

}(document);
