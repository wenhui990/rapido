$('header').load('header.html');
$('footer').load('footer.html');
//接口
var _href = "http://api.jjrb.grsx.cc",//"http://test.api.wantscart.com",
	interfacelist = {
		user_all: "/user/list",  //所有用户
		role: "/user/role",
		feed: "/feed/",
		group: "/data2/group/",
//		edit_indicator: "/data2/indicator/",  //put + id
		country: "/data2/country/",
		indicator: "/data2/indicator/",
		select_indicator: "/data2/indicator/k/", //查询indicator
		select_country: "/data2/country/k/", //查询国家/data/country/k/{val}
	},n=1;


// 点击左侧导航事件
$(document).on('click',".navlist_a",function(){
	console.log($(this).attr("href"));
	$('.toolbar page-header h1').html($(this).text());
	window.location.href = $(this).attr("href");
});

$(document).on("click",".panel-heading",function(e){
    /*切换折叠指示图标*/
    $(this).find("span").toggleClass("glyphicon-chevron-down");
    $(this).find("span").toggleClass("glyphicon-chevron-right");
});

// 左侧导航鼠标移入移出事件
$(document).on("mouseenter",".lists_c",function(){
	$(this).css("background","#e66b6b");
});
$(document).on("mouseleave",".lists_c",function(){
	$(this).css("background","#22262f");
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
	alert('审核成功');
	window.location.reload();
});

