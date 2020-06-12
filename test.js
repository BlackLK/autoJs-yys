auto.waitFor();
device.wakeUp();//唤醒屏幕
//随机休眠时间参数
var starTime = 500;
var endTime = 2000;
var urlStory = "story/";///sdcard/yys-jio/
var _toast_ = toast;
toast = function(message){
    _toast_(message);
    console.log(message);
    sleep(starTime, endTime);
}


//var height = device.height;
//var width = device.width;
//setScreenMetrics(1080, 2160);

//请求截图权限
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
}
// 检测是否断线 每隔两分钟检测一次
// threads.setTimeout(function(){
//     //在新线程执行的代码
    // var p = captureScreenCoord(urlStory+"28.png",0.8);    
    // if(P) {
    //     console.log("检测到掉线，3秒钟后停止脚本");
    //     sleep(3000);
    //     closeApp();
    //     exit();
    // }
// }, 1000*2*60);
/**
 * 游戏选项
 */
var gameOption = 0;
/**
 * 游戏次数
 */
var gameTimes = 100;
/**
 * 全狗粮-0； 司机/打手-1，
 * 打手式神位置请放在面对小怪的左边
 */
var driver = 1;
var parent = threads.start(function() {
    for(var i = 0; i < gameTimes; i++) {
        //sleep(random(starTime,endTime));
        switch (gameOption) {
            case 0:
                chapter();
                break;
            case 1:
                chapter();
                break;
            default:
                break;
        }
    }
    toast("已完成游戏"+gameTimes+"次,退出程序");
    exit();
});


/**
 * 探索章节，刷狗粮
 */
function chapter() {
    var img ="";
    var flag = "";
    var point = "";
    while(true){
        if(driver == 1) {
            flag = clickCoord(urlStory+"28.png",0.8,"28章");
            if(flag) continue;

            flag = clickCoord(urlStory+"explore.png",0.8,"探索");
            if(flag) continue;

            flag = clickCoord(urlStory+"boss.png",0.8,"boss");
            if(flag) continue;
            
            flag = clickCoord(urlStory+"monster-experience.png",0.8,"经验小怪");
            if(flag) {
                sleep(3000); 
                continue;
            }
        }
        
        //检测是否有满经验狗粮
        img = images.read(urlStory+"full.png");
        var result = images.matchTemplate(captureScreen(), img, {
            threshold: 0.7,
            max: 3
        });
       
        if(result.matches.length>driver) {
            toast("检测到"+(result.matches.length)-driver+"个满级狗粮");
            
            //var p = captureScreenCoord(img,0.7);
            var x = parseInt(device.height*0.22);
            var y = parseInt(device.width*0.733);
            x = random(x-20,x+50);
            y = random(y-20,y+50);
 //           sleep(2000);
//            sleep(starTime, endTime);
 // click(x,y);
            
            //点击全部
//            sleep(2000);
//            clickCoord(urlStory+"all.png",0.8,"全部");
//            sleep(2000);

            //点击N卡
//            clickCoord(urlStory+"change.png",0.8,"切换狗粮分类");

            //toast("切换狗粮分类");
            //更换狗粮
            
            //查询满级狗粮坐标
            var result2 = images.matchTemplate(captureScreen(), img, {
                threshold: 0.7,
                max: 3
            });
            // console.log("result2");
            // console.log(result2);
            //司机或单人需要排除打手式神
            // for(var i = 0; i < result.matches.length-1; i++) {
            //     for(var j = 1; j < result.matches.length-2; j++) {
            //         //toast(result.matches[i].point.x>result.matches[j].point.x);
            //         if(result.matches[i].point.x > result.matches[j].point.x) {
            //             var change = result.matches[i];
            //             result.matches[i] = result.matches[i+1];
            //             result.matches[i+1] = change;
            //             //toast("输出："+result.matches[i].point);
            //         }
            //     }
            // }
            img = images.read(urlStory + "progressBar.png")
            if(!img){
                toast(urlStory + "progressBar.png not found");
                exit();
            }
            //console.log(img);
            point = captureScreenCoord(img, 0.8);
            point = imgPoint(point,img.getWidth(), img.getHeight());
            //swipe();

            //滑动狗粮进度条
            // var thread2 = threads.start(function(){
                // swipeEx(point.x,point.y,point.x+random(10,200),point.y,random(2000,4000));
                
            // });
            // thread2.waitFor();
            swipeEx(point.x,point.y,point.x+random(10,20),point.y,random(1500,2500));
            var swipeExFlag = true;
            var glTimes = 1;
            while(true){
                //检测可以更换的狗粮，只挑选1级狗粮
                var gl = images.read(urlStory+"materials.png");
                if(gl) {
                    //thread2.interrupt();
                    // if(swipeExFlag) {
                    //     thread2.interrupt();
                    //     swipeExFlag = false;
                    // }
                    //找到狗粮图标位置
                    point = captureScreenCoord(gl,0.8);
                    // console.log("找到狗粮图标位置");
                    // console.log(point);
                    point = imgPoint(point,80,180);
                    // 如果不是打手则不需要-1
                    // console.log("狗粮数量："+result2.matches.length);
                    // console.log(result2.matches);
                    for (var index = result2.matches.length-driver; index > 0; index--) {
                        // console.log("坐标：");
                        // console.log(result2.matches[index])
                        swipeEx(point.x,point.y,
                            result2.matches[index].point.x+random(-40,40),
                            result2.matches[index].point.y+random(100,150),
                            random(1000,2500));
                            sleep(starTime, endTime);
                    }
                    break;
                } else {
                    //未检测到1级狗粮，继续滑动
                    point = captureScreenCoord(img, 0.8);
                    point = imgPoint(point,img.getWidth(), img.getHeight());
                    swipeEx(point.x,point.y,point.x+random(5,10),point.y,random(1500,2500));
                    if(glTimes == 4) {
                        //找了四次，判定没有狗粮结束循环
                        break;
                    }
                    glTimes ++;
                }
            }
        }
        //点击准备按钮
        flag = clickCoord(urlStory+"ready.png",0.8,"准备");
        if(flag) continue;
        //sleep(random(2800,3000));
        //点击胜利
        flag = clickCoord(urlStory+"victory.png",0.8,"胜利");
        if(flag) continue;
        //点击胜利2
        flag = clickCoord(urlStory+"victory2.png",0.8,"奖励");
        if(flag) break;
        flag = clickCoord(urlStory+"box.png",0.8,"宝箱");
        
        //sleep(random(starTime,endTime));
        while (true) {
            img = images.read(urlStory+"getAward.png");
            if(img) {
                var x = device.width*0.8;
                var y = parseInt(device.height* 0.65);
                click(random(50,x),random(y,device.height-30));
                random(1000);
            }
            flag = clickCoord(urlStory+"box.png",0.8,"宝箱");
            if (flag) {
                continue;
            } else {
                break;
            }
        }
    }
    if(img) {
        img.recycle();
    }
}

