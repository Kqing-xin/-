let canvas = document.querySelector('#container')
let canvasW = canvas.width = window.innerWidth
let canvasH = canvas.height = window.innerHeight + 600
let geoCenterX = 0, geoCenterY = 0  // 地图区域的经纬度中心点
let scale = 23  // 地图缩放系数
let geoData = []
let movieData = []
let offsetX = 0, offsetY = 0    // 鼠标事件的位置信息
let eventType = ''  // 事件类型
let ctx = canvas.getContext('2d')
let color = '#0b1c2d'

function drawTitle(text, color, x, y) {
    ctx.fillStyle = color;
    ctx.font = "bold 36px 楷体";
    ctx.fillText(text, x, y)
}


//绘制矩形
function drawRec(text, color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 120, 50);
    ctx.font = "38px serif";
    ctx.fillText(text, x, y)
}


//获取电影票房数据
function getMovieData() {
    let url = './movie.json'/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
    let request = new XMLHttpRequest()
    request.open('get', url)/*设置请求方法与路径*/
    request.send()/*不发送数据到服务器*/
    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            movieData = JSON.parse(request.responseText)
        }
    }
}


// 地图绘制入口方法
function init() {
    getMovieData()
    let request = new XMLHttpRequest()
    request.open('get', 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    request.send()
    request.onload = function () {
        if (request.status === 200) {
            geoData = JSON.parse(request.responseText)
            getBoxArea()
            drawMap()
        }
    }
}

// 绘制地图，清空画布、绘制地图各子区域、标注城市名称、填充颜色、绘制热力图标尺
function drawMap() {
    ctx.clearRect(0, 0, canvasW, canvasH)
    // 画布背景
    ctx.fillStyle = '#101129'
    ctx.fillRect(0, 0, canvasW, canvasH)
    drawArea()
    drawText()
    drawTitle('2019年与2020年全国各省份票房差统计地图(单位：亿元)', '#fff', 10, 70)
    drawRec('0-5', '#aed0ee', 100, canvasH - 200)
    drawRec('5-10', '#8aabcc', 200, canvasH - 200)
    drawRec('10-15', '#6e9bc5', 300, canvasH - 200)
    drawRec('15-20', '#5e93b9', 400, canvasH - 200)
    drawRec('20-30', '#5491b9', 500, canvasH - 200)
}

// 绘制地图各子区域
function drawArea() {
    let dataArr = geoData.features
    let movieArr = movieData
    for (let i = 0; i < dataArr.length; i++) {
        let centerX = canvasW / 2
        let centerY = canvasH / 2
        dataArr[i].geometry.coordinates.forEach(area => {
            ctx.save()
            ctx.beginPath()
            ctx.translate(centerX, centerY)
            area[0].forEach((elem, index) => {
                let position = toScreenPosition(elem[0], elem[1])
                if (index === 0) {
                    ctx.moveTo(position.x, position.y)
                } else {
                    ctx.lineTo(position.x, position.y)
                }
            })
            ctx.closePath()
            ctx.strokeStyle = '#0c6886'
            //'#00cccc'
            ctx.lineWidth = 1
            // #66A9D7 #4394C2 #A1CAE0 #0b1c2d
            for (var j = 0; j < movieData.length; j++) {
                if (movieData[j].name == dataArr[i].properties.name) {
                    let movieDiff = movieData[j].movieDiff
                    getColor(movieDiff)
                }
            }
            // console.log('movieArr: ' + movieData[i].name)

            ctx.fillStyle = color
            // }
            ctx.fill()
            ctx.stroke()
            ctx.restore()
        });
    }
}

// 标注地图上的城市名称
function drawText() {
    let centerX = canvasW / 2
    let centerY = canvasH / 2
    geoData.features.forEach(item => {
        ctx.save()
        ctx.beginPath()
        ctx.translate(centerX, centerY) // 将画笔移至画布的中心
        ctx.fillStyle = '#2f4f4f'
        ctx.font = 'bold 22px 楷体'
        ctx.textAlign = 'center'
        ctx.textBaseLine = 'center'
        let x = 0, y = 0
        //  因不同的geojson文件中中心点属性信息不同，这里需要做兼容性处理
        if (item.properties.cp) {
            x = item.properties.cp[0]
            y = item.properties.cp[1]
        } else if (item.properties.centroid) {
            x = item.properties.centroid[0]
            y = item.properties.centroid[1]
        } else if (item.properties.center) {
            x = item.properties.center[0]
            y = item.properties.center[1]
        }
        let position = toScreenPosition(x, y)
        //添加地名:遍历features获取item.properties.name
        ctx.fillText(item.properties.name, position.x, position.y);
        ctx.restore()
    })
}

// 将经纬度坐标转换为屏幕坐标
function toScreenPosition(horizontal, vertical) {
    return {
        x: (horizontal - geoCenterX) * scale,
        y: (geoCenterY - vertical) * scale
    }
}

// 获取包围盒范围，计算包围盒中心经纬度坐标，计算地图缩放系数
function getBoxArea() {
    let N = -90, S = 90, W = 180, E = -180
    geoData.features.forEach(item => {
        // 将MultiPolygon和Polygon格式的地图处理成统一数据格式
        if (item.geometry.type === 'Polygon') {
            item.geometry.coordinates = [item.geometry.coordinates]
        }
        // 取四个方向的极值
        item.geometry.coordinates.forEach(area => {
            let areaN = - 90, areaS = 90, areaW = 180, areaE = -180
            area[0].forEach(elem => {
                if (elem[0] < W) {
                    W = elem[0]
                }
                if (elem[0] > E) {
                    E = elem[0]
                }
                if (elem[1] > N) {
                    N = elem[1]
                }
                if (elem[1] < S) {
                    S = elem[1]
                }
            })
        })
    })
    // 计算包围盒的宽高
    let width = Math.abs(E - W)
    let height = Math.abs(N - S)
    let wScale = canvasW / width
    let hScale = canvasH / height
    // 计算地图缩放系数
    //scale = wScale > hScale ? hScale : wScale
    // 获取包围盒中心经纬度坐标
    geoCenterX = (E + W) / 2
    geoCenterY = (N + S) / 2
}

function getColor(movieDiff) {
    if (movieDiff < 5.00) {
        color = '#aed0ee'
    } else if (movieDiff >= 5.00 & movieDiff < 10.00) {
        color = '#8aabcc'
    } else if (movieDiff >= 10.00 & movieDiff < 15.00) {
        color = '#6e9bc5'
    } else if (movieDiff >= 15.00 & movieDiff < 20.00) {
        color = '#5e93b9'
    } else if (movieDiff >= 20.00) {
        color = '#5491b9'
    }
}

export {
    drawRec,
    getMovieData,
    init,
    drawMap,
    drawArea,
    drawText,
    toScreenPosition,
    getColor
}