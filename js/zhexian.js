const canvas = document.getElementById('canvas_zhexian');
const ctx = canvas.getContext('2d');

// 数据
const data = [  {x: 0, y: 10},  {x: 10, y: 30},  {x: 20, y: 20},  {x: 30, y: 40},  {x: 40, y: 50},  {x: 50, y: 30},  {x: 60, y: 20},  {x: 70, y: 40},  {x: 80, y: 60},  {x: 90, y: 50}];

// 绘制坐标轴
function drawAxes() {
  // x轴
  ctx.beginPath();
  ctx.moveTo(50, canvas.height - 50);
  ctx.lineTo(canvas.width - 50, canvas.height - 50);
  ctx.stroke();

  // y轴
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(50, canvas.height - 50);
  ctx.stroke();
}

// 绘制数据点
function drawDataPoints() {
  const pointRadius = 3;
  ctx.fillStyle = 'blue';
  data.forEach(point => {
    const x = 50 + point.x;
    const y = canvas.height - 50 - point.y;
    ctx.beginPath();
    ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
    ctx.fill();
  });
}

// 绘制折线
function drawLine() {
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = 50 + point.x;
    const y = canvas.height - 50 - point.y;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
}

// 初始化
function init() {
  drawAxes();
  drawDataPoints();
  drawLine();
}

init();