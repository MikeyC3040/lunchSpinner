var options = ["Rangoli","Sala Thai","Street Food","Sketch Tacos","Carnival","BBQ","Burgers","Pho Street","Kimchi"];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

document.getElementById("spin").addEventListener("click", spin);
document.body.onkeyup = function(e){
  if(e.keyCode == 32){
      spin();
  }
}

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;
  
  red   = 0;//Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = 80;//Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
}


function drawRouletteWheel() {
  if (canvas.getContext) {
    var outsideRadius = 220;
    var textRadius = 175;
    var insideRadius = 145;

    ctx.clearRect(0,0,500,500);

    ctx.font = 'bold 20px Kanit, Sans Serif';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.fillStyle = "white";
      ctx.lineWidth = 1;
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      words = text.split(' ');
      var height = 0;
      if (words.length > 1){
        height = -5*words.length
      }
      for (var j = 0; j < words.length; j++){
        ctx.fillText(words[j], -ctx.measureText(words[j]).width / 2, height);
        ctx.strokeText(words[j], -ctx.measureText(words[j]).width / 2, height);
        height += 18;
      }
      ctx.restore();
    } 

    //Arrow
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(250 - 8, 250 - (outsideRadius + 10));
    ctx.lineTo(250 + 8, 250 - (outsideRadius + 10));
    ctx.lineTo(250 + 8, 250 - (outsideRadius - 10));
    ctx.lineTo(250 + 14, 250 - (outsideRadius - 10));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 22));
    ctx.lineTo(250 - 14, 250 - (outsideRadius - 10));
    ctx.lineTo(250 - 8, 250 - (outsideRadius - 10));
    ctx.lineTo(250 - 8, 250 - (outsideRadius + 10));
    ctx.fill();
    ctx.stroke();
  }
}

function spin() {
  spinAngleStart = Math.random() * 30 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 6 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 18;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 18);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 40px Kanit, Sans Serif';
  var text = options[index]
  ctx.fillStyle = "white";
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.strokeText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

WebFont.load({
  google: {
    families: ['Kanit:700']
  },
  active: drawRouletteWheel
});