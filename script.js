var fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', function(event) {
  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function(event) {
    var c = event.target.result;
    if (c === '') {
      alert("Enter something");
    }

    var lines = c.split('\n');
    var test_length = lines[0].length;

    lines.forEach(function(line) {
      if (test_length !== line.length && (line !== '' && line.length !== test_length - 1)) {
        alert("All sequences must have the same length!");
      }
    });

    c = c.replace(/\n/g, ',').replace(/ /g, '').replace(/&emsp;/g, '').replace(/\t/g, '').replace(/	/g, '');

    c = c.replace(/,,/g, ',');

    var tmp = matrix(c);
    logo(tmp[0], tmp[1]);
  };

  reader.readAsText(file);
});

function addExample() {
  var exampleSequence = `GDLGAGKTT
GDLGAGKTT
GPLGAGKTS
GDLGAGKTS
GDLGAGKTT
GDLGAGKTT
GEVGSGKTT
GELGAGKTT
GDLGAGKTI
GNLGAGKTT
GELGAGKTT
GTLGAGKTT
GDLGAGKTT
GDLGAGKTT
GDLGAGKTT
GDLGAGKTT
GDLGAGKTT`;

  document.getElementById("input_seq").value = exampleSequence;
}

function generateLogo() {
  var c = document.getElementById("input_seq").value;
  var lines = c.split('\n');
  var test_length = lines[0].length;

  lines.forEach(function(line) {
    if (test_length !== line.length && (line !== '' && line.length !== test_length - 1)) {
      alert("All sequences must have the same length!");
    }
  });

  c = c.replace(/\n/g, ',').replace(/ /g, '').replace(/&emsp;/g, '').replace(/\t/g, '').replace(/	/g, '');;

  c = c.replace(/,,/g, ',');

  var tmp = matrix(c);
  logo(tmp[0], tmp[1]);
}

function download(format) {
  var canvas = document.getElementById("bio");
  var link = document.createElement('a');
  link.download = "sequence_logo." + format;

  switch (format) {
    case "jpg":
      link.href = canvas.toDataURL("image/jpeg");
      break;
    case "png":
      link.href = canvas.toDataURL("image/png");
      break;
    case "svg":
      var svg = createSVGWithCanvas("bio");
      var svgData = new XMLSerializer().serializeToString(svg);
      var blob = new Blob([svgData], { type: "image/svg+xml" });
      link.href = URL.createObjectURL(blob);
      break;
  }

  link.click();
}

function createSVGWithCanvas(canvasId) {
  var canvas = document.getElementById(canvasId);
  var svgNamespace = "http://www.w3.org/2000/svg";

  var svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("xmlns", svgNamespace);

  svg.setAttribute("width", canvas.width);
  svg.setAttribute("height", canvas.height);

  var svgImage = document.createElementNS(svgNamespace, "image");
  svgImage.setAttributeNS(null, "width", canvas.width);
  svgImage.setAttributeNS(null, "height", canvas.height);

  svgImage.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", canvas.toDataURL("image/png"));

  svg.appendChild(svgImage);

  return svg;
}

var c = '';


document.getElementById("input_seq").innerHTML = c.replace(/,/g, '\n');

var tmp = matrix(c);
logo(tmp[0], tmp[1]);

function clearCanvas() {
    var canvas = document.getElementById("bio");
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
  
    // Clear the canvas
    ctx.clearRect(0, 0, w, h);
  }

function matrix(c) {
  var s = [];
  var m = [];

  m = c.split(',');
  var n = m.length;

  for (var i = 0; i < n; i++) {
    s[i] = [];
    s[i] = m[i].split('');
  }

  var a = [];
  var t = c.replace(/,/g, '').split('');
  var k = t.length;

  for (var i = 0; i <= k; i++) {
    var q = 1;
    for (var j = 0; j <= a.length; j++) {
      if (t[i] === a[j]) { q = 0; }
    }
    if (q === 1) { a.push(t[i]); }
  }

  var p = [];

  for (var h = 0; h < a.length; h++) {
    p[h] = [];
    for (var i = 0; i <= s[0].length; i++) {
      p[h][i] = 0;
      p[h][0] = a[h];
    }
  }

  for (var i = 0; i < s.length; i++) {
    for (var j = 0; j < s[i].length; j++) {

      for (var h = 0; h < a.length; h++) {

        if (s[i][j] === a[h]) { p[h][j + 1]++; }
      }
    }
  }

  var max = 0;
  for (var i = 0; i < p.length; i++) {
    for (var j = 0; j < p[i].length - 1; j++) {

      p[i][j + 1] = p[i][j + 1] / s.length;
      p[i][j + 1] = p[i][j + 1].toFixed(2);

      if (max <= p[i][j + 1]) { max = p[i][j + 1]; }

      p[i][j + 1] += '|' + p[i][0]
    }
  }

  return [p, max];
}

function logo(M, max) {
    var a = [];
    var t = M[0].length;
  
    var canvas = document.getElementById('bio');
    var canvasl = document.getElementById('letter');
    var ctl = canvasl.getContext('2d');
  
    var w = canvas.width;
    var h = canvas.height - 5;
  
    var wl = canvasl.width;
    var hl = canvasl.height;
  
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);
  
      for (var j = 1; j < t; j++) {
        for (var k = 0; k < M.length; k++) {
          a[k] = [];
          a[k][0] = M[k][j].split('|')[0];
          a[k][1] = M[k][j].split('|')[1];
        }
  
        a = iSort(a);
  
        for (var k = 0; k < M.length; k++) {
          M[k][j] = a[k][0] + '|' + a[k][1];
        }
  
        var iw = w / (t - 1);
        var x = (j - 1) * iw;
  
        for (var u = 0; u < a.length; u++) {
          ctl.imageSmoothingQuality = 'high';
          ctl.clearRect(0, 0, wl, hl);
          ctl.font = 'bold 540px Arial';
  
          var cl;
          switch (a[u][1]) {
            case 'G':
              cl = '#FFD700';
              break;
            case 'T':
              cl = '#00FFFF';
              break;
            case 'A':
              cl = '#FF4500';
              break;
            case 'C':
              cl = '#FA8072';
              break;
            default:
              cl = '#7FFF00'; // Default color
              break;
          }
  
          ctl.fillStyle = cl;
  
          var ltr = ctl.measureText(a[u][1]).width;
          ctl.fillText(a[u][1], (wl / 2) - (ltr / 2), hl - 5);
  
          var y = h - (h / max) * a[u][0];
  
          if (u > 0) {
            var ih = h - ((h / max) * a[u - 1][0]) - y;
          }
          if (u == 0) {
            var ih = h - y;
          }
  
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(canvasl, x, y, iw, ih);
        }
      }
    }
  }
  
  

function iSort(a) {
  var n = a.length;
  for (var i = 1; i < n; i++) {
    let n = a[i][0];
    let j = i - 1;

    while ((j > -1) && (n < a[j][0])) {
      a[j + 1][0] = a[j][0];

      var t = a[j + 1][1];
      a[j + 1][1] = a[j][1];
      a[j][1] = t;
      j--;
    }
    a[j + 1][0] = n;
  }
  return a;
}
