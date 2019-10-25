var newinput = document.getElementById("new");
var saveinput = document.getElementById("save");

newinput.addEventListener("click", function () {
    var allobject = document.getElementsByClassName("get");
    for (var i = 0; i < allobject.length; i++) {
        if (allobject[i].id == "jlr") {
            allobject[i].value = GetQueryString("name");
        }

        if (allobject[i].id == "fssj") {
            var time = new Date();
            var day = ("0" + time.getDate()).slice(-2);
            var month = ("0" + (time.getMonth() + 1)).slice(-2);
            var today = time.getFullYear() + "-" + (month) + "-" + (day);
            allobject[i].value = today;
        }
        allobject[i].disabled = false;
    }

}, false);

saveinput.addEventListener("click", function (e) {
    var allobject = document.getElementsByClassName("get");
    var json = [];
    var row = {};
    row["xh"] = e.currentTarget.name;

    for (var i = 0; i < allobject.length; i++) {

        if (allobject[i].id == "fssj") {
            if (allobject[i].value.length != 10) {
                alert("时间格式错误，例如：2019-10-10或2019/10/10");
                return;
            }
            var date = new Date(allobject[i].value);
            var year, month, day;
            year = date.getYear() + 1900;
            month = date.getMonth() + 1;
            day = date.getDate();
            row[allobject[i].id] = year.toString() + (month > 9 ? month : '0' + month) + (day > 9 ? day : '0' + day);
            continue;
        }
        if (allobject[i].id == "fssl") {
          if(!isRealNum(allobject[i].value)) {
              alert("数量不是数字格式！");
              return;
          }
        }
        row[allobject[i].id] = allobject[i].value;
    }
    json.push(row);
    PostDate(json);
}, false);



function PostDate(json) {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHttp');
    }
    xhr.open('POST', window.location.origin + "/WebService.asmx/HttpPostInsert", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("Jsons=" + JSON.stringify(json));

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
            if (xmlDoc.childNodes[0].textContent == "true") {
                alert("保存成功！");
            } else {
                alert("保存失败！");
            }
        }
    };
}


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function isRealNum(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if (val === "" || val == null) {
        return false;
    }
    if (!isNaN(val)) {
        return true;
    } else {
        return false;
    }
}