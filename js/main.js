~function(document, window)   {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  var w, h, full, quarter, darkGray = "#333",
  createCanvas = function() {
    var canvas = document.getElementById('polar-clock') ?
                 document.getElementById('polar-clock') :
                 document.createElement('canvas'),
        cxt;
    if(cxt = canvas.getContext('2d')) {
      cxt.canvas.width = w = window.innerWidth;
      cxt.canvas.height = h = window.innerHeight;
      canvas.setAttribute('id', 'polar-clock');
      document.body.appendChild(canvas);
    }
    return cxt || !!cxt;
  },

  getClockDimensions = function(scale){
    return Math.min(1024/2, (Math.min(w, h)/2)) * scale;
  },

  createCircle = function(cxt, radius, perc) {
    var x = w/2,
        y = h/2,
        counterClockwise =  false,
        color = generateColor(perc);
        full = Math.PI * 2,
        quarter = Math.PI / 2;

    cxt.lineWidth = 0.08 * getClockDimensions(0.8);
    cxt.beginPath();
    cxt.shadowColor = color;
    cxt.strokeStyle = color;
    cxt.arc(x, y, radius, -(quarter), ((full) * perc) - quarter, counterClockwise);
    cxt.stroke();
    cxt.closePath();
  },


  createParams = function() {
   var d = new Date(), secondText, minuteText, hourText, weekdayText, dateText, monthText,
      second = ((secondText = d.getSeconds()) + d.getMilliseconds()/1000)/ 60 ,
      minute = ((minuteText = d.getMinutes()) + second) / 60,
      hour = ((hourText = d.getHours()) + minute) / 24,
      weekday = ((weekdayText = d.getDay()) + hour)/ 7,
      date = ((dateText = d.getDate()) + hour) / daysInMonth(d.getMonth() - 1, d.getFullYear()),
      month = ((monthText = d.getMonth()) + date)/ 12;

    function daysInMonth(m, y) {
        return (m == 2) ? (!((y % 4) || (!(y % 100) && (y % 400))) ? 29 : 28) : (m >> 3 ^ m) & 1 ? 31 : 30;
    }

   return [
       { value: second,  factor: 0.8, text: secondText},
       { value: minute,  factor: 0.7, text: minuteText},
       { value: hour,    factor: 0.6, text: hourText},
       { value: weekday, factor: 0.5, text: weekdayText},
       { value: date,    factor: 0.4, text: dateText},
       { value: month,   factor: 0.3, text: monthText},
     ];
  },

  generateColor = function(value) {
    return "hsl(" + (360 * (value)) + ", 40%, 50% )";
  },

  printTimeComponent = function(cxt, param, radius){
    var formattedTime,
        weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    cxt.font = 0.06 * getClockDimensions(0.8) +"px Helvetica";
    cxt.fillStyle = "#FFF";

      switch(param.factor) {
      case 0.8:
        formattedTime = param.text + " s";
        break;
      case 0.7:
        formattedTime = param.text + " m";
        break;
      case 0.6:
        formattedTime = param.text + " h";
        break;
      case 0.5:
        formattedTime = weekdays[param.text];
        break;
      case 0.4:
        suffix = param.text > 3 && param.text < 21 ? "th" :
                 param.text % 10 == 1 ? "st" :
                 param.text % 10 == 2 ? "nd" :
                 param.text % 10 == 3 ? "rd" : "th";
        formattedTime = param.text + suffix;
        break;
      case 0.3:
        formattedTime = months[param.text];
        break;
      default:
        formattedTime = "";
    }
    cxt.fillText(formattedTime, w/2, h/2 - radius * 0.95);
  }

  animate = function(cxt) {
    var radius;
    cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
    cxt.arc(w/2, h/2, getClockDimensions(0.65), -quarter, full - quarter);
    cxt.fillStyle = darkGray;
    cxt.fill();
    createParams().forEach(function(param, i, arr) {
      radius = getClockDimensions(0.8) * param.factor - 20;
      createCircle(cxt, radius, param.value);
      printTimeComponent(cxt, param, radius);
    });
    requestAnimationFrame(function(){
      animate(cxt);
    });
  };

  window.onload = window.onresize = function() {
    if(cxt = createCanvas()){
      animate(cxt);
    } else {
      document.write("This is an experiment that depends on canvas, which is not supported by your browser. Please try using a modern browser.")
    }
  }

}(document, window);
