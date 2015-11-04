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
    cxt.lineWidth = 10;
    cxt.beginPath();
    cxt.arc(cp.x, cp.y, cp.rad, -(cp.quart), ((cp.circ) * perc) - cp.quart, cp.counterClockwise);
    cxt.stroke();
    if (callback) callback.call();
  },

  createParams = function() {
   var d = new Date();

   function days() {
     return 32 - new Date(d.getYear(), d.getMonth(), 32).getDate();
   }

   var second = d.getSeconds()  / 60;
   var minute = (d.getMinutes() + second) / 60;
   var hour = (d.getHours() + minute) / 24;
   var weekday = (d.getDay() + hour) / 7;
   var date = (d.getDate() - 1 + hour) / days();
   var month = (d.getMonth() + date) / 12;

   return [
       { value: second,  index: .7},
       { value: minute,  index: .6},
       { value: hour,    index: .5},
       { value: weekday, index: .3},
       { value: date,    index: .2},
       { value: month,   index: .1},
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
          rad: ((window.innerWidth < window.innerHeight? window.innerWidth/2 : window.innerHeight/2) - 20) * el.index,
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
