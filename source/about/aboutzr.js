/*
 * aboutzr page js
 * by arayzou(邹瑞)
 * https://github.com/ArayZou/arayzou_hexoTheme
 * Requires jQuery 2.1.0
 *
 * Copyright 2014, arayzou
 * http://arayzou.com
 */
$(function(){
    var $gridBody = $('.grid_body');
    var $gridU = $('.grid_u');
    //有效格坐标数组
    var gridXY = [];

    var gridSize = 101;

    //计算宽高各需要多少个格子，先向下取整，然后计算高度要+1
    var bodyWidth = $(window).width()/gridSize>>0;
    var bodyHeight = $(window).height()/gridSize>>0;

    //执行填充方块
    fillInt();

    //填充方块方法
    function fillInt(){
        // var Begin = new Date();

        $gridU.show().find('.grid_b').hide();

        //计算宽高各需要多少个格子，先向下取整，然后计算高度要+1
        var bodyWidth = $(window).width()/gridSize>>0;
        var bodyHeight = $(window).height()/gridSize>>0;
        //设置大容器宽高
        $gridBody.css({
            width:(bodyWidth+1)*gridSize,
            height:(bodyHeight+1)*gridSize
        });
        //填充空背景格,写入有效格坐标
        var gridNum = 0;
        $gridBody.find('.grid').remove();
        gridXY = [];
        for(var j=0;j<(bodyHeight+1);j++){
            for(var i=0;i<(bodyWidth+1);i++){
                $gridBody.append('<b class="grid" id="g_'+i+'_'+j+'"></b>');
                if(i!=bodyWidth&&j!=bodyHeight){
                    gridXY[gridNum] = i+'.'+j;
                    gridNum++
                }
            }
        }
        //随机对有效坐标排序
        var gridXYran=gridXY.sort(function(a,b){return Math.random()>=0.5?-1:1;});

        //定位所有内容格
        for (var u = 0;u < $gridU.length;u++){
            var uID = '#g_'+String(gridXYran[u]).split('.')[0]+'_'+String(gridXYran[u]).split('.')[1];
            $gridU.eq(u).find('.grid_a,.grid_con').css({
                left:$(uID).offset().left,
                top:$(uID).offset().top
            });
            $gridU.eq(u).find('.grid_a').show();
            $gridU.eq(u).attr('data-p',gridXYran[u]);
        }

        // var Done = new Date();
        // console.log('fillInt function cost Time: '+(Done-Begin)+'ms');
    }

    //移动或点击内容格
    var $moveGrid = '',
        moveGridLeft = 0,
        moveGridTop = 0;
    var ifMove = false,
        ifGridCanMove = true;
    var downClientX = 0,
        downClientY = 0;
    $(document).on('mousedown touchstart',function (e){
        if (e.type == 'touchstart') {
            var eventObj = e.originalEvent.touches[0];
        }else {
            var eventObj = e;
        }
        if($(eventObj.target).hasClass('grid_1')){
            e.preventDefault();
            e.stopPropagation();
            console.log(eventObj);
            $moveGrid = $(eventObj.target);


            ifGridCanMove = $moveGrid.parent().hasClass('clicked')?false:true;
            // 鼠标点击位置
            downClientX = eventObj.clientX,
            downClientY = eventObj.clientY;
            // 鼠标点击位置和当前格的坐标差
            moveGridLeft = downClientX-$moveGrid.position().left,
            moveGridTop = downClientY-$moveGrid.position().top;
        }
    }).on('mousemove touchmove',function (e){
        if (e.type == 'touchmove') {
            var eventObj = e.originalEvent.touches[0];
        }else {
            var eventObj = e;
        }
        if($moveGrid&&ifGridCanMove){
            e.preventDefault();
            e.stopPropagation();
            //左右移动超过5像素再计算移动
            if(Math.abs(eventObj.clientX-downClientX)>5&&Math.abs(eventObj.clientY-downClientY)>5){
                $moveGrid.siblings('.grid_b').hide();
                ifMove = true;
                $moveGrid.css({
                    left:eventObj.clientX-moveGridLeft,
                    top:eventObj.clientY-moveGridTop,
                    zIndex:999
                }).siblings('.grid_b').css({
                    left:eventObj.clientX-moveGridLeft,
                    top:eventObj.clientY-moveGridTop
                });
            }
        }
    }).on('mouseup touchend touchcancel',function (e){
        //没有做移动，打开展开格
        if($moveGrid&&!ifMove){
            e.preventDefault();
            e.stopPropagation();
            if($moveGrid.siblings('.grid_b').length>0){
                //内容格向周围散开的展现方式定位
                $moveGrid.siblings('.grid_b').show();
                var $this = $moveGrid;
                var thisP = $this.parent().attr('data-p');
                var thisPX = parseInt(String(thisP).split('.')[0]);
                var thisPY = parseInt(String(thisP).split('.')[1]);
                if($this.parent().hasClass('clicked')){
                    $this.parent().removeClass('clicked');
                    $this.siblings('.grid_b').css({
                        left:$this.offset().left,
                        top:$this.offset().top
                    });
                    $this.parent().siblings('.grid_u').show();
                }else{
                    //找内容格周围可用单元格的坐标，这个没想到什么好方法。。。
                    //先按上左右下，上左，上右，下左，下右，上上，左左，右右，下下找12个，然后排除无用格,再加12个,坐标如下
                    //      21  13  9   14  22
                    //      17  5   1   6   18
                    //      10  2   格  3   11
                    //      19  7   4   8   20
                    //      23  15  12  16  24
                    $this.parent().addClass('clicked');
                    $this.parent().siblings('.grid_u').hide();
                    //周围可以用单元格数组，JS小数加减有问题，只好用这种方法，如果不够可以再加
                    var thisPX_L1 = thisPX-1;
                    var thisPX_L2 = thisPX-2;
                    var thisPX_R1 = thisPX+1;
                    var thisPX_R2 = thisPX+2;
                    var thisPY_T1 = thisPY-1;
                    var thisPY_T2 = thisPY-2;
                    var thisPY_B1 = thisPY+1;
                    var thisPY_B2 = thisPY+2;
                    var gridAroundXY = [];
                    gridAroundXY.push(thisPX+'.'+thisPY_T1);        //1
                    gridAroundXY.push(thisPX_L1+'.'+thisPY);        //2
                    gridAroundXY.push(thisPX_R1+'.'+thisPY);        //3
                    gridAroundXY.push(thisPX+'.'+thisPY_B1);        //4
                    gridAroundXY.push(thisPX_L1+'.'+thisPY_T1);     //5
                    gridAroundXY.push(thisPX_R1+'.'+thisPY_T1);     //6
                    gridAroundXY.push(thisPX_L1+'.'+thisPY_B1);     //7
                    gridAroundXY.push(thisPX_R1+'.'+thisPY_B1);     //8
                    gridAroundXY.push(thisPX+'.'+thisPY_T2);        //9
                    gridAroundXY.push(thisPX_L2+'.'+thisPY);        //10
                    gridAroundXY.push(thisPX_R2+'.'+thisPY);        //11
                    gridAroundXY.push(thisPX+'.'+thisPY_B2);        //12
                    gridAroundXY.push(thisPX_L1+'.'+thisPY_T2);     //13
                    gridAroundXY.push(thisPX_R1+'.'+thisPY_T2);     //14
                    gridAroundXY.push(thisPX_L1+'.'+thisPY_B2);     //15
                    gridAroundXY.push(thisPX_R1+'.'+thisPY_B2);     //16
                    gridAroundXY.push(thisPX_L2+'.'+thisPY_T1);     //17
                    gridAroundXY.push(thisPX_R2+'.'+thisPY_T1);     //18
                    gridAroundXY.push(thisPX_L2+'.'+thisPY_B1);     //19
                    gridAroundXY.push(thisPX_R2+'.'+thisPY_B1);     //20
                    gridAroundXY.push(thisPX_L2+'.'+thisPY_T2);     //21
                    gridAroundXY.push(thisPX_R2+'.'+thisPY_T2);     //22
                    gridAroundXY.push(thisPX_L2+'.'+thisPY_B2);     //23
                    gridAroundXY.push(thisPX_R2+'.'+thisPY_B2);     //24
                    //排除周围的无用格坐标，两数组求相同元素，要判断上千次，醉了，有更好的方法么
                    var thisGridUse = [];
                    for(var garo = 0;garo<gridAroundXY.length;garo++){
                        for(var gall = 0;gall<gridXY.length;gall++){
                            if(gridAroundXY[garo]==gridXY[gall]){
                                thisGridUse.push(gridAroundXY[garo]);
                                continue;
                            }
                        }
                    }
                    //定位展开格
                    for(var gb=0;gb<$this.siblings('.grid_b').length;gb++){
                        var uID = '#g_'+String(thisGridUse[gb]).split('.')[0]+'_'+String(thisGridUse[gb]).split('.')[1];
                        $this.siblings('.grid_b').eq(gb).animate({
                            left:$(uID).offset().left,
                            top:$(uID).offset().top
                        },gb*50);
                    }
                }
            }else if($moveGrid.siblings('.grid_con').length>0){
                //内容格左侧定位展开大块内容的方式
                var $this = $moveGrid;
                if($this.parent().hasClass('clicked')){
                    $this.parent().removeClass('clicked');
                    $this.siblings('.grid_con').css({
                        width:'0',
                        height:'0'
                    });
                    $this.animate({
                        left:$this.parent().attr('data-p').split('.')[0]*gridSize,
                        top:$this.parent().attr('data-p').split('.')[1]*gridSize
                    },300,function(){
                        $this.parent().siblings('.grid_u').show();
                    });
                }else{
                    $this.parent().addClass('clicked');
                    $this.parent().siblings('.grid_u').hide();
                    var gridConLeft = bodyWidth<=4? 0:101;
                    var gridConWidth = bodyWidth<=4? 101*bodyWidth:$this.siblings('.grid_con').attr('data-width');
                    var gridConHeight = bodyWidth<=4?(bodyHeight-1)*101:$this.siblings('.grid_con').attr('data-width');
                    $this.animate({
                        left:gridConLeft,
                        top:0
                    },300);

                    $this.siblings('.grid_con').animate({
                        left:gridConLeft,
                        top:0
                    },300,function(){
                        $(this).animate({
                            width:gridConWidth,
                            height:gridConHeight
                        });
                    });
                }
            }
            //清空对象
            $moveGrid = '';
        }
        //做了移动，直接移动内容格
        else if(ifMove){
            //获取鼠标松开时内容格中心点的坐标，并判断此坐标所在的背景格是否为有效格，若是直接定位到它上面，若不是则在它周围寻找有效格,无效格只会在右下，所以只要向左便移一格或者向上偏移一格就可以，并判断左和上是否已经存在内容格，有则再判断
            var uIDX = ($moveGrid.offset().left+50)/101>>0,
                uIDY = ($moveGrid.offset().top+50)/101>>0;
            var uGridXY = uIDX+'.'+uIDY,
                ifGridXYuse = false;
            for(var gall = 0;gall<gridXY.length;gall++){
                if(uGridXY==gridXY[gall]){
                    ifGridXYuse = true;
                    continue;
                }
            }
            //如果不是有效格
            if(!ifGridXYuse){
                //判断左侧是否为有效格
                var uIDleft = (uIDX-1)+'.'+(uIDY);
                for(var gallr = 0;gallr<gridXY.length;gallr++){
                    if(uIDleft==gridXY[gallr]){
                        //右侧是有效格
                        uIDleft = false;
                        continue;
                    }
                }
                //判断上方是否为有效格
                var uIDtop = (uIDX)+'.'+(uIDY-1);
                for(var gallb = 0;gallb<gridXY.length;gallb++){
                    if(uIDtop==gridXY[gallb]){
                        //下方是有效格
                        uIDtop = false;
                        continue;
                    }
                }
                if(!uIDleft&&uIDtop){
                    //右边，左侧有效上方无效
                    uIDX = uIDX-1;
                    uIDY = uIDY;
                    uGridXY = uIDX+'.'+uIDY;
                }else if(uIDleft&&!uIDtop){
                    //下边，左侧无效，上方无效
                    uIDX = uIDX;
                    uIDY = uIDY-1;
                    uGridXY = uIDX+'.'+uIDY;
                }else if(uIDleft&&uIDtop){
                    //右下角，左侧无效，上方无效
                    uIDX = uIDX-1;
                    uIDY = uIDY-1;
                    uGridXY = uIDX+'.'+uIDY;
                }
            }

            //再判断此时的uGridXY坐标的有效格有没有存在内容格,如果已经有内容格了，返回原位
            for(var ug=0;ug<$moveGrid.parent().siblings('.grid_u').length;ug++){
                if(uGridXY==$moveGrid.parent().siblings('.grid_u').eq(ug).attr('data-p')){
                    var uID = '#g_'+String($moveGrid.parent().attr('data-p')).split('.')[0]+'_'+String($moveGrid.parent().attr('data-p')).split('.')[1];
                    $moveGrid.animate({
                        left:$(uID).offset().left,
                        top:$(uID).offset().top
                    },300).css({
                        zIndex:10
                    }).siblings('.grid_b').animate({
                        left:$(uID).offset().left,
                        top:$(uID).offset().top
                    },function(){
                        $(this).show();
                    });
                    //清空对象
                    $moveGrid = '';
                    ifMove = false;
                    return false;
                }
            }

            var uID = '#g_'+ uIDX +'_'+ uIDY;
            $moveGrid.parent().attr('data-p',uGridXY);
            $moveGrid.animate({
                left:$(uID).offset().left,
                top:$(uID).offset().top
            },100).css({
                zIndex:10
            }).siblings('.grid_b').animate({
                left:$(uID).offset().left,
                top:$(uID).offset().top
            },100,function(){
                $(this).show();
            });
            //清空对象
            $moveGrid = '';
            ifMove = false;
        }
    });

    //resize后重新加载
    $(window).resize(function(){
        //计算宽高各需要多少个格子，先向下取整，格子数变化再执行fill
        var windowWidth = $(window).width()/gridSize>>0;
        var windowHeight = $(window).height()/gridSize>>0;
        if(windowWidth!=bodyWidth||windowHeight!=bodyHeight){
            bodyWidth=windowWidth;
            bodyHeight=windowHeight;
            fillInt();
        }
    });


    //开发者console
    console.log('%c','background:url(http://arayzou.qiniudn.com/personal/Aray1_sumiao.jpg);padding:43px 50px;line-height:100px;height:1px;border-radius:50px;background-size:100px 100px;')
    console.log('邹瑞的前端博客：http://arayzou.com \n\n如果你遇到BUG或者对代码有建议，欢迎联系我~ \nQQ:4751738(邹瑞) \nE-mail:zrxldl@gmail.com');
    console.log('github地址：https://github.com/ArayZou');
});
