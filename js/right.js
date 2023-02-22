// 经济回复速度
const canvas = document.getElementById('progress');
const ctx = canvas.getContext('2d');

// 绘制底部灰色矩形
ctx.fillStyle = '#0c6886';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// 绘制进度条
ctx.fillStyle = '#00c5df';
const progress = 0.73;
const barWidth = canvas.width * progress;
ctx.fillRect(0, 0, barWidth, canvas.height);

// 绘制进度文字
ctx.fillStyle = '#fff';
ctx.font = '45px Microsoft YaHei';
ctx.textAlign = 'center';
ctx.fillText(`${progress * 100}%`, canvas.width / 2, canvas.height / 2 + 15);



// 各国受疫情影响指数
const canvas2 = document.getElementById("myCanvas");
const ctx2 = canvas2.getContext("2d");

// 绘制背景
// ctx.fillStyle = "#F8F8FF";
ctx2.fillStyle = "#101129";
ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

// 绘制柱状图
const data = [223,185,  172, 172,163,  155,131,];
const colors = ["#bce4d8", "#8cc9cd", "#5eafc0", "#3992b0", "#32759a", "#317097", "#2c5985"];
const categories = [ "英国",'美国', "法国", '印度',"日本", '意大利',"中国"];
const maxData = Math.max(...data);

for (let i = 0; i < data.length; i++) {
	// 绘制柱体
	const barHeight = (data[i] / maxData) * (canvas2.height - 100);
	const barWidth = (canvas2.width - 100) / data.length - 10;
	const x = 50 + i * (barWidth + 10);
	const y = canvas2.height - 50 - barHeight;
	ctx2.fillStyle = colors[i];
	ctx2.fillRect(x, y, barWidth, barHeight);

	// 绘制标签
	ctx2.font = "25px Microsoft YaHei";
	ctx2.fillStyle = "#FFF";
	ctx2.textAlign = "center";
	ctx2.fillText(categories[i], x + barWidth / 2, canvas2.height - 15);

	// 绘制数据
	ctx2.font = "30px Microsoft YaHei";
	ctx2.fillStyle = "#F8F8FF";
	ctx2.textAlign = "center";
	ctx2.fillText(data[i], x + barWidth / 2, y - 10);
}





//疫情治愈&感染
(function () {
    var data = {
        day365: { orders: '124,457', amount: '56555' },
        day90: { orders: '87,071', amount: '85536' },
        day30: { orders: '12725', amount: '10475' },
        day1: { orders: '8452', amount: '8002' }
    }
    //点击事件
    $('.order').on('click', '.filter a', function () {
        //点击之后加类名
        $(this).addClass('active').siblings().removeClass('active');
        // 先获取点击a的 data-key自定义属性
        var key = $(this).attr('data-key');
        //获取自定义属性
        // data{}==>data.shuxing data['shuxing]
        key = data[key];//
        $('.order .item h4:eq(0)').text(key.orders);
        $('.order .item h4:eq(1)').text(key.amount);
    });
    //定时器
    var index = 0;
    var aclick = $('.order a');
    setInterval(function () {
        index++;
        if (index > 3) {
            index = 0;
        }
        //每san秒调用点击事件
        aclick.eq(index).click();
    }, 3000);
})();

