/**
 * Created by actanble on 2019/01/09
 */
// 切记： 节点位置的测试是在屏幕宽度 1280 的环境下测试。
window.oncontextmenu = function(){return false;}

var pic_dir = "backup/whtv/img_0108/";
var DEFAULT_FONT = "bold 25px 微软雅黑";
var NamePrefix = "" //  "名称: " 
var IpPrefix = "" //  "名称: " 

var CanvasRoutes = {
    in_route_container: function(container_name) {
        localStorage.container_name = container_name ;
        $.ajax({
            type:"GET",
            url: "backup/jtopot/htmls/find_more.html",
             success:function(res){
                 $("#content").html(res);
             }
        })
    },

    jt_node: function (node, container_name) {
        // 左键点击的时候
        node.addEventListener('mouseup',function(event) {
            // node 节点的左键按钮
            if (event.button == 0) {
                CanvasRoutes.in_route_container(container_name)
            }
        })
    },

}

var namestr_max_size = 30;
var SpaceTool = {
    sizeof:function(str, charset){
        var total = 0,
            charCode,
            i,
            len;
        charset = charset ? charset.toLowerCase() : '';
        if(charset === 'utf-16' || charset === 'utf16'){
            for(i = 0, len = str.length; i < len; i++){
                charCode = str.charCodeAt(i);
                if(charCode <= 0xffff){
                    total += 2;
                }else{
                    total += 4;
                }
            }
        }else{
            for(i = 0, len = str.length; i < len; i++){
                charCode = str.charCodeAt(i);
                if(charCode <= 0x007f) {
                    total += 1;
                }else if(charCode <= 0x07ff){
                    total += 2;
                }else if(charCode <= 0xffff){
                    total += 3;
                }else{
                    total += 4;
                }
            }
        }
        return total;
    },

    strslice:function(string){
        var str = new String(string);  
        var bytesCount = 0;  
        var _pre = "" ; 
        for (var i = 0 ,n = str.length; i < n; i++) {  
            var c = str.charCodeAt(i);  
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {  
                bytesCount += 1;  
                if(bytesCount > namestr_max_size){break;}
                _pre += String(c);
            } else {  
                bytesCount += 2; 
                if(bytesCount > namestr_max_size){break;}
                _pre += String(c);
            }  
        }  
        console.log(_pre);
        return _pre;  
    },

    str2stable:function(string){
        // var _len = string.length;
        var _len = SpaceTool.sizeof(string, null);
        var last_str;
        if(_len > namestr_max_size){
            // last_str = SpaceTool.strslice(string);
            last_str = 'Err_命名长度过长';
        }else{
            var _fix_len = namestr_max_size - _len
            var _fix_str = "";
            for(var i=0; i <_fix_len; i++){
                _fix_str += " ";
            }
            // console.log(_fix_len) ; 
            last_str = string + _fix_str ;
        }
        return last_str
    },

}

var FlowDivManager = {
   
    get_left_div:function (infos){
        _str = ' <div class="flow-left row flow1 ftx" id="'+ infos.instance_id  +'_left">'
        _str += '  <p><span class="flow-arrow"><i class="fa fa-long-arrow-right green"></i></span><span class="flow-text">'+ infos.LanIn +'</span></p>'
        _str += '  </div>'
        return _str
    },

    get_right_div:function (infos){
        _str = ' <div class="flow-left row flow1 ftx" id="'+ infos.instance_id  +'_right">'
        _str += '<p><span class="flow-arrow"><i class="fa fa-long-arrow-right red"></i></span><span class="flow-text">'+ infos.LanOut +'</span></p>'
        _str += '  </div>'
        return _str
    },
 
    get_top_div:function (infos){
        _str = ' <div class="flow-right row flow1 flow2 ftx" id="'+ infos.instance_id  +'_top">'
        _str += ' <p><span class="flow-text1">'+ infos.WanOut +'</span><span class="flow-arrow"><i class="fa fa-long-arrow-down red"></i></span></p>'
        _str += ' <p><span class="flow-arrow"><i class="fa fa-long-arrow-up green"></i></span><span class="flow-text">'+ infos.WanIn +'</span></p>'
        _str += '  </div>'
        return _str
    },

}


