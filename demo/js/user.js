var selected;

function Init() {
    document.getElementById("seacrh").addEventListener("click", function () {
        var json = [];
        var row = {};
        row["name"] = document.getElementById("search-input").value;
        json.push(row);
        PostDate(window.location.origin + "/WebService.asmx/HttpPostSelectUsers", "Jsons=" + JSON.stringify(json), setData);
    }, false);

    document.getElementById("new").addEventListener("click", function () {
        var div = document.getElementsByClassName("reg")[0];
        div.style.display = "block";
        var close = document.getElementsByClassName("close")[0];
        close.addEventListener("click", function () {
            var div = document.getElementsByClassName("reg")[0];
            div.style.display = "none";
        }, false);

        //点击注册界面注册
        var saveuser = document.getElementById("saveuser");
        saveuser.addEventListener("click", Saveuser, false);
    }, false);
    document.getElementById("del").addEventListener("click", function () {
        if (typeof (selected) == "undefined" || selected == null)
            return;
        var json = [];
        var row = {};
        if(selected.childNodes[2].innerHTML == "admin"){
            alert("管理员无法删除！");
            return;
        }
        row["ID"] = selected.childNodes[0].innerHTML;
        json.push(row);
        PostDate(window.location.origin + "/WebService.asmx/HttpPostDeleteUsers", "Jsons=" + JSON.stringify(json), refesh);
    }, false);
    document.getElementById("reset").addEventListener("click", function () {
        if (typeof (selected) == "undefined" || selected == null)
            return;
        var json = [];
        var row = {};
        row["ID"] = selected.childNodes[0].innerHTML;
        row["password"] = "1";
        json.push(row);
        PostDate(window.location.origin + "/WebService.asmx/HttpPostInsertUser", "Jsons=" + JSON.stringify(json), reset);
    }, false);;
}

function Saveuser() {
    var allinput = document.getElementsByClassName("input")[0].getElementsByClassName("allinput");
    var json = [];
    var row = {};
    row["ID"] = "";
    for (var i = 0; i < allinput.length; i++) {
        if (allinput[i].value == "" || allinput[i].value == null) {
            alert("内容不能为空！");
            allinput[i].style.background = "red";
            allinput[i].addEventListener("mouseover",function(e){
                e.currentTarget.style.background = "#FFF";
            },false);
            return;
        }
        row[allinput[i].name] = allinput[i].value;
    }
    row["password"] = "1";
    json.push(row);
    PostDate(window.location.origin + "/WebService.asmx/HttpPostInsertUser", "Jsons=" + JSON.stringify(json), regsave);
}

function regsave(json) {
    var row = json[0];
    if (row.id == "0") {
        alert(row.mess);
        var close = document.getElementsByClassName("close")[0];
        document.getElementById("seacrh").click();
        close.click();
    } else {
        alert(row.mess);
    }
}

function setData(json) {
    var tbody = document.getElementsByClassName("tbody")[0];
    tbody.innerHTML = "";
    if (typeof (json[0].id) != "undefined") {
        alert(json[0].mess);
        return;
    }
    for (var i = 0; i < json.length; i++) {
        var row = json[i];
        var tr = document.createElement("tr");
        tr.addEventListener("click", function (e) {
            if (typeof (selected) != "undefined" && selected != null)
                selected.classList.remove("selected");
            selected = e.currentTarget;
            selected.classList.add("selected");
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

function refesh(json) {
    if (json[0].id != "0") {
        alert(json[0].mess);
        return;
    }
    selected = null;
    document.getElementById("seacrh").click();
}

function reset(json) {
    if (json[0].id == "0") {
        selected = null;
        alert(json[0].mess);
        return;
    }
    alert(json[0].mess);
}

Init();