function showIndex(x, y) {
    var w = floaty.rawWindow(
        <frame bg="#9F9F9F">
            {/* <button id="action" text="学生姓名" w="120" h="40"/> */}
            <text id="text" textColor="white" textSize="16sp">0</text>
        </frame>
    );
    w.setPosition(x, y)//设置位置
    w.setTouchable(false)//悬浮窗不可触摸
    w.setSize(200, 50);//窗体大小，-1全屏，-2跟随内容大小
    //toast(width);
    //ui.run(function(){ w.action.setText("文本");});
    setInterval(()=>{}, 1000);
}


/**
 * 点击对应图片坐标
 * @param {*} urlImg 图标路径
 * @param {*} accuracy 精确度
 * @param {*} msg 信息
 */
function clickCoord(urlImg,accuracy,msg) {
    var img = images.read(urlImg);
    //sleep(random(starTime,endTime));
    var p = captureScreenCoord(img,accuracy);
    if(p) {
        p = imgPoint(p,img.getWidth(),img.getHeight());
        // p.x = random(p.x, p.x+img.getWidth());
        // p.y = random(p.y, p.x+img.getHeight());
    }
    var flag = false
    if(p){
        click(p.x,p.y);
        //press(p.x, p.y, random(100,300))
        toast("点击了"+msg);
        flag = true;
    }
    
    return flag;
}

/**
 * 随机图片坐标
 * @param {*} p 坐标
 * @param {*} width x偏移量
 * @param {*} height y偏移量
 */
function imgPoint(p,width,height) {
    p.x = random(p.x, p.x+width);
    p.y = random(p.y, p.y+height);
    return p;
}

/**
 * 找到图标位置
 * @param {*} img 
 * @param {*} accuracy 
 */
function captureScreenCoord(img,accuracy) {
    var p = findImage(captureScreen(), img, {
        region: [0, 0],
        threshold: accuracy
    });
    return p;
}

/**
 * 关闭应用
 */
function closeApp() {
    let packageName = currentPackage();
    app.openAppSetting(packageName);
    text(app.getAppName(packageName)).waitFor();  
    let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne();
    if (is_sure.enabled()) {
        textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne().click();
        textMatches(/(.*确.*|.*定.*)/).findOne().click();
        log(app.getAppName(packageName) + "应用已被关闭");
        sleep(1000);
        back();
    } else {
        log(app.getAppName(packageName) + "应用不能被正常关闭或不在后台运行");
        back();
    }
}

/**
 * //仿真随机带曲线滑动  
 *  qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,过程耗时单位毫秒
 */
function swipeEx(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };

    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy, qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy, zy + 50),
    };
    var dx3 = {
        "x": zx,
        "y": zy
    };
    for (var i = 0; i < 4; i++) {

        eval("point.push(dx" + i + ")");

    };
    // log(point[3].x)

    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)]

        xxy.push(xxyy);

    }

    // log(xxy);
    gesture.apply(null, xxy);
};

function bezier_curves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;

    tSquared = t * t;
    tCubed = tSquared * t;
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
};