var TopoObjManager = {

    namestr_max_size : 11,

    common_nodepic : pic_dir + "server_w.png", // 普通服务器
    red_nodepic : pic_dir + "server_r.png",    // 红色告警服务器
    orange_nodepic : pic_dir + "server_o.png", // 橙色服务器
    bray_nodepic : pic_dir + "server_g.png",  // 灰色服务器 关机状态服务器
    bray2_nodepic : pic_dir + "server_xg.png",  // 灰色服务器感叹号, 正在开机状态但是有告警
    // idc_nodepic : pic_dir + "ids.png",
    // common_bgpic : "./backup/backpngs/tv181212.png",
    common_bgpic : pic_dir + "tv18.png",
    more_pic : pic_dir + "more.png",
    // more_pic : "./tool_src/images/530/more.png",
    initCanvas: function (canvas) {
          // canvas.width = window.innerWidth * 0.38;
            canvas.width = window.innerWidth - 55;
            var alfa = 916 / 2000 ;
            canvas.height = canvas.width * alfa;
            var scene = new JTopo.Scene();
            scene.background = TopoObjManager.common_bgpic;
            var stage = new JTopo.Stage(canvas);
            TopoObjManager.stage_listen(stage); // 增加监听
            // TopoObjManager.local_default_add_nodes(scene);  // 增加零散节点
            stage.add(scene);
            return [stage,scene]
    },

    printScreenWidth: function () {
        console.log("屏幕的宽度_" + window.innerWidth);
    },

    get_conter_dialog: function () {
      return " <div id=\"index_dialog\" class=\"o-model\" style=\"display: none\">"
    },

    get_pic_by_slug: function(slug){
        switch (slug){
            case 0:
                pic = TopoObjManager.bray_nodepic
                break;
            case 1:
                pic = TopoObjManager.bray2_nodepic
                break;
            case 2:
                pic = TopoObjManager.bray2_nodepic
                break;
            case 10:
                pic = TopoObjManager.common_nodepic
                break;
            case 11:
                pic = TopoObjManager.orange_nodepic
                break;
            case 12:
                pic = TopoObjManager.red_nodepic
                break;
            default:
                pic = TopoObjManager.common_nodepic
            }
        return pic 
    },  

    blinkNode: function (node) {
        return setInterval(function () {
            if (node.visible == true) {
                node.visible = false;
            } else {
                node.visible = true;
            }
        }, 600);
    },
    // 添加节点; 默认有个 sceen, 节点的x,y, 图片链接, 闪不闪
    AddNode:function(scene, name, x, y, ip, img, scaleX, isblink) {
        x = x || 0; y = y || 0; ip= ip|| "0.0.0.0"; img = img || TopoObjManager.common_nodepic;
        scaleX = scaleX || 1; isblink = isblink||0 ;
        var node = new JTopo.Node(name);

        node.setLocation( (x- 55) * window.innerWidth / 1280 , (y-55) * window.innerWidth / 1280);
        node.serializedProperties.push('isblink');
        node.serializedProperties.push('msg');
        node.serializedProperties.push('ip');
        node.msg = "预留消息字段";

        node.isblink = isblink ;
        node.scaleX = scaleX * window.innerWidth / 1280 * 0.55;
        node.scaleY = scaleX * window.innerWidth / 1280 * 0.55;
        node.setImage(img, true);
        node.textPosition = 'Bottom_Center';
        node.fontColor = '0,0,0';
        node.serializedProperties.push('timer');
        node.timer = null;
        node.ip = ip;

        if (img.indexOf("server_red") >= 0){
            node.fontColor = '255,0,0';
        }
        if(isblink == 1){
            // var temp_timer = TopoObjManager.blinkNode(node);
            //node.setImage(TopoObjManager.red_nodepic, true);
            node.fontColor = '255,0,0';
        }

        if( ip=="255.255.255.0" ){
            // node.alpha = 0.0 ; // 如果底图有图标, 就设置透明度 0.0
            CanvasRoutes.jt_node(node, "云服务器区")
        }else{
            TopoObjManager.addLisentrigger(node);
        }
        node.font = "14px Consolas" ;
        // 省略 blink node;
        scene.add(node);
        return node ;
    },

    hideAlldiv: function () {
        $(".dialog").hide()
        $("#opreate_menu").hide();
        $("#find_more").hide();
        // click_flag = 0
        $("#saomiao").modal("hide");
    },

    AddContainerOnStage : function (stage, location, nodes, size) {
          var scene = new JTopo.Scene();
          stage.add(scene);
          // 网格布局(4行3列)
          var gridLayout = JTopo.layout.GridLayout(size[0], size[1]);
          var container2 = new JTopo.Container('云服务区');
          container2.layout = gridLayout;
          container2.setBound( window.innerWidth / 1280 * location[0], window.innerWidth / 1280 * location[1], window.innerWidth / 1280 * location[2],  window.innerWidth / 1280 * location[3]);
          container2.alpha = 0.0 ;
          container2.background = TopoObjManager.common_bgpic; ////////////// 全区变量修改；
          scene.add(container2);

          for (var i=0;i< nodes.length; i++){
              scene.add(nodes[i]) ;
              container2.add(nodes[i]) ;
          }
          // container2.layout = JTopo.layout.GridLayout(3, 2);
          container2.addEventListener('click', function(event) {
               $("#index_dialog").hide();
          });

        return container2;
    },

    addSimpleNode: function (name, img, ip, pub_ip, id) {
         //画出节点(函数) ___ 跟以前相比, 没有位置；没有alram
        scaleX = 0.47 * window.innerWidth / 1280;
        // scaleX = scaleX || 0.47 * window.innerWidth / 1280;
        name = NamePrefix + SpaceTool.str2stable(name);
        var max_name_size = 30;
        // msg = msg || "<h2>准备填冲每个节点弹出框的内容</h2>" ;
        var node = new JTopo.Node(IpPrefix + pub_ip)
        node.scaleX = scaleX;
        node.scaleY = scaleX * 0.9;
        node.setImage(img, true);
        // node.textPosition = 'Bottom_Center';
        node.textPosition = 'Top_Center';
        node.textOffsetX = 0 * window.innerWidth / 1280;
        node.textOffsetY = 0 * window.innerWidth / 1280;
        node.fontColor = '0,0,0';
        node.font = DEFAULT_FONT ;
        node.ip = ip ;
        node.id = id ;
        node.name = name;
        if( ip == "0.0.0.0"){
            node.visible = false;
        }
        TopoObjManager.addLisentrigger(node);
        return node;
    },

    addLisentrigger: function (node) {
        // 节点监听处理函数
        node.addEventListener('mouseout',function(event) {
            // 原本是移出去; 弹窗消失, 现在改了
            // $("#index_dialog").hide();
        });
        // 左键点击的时候
        node.addEventListener('mouseup',function(event) {
            TopoObjManager.hideAlldiv();
            // node 节点的左键按钮
            if (event.button == 0) {
                // TopoObjManager.func_index_dialog(node, event);
                $.ajax({
                    headers:{'Authorization':'JWT '+ localStorage.token},
                    url: backend_host + "/jtopo/node_dialog?ip=" + node.ip,
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    traditional: true,
                    success: function(response) {
                        $(".dialog").html(response);
                        var TOP_BEGIN = 120;
                        var LEFT_BEGIN = 55;
                        // || node.y < $(".dialog").height() ;   || node.x < $(".dialog").width() ;
                        var _top = (node.y + $(".dialog").height() + TOP_BEGIN > window.innerHeight )?
                            node.y- $(".dialog").height() :  node.y  ; // 框在鼠标的上侧 / 框在鼠标的下侧

                        var _left = (node.x + $(".dialog").width() + LEFT_BEGIN  > window.innerWidth)?
                            node.x - $(".dialog").width() :  node.x ; // 框在鼠标的左侧 / 框在鼠标的右侧

                        $(".dialog").css({
                            top: _top + 55,
                            left: _left + 55,
                        }).show();
                    },
                    error: function(response) {
                       console.log(response);
                    }
                })
            }

            if (event.button == 2) {
                TopoObjManager.right_click_menu(event, node);
                console.log("Right Button");
            }

        });
    },

    // 右击菜单监听
    right_click_menu: function(event, node) {
        $("#opreate_menu").css({
            top: node.y + 55,
            left: node.x + 55
        }).show();
        $("#opreate_menu a").off("click").on("click", function(event){
            var text = $(this).text();
            if("取消" == text){
                $("#opreate_menu").hide();
            }

            if("修改主机信息" == text){
                $("#myModalLabel").text("修改主机名称");
                $("#saomiao").modal('show');
                $('#saomiao1').attr("readonly",true);
                $.ajax({
                type: "GET",
                 headers:{'Authorization':'JWT '+ localStorage.token},
                url: backend_host +  "/service/ipmg/" + node.id + "/",
                success: function (data) {
                  $("#saomiao1").val(data.ip) ;
                  $("#saomiao2").val(data.name) ;
                  $("#saomiao4").val(data.belongCate) ;
                  $("#add_saomiao").off("click").on("click", function () {
                      $.ajax({
                           type: "PUT",
                           url: backend_host +  "/service/ipmg/" + node.id  + "/",
                           headers:{'Authorization':'JWT '+ localStorage.token},
                          data:{
                            "ip": $("#saomiao1").val(),
                            "name": $("#saomiao2").val(),
                            "belongCate": $("#saomiao4").val(),
                           },
                           dataType: "json",
                           success: function (res) {
                               // 修改以后刷新这个页面
                               TopoObjManager.hideAlldiv();
                               setTimeout(function(){
                                  $("#contentc").html("") ;
                                  $("#contentc").html("<canvas id=\"canvas\" ></canvas>") ;
                                            order_nodes_for_homepage()
                                      }, 500);

                           }
                        })
                    })
                  }
                })

            }

            if("添加节点" == text){
                $("#opreate_menu").hide();
                add_scanarea()
            }

          });
    },

    stage_listen: function (stage) {
        stage.addEventListener('mouseup',function(event) {
            // node 节点的左键按钮
            if(event.button == 0){
                TopoObjManager.hideAlldiv();
            }
           if(event.button == 2){
               console.log(event.pageX+" X " + event.pageY)
            }
        })
    },

    addTxtnode2stage: function (stage, container) {
        var scene2 = new JTopo.Scene();
        stage.add(scene2);
        var sd_size = 19;
        var _nodes = container.childs ;
        for(var i=0 ; i<_nodes.length; i++){
            _temp_node = _nodes[i];
            var textNode = new JTopo.TextNode(_temp_node.name);
            textNode.font = DEFAULT_FONT;
            textNode.fontColor = "255.0.0" ;
            // textNode.setLocation(_temp_node.x + 110 * window.innerWidth / 1280 - 110, _temp_node.y + 50 );
            textNode.setLocation(_temp_node.x - 0.35 * _temp_node.width,  _temp_node.y - 33* window.innerWidth / 1280 - 5 );
            textNode.scaleX = _temp_node.scaleX;
            textNode.scaleY = _temp_node.scaleY ;
            scene2.add(textNode);
        }
    },
    addflows2stage: function (container1, container2) {
        $.ajax({
            headers: {'Authorization': 'JWT ' + localStorage.token},
            type: "GET",
            data: {},
            url: backend_host + "/jtopo/get_hosts_flow",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            traditional: true,
            success: function (response) {
                var flows_data = response.res;
                var _nodes1 = container1.childs ;
                var _nodes2 = container2.childs ;
                var _nodes = _nodes1.concat(_nodes2) ; 
                var _div_lists = ''; 
            
                for(var j=0; j< flows_data.length; j++){
                    for(var i=0 ; i<_nodes.length; i++){
                        if(_nodes[i].ip == flows_data[j].ip ){
                            _div_lists += FlowDivManager.get_left_div(flows_data[j])
                            _div_lists += FlowDivManager.get_right_div(flows_data[j])
                            _div_lists += FlowDivManager.get_top_div(flows_data[j])
                        }
                    }
                }
        
                $("#flows").html(_div_lists);

                setTimeout(function(){
                    for(var i=0 ; i<_nodes.length; i++){
                        for(var j=0; j<flows_data.length; j++){
                            if(_nodes[i].ip == flows_data[j].ip){
                                temp_node = _nodes[i];
                                _left = temp_node.x;
                                _top  = temp_node.y;
                                $("#"+ flows_data[j].instance_id + "_left").css({
                                    left: _left - 11 + 10 * window.innerWidth/1280 ,
                                    top : _top + 55 + temp_node.height,
                                }).show();      

                                $("#"+ flows_data[j].instance_id+ "_right").css({
                                    left: _left - 11 + temp_node.width + 15* window.innerWidth/1280,
                                    top : _top + 55 + temp_node.height,
                                }).show();  

                                $("#"+ flows_data[j].instance_id+ "_top").css({
                                    left: _left + 0.5 * temp_node.width,
                                    top : _top + temp_node.height * 2 + 55,
                                }).show();  
                                
                            }
                        }
                    }
                }, 10)

            }
        })
    },

}


