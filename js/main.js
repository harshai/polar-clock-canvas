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

  getClockDimensions = function(scale){
    return Math.min(1024/2, (Math.min(window.innerWidth, window.innerHeight)/2)) * scale;
  },

  createCircle = function(cxt, radius, perc) {
    var x = window.innerWidth/2,
        y = window.innerHeight/2,
        counterClockwise =  false,
        full = Math.PI * 2,
        quarter = Math.PI / 2,
        color = generateColor(perc)

    cxt.shadowOffsetX = 0;
    cxt.shadowOffsetY = 0;
    cxt.shadowBlur = 5;
    cxt.lineWidth = 0.08 * getClockDimensions(0.8);
    cxt.beginPath();
    cxt.shadowColor = color;
    cxt.strokeStyle = color;
    cxt.arc(x, y, radius, -(quarter), ((full) * perc) - quarter, counterClockwise);
    cxt.stroke();
  },

  createParams = function() {
   var d = new Date(),
      second = (d.getSeconds() + d.getMilliseconds()/1000)/ 60 ,
      minute = (d.getMinutes() + second) / 60,
      hour = (d.getHours() + minute) / 24,
      weekday = (d.getDay() + hour)/ 7,
      date = (d.getDate() - 1 + hour) / daysInMonth(d.getMonth() - 1, d.getFullYear()),
      month = (d.getMonth() + date)/ 12;

    function daysInMonth(m, y) {
        return (m == 2) ? (!((y % 4) || (!(y % 100) && (y % 400))) ? 29 : 28) : (m >> 3 ^ m) & 1 ? 31 : 30;
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

  generateColor = function(value) {
    return "hsl(" + (360 * (value)) + ", 40%, 50% )";
  },

  animate = function() {
    var cxt = createCanvas(),
        radius;
    if (cxt) {
      cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
      createParams().forEach(function(el, i, arr) {
        radius = getClockDimensions(0.8) * el.factor - 20;
        createCircle(cxt, radius, el.value);
      });

      requestAnimationFrame(function(){
        animate(cxt);
      });
    } else {
      document.write("This is an experiment that depends on canvas, which is not supported by your browser. Please try using a modern browser.")
    }
  };

  window.onload = animate();

}(document);
