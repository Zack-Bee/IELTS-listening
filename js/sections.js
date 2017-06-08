/**
 * Created by zackbee on 17-6-4.
 */
/* 此代码支持IE9+以及其他浏览器，
 * 使用了dom2级的特性，由于IE8
 * 以及以下版本（未完全支持dom2）
 * 未实现audio,video所以不用考虑
 */

window.onload = function () {
    function addPlayerEvents(element, config) {
        "use strict";

        //传入单个元素
        if (element.nodeType === 1) {
            addEvents(element);
        } else if (element.length >= 1){

            //传入nodeList
            var i = 0,
                len = element.length;

            for (; i < len; i++) {
                addEvents(element[i]);
            }
        } else {
            throw new Error("Wrong arguments!");
        }

        function addEvents(element) {

            //getElementsByClassName ie9+可以使用
            var pauseBtn =
                    element.getElementsByClassName(config.pauseBtn)[0],
                timeLine = element.getElementsByClassName(config.timeLine)[0],
                timeLineDuration = timeLine.children[0],
                timeLineBtn =
                    element.getElementsByClassName(config.timeLineBtn)[0],
                controls = element.getElementsByClassName(config.controls)[0],
                timeNow = element.getElementsByClassName(config.timeNow)[0],
                timeFull = element.getElementsByClassName(config.timeFull)[0],
                playerPlaying = false,

                //ie9+支持getComputedStyle
                getComputedStyle = document.defaultView.getComputedStyle,
                durationPercent = 0,
                allTime = 0,
                offsetLeft = 0,
                currentElement = timeLineBtn.offsetParent;

            function getCurrentTime(pageX) {
                var width = parseInt(pageX - offsetLeft),
                    allWidth = parseInt(getComputedStyle(timeLine,
                        null).width);
                durationPercent = width / allWidth;
                return parseInt(durationPercent * allTime);
            }

            function playerPause() {
                pauseBtn.className = config.pauseBtnPause;
                timeLineBtn.className = config.timeLineBtnStop;
                playerPlaying = false;
                controls.pause();
            }

            function playerPlay() {
                pauseBtn.className = config.pauseBtnPlay;
                timeLineBtn.className = config.timeLineBtnMove;
                playerPlaying = true;
                controls.play();
            }

            //转换时间成标准格式
            function getFormatTime(time) {
                time = parseInt(time);
                var hour = parseInt(time / 3600),
                    minute = parseInt((time % 3600) / 60),
                    second = time % 60;
                return transformTime(hour) + ":" + transformTime(minute)
                    + ":" + transformTime(second);
            }

            //转换时间
            function transformTime(time) {
                if (time < 10) {
                    return "0" + time;
                } else {
                    return time;
                }
            }

            //改变播放器的播放时间
            function changePlayerTime(pageX) {
                timeLineBtn.style.left = parseInt(pageX - offsetLeft);
                controls.currentTime = String(getCurrentTime(pageX));
            }

            //处理pauseBtn的点击事件


            function handleMousemove(event) {
                var pageX = event.pageX;
                changePlayerTime(pageX);
            }

            function handleTimeLineBtnMousemove() {
                window.addEventListener("mousemove", handleMousemove);
                timeLineBtn.className = config.timeLineBtnMove;
            }

            function showTime(event) {
                timeLine.title = getFormatTime(getCurrentTime(event.pageX));
            }

            function updateTimeMeta() {
                allTime = controls.duration;
                timeNow.innerHTML = getFormatTime(controls.currentTime);
                timeFull.innerHTML = getFormatTime(controls.duration);
            }

            function updateTime() {
                //防止初始化更新播放时长失败
                allTime = controls.duration;
                var percent = controls.currentTime / allTime;
                timeLineBtn.style.left = parseInt(percent *
                        parseInt(getComputedStyle(timeLine, null).width)) +
                    "px";
                timeLineDuration.style.width = parseInt(percent *
                        parseInt(getComputedStyle(timeLine, null).width)) +
                    "px";
                timeNow.innerHTML = getFormatTime(controls.currentTime);
                timeFull.innerHTML = getFormatTime(controls.duration);
            }

            //初始化
            timeLineDuration.style.width = "0";
            pauseBtn.style.left = "0";

            do {
                offsetLeft += currentElement.offsetLeft;
                currentElement = currentElement.offsetParent;
            } while (currentElement);

            //增加对pauseBtn的相应事件
            //监听对pause按钮的点击操作,ie9+支持addEventListener
            //addEventListener ie9+可以使用
            pauseBtn.addEventListener("click", function () {
                if (playerPlaying === true) {
                    playerPause();
                } else {
                    playerPlay();
                }
            });

            //增加对timeLineBtn的相应事件
            //removeEventListener ie9+可以使用
            timeLineBtn.addEventListener("mousedown",
                handleTimeLineBtnMousemove);

            //监听click事件，解决使用触摸板操作的问题
            window.addEventListener("click", function () {
                window.removeEventListener("mousemove", handleMousemove);
            });

            //增加对timeLine的事件
            timeLine.addEventListener("click", handleMousemove);

            //使得鼠标放在上面时显示时间
            timeLine.addEventListener("mousemove", showTime);

            //增加对播放器数据更新的相应事件
            //监听是否播放结束，并对其做相应处理
            controls.addEventListener("ended", playerPause);

            controls.addEventListener("pause", playerPause);

            controls.addEventListener("play", playerPlay);

            controls.addEventListener("loadedmetadata", updateTimeMeta);

            controls.addEventListener("timeupdate", updateTime);
        }
    }

    var players = document.getElementsByClassName("audioPlayer"),
        config = {
            pauseBtn: "pause-btn",
            timeLine: "time-line",
            timeLineBtn: "time-line-btn",
            controls: "controls",
            timeNow: "time-text-now",
            timeFull: "time-text-full",
            pauseBtnPlay: "pause-btn pause-btn-play",
            pauseBtnPause: "pause-btn pause-btn-pause",
            timeLineBtnStop: "time-line-btn time-line-btn-stop",
            timeLineBtnMove: "time-line-btn time-line-btn-move"
        };

    addPlayerEvents(players, config);
};


