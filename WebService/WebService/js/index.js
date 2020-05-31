var newinput = document.getElementById("new");
var saveinput = document.getElementById("save");
var files = {};
newinput.addEventListener("click", function () {
    var allobject = document.getElementsByClassName("get");
    for (var i = 0; i < allobject.length; i++) {
        if (allobject[i].id == "jlr") {
            allobject[i].value = GetQueryString("name");
            continue;
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
    $('#load').click(function () {
        document.getElementById("load_xls").click();
    });
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
            if (!isRealNum(allobject[i].value)) {
                alert("数量不是数字格式！");
                return;
            }
        }
        row[allobject[i].id] = escape2Html(allobject[i].value);
    }
    json.push(row);
    uploadFile("/WebService.asmx/SaveImage");
    //PostDate(json);
}, false);

function escape2Html(str) {
    var arrEntities = {
        'lt': '<',
        'gt': '>',
        'nbsp': ' ',
        'amp': '&',
        'quot': '"'
    };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
        return arrEntities[t];
    });
}

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

function SelectFile() {
    // $(".a").remove();
    var newfiles = $('#load_xls')[0].files;
    if (newfiles.length < 1) {
        return;
    }
    for (var i = 0; i < newfiles.length; i++) {
        $("#filenames").append("<span class='a' name='" + newfiles[i].name + "'>" + newfiles[i].name + "</span>");
        $("#filenames").append("<span class='a'><a href='#' name='" + newfiles[i].name + "'>删除</a></span>");
        files[newfiles[i].name] = newfiles[i];
    }
    console.log(typeof (files));
    console.log(files);
    $(".a a").on("click", function () {
        var name = this.name;
        $("[name='" + name + "']").remove();
        delete files[name];
    });
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

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

 function Getsize(files) {
    var mysize = 0
    for (var item in files) {
        if(typeof(files[item]) != "object") continue;
        mysize += files[item].size;
    }
    return mysize;
}

function uploadFile(url) {

    if (typeof (files) != "undefined" && files != null) {
        var sumzize = 0;
        var filessize = Getsize(files);
        for (var item in files) {
            var file = files[item];
            var name = file.name,
                size = file.size,
                uuid = guid();
            succeed = 0;
            var shardSize = 2 * 1024 * 1024, //以2MB为一个分片
                shardCount = Math.ceil(size / shardSize); //总片数
            for (var shardlen = 0; shardlen < shardCount; ++shardlen) {
                //计算每一片的起始与结束位置
                var start = shardlen * shardSize,
                    end = Math.min(size, start + shardSize);
                sumzize+=(end - start);
                var myform = new FormData();
                myform.append("data", file.slice(start, end)); //slice方法用于切出文件的一部分
                myform.append("name", name);
                myform.append("uuid", uuid); //uuid
                myform.append("total", shardCount); //总片数
                myform.append("index", shardlen + 1); //当前是第几片

                var progressRate = (sumzize / filessize) * 100 + '%';
                $('.progress div').css('width', progressRate);
                $.ajax({
                    url: url,
                    type: "POST",
                    data: myform,
                    async: true, //异步
                    contentType: false,
                    processData: false,
                    // xhr: function () {
                    //     var xhr = new XMLHttpRequest();
                    //     xhr.upload.addEventListener('progress', function (e) {
                    //         console.log(e);
                    //         //loaded代表上传了多少
                    //         //total代表总数为多少
                    //         var progressRate = (e.loaded / e.total) * 100 + '%';
                    //         //通过设置进度条的宽度达到效果
                    //         $('.progress div').css('width', progressRate);

                    //     });
                    //     return xhr;
                    // },
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (data) {
                        console.log(data)
                    }
                });
                
            }

        }
    }
}