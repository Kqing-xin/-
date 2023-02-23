function initPieChart(_targetId,_dataSet,_dataSum) {
    let canvas=document.querySelector(_targetId);
    let context=canvas.getContext("2d");
    let canvasHeight=canvas.height,
        canvasWidth=canvas.width;
    let sum=_dataSet.reduce(function (pre,cur){
        return pre+cur.value;
    },0);
    let trans_dataSet=_dataSet.map(item=>{
        return {
            value: item.value/sum,
            name: item.name,
        }
    });
    console.log(trans_dataSet)
    
    drawInfo(_dataSum);
    function drawInfo(_dataSum){
    context.beginPath();
    for(let i=0;i<_dataSum.length;i++){
        context.beginPath();
       //画小矩形  
       context.fillStyle=_dataSum[i].color;
       context.fillRect(canvasWidth-250,60*(i+1)+80,30,20);
       //画文字
       context.font="20px Georgia";
       context.textAlign="right";
       context.fillText(_dataSum[i].name,canvasWidth-250+150,60*(i+1)+96);
       context.font = "30px Arial";
       context.fillText(_dataSum[i].value,canvasWidth-250+150,60*(i+1)+130);
       }
    } 
     //绘制饼图 
    drawPieChart(trans_dataSet,sum,canvasWidth,canvasHeight); 
    function drawPieChart(_dataSet,_sum,_canvasWidth,_canvasHeight){
        let pieCenter={
            x:_canvasWidth/3,
            y:_canvasHeight/2
        };
        let pieRadius=0.5*Math.min(_canvasHeight,_canvasWidth)*0.45;
        let beginAngle=-Math.PI/2;
        let curAngle=-Math.PI/2;
        //颜色
        let randomColorTable=(function (_length,_alpha=1){
            let colorTable=new Array(_length).fill("#000");
              return colorTable.map(item=>`rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},${_alpha})`);
        })(_dataSet.length,0.8);
        for (let i=0;i<_dataSet.length;i++){
            let roseRadians=pieRadius+Math.random()*50;
            let endAngle=curAngle+_dataSet[i]['value']*360*Math.PI/180;
            //1-绘制圆弧 
            context.beginPath();
            context.moveTo(pieCenter.x,pieCenter.y);
            context.arc(pieCenter.x,pieCenter.y,roseRadians,curAngle,endAngle,false);
            context.fillStyle=randomColorTable[i%randomColorTable.length];
            context.fill();
            context.beginPath();
            context.arc(pieCenter.x,pieCenter.y,40,0,Math.PI*2,false);
            context.fillStyle='#101129';
            context.fill();  
            context.lineWidth=20;
            context.closePath();
            //文字标签
            let splitAngle = curAngle + _dataSet[i]['value']*360*Math.PI/180*0.5;
            let textParams = {
              splitAngle : splitAngle,
              offset : 30,
              label: `${_dataSet[i]['name']}:${(_dataSet[i]['value']*100).toFixed(2)}%`,
            };
            let textArray = textParams.label.split(":");
            //文字位置
            let textPosition={
                x: pieCenter.x+Math.cos(textParams.splitAngle)*(roseRadians+textParams.offset),
                y: pieCenter.y+Math.sin(textParams.splitAngle)*(roseRadians+textParams.offset),
            };
            context.beginPath();
            console.log()
            context.stroke();
            //换行
            textArray.some((item,index)=>{
                context.textAlign="center";
                context.fillStyle = randomColorTable[i%randomColorTable.length];
                context.font="18px Arial";
                context.fillText(item,textPosition.x,textPosition.y+index*20);
            });
            context.closePath();
            curAngle=endAngle;
        }
    }
}


