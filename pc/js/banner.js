var banner = document.getElementById("banner");
var bannerInner = utils.fistEleChild(banner);
var focusList = utils.children(banner, "ul")[0];
var left = utils.getElementsByClass("left", banner)[0];
var right = utils.getElementsByClass("right", banner)[0];
var imgBox = bannerInner.getElementsByTagName("div");
var imgList = bannerInner.getElementsByTagName("img");
var lis = focusList.getElementsByTagName("li");
(function(){
    var zhufengEffect = {
        linear : function (t, b, c, d) {
            return b+ t/d*c;
        }
    };
    function move(ele,target,duration,effect,callback){
        var change = {};
        var begin = {};
        var time = 0;
        var interval = 10;
        var defaultEffect = zhufengEffect.linear;
        if(typeof effect == 'number'){
            switch (effect){
                case 1:
                    defaultEffect = zhufengEffect.linear;
                    break;
            }
        }else if(typeof effect == 'function'){
            callback = effect;
        }
        for(var attr in target){
            if(target.hasOwnProperty(attr)){
                begin[attr] = utils.css(ele,attr);
                change[attr] = target[attr] - begin[attr];
            }
        }
        var timer = window.setInterval(function(){
            time += interval;
            if(time >= duration){
                window.clearInterval(timer);
                utils.css(ele,target);
                if(typeof callback == 'function'){
                    callback.call(ele);
                }
                return;
            }
            for(var key in change){
                var curWD = change[key];
                if(curWD){
                    var curPosi = defaultEffect(time,begin[key],change[key],duration);
                    utils.css(ele,key,curPosi);
                }
            }
        },interval);
    }
    window.zhufengAnimate = move;
})();

var data = null;
function getData() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'data.txt?_=' + Math.random(), false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
}
getData();
function bindData() {
    if (data) {
        var str1 = "";
        var str2 = "";
        for (var i = 0; i < data.length; i++) {
            var curDataObj = data[i];
            str1 += "<div><img src='' trueSrc='" + curDataObj.src + "'/></div>";
            str2 += i == 0 ? "<li class='bg'></li>" : "<li></li>";
        }
        bannerInner.innerHTML = str1;
        focusList.innerHTML = str2;
    }
}
bindData();
function imgLoad() {
    for (var i = 0; i < imgList.length; i++) {
        (function (i) {
            var curImg = imgList[i];
            if (curImg.isLoad) return;
            var tempImg = new Image();
            tempImg.src = curImg.getAttribute("trueSrc");
            tempImg.onload = function () {
                curImg.src = this.src;
                utils.css(curImg, "display", "block");
                tempImg = null;
                if (i === 0) {
                    utils.css(curImg.parentNode, "zIndex", 1);
                    zhufengAnimate(curImg.parentNode, {opacity: 1}, 100);
                } else {
                    utils.css(curImg, "zIndex", 0);
                }
            }
            curImg.isLoad = true;
        })(i);
    }
}
window.setTimeout(imgLoad, 500);
var step = 0;
var timer = null;
var interval = 2000;
function autoMove() {
    if (step == data.length - 1) {
        step = -1;
    }
    step++;
    setBanner();
}
function setBanner() {
    for (var i = 0; i < imgBox.length; i++) {
        var curDiv = imgBox[i];
        if (i == step) {
            utils.css(curDiv, "zIndex", 1);
            zhufengAnimate(curDiv, {opacity: 1}, 200, function () {
                var siblings = utils.siblings(this);
                for (var j = 0; j < siblings.length; j++) {
                    var curSibling = siblings[j];
                    utils.css(curSibling, "opacity", 0);
                }
            });
        } else {
            utils.css(curDiv, "zIndex", 0);
        }
    }
    for (var k = 0; k < lis.length; k++) {
        var curLi = lis[k];
        k === step ? utils.addClass(curLi, "bg") : utils.removeClass(curLi, "bg");
    }
}
timer = window.setInterval(autoMove, interval);
banner.onmouseover = function () {
    window.clearInterval(timer);
    utils.css(left, "display", "block");
    utils.css(right, "display", "block");
}
banner.onmouseout = function () {
    timer = window.setInterval(autoMove, interval);
    utils.css(left, "display", "none");
    utils.css(right, "display", "none");
}
function bindEvetnForFocus() {
    for (var i = 0; i < lis.length; i++) {
        var curLi = lis[i];
        curLi.index = i;
        curLi.onclick = function () {
            step = this.index;
            setBanner();
        }
    }
}
bindEvetnForFocus();
left.onclick = function () {
    if (step == 0) {
        step = data.length;
    }
    step--;
    setBanner();
}
right.onclick = autoMove;