// 点击不通过
$(document).on("click",".nopass",function(){
	var _id = $(this).attr("data-id");
	var type = "post",
		_url = _href + interfacelist.feed + _id + "/nopass";
	manageNV(type,_url);
	alert('审核成功');
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
		url: _url+'?token='+localStorage.token,
		async:true,
		success: function(data){
			if (type==='delete') {
				console.log("delete"+data);
			} else{
				$("#modalHtml").html('');
				console.log("其他"+data);
				$("#modalHtml").append(data);
			}
			window.location.reload();
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
				if(e.role===0){
					html = '<tr><td class="center">'+e.id+'</td>'+
							'<td><img src="'+e.head+'" width="100" height="100" alt="用户头像" /></td>'+
							'<td class="hidden-xs">'+e.name+'</td>'+
							'<td>'+e.sign+'</td>'+
							'<td class="center" style="min-width:120px">'+
							'	<select class="form-control roles">'+
							'	    <option value=9><a href="#" name="a-role" val="9"><i class="fa fa-user-md"></i>管理员 </a></option>'+
							'	    <option value=0 selected><a href="#" name="a-role" val="0"><i class="fa fa-user"></i>普通用户</a></option>'+
							'	    <option value=1><a href="#" name="a-role" val="1"><i class="fa fa-film"></i>专家</a></option></select></td></tr>';
				}else if(e.role===1||e.role===2){
					html = '<tr><td class="center">'+e.id+'</td>'+
							'<td><img src="'+e.head+'" width="100" height="100" alt="用户头像" /></td>'+
							'<td class="hidden-xs">'+e.name+'</td>'+
							'<td>'+e.sign+'</td>'+
							'<td class="center"style="min-width:120px">'+
							'	<select class="form-control roles">'+
							'	    <option value=9><a href="#" name="a-role" val="9"><i class="fa fa-user-md"></i>管理员 </a></option>'+
							'	    <option value=0><a href="#" name="a-role" val="0"><i class="fa fa-user"></i>普通用户</a></option>'+
							'	    <option value=1 selected><a href="#" name="a-role" val="1"><i class="fa fa-film"></i>专家</a></option></select></td></tr>';
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
	var _src,_src_user="my_viewpoint";
//	console.log(typeof(type))
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
//			console.log(data);
			$.each(data, function(i,e) {
				var statushtml,now_status;
				if (e.status===0) {
					statushtml ='<a href="#" class="btn btn-success btn-xs pass" data-id="'+e.id+'" title="审核通过"><span class="glyphicon glyphicon-ok"></span></a>'+
						'		<a href="#" class="btn btn-light-blue btn-xs nopass" data-id="'+e.id+'" title="不通过"><span class="glyphicon glyphicon-ban-circle"></span></a>'+
						'		<a href="#" class="btn btn-red btn-xs delete" data-id="'+e.id+'" data-toggle="modal" data-target="#myDelModal" title="删除新闻"><span class="glyphicon glyphicon-remove"></span></a>';
						now_status = '<span class="status_txt">待审核</span>';
				} else if(e.status===1){
					statushtml ='<a href="#" class="btn btn-red btn-xs delete" data-id="'+e.id+'" data-toggle="modal" data-target="#myDelModal" title="删除新闻"><span class="glyphicon glyphicon-remove"></span></a>';
					now_status = '已审核';
				}else if(e.status=== (-100)){
					statushtml ='';
					now_status = '已删除';
				}else if(e.status=== (-1)){
					statushtml ='<a href="#" class="btn btn-success btn-xs pass" data-id="'+e.id+'" title="审核通过"><span class="glyphicon glyphicon-ok"></span></a>'+
						'		<a href="#" class="btn btn-red btn-xs delete" data-id="'+e.id+'" data-toggle="modal" data-target="#myDelModal" title="删除新闻"><span class="glyphicon glyphicon-remove"></span></a>';
					now_status = '未通过';
				}
				var html = '<tr><td class="center">'+e.id+'</td>'+
						'<td><a href="http://m.jjrb.grsx.cc/'+_src+'.html?id='+e.id+'" target="_blank">'+e.title+'</a></td>'+
						'<td class="hidden-xs"><a href="http://m.jjrb.grsx.cc/'+_src_user+'.html?id='+e.owner.id+'" target="_blank">'+e.owner.name+'</a></td>'+
						'<td class="center"><a href="javascript:;" class="btn btn-primary btn-xs nvDescp" data-toggle="modal" data-target="#myModal" title="查看详情" data-id="'+e.id+'">详情</a></td>'+
						'<td>'+now_status+'</td>'+
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

// indicator国家分组
function indicatorAndCountryGroup(n,type){
	var _id,all_url,all_data;
	console.log(type);
	all_data={
			page:n,
			token: localStorage.token
		};
	if(type.indexOf("group")>=0){
		all_url = _href + interfacelist.group;
	}else if(type.indexOf("country")>=0){
		all_url = _href + interfacelist.country;
	}else if(type.indexOf("indicator.html")>=0){
		all_url = _href + interfacelist.indicator;
	}
	// 加载分组
	$.ajax({
		type:"get",
		url: all_url,
		async:true,
		data: all_data,
		success: function(data){
			$.each(data, function(i,e) {
				if(type.indexOf("group")>=0){ //指标分组
					var _type ;
					switch (e.type){
						case 1:
							_type = "分类分组";
							break;
						case 2:
							_type = "自定义";
							break;
						case 3:
							_type = "国际";
							break;
						case 4:
							_type = "国内";
							break;
					}
					var html = '<tr><td class="center"><a href="indicator_group_desc.html?id='+e.id+'">'+e.id+'</a></td>'+
							'<td><input type="text" name="indicatorName" id="indicatorName" value="'+e.name+'" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="'+e.id+'" title="修改名称"><span class="glyphicon glyphicon-edit"></span></a>'+
							'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td>'+
							'<td class="hidden-xs"><input type="text" name="indicatorDescpG" id="indicatorDescpG" value="'+e.descp+'" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="'+e.id+'" title="修改描述"><span class="glyphicon glyphicon-edit"></span></a>'+
							'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td>'+
							'<td class="hidden-xs">'+_type+'</td>'+
							'<td class="hidden-xs"><a href="#myDelModal" class="del_indicator_group" data-toggle="modal" data-target="#myDelModal" data-id="'+e.id+'" title="删除分组指标"><span class="glyphicon glyphicon-remove-sign"></span></a></td></tr>';
					$('#indicator_group_datas').append(html);
				}else if(type.indexOf("indicator.html")>=0){ //指标
					var html = '<tr><td class="center">'+e.pid+'</td>'+
								'<td><input type="text" name="indicatorEnName" id="indicatorEnName" value="'+e.name_en+'" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="'+e.pid+'" title="修改英文名称"><span class="glyphicon glyphicon-edit"></span></a>'+
								'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td>'+
								'<td class="hidden-xs"><input type="text" name="indicatorCnName" id="indicatorCnName" value="'+e.name_zh+'" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="'+e.pid+'" title="修改中文名称"><span class="glyphicon glyphicon-edit"></span></a>'+
								'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td>'+
								'<td class="hidden-xs"><input type="text" name="indicatorDescp" id="indicatorDescp" value="'+e.descp+'" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="'+e.pid+'" title="修改描述"><span class="glyphicon glyphicon-edit"></span></a>'+
								'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td></tr>';
					$('#indicator_datas').append(html);
				}else if(type.indexOf("country")>=0){ //国家
					var html = '<tr><td class="center">'+e.pid+'</td>'+
								'<td><input type="text" name="countryEnName" id="countryEnName" value="'+e.name_en+'" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="'+e.pid+'" title="修改英文名称"><span class="glyphicon glyphicon-edit"></span></a>'+
								'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td>'+
								'<td class="hidden-xs"><input type="text" name="countryCnName" id="countryCnName" value="'+e.name_zh+'" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="'+e.pid+'" title="修改中文名称"><span class="glyphicon glyphicon-edit"></span></a>'+
								'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td></tr>';
					$('#country_datas').append(html);
				}
				
			});
		},
		error: function(data){
			console.log(data);
		}
	});
	
	
	// 点击修改，输入框可编辑-显示确定取消按钮
	$(document).on('click','.indicator_edit',function(){
		$(this).hide();
		$(this).next().show();
		$(this).prev().removeAttr("disabled").focus();
		_id = $(this).attr("data-id");
//		console.log($(this).next());
	});
	
	// 确定修改
	$(document).on('click','.edit_ok',function(){
		$(this).parent().hide();
		$(this).parent().prev().show();
		var $input = $(this).parent().prevAll('input'),data,_url;
		$input.attr('disabled','disabled');
		var _idName = $input.attr("id");
		if (type.indexOf("group")>=0) {
			_url = _href + interfacelist.group + _id;
			if (_idName.indexOf('indicatorName')>=0) {
				data = {
					token: localStorage.token,
					name: $input.val()
				}
			} else if (_idName.indexOf('indicatorDescpG')>=0){
				data = {
					token: localStorage.token,
					descp: $input.val()
				}
			}
		}else if(type.indexOf("country")>=0){
			_url = _href + interfacelist.country + _id;
			if (_idName.indexOf('countryCnName')>=0) {
				data = {
					token: localStorage.token,
					name_zh: $input.val()
				}
			} else if (_idName.indexOf('countryEnName')>=0){
				data = {
					token: localStorage.token,
					name_en: $input.val()
				}
			}
		}else if(type.indexOf("indicator.html")>=0){
			_url = _href + interfacelist.indicator + _id;
			if (_idName.indexOf('indicatorCnName')>=0) {
				data = {
					token: localStorage.token,
					name_zh: $input.val()
				}
			} else if (_idName.indexOf('indicatorEnName')>=0){
				data = {
					token: localStorage.token,
					name_es: $input.val()
				}
			} else if (_idName.indexOf('indicatorDescp')>=0){
				data = {
					token: localStorage.token,
					descp: $input.val()
				}
			}
		}
		$.ajax({
			type:"put",
			url: _url,
			async:true,
			data: data,
			success: function(data){
				if(data.code===1){
					alert("修改成功！");
				}else{
					alert("修改失败！");
				}
				console.log(data);
			},
			error: function(data){
				console.log(data);
			}
		});
	});
	
	// 取消
	$(document).on('click','.edit_change',function(){
		$(this).parent().hide();
		$(this).parent().prev().show();
		$(this).parent().prevAll('input').attr('disabled','disabled');
	});
}


//获取url中字段
function getUrlParams() {
	var params = {};
	var url = window.location.href;
	var idx = url.indexOf("?");
	if(idx > 0) {
		var queryStr = url.substring(idx + 1);
		var args = queryStr.split("&");
		for(var i = 0, a, nv; a = args[i]; i++) {
			nv = args[i] = a.split("=");
			params[nv[0]] = nv.length > 1 ? nv[1] : true;
		}
	}
	return params;
};