function sBarChart(canvas, data, options) {
	this.canvas = document.getElementById(canvas);
	this.ctx = this.canvas.getContext('2d');
	this.data = data; // 存放图表数据
	this.dataLength = this.data.length; // 图表数据的长度
	this.width = this.canvas.width; // canvas 宽度
	this.height = this.canvas.height; // canvas 高度
	this.padding = 50; // canvas 内边距
	this.yEqual = 5; // y轴分成5等分
	this.yLength = 0; // y轴坐标点之间的真实长度
	this.xLength = 0; // x轴坐标点之间的真实长度
	this.yFictitious = 0; // y轴坐标点之间显示的间距
	this.yRatio = 0; // y轴坐标真实长度和坐标间距的比
	this.bgColor = '#fff'; // 默认背景颜色
	this.fillColor = '#dff'; // 默认填充颜色
	this.axisColor = '#ddd'; // 坐标轴颜色
	this.contentColor = '#ddd'; // 内容横线颜色
	this.titleColor = '#fff'; // 图表标题颜色
	this.title = ''; // 图表标题
	this.titlePosition = 'top'; // 图表标题位置: top / bottom
	this.looped = null; // 是否循环
	this.current = 0; // 当前加载柱状图高度的百分数
	this.currentIndex = -1;
	this.onceMove = -1;
	this.init(options);
}
sBarChart.prototype = {

	init: function(options) {
		if (options) {
			for (var i = 0; i < this.data.length - 1; i++) {
				for (var j = 0; j < this.data.length - 1 - i; j++) {
					if (this.data[j].value < this.data[j + 1].value) {
						var temp = this.data[j].value;
						this.data[j].value = this.data[j + 1].value;
						this.data[j + 1].value = temp;
					}
				}
			}
			this.padding = options.padding || 50;
			this.yEqual = options.yEqual || 5;
			this.bgColor = options.bgColor || '#fff';
			this.fillColor = options.fillColor || '#1E9FFF';
			this.axisColor = options.axisColor || '#666666';
			this.contentColor = options.contentColor || '#eeeeee';
			this.titleColor = options.titleColor || '#000000';
			this.title = options.title;
			this.titlePosition = options.titlePosition || 'top';
		}
		this.yLength = Math.floor((this.height - this.padding * 1.8 - 10) / this.yEqual);
		this.xLength = Math.floor((this.width - this.padding * 1.5 - 10) / this.dataLength);
		this.yFictitious = this.getYFictitious(this.data);
		this.yRatio = this.yLength / this.yFictitious;
		this.looping();
	},

	looping: function() {
		this.looped = requestAnimationFrame(this.looping.bind(this));
		if (this.current < 100) {
			this.current = (this.current + 3) > 100 ? 100 : (this.current + 3);
			this.drawAnimation();
		} else {
			window.cancelAnimationFrame(this.looped);
			this.looped = null;
			this.watchHover();
		}
	},
	drawAnimation: function() {
		for (var i = 0; i < this.dataLength; i++) {
			var x = Math.ceil(this.data[i].value * this.current / 100 * this.yRatio);
			var y = this.height - this.padding - x;

			this.data[i].left = this.padding + this.xLength * (i + 0.25);
			this.data[i].top = y;
			this.data[i].right = this.padding + this.xLength * (i + 0.75);
			this.data[i].bottom = this.height - this.padding;
			this.drawUpdate();
		}
	},
	drawUpdate: function() {
		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.drawAxis();
		this.drawPoint();
		this.drawTitle();
		this.drawChart();
	},
	drawChart: function() {
		this.ctx.fillStyle = this.fillColor;
		for (var i = 0; i < this.dataLength; i++) {
			this.ctx.fillRect(
				this.data[i].left,
				this.data[i].top,
				this.data[i].right - this.data[i].left,
				this.data[i].bottom - this.data[i].top
			);
			// this.ctx.font = '12px Arial'
			// this.ctx.fillText(
			//     this.data[i].value ,
			//     this.data[i].left + this.xLength / 4, 
			//     this.data[i].top - 5
			// );
		}
	},
	drawAxis: function() {
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.axisColor;
		this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5);
		this.ctx.lineTo(this.padding + 0.5, this.padding + 0.5);
		// x轴线
		this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5);
		this.ctx.lineTo(this.width - this.padding / 2 + 0.5, this.height - this.padding + 0.5);
		this.ctx.stroke();
	},
	drawPoint: function() {
		// x轴坐标点
		this.ctx.beginPath();
		this.ctx.font = '12px Microsoft YaHei';
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = this.axisColor;
		for (var i = 0; i < this.dataLength; i++) {
			var xAxis = this.data[i].xAxis;
			var xlen = this.xLength * (i + 1);
			this.ctx.moveTo(this.padding + xlen + 0.5, this.height - this.padding + 0.5);
			this.ctx.fillText(xAxis, this.padding + xlen - this.xLength / 2, this.height - this.padding + 15);
		}
		this.ctx.stroke();

		// y轴坐标点
		this.ctx.beginPath();
		this.ctx.font = '12px Microsoft YaHei';
		this.ctx.textAlign = 'right';
		this.ctx.fillStyle = this.axisColor;
		this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5);
		this.ctx.lineTo(this.padding - 4.5, this.height - this.padding + 0.5);
		this.ctx.fillText(0, this.padding - 10, this.height - this.padding + 5);
		for (var i = 0; i < this.yEqual; i++) {
			var y = this.yFictitious * (i + 1);
			var ylen = this.yLength * (i + 1);
			this.ctx.fillText(y, this.padding - 10, this.height - this.padding - ylen + 5);
			this.ctx.beginPath();
			this.ctx.strokeStyle = this.contentColor;
			this.ctx.moveTo(this.padding + 0.5, this.height - this.padding - ylen + 0.5)
			this.ctx.lineTo(this.width - this.padding / 2 + 0.5, this.height - this.padding - ylen + 0.5);
			this.ctx.stroke();
		}
	},
	drawTitle: function() {
		if (this.title) {
			this.ctx.beginPath();
			this.ctx.textAlign = 'center';
			this.ctx.fillStyle = this.titleColor;
			this.ctx.font = '16px Microsoft YaHei';
			if (this.titlePosition === 'bottom' && this.padding >= 40) {
				this.ctx.fillText(this.title, this.width / 2, this.height - 5)
			} else {
				this.ctx.fillText(this.title, this.width / 2, this.padding / 2)
			}
		}
	},
	/**
	 * 监听鼠标移动事件
	 */
	watchHover: function() {
		var self = this;
		self.canvas.addEventListener('mousemove', function(ev) {
			ev = ev || window.event;
			self.currentIndex = -1;
			for (var i = 0; i < self.data.length; i++) {
				if (ev.offsetX > self.data[i].left &&
					ev.offsetX < self.data[i].right &&
					ev.offsetY > self.data[i].top &&
					ev.offsetY < self.data[i].bottom) {
					self.currentIndex = i;
					console.log('第' + i + '条');


				}
			}
			self.drawHover();
		})
	},
	drawHover: function() {
		if (this.currentIndex != -1) {
			if (this.onceMove == -1) {
				this.onceMove = this.currentIndex;
				this.canvas.style.cursor = 'pointer';

			}
		} else {
			if (this.onceMove != -1) {
				this.onceMove = -1;
				this.canvas.style.cursor = 'inherit';
			}
		}
	},
	//y轴坐标点之间显示的间距
	getYFictitious: function(data) {
		var arr = data.slice(0);
		arr.sort(function(a, b) {
			return -(a.value - b.value);
		});
		var len = Math.ceil(arr[0].value / this.yEqual);
		var pow = len.toString().length - 1;
		pow = pow > 2 ? 2 : pow;
		return Math.ceil(len / Math.pow(20, pow)) * Math.pow(20, pow);
	}
};

