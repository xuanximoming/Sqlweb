var X = XLSX;
var XW = {
    /* worker message */
    msg: 'xlsx',
    /* worker scripts */
    worker: './xlsxworker.js'
};
//ajx 发送数据
function PostDate(url, para, fun) {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHttp');
    }
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(para);

    xhr.onreadystatechange = function () { //请求后的回调接口，可将请求成功后要执行的程序写在其中
        if (xhr.readyState == 4 && xhr.status == 200) { //验证请求是否发送成功
            var xmlDoc = null; //获取到服务端返回的数据

            if (window.XMLHttpRequest) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
            } else {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(xhr.responseText);
            }
            if (xmlDoc.childNodes[0].textContent != "" && xmlDoc.childNodes[0].textContent != null) {
                fun(JSON.parse(xmlDoc.childNodes[0].textContent));
            } else {
                alert("未知错误！");
            }
        }
    };
}

var do_file = (function () {
    var rABS = typeof FileReader !== "undefined" && (FileReader.prototype || {}).readAsBinaryString;

    return function do_file(files, callback) {
        var f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            if (!rABS) data = new Uint8Array(data);
            process_wb(X.read(data, {
                type: rABS ? 'binary' : 'array'
            }), callback);
        };
        if (rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
    };
})();

var process_wb = (function () {
    var to_csv = function to_csv(workbook) {
        var sheetNames = workbook.SheetNames; // 工作表名称集合
        var worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
        var csv = X.utils.sheet_to_csv(worksheet);
        return csv;
    };

    return function process_wb(wb, callback) {
        callback(csv2json(to_csv(wb)));
    };
})();

// 将csv转换成表格
function csv2json(csv) {
    var mycsv = csv.replace(/\r\n/g,'    ');
    var mycsv = mycsv.replace(/\"/g,'');
    var rows = mycsv.split('\n');
    rows.pop(); // 最后一行没用的
    var json = [];
    rows.forEach(function (row, idx) {

        var columns = row.split(',');
        if (idx > 1) {
            var JsonRow = {};
            var i = 0;
            columns.forEach(function (column) {
                JsonRow[i++] = column;
            });
            json.push(JsonRow);
        }
    });
    console.log(json);
    return json;
}

function prompted(json) {
    var row = json[0];
    if (row.id == "0") {
        alert(row.mess);
    } else {
        alert(row.mess);
    }
    document.getElementsByClassName("waiting")[0].style.display = "none";
}


var optionpie = {
    tooltip: {
        //鼠标放上是否显示内容
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        //靠右侧位置
        right: '0',
        //垂直方向位置
        y: 'middle',
        //右侧标识颜色
        textStyle: {
            color: "#000"
        },
        data: [],
        formatter: function (name,series) {
            var oa = series[0].data;
            var num = 0;
            for (var i = 0; i < oa.length; i++) {
                num += oa[i].value;
                if (name == oa[i].name) {
                    return name + ' ' + oa[i].value;
                }
            }
        }
    },
    series: [{
        name: '占比',
        type: 'pie',
        radius: '70%',
        center: ['35%', '50%'],
        data: [{}],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        },
        itemStyle: {
            normal: {
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '  {b}'
                }
            },
            labelLine: {
                show: true
            }
        }
    }]
};


// 指定图表的配置项和数据
var optionbar = {
    color: ['#3398DB'],
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}"
    },
    legend: {
        data: ['数量']
    },
    xAxis: {
        name: '',
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子", "帽子", "手套"]
    },
    yAxis: {
        name: '数量'
    },
    series: [{
        name: '数量',
        type: 'bar',
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
        data: []
    }]
};

//数组去重
Array.prototype.unique = function () {
    var len = this.length;
    var agrlen = arguments.length;
    //有参数
    if (agrlen > 0) {
        var allarr = [];
        for (var j = 0; j < agrlen; j++) {
            var arr = [],
                temp = {};
            for (var i = 0; i < len; i++) {
                if (!temp[this[i][arguments[j]]]) {
                    temp[this[i][arguments[j]]] = "1";
                    arr.push(this[i][arguments[j]]);
                }
            }
            allarr.push(arr);
        }
        return allarr;
    }
}

Array.prototype.countarr = function () {
    var len = this.length,
        allarr = [];
    var agrlen = arguments.length;
    if (agrlen > 0) {
        for (var j = 0; j < agrlen; j++) {
            var temp = {};
            if (arguments[j] == "sfbh"){
                for (var i = 0; i < len; i++) {
                    if (!temp[this[i][arguments[j]]] && temp[this[i][arguments[j]]] != 0) {
                        temp[this[i][arguments[j]]] = 1;
                        continue;
                    }
                    temp[this[i][arguments[j]]] = parseInt(temp[this[i][arguments[j]]]) + 1;
                }
                allarr.push(temp);
                continue;
            }
            for (var i = 0; i < len; i++) {
                if (!temp[this[i][arguments[j]]] && temp[this[i][arguments[j]]] != 0) {
                    temp[this[i][arguments[j]]] = parseInt(this[i]["fssl"]);
                    continue;
                }
                temp[this[i][arguments[j]]] = parseInt(temp[this[i][arguments[j]]]) + parseInt(this[i]["fssl"]);
            }
            allarr.push(temp);
        }
        return allarr;
    }
}
Array.prototype.GetData = function () {
    var len = this.length,
        arrall = [],
        arrname = [],
        arrvalue = [];
    for (var i = 0; i < len; i++) {
        arrname[i] = this[i]["name"];
        arrvalue[i] = this[i]["value"];
    }
    arrall.push(arrname);
    arrall.push(arrvalue);
    return arrall;
}