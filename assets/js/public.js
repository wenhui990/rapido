//接口
var _href = "http://api.jjrb.grsx.cc",//"http://test.api.wantscart.com",
	interfacelist = {
		user_all: "/user/list",  //所有用户
		role: "/user/role",
		feed: "/feed/"
	},n=1;


// 点击左侧导航事件
$(document).on('click',".navlist_a",function(){
	console.log($(this).attr("href"));
	window.location.href = $(this).attr("href");
});

$(document).on("click",".panel-heading",function(e){
    /*切换折叠指示图标*/
    $(this).find("span").toggleClass("glyphicon-chevron-down");
    $(this).find("span").toggleClass("glyphicon-chevron-right");
});

// 点击详情
$(document).on('click','.nvDescp',function(){
	var _id = $(this).attr("data-id"),descp='';
	$("#modalHtml").html('');
	$.ajax({
		type:"get",
		url: _href + interfacelist.feed + _id,
		async:true,
		data:{
			token:localStorage.token
		},
		success: function(data){
			console.log(data);
			$("h4.modal-title").text(data.title);
			descp += '<div style="margin:10px auto;" id="header_img"><img src="'+data.cover+'" alt="热点图" class="hotspot_img" /></div>';
			var a = $("<div></div>");
			data.resources.forEach(function(res,inx){
//				console.log(res);
				var type = res.type;
				if (type === 12) {//图片
					descp += '<img src="' + res.uri + '">'
				}else if (type === 13) {//文本
					descp += '<p>'+res.descp+'</p>'
				} else if(type === 15){//数据
					var _id ='';
					if (res.descp) {
						res.descp.length<0?echarts_data=res.descp:echarts_data=JSON.parse(res.descp);
						_id = echarts_data.id_val;
					}
					descp += '<div id="'+_id+'" style="min-height:500px;"></div>'
				}else{
					descp += res.descp
				}
			});
			$("#modalHtml").append(descp);
		},
		error: function(data,err){
			console.log(err);
		}
	});
});

// 点击通过审核
$(document).on("click",".pass",function(){
	var _id = $(this).attr("data-id");
	var type = "post",
		_url = _href + interfacelist.feed + _id + "/pass";
	manageNV(type,_url);
});

// 点击不通过
$(document).on("click",".nopass",function(){
	var _id = $(this).attr("data-id");
	var type = "post",
		_url = _href + interfacelist.feed + _id + "/nopass";
	manageNV(type,_url);
});

// 点击删除
$(document).on("click",".delete",function(){
	var _id = $(this).attr("data-id");
	var _this = $(this);
	var type = "delete",
		_url = _href + interfacelist.feed + _id +'?token=' + localStorage.token;
	$(document).on('click','.del_btn',function(){
		manageNV(type,_url);
		_this.parents('tr').remove();
	});
});

// 管理新闻和观点（审核、删除、通过不通过）
function manageNV(type,_url){
	$.ajax({
		type: type,
		url: _url,
		async:true,
		data:{
			token: localStorage.token
		},
		success: function(data){
			if (type==='delete') {
				console.log("delete"+data);
			} else{
				$("#modalHtml").html('');
				console.log("其他"+data);
				$("#modalHtml").append(data);
			}
		}
	});
}