var data = [{
		xAxis: '冀',
		value: 4141
	},
	{
		xAxis: '晋',
		value: 1499
	},
	{
		xAxis: '黑',
		value: 3260
	},
	{
		xAxis: '吉',
		value: 1170
	},
	{
		xAxis: '辽',
		value: 970
	},
	{
		xAxis: '浙',
		value: 2350
	},
	{
		xAxis: '皖',
		value: 1499
	},
	{
		xAxis: '闽',
		value: 3260
	},
	{
		xAxis: '赣',
		value: 1170
	},
	{
		xAxis: '鲁',
		value: 970
	},
	{
		xAxis: '鄂',
		value: 2350
	},
	{
		xAxis: '湘',
		value: 1499
	},
	{
		xAxis: '粤',
		value: 3260
	},
	{
		xAxis: '琼',
		value: 1170
	},
	{
		xAxis: '川',
		value: 970
	},
	{
		xAxis: '滇',
		value: 2350
	},
	{
		xAxis: '陕',
		value: 970
	},
	{
		xAxis: '甘',
		value: 2350
	},
	{
		xAxis: '青',
		value: 1499
	},
	{
		xAxis: '台',
		value: 3260
	},
	{
		xAxis: '贵',
		value: 1170
	},
	{
		xAxis: '藏',
		value: 970
	},
	{
		xAxis: '豫',
		value: 2350
	}
];

var dataSet=[
			{value:35,name:"黑龙江"},
			{value:13,name:"吉林"},
			{value:6,name:"辽宁"},
			{value:26,name:"江苏"},
			{value:18,name:"浙江"},
			{value:11,name:"安徽"},
			{value:8,name:"山东"},
			{value:32,name:"河南"},
			{value: 6,name:"湖北"},
			{value:13,name:"湖南"},
			{value:23,name:"广东"},
			{value:19,name:"四川"},
			{value:23,name:"台湾"}
		];
			var dataSum=[
			{
				value: 227,
				name:"总数",
				color:"red"
			},
			{
				value:13,
				name:"新增",
				color:"#FFA07A"
			},
			{
				value: 4,
				name:"重点区域",
				color:"red"
			},
			{
				value: 19,
				name:"常态区域",
				color:"green"
			}
        ];
		
		initPieChart("canvas",dataSet,dataSum);
				var chart = new sBarChart('canvas',data,{
					title:'总人数：85769',
					bgColor:'#101129',
					titleColor:' #ADD8E6',//标题颜色
					titlePosition:'top',//标题位置
					fillColor:'rgb(0,191,255)',// 柱状填充色
					axisColor:'#87CEFA',//坐标轴颜色
					contentColor:'rgb(0,110,100)'//内容横线颜色
				});
				initPieChart("cns",dataSet,dataSum); 
				
				