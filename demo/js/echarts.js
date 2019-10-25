    function DrawEchart(json) {

        var data = [];
        var count = [];
        count = json.countarr('yyfl', 'wtly', 'zrbm','gzmc');
        data = json.unique('yyfl', 'wtly', 'zrbm','gzmc');
        for (var i = 0; i < 2; i++) {
            var serdata = [];
            optionpie.legend.data = data[i];
            for (var j = 0; j < data[i].length; j++) {
                var temp = {};
                temp["value"] = count[i][data[i][j]];
                temp["name"] = data[i][j];
                serdata.push(temp);
            }
            optionpie.series[0].data = serdata;
            echarts.init(document.getElementById('echarts' + (i + 1))).setOption(optionpie);
        }
        SetEchart(count,2,'main1','责任\n部门',['red']);
        SetEchart(count,3,'main2','故障\n分类',['#3398DB']);
    }

    function SetEchart(count,num,id,name,color) {
        var serdata = [];
        for(var temp in count[num]){
            var count1 ={};
            count1["name"] = temp;
            count1["value"] = count[num][temp];
            serdata.push(count1);
        }

        serdata = serdata.sort(compare("value"));

        // // 基于准备好的dom，初始化echarts实例
        optionbar.xAxis.name = name;
        optionbar.color = color;
        optionbar.xAxis.data = serdata.GetData()[0];
        optionbar.series[0].data = serdata.GetData()[1];
        var myChart = echarts.init(document.getElementById(id));

        // // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(optionbar);
    }
    function compare(property) {
        return function (a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value2 - value1;
        }
      }