function array_slipce(array, start, end) {
    var _new_array = []
    for (var i = 0; i < array.length; i++){
        if (i >= start && i < end) {
            _new_array.push(array[i])
        }
    }
    return _new_array
}

function whtv_add_nodes(response, size1, size2) {
    var pre_datas = response.res;
    var _nodes1 = [];
    var _nodes2 = [];

    // _nodes.push( TopoObjManager.addSimpleNode("", TopoObjManager.common_nodepic, null,null, "0.0.0.0", null) ); // 查看更多
    for(var i=0; i< pre_datas.length; i++){
        var _pre_data = pre_datas[i] ;
        var _pic = TopoObjManager.get_pic_by_slug(_pre_data.slug)
        // PIC_TEST
        if(_pre_data.belongCate == "对外通信节点") {
            _nodes1.push(TopoObjManager.addSimpleNode(_pre_data.name, _pic,_pre_data.ip, _pre_data.pub_ip, _pre_data.id) )
        }
        if(_pre_data.belongCate == "云内部节点") {
            _nodes2.push(TopoObjManager.addSimpleNode(_pre_data.name, _pic,_pre_data.ip, _pre_data.pub_ip, _pre_data.id))
        }
    }

    var _size_length1 = size1[0] * size1[1] ;
    // 增加查看更多按钮
    if (_nodes1.length > _size_length1){
        _nodes1 = array_slipce(_nodes1, 0, _size_length1 );
    }

    var _size_length2 = size2[0] * size2[1] ;
    if (_nodes2.length >  _size_length2){
        _nodes2 = array_slipce(_nodes2, 0, _size_length2 );
        // _nodes2.push(TopoObjManager.addSimpleNode('查看更多', TopoObjManager.common_nodepic,
        //             null, 0, '255.2.0.0', null, null))
    }

    return [_nodes1, _nodes2]
}

