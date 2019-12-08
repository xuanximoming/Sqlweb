//option = $.extend(true,{},optionpie);


function DrawEchart(json) {

    var data = [];
    var count = [];
    count = json.countarr('wtly', 'yyfl', 'zrbm', 'gzmc','cpxmc');
    data = json.unique('wtly', 'yyfl', 'zrbm', 'gzmc','cpxmc');

    SetEchartPie(data,count,0,'echarts1');
    SetEchartPie(data,count,1,'echarts2');
    SetEchartBar(count, 2, 'main1', '责任\n部门', ['#C23531']);
    SetEchartBar(count, 3, 'main2', '故障\n分类', ['#3398DB']);
    SetEchartBar(count, 4, 'main3', '产品\n线名', ['#91C7AE']);
}

function SetEchartPie(data,count,num,id){
        var serdata = [];
        var option = {};
        option = $.extend(true,{},optionpie);
        option.legend.data = data[num];
        for (var j = 0; j < data[num].length; j++) {
            var temp = {};
            temp["value"] = count[num][data[num][j]];
            temp["name"] = data[num][j];
            serdata.push(temp);
        }
        option.series[0].data = serdata;
        echarts.init(document.getElementById(id)).setOption(option)
}


function SetEchartBar(count, num, id, name, color) {
    var serdata = [];
    var option = optionbar;
    for (var temp in count[num]) {
        var count1 = {};
        count1["name"] = temp;
        count1["value"] = count[num][temp];
        serdata.push(count1);
    }

    serdata = serdata.sort(compare("value"));

    // // 基于准备好的dom，初始化echarts实例
    option.xAxis.name = name;
    option.color = color;
    option.xAxis.data = serdata.GetData()[0];
    option.series[0].data = serdata.GetData()[1];
    var myChart = echarts.init(document.getElementById(id));

    // // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}


function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}