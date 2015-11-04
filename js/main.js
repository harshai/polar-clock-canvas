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

  createCircle = function(cxt, cp, perc, callback) {
    cxt.lineWidth = 30;
    cxt.beginPath();
    // cxt.arc(cp.x, cp.y, Math.min(window.innerWidth, window.innerHeight)/2 - 20, 0, Math.PI*2);
    // cxt.fill()
    cxt.arc(cp.x, cp.y, cp.rad, -(cp.quart), ((cp.circ) * perc) - cp.quart, cp.counterClockwise);
    cxt.stroke();
    if (callback) callback.call();
  },

  createParams = function() {
   var d = new Date(),
      second = d.getSeconds()  / 60,
      minute = d.getMinutes() / 60,
      hour = d.getHours() / 24,
      weekday = d.getDay() / 7,
      date = (d.getDate() - 1 ) / days(),
      month = d.getMonth() / 12;

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

  animate = function(context){
    var cxt = context;
    if (cxt) {
      var paramList = createParams();
      cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
      paramList.forEach(function(el, i, arr){
        var circleParams = {
          x: window.innerWidth/2,
          y: window.innerHeight/2,
          rad: Math.min(window.innerWidth, window.innerHeight)/2 * el.factor - 20,
          counterClockwise: false,
          circ: Math.PI * 2,
          quart: Math.PI / 2
        }
        cxt.strokeStyle = "orange";
        createCircle(cxt, circleParams, el.value);
      });

      requestAnimationFrame(function(){
        animate(cxt);
      });
    } else {
      document.write("Canvas not supported, please try a modern browser")
    }
  }

  animate(createCanvas());

}(document);
