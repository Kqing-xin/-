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
       context.textAlign="center";
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
            let roseRadians=pieRadius+Math.random()*50+80;
            let endAngle=curAngle+_dataSet[i]['value']*360*Math.PI/180;
            //1-绘制圆弧 
            context.beginPath();
            context.moveTo(pieCenter.x,pieCenter.y);
            context.arc(pieCenter.x,pieCenter.y,roseRadians,curAngle,endAngle,false);
            context.fillStyle=randomColorTable[i%randomColorTable.length];
            context.fill();
            context.beginPath();
            context.arc(pieCenter.x,pieCenter.y,80,0,Math.PI*2,false);
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
                x: pieCenter.x+Math.cos(textParams.splitAngle)*(roseRadians+textParams.offset+20),
                y: pieCenter.y+Math.sin(textParams.splitAngle)*(roseRadians+textParams.offset+20),
            };
            context.beginPath();
            console.log()
            context.stroke();
            //换行
            textArray.some((item,index)=>{
                context.textAlign="center";
                context.fillStyle = randomColorTable[i%randomColorTable.length];
                context.font="22px Arial";
                context.fillText(item,textPosition.x,textPosition.y+index*20);
            });
            context.closePath();
            curAngle=endAngle;
        }
    }
}