function order_nodes_for_homepage(){
    console.log(window.innerWidth) ;
    $.ajax({
        headers: {'Authorization': 'JWT ' + localStorage.token},
        type: "GET",
        data: {},
        url: backend_host + "/jtopo/json_dj_nodes_0103",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        traditional: true,
        success: function (response) {
            var size1 = [3,4];  // 左侧的是size1
            var size2 = [3,2];
            nodes_list = whtv_add_nodes(response, size2, size1);
            nodes1 = nodes_list[0] ;
            nodes2 = nodes_list[1] ;
            var canvas = document.getElementById('canvas') ;
            var local_stage = TopoObjManager.initCanvas(canvas);

            var location1 = [131, 92, 650, 280];
            var location2 = [720, 92, 400, 280];

            // TopoObjManager.AddContainerOnStage(local_stage, location , TopoObjManager.order_nodes1(), [2,7])
            var c1 = TopoObjManager.AddContainerOnStage(local_stage[0], location1 , nodes2, size1)
            var c2 = TopoObjManager.AddContainerOnStage(local_stage[0], location2 , nodes1, size2)

            // 2018-12-19 增加ip的文本节点
            // 延迟投影字体; 否则不行
            setTimeout(function () {
                TopoObjManager.addTxtnode2stage(local_stage[0], c2);
                TopoObjManager.addTxtnode2stage(local_stage[0], c1);
            }, 50);
            
            // 2019-1-7 增加ip主机的流量信息
            setTimeout(function () {
                TopoObjManager.addflows2stage(c1, c2);
            }, 50);

            // 风控设备的节点放置
            // 2018-12-17 注释着两个节点
            // TopoObjManager.add_nodes_stx(local_stage[1], response.res)

        }
    })
}

(function test() {order_nodes_for_homepage();}());

$(window).resize(function () {          //当浏览器大小变化时
    $("#contentc").html("") ;
    $("#contentc").html("<canvas id=\"canvas\" ></canvas>") ;
    order_nodes_for_homepage();
});