(function () {
    var pageList = document.getElementsByClassName("section-pageList")[0],
        navBar = document.getElementsByClassName("section-nav-bar")[0],
        navList = document.getElementById("nav-list"),
        navEdit = document.getElementById("nav-edit"),
        navUp = document.getElementById("nav-up"),
        editArea = document.getElementById("edit-area"),
        ansBtns = document.getElementsByClassName("section-ans-btn");


    //对ans按钮添加点击事件的监听
    for (var i = 0, len = ansBtns.length; i < len; i++) {
        ansBtns[i].onclick = function () {
            if (this.className === "section-ans-btn" + " " + "section-ans-btn-show") {
                this.className = "section-ans-btn" + " " + "section-ans-btn-hidden";
                this.nextElementSibling.className = "section-ans-table" + " " +
                    "section-ans-table-hidden";
            } else {
                this.className = "section-ans-btn" + " " + "section-ans-btn-show";
                this.nextElementSibling.className = "section-ans-table" + " " +
                    "section-ans-table-show";
            }
        }
    }


    //对list按钮添加点击事件的监听
    navList.onclick = function (event) {
        if (navBar.className === "section-nav-bar" + " " + "section-nav-bar-hidden") {
            navBar.className = "section-nav-bar" + " " + "section-nav-bar-show";
            pageList.className = "section-pageList" + " " + "section-pageList-show";
            event.stopPropagation();
        }
    };


    //对edit按钮添加点击事件的监听
    navEdit.onclick = function (event) {
        editArea.className = "edit-area-show";
        event.stopPropagation();
    };


    //对发生在editArea中的点击事件进行处理
    editArea.onclick = function (event) {
        event.stopPropagation();
    };

    //对点击事件进行处理
    window.addEventListener("click", function () {
        if (navBar.className === "section-nav-bar" + " " + "section-nav-bar-show") {
            navBar.className = "section-nav-bar" + " " + "section-nav-bar-hidden";
            pageList.className = "section-pageList" + " " + "section-pageList-hidden";
        }
        editArea.className = "edit-area-hidden";
    });

    navUp.onclick = function () {
        document.body.scrollTop = 0;
    };
})();