// 加载用户列表方法
function loadUsers(n){
	$.ajax({
		type:"get",
		url: _href + interfacelist.user_all,
		async:true,
		data:{
			token: localStorage.token,
			page:n
		},
		success: function(data){
			$.each(data,function(i,e){
				var html;
				if(e.role===1){
					html = '<tr><td class="center">'+e.id+'</td>'+
							'<td><img src="'+e.head+'" width="100" height="100" alt="用户头像" /></td>'+
							'<td class="hidden-xs">'+e.name+'</td>'+
							'<td>'+e.sign+'</td>'+
							'<td class="center"style="min-width:120px">'+
							'	<select class="form-control roles">'+
							'	    <option value=9><a href="#" name="a-role" val="9"><i class="fa fa-user-md"></i>管理员 </a></option>'+
							'	    <option value=0><a href="#" name="a-role" val="0"><i class="fa fa-user"></i>普通用户</a></option>'+
							'	    <option value=1 selected><a href="#" name="a-role" val="1"><i class="fa fa-film"></i>专家</a></option></select></td></tr>';
				}else if(e.role===0){
					html = '<tr><td class="center">'+e.id+'</td>'+
							'<td><img src="'+e.head+'" width="100" height="100" alt="用户头像" /></td>'+
							'<td class="hidden-xs">'+e.name+'</td>'+
							'<td>'+e.sign+'</td>'+
							'<td class="center" style="min-width:120px">'+
							'	<select class="form-control roles">'+
							'	    <option value=9><a href="#" name="a-role" val="9"><i class="fa fa-user-md"></i>管理员 </a></option>'+
							'	    <option value=0 selected><a href="#" name="a-role" val="0"><i class="fa fa-user"></i>普通用户</a></option>'+
							'	    <option value=1><a href="#" name="a-role" val="1"><i class="fa fa-film"></i>专家</a></option></select></td></tr>';
				}else if(e.role===9){
					html = '<tr><td class="center">'+e.id+'</td>'+
							'<td><img src="'+e.head+'" width="100" height="100" alt="用户头像" /></td>'+
							'<td class="hidden-xs">'+e.name+'</td>'+
							'<td>'+e.sign+'</td>'+
							'<td class="center"style="min-width:120px">'+
							'	<select class="form-control roles">'+
							'	    <option value=9 selected><a href="#" name="a-role" val="9"><i class="fa fa-user-md"></i>管理员 </a></option>'+
							'	    <option value=0><a href="#" name="a-role" val="0"><i class="fa fa-user"></i>普通用户</a></option>'+
							'	    <option value=1><a href="#" name="a-role" val="1"><i class="fa fa-film"></i>专家</a></option></select></td></tr>';("#role").find("option[value='9']").attr("selected","selected");
				}
				$("#projects").find("tbody").append(html);
			});
		}
	});
};

// 修改用户角色方法
function editRole(_id,roleVal){
	$.ajax({
		type:"PUT",
		url: _href + interfacelist.role,
		async:true,
		data:{
			id: _id,
			role: roleVal,
			token: localStorage.token
		},
		success: function(data){
			if (data.code===1 || data.msg === "success") {
				alert("修改成功！");
			}
		},
		error:function(d){
			alert("修改失败！"+d.statusText);
		}
	});
}

// 新闻观点列表
function newViewpoint(n,type,status){
	var _src;
	console.log(typeof(type))
	if (type==3) {
		_src = "viewpoint_desc";
	} else if(type==4){
		_src = "hotspot_desc";
	}
	$.ajax({
		type:"get",
		url: _href + interfacelist.feed,
		async:true,
		data:{
			token: localStorage.token,
			type: type,
			page: n,
			status: status
		},
		success: function(data){
			console.log(data);panel_all
			$.each(data, function(i,e) {
				var statushtml;
				if (e.status===0) {
					statushtml ='<a href="#" class="btn btn-light-blue pass" data-id="'+e.id+'" title="审核通过">通过</a>'+
						'		<a href="#" class="btn btn-light-blue nopass" data-id="'+e.id+'" title="不通过">不通过</a>'+
						'		<a href="#" class="btn btn-red delete" data-id="'+e.id+'" data-toggle="modal" data-target="#myDelModal" title="删除新闻">删除</a>';
				} else if(e.status===1){
					statushtml ='<a href="#" class="btn btn-red delete" data-id="'+e.id+'" data-toggle="modal" data-target="#myDelModal" title="删除新闻">删除</a>';
				}else if(e.status=== (-100)){
					statushtml ='';
				}else if(e.status=== (-1)){
					statushtml ='<a href="#" class="btn btn-light-blue pass" data-id="'+e.id+'" title="审核通过">通过</a>'+
						'		<a href="#" class="btn btn-red delete" data-id="'+e.id+'" data-toggle="modal" data-target="#myDelModal" title="删除新闻">删除</a>';
				}
				var html = '<tr><td class="center">'+e.id+'</td>'+
						'<td><a href="http://m.jjrb.grsx.cc/'+_src+'.html?id='+e.id+'" target="_blank">'+e.title+'</a></td>'+
						'<td class="hidden-xs"><a href="http://m.jjrb.grsx.cc/'+_src+'.html?id='+e.owner.id+'" target="_blank">'+e.owner.name+'</a></td>'+
						'<td class="center"><a href="javascript:;" class="btn btn-primary nvDescp" data-toggle="modal" data-target="#myModal" title="查看详情" data-id="'+e.id+'">详情</a></td>'+
						'<td class="center"><div>'+ statushtml +'</div></td></tr>';
				switch (status){
					case "0":
						$("#panel_check_pending").find("tbody").append(html);
						break;
					case "-1":
						$("#panel_refer").find("tbody").append(html);
						break;
					case "-100":
						$("#panel_del").find("tbody").append(html);
						break;
					default:
						$("#panel_all").find("tbody").append(html);
						break;
				}
				
			});
			
						
		}
	});
}
