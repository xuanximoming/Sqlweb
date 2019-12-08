//初始化元素
var selected;
var Globle_json = [];
(function Init() {
    //初始化控件
    var fssj1 = document.getElementById("fssj1");
    var fssj2 = document.getElementById("fssj2");
    fssj1.value = initdate();
    fssj2.value = initdate();

    //查询按钮添加click事件
    document.getElementById("search").addEventListener("click", function () {
        var allobject = document.getElementsByClassName("get");
        var json = [];
        var row = {};
        var tem = {};
        for (var i = 0; i < allobject.length; i++) {

            if (allobject[i].id == "fssj1" || allobject[i].id == "fssj2") {
                if (allobject[i].value.length != 10) {
                    alert("时间格式错误，例如：2019-10-10或2019/10/10");
                    return;
                }
                var date = new Date(allobject[i].value);
                var year, month, day;
                year = date.getYear() + 1900;
                month = date.getMonth() + 1;
                day = date.getDate();
                tem[allobject[i].id] = year.toString() + (month > 9 ? month : '0' + month) + (day > 9 ? day : '0' + day);
                continue;
            }
            row[allobject[i].id] = allobject[i].value;
        }
        row["fssj"] = tem.fssj1 + '-' + tem.fssj2;
        json.push(row);
        PostDate(window.location.origin + "/WebService.asmx/HttpPostSelect", "Jsons=" + JSON.stringify(json), setData);
    }, false);

    //导入按钮添加click事件
    document.getElementById("imp").addEventListener("click", function () {
        document.getElementById('file').click();
        document.getElementsByClassName("waiting")[0].style.display = "block";
        document.getElementsByClassName('contents')[0].innerHTML = "Please wait while the data is Importing……";
    }, false);

    //下载模板按钮click事件
    document.getElementById("impdemo").addEventListener("click", function () {
        window.open(window.location.origin + "/template/失效案例库导入模板.xlsx", "_blank");
    }, false);
    //删除按钮事件初始化
    document.getElementById("del").addEventListener("click", function () {
        if (typeof (selected) == "undefined" || selected == null)
            return;
        var json = [];
        var row = {};
        if (selected.childNodes[3].innerHTML != GetQueryString("name") && GetQueryString("name") != "管理员") {
            alert("此账号非本条记录人！");
            return;
        }
        row["xh"] = selected.childNodes[0].innerHTML;
        json.push(row);
        PostDate(window.location.origin + "/WebService.asmx/HttpPostDeleteIfon", "Jsons=" + JSON.stringify(json), refesh);
    }, false);

    document.getElementById("Chart").addEventListener("click", function () {
        if (Globle_json.length < 1) {
            alert("请查询数据！");
            return;
        }
        var echarts = document.getElementsByClassName("echarts")[0];
        echarts.style.display = "block";
        DrawEchart(Globle_json);
        document.getElementById("closeechar").addEventListener("click", function () {
            echarts.style.display = "none";
        }, false);
    }, false);
})();

function setData(json) {
    Globle_json = json;
    var tbody = document.getElementsByClassName("tbody")[0];
    tbody.innerHTML = "";
    if (typeof (json[0].id) != "undefined") {
        alert(json[0].mess);
        return;
    }
    //给导出按钮创建事件
    document.getElementById("exp").addEventListener("click", Expdata, false);
    for (var i = 0; i < json.length; i++) {
        var row = json[i];
        var tr = document.createElement("tr");
        tr.addEventListener("dblclick", function (e) {
            dbfind(e);
        }, false);
        tr.addEventListener("click", function (e) {
            Handleclick(e);
        }, false);
        for (var atrr in row) {
            var th = document.createElement("th");
            th.innerHTML = row[atrr];
            th.setAttribute("colmun", atrr);
            tr.appendChild(th);
            th = null;
        }
        tbody.appendChild(tr);
        tr = null;
    }
}

function initdate() {
    var time = new Date();
    var day = ("0" + time.getDate()).slice(-2);
    var month = ("0" + (time.getMonth() + 1)).slice(-2);
    return time.getFullYear() + "-" + (month) + "-" + (day);
}

//导出excel数据
function Expdata() {
    //表头数据
    document.getElementsByClassName("waiting")[0].style.display = "block";
    document.getElementsByClassName('contents')[0].innerHTML = "Please wait while the data is Exporting……";
    var ths = document.getElementsByClassName("mythead")[0].children[0].children;
    Jsoncap = [];
    for (var i = 0; i < ths.length; i++) {
        row = {};
        var th = ths[i];
        row["name"] = th.innerHTML;
        Jsoncap.push(row);
    }
    //表内容部分数据
    var trs = document.getElementsByTagName("tbody")[0].children;
    var json = [];
    for (var i = 0; i < trs.length; i++) {
        var row = {};
        ths = trs[i].children;
        for (var j = 0; j < ths.length; j++) {
            var th = ths[j];
            row[th.getAttribute("colmun")] = th.innerHTML;
        }
        json.push(row);
    }
    PostDate(window.location.origin + "/WebService.asmx/HttpPostexpExcle", "Jsoncap=" + JSON.stringify(Jsoncap) + "&Jsons=" + JSON.stringify(json), dowloadexcel)
}

function dowloadexcel(json) {
    if (json[0].id != "0") {
        alert(json[0].mess);
        return;
    }
    var waiting = document.getElementsByClassName("waiting")[0];
    waiting.style.display = "none";
    window.open(window.location.origin + "/" + json[0].mess, "_blank");
}

function dbfind(e) {
    var dom = e.currentTarget;
    var json = [];
    var row = {};
    row["xh"] = dom.childNodes[0].innerHTML;
    json.push(row);
    PostDate(window.location.origin + "/WebService.asmx/HttpPostSelect", "Jsons=" + JSON.stringify(json), setiframe);
}

function Handleclick(e) {
    if (typeof (selected) != "undefined" && selected != null)
        selected.classList.remove("selected");
    selected = e.currentTarget;
    selected.classList.add("selected");
}

function setiframe(json) {
    var FormObj = document.getElementById("update").contentWindow;
    var allobject = FormObj.document.getElementsByClassName("get");
    var save = FormObj.document.getElementById("save");
    save.value = "修改";
    FormObj.document.getElementById("new").disabled = true;
    var update = document.getElementsByClassName("update")[0];
    update.style.display = "block";
    document.getElementById("close").addEventListener("click", function () {
        update.style.display = "none";
    }, false);
    var row = json[0];
    save.name = row["xh"];
    var name = GetQueryString("name");
    for (var i = 0; i < allobject.length; i++) {
        allobject[i].disabled = false;
        if (name != row["jlr"] && name != '管理员') {
            save.disabled = true;
            allobject[i].disabled = true;
        }
        if (allobject[i].id == "fssj") {
            var date = row[allobject[i].id].toString();
            var year = date.substr(0, 4);
            var month = date.substr(4, 2);
            var day = date.substr(6, 2);
            allobject[i].value = year + "-" + month + "-" + day;
            continue;
        }
        allobject[i].value = row[allobject[i].id];

    }
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

(function () {
    var file = document.getElementById('file');
    if (!file.addEventListener) return;

    function handleFile(e) {
        var files = e.target.files;
        if (files.length == 0) return;
        do_file(files, function (json) {
            PostDate(window.location.origin + "/WebService.asmx/HttpPostImpExcel", "Jsons=" + JSON.stringify(json), prompted);
        });
    }
    file.addEventListener('change', handleFile, false);
})();

function refesh(json) {
    if (json[0].id != "0") {
        alert(json[0].mess);
        return;
    }
    selected = null;
    document.getElementById("search").click();
}