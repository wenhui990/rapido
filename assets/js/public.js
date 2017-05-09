$('header').load('header.html');
$('footer').load('footer.html');
$('#dialogPubic').load('login.html');
//接口
var _href = "http://api.jjrb.grsx.cc", //"http://test.api.wantscart.com",
	interfacelist = {
		user_all: "/user/list", //所有用户
		seach_user: "/user",
		role: "/user/role",
		user: "/user/",
		feed: "/feed/",
		group: "/data2/group/",
		//		edit_indicator: "/data2/indicator/",  //put + id
		country: "/data2/country/",
		indicator: "/data2/indicator/",
		select_indicator: "/data2/indicator/k/", //查询indicator
		select_country: "/data2/country/k/", //查询国家/data/country/k/{val}
		phone_code: "/login", //"/api/login", //手机验证码get?phone=
		phone_login: "/login", //"/api/login", //手机登录post  phone=&code=
		wx: "/login/wx",
	},
	n = 1,
	token = localStorage.token || $.cookie('token'),
	uid = localStorage.userId || $.cookie('id');
	
// 是否管理员
function isAdmin(uid){
	$.ajax({
		type:"get",
		url:_href + interfacelist.user + uid,
		async:true,
		success: function(data){
			console.log(data.role);
			if(data.role!=9){
				$('#dialogPulic').find('.modal-body').text("只有管理员才可登录后台，请联系管理员授权！");
				$('#dialogPulic').modal('show');
				$('#dialogPulic').on('hide.bs.modal',function(){
					$('.wxPhoneLogin').show();
					$('.login_phone').click();
				});
			}
		}
	});
	
};

//点击登录区域阻止冒泡
$("#phone div.modal-body,#WeChat div.modal-body").on("click", function(e) {
	e.stopPropagation();
});

//$("body").click(function() {
//	$("#phone").hide();
//	$("#WeChat").hide();
//	//		$(".collects_title_right").click();
//	//		$(".dropdown").addClass("open");
//	$(document.body).css({
//		"overflow": "auto"
//	});
//});

// 退出登录
$('.log-out').click(function() {
	localStorage.clear();
	$.cookie('token', '', {
		'domain': '.jjrb.grsx.cc',
		'path': '/',
		'expires': -1
	});
	location.reload();
});

//微信登陆界面 
$(document).on("click", '.login_wx', function(e) {
	//			e.stopPropagation();
	//			alert(a+"==="+b);
	$(document.body).css({
		"overflow": "hidden"
	});

	$('#WeChat').show();
	$('#phone').hide();
	var obj = new WxLogin({
		id: "wx",
		appid: "wxf7eec57ef58d6a4b",
		redirect_uri: encodeURIComponent('http://api.jjrb.grsx.cc/login/wx?f=' + encodeURIComponent(location.href)),
		state: Math.ceil(Math.random() * 1000),
		scope: 'snsapi_login',
		style: "",
		href: ""
	});
});
$(document).on("click", '.login_phone', function(e) {
	$('#WeChat').hide();
	$('#phone').show();
});

//点击验证码登录
$(document).on("click", ".phone_code", function() {
	$("#input_password,.phone_code").hide();
	$(".fg_hide").show();
	$(".btn_login").addClass("phone_code_login");
	$(".btn_login").removeClass("phone_login");
	$("#input_Phone").focus();
});
//获取验证码
$(document).stop(true, true).on("click", "#code_btn", function(e) {
	var _phone = $("#input_Phone").val();
	if(_phone.length < 11 || _phone == "" || _phone.length > 11) {
		$('#dialogPulic').find('.modal-body').text("请输入正确的手机号");
		$('#dialogPulic').modal('show');
		return;
	}
	console.log(interfacelist)
	//		return;
	$("#code_btn1").show();
	$("#code_btn").hide();
	code_time();
	$.ajax({
		type: "get",
		url: _href + interfacelist.phone_code,
		data: {
			phone: _phone
		},
		success: function(e) {
			$('#dialogPulic').find('.modal-body').text("发送成功");
			$('#dialogPulic').modal('show');
		}
	});
});
//点击手机号号登录
$(document).on("click", ".phone_no", function() {
	$("#input_password,.phone_code").show();
	$(".fg_hide").hide();
	$(".btn_login").addClass("phone_login");
	$(".btn_login").removeClass("phone_code_login");
	$("#input_Phone").focus();
});
//登录
$(document).on("click", ".btn_login", function() {

	var _classname = $(this).attr("class"),
		_phone = $("#input_Phone").val(),
		_code;
	console.log(_classname);
	if(_classname.indexOf("phone_login") >= 0) {
		console.log("手机号密码登录");
		if(forms(true, false)) {
			forms(true, false);
		} else {
			return false;
		}
		_code = $("#input_password").val();
		$.ajax({
			type: "post",
			url: _href + interfacelist.phone_login,
			data: {
				phone: _phone,
				code: _code
			},
			success: function(e) {
				$('#dialogPulic').find('.modal-body').text("登录成功");
				$('#dialogPulic').modal('show');
				console.log(e);
				if(data != 'success') {
					//location.href= data;//"http://wap.wantscart.com/admin/login?from="+location.href;
				}
			},
			error: function(e) {
				$('#dialogPulic').find('.modal-body').text('登录失败！');
				$('#dialogPulic').modal('show');
			}
		});
	} else if(_classname.indexOf("phone_code_login") >= 0) {
		console.log("手机号验证码登录");
		console.log(!forms(false, true));
		if(forms(false, true)) {
			$("#input_Phone_code").focus();
			return;
		}
		_code = $("#input_Phone_code").val();
		localStorage.phone = _phone;
		console.log(_code);
		$.ajax({
			type: "post",
			url: _href + interfacelist.phone_login,
			data: {
				phone: _phone,
				code: _code
			},
			success: function(e) {
				console.log(e);
				if(e.msg == "无效的短信验证码") {
					$('#dialogPulic').find('.modal-body').text('无效的验证码！');
					$('#dialogPulic').modal('show');
					console.log(e.detail + "===");
					return false;
				}
				console.log("登录成功！");
				localStorage.token = e.token;
				localStorage.userId = e.user.id;
				localStorage.userName = e.user.name;
				localStorage.head = e.user.head;
				localStorage.role = e.user.role;
				$("#phone").hide();
				location.reload();
			},
			error: function() {
				console.log("登陆失败！")
			}
		});
	}
});

// token判断
setTimeout(function() {
	if(!token) {
		$('.wxPhoneLogin').show();
		$('.login_phone').click();
	} else {
		isAdmin(uid);
		var _img;
		$('.wxPhoneLogin').hide();
		$('nav').find('h4.no-margin').text(localStorage.userName || decodeURIComponent($.cookie('name')));
		if(localStorage.head || $.cookie('head')) {
			_img = localStorage.head || $.cookie('head');
		} else {
			_img = 'assets/images/anonymous.jpg';
		}
		$('#role_img').find('img').attr('src', _img);
	}
}, 500);

// 点击左侧导航事件
$(document).on('click', ".navlist_a", function() {
	console.log($(this).attr("href"));
	$('.toolbar page-header h1').html($(this).text());
	sessionStorage.nav_parentId = $(this).parents('div').attr('id');
	sessionStorage.nav_index = $(this).parent().index();
	window.location.href = $(this).attr("href");
});

$(document).on("click", ".panel-heading", function(e) {
	/*切换折叠指示图标*/
	$(this).find("span").toggleClass("glyphicon-chevron-down");
	$(this).find("span").toggleClass("glyphicon-chevron-right");
});

// 左侧导航鼠标移入移出事件
$(document).on("mouseenter", ".lists_c", function() {
	$(this).css("background", "#e66b6b");
});
$(document).on("mouseleave", ".lists_c", function() {
	$(this).css("background", "#22262f");
	var _navId = sessionStorage.nav_parentId;
	var _navindex = sessionStorage.nav_index;
	$('#' + _navId).find('.navlist_a').eq(_navindex).mouseover();
});

// 左侧导航刷新后记忆上次选中
setTimeout(function() {
	if(sessionStorage.nav_parentId) {
		var _navId = sessionStorage.nav_parentId;
		var _navindex = sessionStorage.nav_index;
		$('#' + _navId).addClass('in').prev().find('span').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
		$('#' + _navId).find('.navlist_a').eq(_navindex).mouseover();
	}
	// 点击其他导航清除记忆
	$('.leftMenu>li').click(function() {
		sessionStorage.clear();
	});
	// 弹窗高度
	var dialogHeight = $('#dialogPulic').find('.modal-content').height();
	var windowHeight = $(window).height();
	var dialogTop = (windowHeight / 2) - 170;
	$('#dialogPulic').css('top', dialogTop + 'px');
}, 600);

// 弹窗高度
//var dialogHeight = $('#dialogPulic').find('.modal-content').height();
//var windowHeight = $(window).height();
//var dialogTop = (windowHeight/2) - (windowHeight/2);
//$('#dialogPulic').css('top',dialogTop);

dialogPubic();
// 公用弹窗
function dialogPubic() {
	var dialogHtml = '<div class="modal fade bs-example-modal-sm" id="dialogPulic" tabindex="-1" role="dialog">' +
		'<div class="modal-dialog modal-sm" role="document">' +
		'<div class="modal-content">' +
		'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">信息</h4></div>' +
		'	<div class="modal-body">确定删除吗？</div>' +
		'	<div class="modal-footer"><button type="button" data-dismiss="modal" class="btn btn-success del_btn_ok">确定</button></div>' +
		'</div></div></div>';
	$('body').append(dialogHtml);
}

// 点击详情
$(document).on('click', '.nvDescp', function() {
	var _id = $(this).attr("data-id"),
		descp = '';
	$("#modalHtml").html('');
	$.ajax({
		type: "get",
		url: _href + interfacelist.feed + _id,
		async: true,
		data: {
			token: token
		},
		success: function(data) {
			console.log(data);
			$("h4.modal-title").text(data.title);
			descp += '<div style="margin:10px auto;" id="header_img"><img src="' + data.cover + '" alt="热点图" class="hotspot_img" /></div>';
			var a = $("<div></div>");
			data.resources.forEach(function(res, inx) {
				//				console.log(res);
				var type = res.type;
				if(type === 12) { //图片
					descp += '<img src="' + res.uri + '">'
				} else if(type === 13) { //文本
					descp += '<p>' + res.descp + '</p>'
				} else if(type === 15) { //数据
					var _id = '';
					if(res.descp) {
						res.descp.length < 0 ? echarts_data = res.descp : echarts_data = JSON.parse(res.descp);
						_id = echarts_data.id_val;
					}
					descp += '<div id="' + _id + '" style="min-height:500px;"></div>'
				} else {
					descp += res.descp
				}
			});
			$("#modalHtml").append(descp);
		},
		error: function(data, err) {
			console.log(err);
		}
	});
});

// 点击通过审核
$(document).on("click", ".pass", function() {
	var _id = $(this).attr("data-id");
	var type = "post",
		_url = _href + interfacelist.feed + _id + "/pass";
	manageNV(type, _url, 'pass');
	$(this).hide();
	$(this).next('.nopass').hide();
	$(this).parent().parent().prev().find('span').text("已审核").css('color', '#8b91a0');
	//	window.location.reload();
});

// 点击不通过
$(document).on("click", ".nopass", function() {
	var _id = $(this).attr("data-id");
	var type = "post",
		_url = _href + interfacelist.feed + _id + "/nopass";
	manageNV(type, _url);
	$(this).hide();
	$(this).parents('tr').remove();
});


var newViewpointDelId,newViewpointDelThis;
// 点击删除
$(document).on("click", ".delete", function() {
//	$('#myDelModal .modal-footer').find('button.btn-success').addClass('del_btn');
	newViewpointDelId = $(this).attr("data-id");
	newViewpointDelThis = $(this);
	$('#myDelModal').modal('show');
});
$('#myDelModal').on('click', '.del_btn', function() {
//	console.log(newViewpointDelId);
	$('#myDelModal').modal('hide');
	var type = "delete",
	_url = _href + interfacelist.feed + newViewpointDelId + '?token=' + token;
	manageNV(type, _url);
	newViewpointDelThis.parents('tr').remove();
});

// 管理新闻和观点（审核、删除、通过不通过）
function manageNV(type, _url, pass) {
	$.ajax({
		type: type,
		url: _url + '?token=' + token,
		async: false,
		success: function(data) {
			if(data.msg === 'success') {
				if(type === 'delete') {
					$('#myDelModal').modal('hide');
					$('#dialogPulic').find('.modal-body').text('删除成功！');
					$('#dialogPulic').modal('show');
//					$('#myDelModal').off();
//					$('button.del_btn').off();
				} else {
					if(pass) {
						$('#dialogPulic').find('.modal-body').text('审核成功！');
						$('#dialogPulic').modal('show');
					} else {
						$('#dialogPulic').find('.modal-body').text('审核不通过成功！');
						$('#dialogPulic').modal('show');
					}
				}
			}
			if(data.msg !== 'success') {
				$('#dialogPulic').find('.modal-body').text('修改失败！');
				$('#dialogPulic').modal('show');
//				return;
			}
			//			window.location.reload();
		},
		error: function(err) {
			$('#dialogPulic').modal('show');
			return false;
		}
	});
}

// 加载用户列表方法
function loadUsers(n, role, id, name) {
	var _url;
	switch(role) {
		case '0':
			_url = _href + interfacelist.user_all + '/0';
			break;
		case '1':
			_url = _href + interfacelist.user_all + '/1';
			break;
		case '2':
			_url = _href + interfacelist.user_all + '/2';
			break;
		case '9':
			_url = _href + interfacelist.user_all + '/9';
			break;
		case 'w':
			_url = _href + interfacelist.seach_user + '/w/' + name;
			break;
		default:
			_url = _href + interfacelist.user_all;
			break;
	}
	$(id).find("tbody").html('');
	$.ajax({
		type: "get",
		url: _url,
		async: true,
		data: {
			token: token,
			page: n
		},
		success: function(data) {
			$('.loading').hide();
			if(data.length){
				$.each(data, function(i, e) {
					var html;
					var _head = e.head ? e.head : 'assets/images/anonymous.jpg';
					html = '<tr><td class="center">' + e.id + '</td>' +
							'<td><img src="' + _head + '" width="100" height="100" alt="用户头像" /></td>' +
							'<td class="hidden-xs">' + e.name + '</td>' +
							'<td>' + e.sign + '</td>' +
							'<td class="center" style="min-width:120px">' +
							'	<select class="form-control roles roles'+i+'">' +
							'	    <option value=9><a href="#" name="a-role" val="9"><i class="fa fa-user-md"></i>管理员 </a></option>' +
							'	    <option value=0><a href="#" name="a-role" val="0"><i class="fa fa-user"></i>普通用户</a></option>' +
							'	    <option value=1><a href="#" name="a-role" val="1"><i class="fa fa-film"></i>专家</a></option>' +
							'<option value=2><a href="#" name="a-role" val="2"><i class="fa fa-film"></i>系统账户</a></option></select></td>' +
							'<td class="edit_role" data-id="' + e.id + '"><button class="btn btn-primary btn-xs">修改</button></td></tr>';
					$(id).find("tbody").append(html);
	//				if(role === 'w'){
						switch (e.role){
							case 9:
								$('.roles'+i).find('option[value=9]').attr('selected','true');
								break;
							case 2:
								$('.roles'+i).find('option[value=2]').attr('selected','true');
								break;
							case 1:
								$('.roles'+i).find('option[value=1]').attr('selected','true');
								break;
							case 0:
								$('.roles'+i).find('option[value=0]').attr('selected','true');
								break;
							default:
								break;
						}
	//				}else{
	//					$('option[value='+e.role+']').attr('selected','true');
	//				}
					
					
				});
			}
		}
	});
};

// 修改用户角色-更改资料方法
function editRole(_id, roleVal, all) {
	var _url, _data;
	if(all) {
		_url = _href + interfacelist.user + _id;
		_data = {
			name: $('#inputName').val(),
			gender: $(':radio[name="gender"]:checked').val(),
			sign: $('#inputSign').val(),
			intro: $('#inputIntro').val(),
			head: $('#imgShow').attr('src'),
			token: token
		};
	} else {
		_url = _href + interfacelist.role;
		_data = {
			id: _id,
			role: roleVal,
			token: token
		}
	}
	$.ajax({
		type: "PUT",
		url: _url,
		async: false,
		data: _data,
		success: function(data) {
			if(data.code === 1 || data.msg === "success") {
				$('#dialogPulic').find('.modal-body').text('修改成功！');
				$('#dialogPulic').modal('show');
			} else {
				$('#dialogPulic').find('.modal-body').text('修改失败！');
				$('#dialogPulic').modal('show');
			}
//			loadUsers(glUser.userN,glUser.userRole,glUser.userId,glUser.userName);
			roleTabClick(glUser.userN);
		},
		error: function(d) {
			$('#dialogPulic').find('.modal-body').text("修改失败！" + d.statusText);
			$('#dialogPulic').modal('show');
		}
	});
}

// 切换用户列表
function roleTabClick(n) {
	var _url = window.location.href;
	var tabId = _url.split('#')[1];
	$('#' + tabId).click().addClass('active in').siblings().removeClass('active in');
	switch(tabId) {
		case 'panel_common':
			$("#myTab4").find('li').eq(1).click().addClass('active').siblings().removeClass('active');
			break;
		case 'panel_expert':
			$("#myTab4").find('li').eq(2).click().addClass('active').siblings().removeClass('active');
			break;
		case 'panel_admin':
			
			$("#myTab4").find('li').eq(3).click().addClass('active').siblings().removeClass('active');
			break;
		case 'panel_system':
			$("#myTab4").find('li').eq(4).click().addClass('active').siblings().removeClass('active');
			break;
		case 'panel_search':
			$("#myTab4").find('li').eq(5).click().addClass('active').siblings().removeClass('active');
			break;
		default:
			$("#myTab4").find('li').eq(0).click().addClass('active').siblings().removeClass('active');
			break;
	}
}

// 新闻观点列表
function newViewpoint(n, type, status, id) {
	var _src, _src_user = "my_viewpoint";
	//	console.log(typeof(type))
	$('.tab-content').find('tbody').html('');
	if(type == 3) {
		_src = "viewpoint_desc";
	} else if(type == 4) {
		_src = "hotspot_desc";
	}
	$.ajax({
		type: "get",
		url: _href + interfacelist.feed,
		async: true,
		data: {
			token: token,
			type: type,
			page: n,
			status: status
		},
		success: function(data) {
			//			console.log(data);
			$('.loading').hide();
			if(!data.length || data === '') {
				$('.tab-content').find('tbody').html('<td style="text-align:center;padding:10px 0" colspan="5">没有内容！</td>');
			}

			$.each(data, function(i, e) {
				var statushtml, now_status;
				if(e.status === 0) {
					statushtml = '<a href="#" class="btn btn-success btn-xs pass" data-id="' + e.id + '" title="审核通过"><span class="glyphicon glyphicon-ok"></span></a>' +
						'		<a href="#" class="btn btn-light-blue btn-xs nopass" data-id="' + e.id + '" title="不通过"><span class="glyphicon glyphicon-ban-circle"></span></a>' +
						'		<a href="#" class="btn btn-red btn-xs delete" data-id="' + e.id + '"  title="删除新闻"><span class="glyphicon glyphicon-remove"></span></a>';
					now_status = '<span class="status_txt">待审核</span>';
				} else if(e.status === 1) {
					statushtml = '<a href="#" class="btn btn-red btn-xs delete" data-id="' + e.id + '"  title="删除新闻"><span class="glyphicon glyphicon-remove"></span></a>';
					now_status = '已审核';
				} else if(e.status === (-100)) {
					statushtml = '';
					now_status = '已删除';
				} else if(e.status === (-1)) {
					statushtml = '<a href="#" class="btn btn-success btn-xs pass" data-id="' + e.id + '" title="审核通过"><span class="glyphicon glyphicon-ok"></span></a>' +
						'		<a href="#" class="btn btn-red btn-xs delete" data-id="' + e.id + '"  title="删除新闻"><span class="glyphicon glyphicon-remove"></span></a>';
					now_status = '未通过';
				}
				var html = '<tr><td class="center">' + e.id + '</td>' +
					'<td><a href="http://m.jjrb.grsx.cc/' + _src + '.html?id=' + e.id + '" target="_blank">' + e.title + '</a></td>' +
					'<td class="hidden-xs"><a href="http://m.jjrb.grsx.cc/' + _src_user + '.html?id=' + e.owner.id + '" target="_blank">' + e.owner.name + '</a></td>' +
					'<td class="center"><a href="javascript:;" class="btn btn-primary btn-xs nvDescp" data-toggle="modal" data-target="#myModal" title="查看详情" data-id="' + e.id + '">详情</a></td>' +
					'<td>' + now_status + '</td>' +
					'<td class="center"><div>' + statushtml + '</div></td></tr>';
				switch(status) {
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

// 新闻观点tab标签点击事件
function newViewpointTabClick(n, type) {
	var _url = window.location.href;
	var tabId = _url.split('#')[1];
	$('#' + tabId).addClass('active in').siblings().removeClass('active in');
	switch(tabId) {
		case 'panel_check_pending':
//			newViewpoint(n, type, 0);
			$("#myTab4").find('li').eq(1).click().addClass('active').siblings().removeClass('active');
			break;
		case 'panel_refer':
//			newViewpoint(n, type, -1);
			$("#myTab4").find('li').eq(2).click().addClass('active').siblings().removeClass('active');
			break;
		case 'panel_del':
//			newViewpoint(n, type, -100);
			$("#myTab4").find('li').eq(3).click().addClass('active').siblings().removeClass('active');
			break;
		default:
//			newViewpoint(n, type);
			$("#myTab4").find('li').eq(0).click().addClass('active').siblings().removeClass('active');
			break;
	}
}

// indicator国家分组
function indicatorAndCountryGroup(n, type) {
	var _id, all_url, all_data;
	console.log(type);
	all_data = {
		page: n,
		token: token
	};
	if(type.indexOf("group") >= 0) {
		all_url = _href + interfacelist.group;
	} else if(type.indexOf("country") >= 0) {
		all_url = _href + interfacelist.country;
	} else if(type.indexOf("indicator.html") >= 0) {
		all_url = _href + interfacelist.indicator;
	}
	// 加载分组
	$.ajax({
		type: "get",
		url: all_url,
		async: true,
		data: all_data,
		success: function(data) {
			$('#loading').hide();
			$.each(data, function(i, e) {
				if(type.indexOf("group") >= 0) { //指标分组
					var _type;
					switch(e.type) {
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
					var html = '<tr><td class="center"><a href="indicator_group_desc.html?id=' + e.id + '">' + e.id + '</a></td>' +
						'<td><input type="text" name="indicatorName" id="indicatorName" value="' + e.name + '" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="' + e.id + '" title="修改名称"><span class="glyphicon glyphicon-edit"></span></a>' +
						'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td>' +
						'<td class="hidden-xs"><input type="text" name="indicatorDescpG" id="indicatorDescpG" value="' + e.descp + '" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="' + e.id + '" title="修改描述"><span class="glyphicon glyphicon-edit"></span></a>' +
						'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td>' +
						'<td class="hidden-xs">' + _type + '</td>' +
						'<td class="center"><a class="btn btn-default" href="indicator_group_desc.html?id=' + e.id + '">配置</a></td>' +
						'<td class="hidden-xs"><a href="#myDelModal" class="del_indicator_group" data-toggle="modal" data-target="#myDelModal" data-id="' + e.id + '" title="删除分组指标"><span class="glyphicon glyphicon-remove-sign"></span></a></td></tr>';
					$('#indicator_group_datas').append(html);
				} else if(type.indexOf("indicator.html") >= 0) { //指标
					var html = '<tr><td class="center">' + e.pid + '</td>' +
						'<td><input type="text" name="indicatorEnName" id="indicatorEnName" value="' + e.name_en + '" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="' + e.pid + '" title="修改英文名称"><span class="glyphicon glyphicon-edit"></span></a>' +
						'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td>' +
						'<td class="hidden-xs"><input type="text" name="indicatorCnName" id="indicatorCnName" value="' + e.name_zh + '" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="' + e.pid + '" title="修改中文名称"><span class="glyphicon glyphicon-edit"></span></a>' +
						'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td>' +
						'<td class="hidden-xs"><input type="text" name="indicatorDescp" id="indicatorDescp" value="' + e.descp + '" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="' + e.pid + '" title="修改描述"><span class="glyphicon glyphicon-edit"></span></a>' +
						'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td></tr>';
					$('#indicator_datas').append(html);
				} else if(type.indexOf("country") >= 0) { //国家
					var html = '<tr><td class="center">' + e.pid + '</td>' +
						'<td><input type="text" name="countryEnName" id="countryEnName" value="' + e.name_en + '" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="' + e.pid + '" title="修改英文名称"><span class="glyphicon glyphicon-edit"></span></a>' +
						'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td>' +
						'<td class="hidden-xs"><input type="text" name="countryCnName" id="countryCnName" value="' + e.name_zh + '" disabled="disabled" /><a href="javascript:;" class="btn btn-default btn-xs indicator_edit" data-id="' + e.pid + '" title="修改中文名称"><span class="glyphicon glyphicon-edit"></span></a>' +
						'<span class="edit_name_descp none"><span class="glyphicon glyphicon-ok edit_ok" title="确定修改"></span><span class="glyphicon glyphicon-remove edit_change" title="取消修改"></span></span></td></tr>';
					$('#country_datas').append(html);
				}

			});
		},
		error: function(data) {
			console.log(data);
		}
	});

	// 点击修改，输入框可编辑-显示确定取消按钮
	$(document).on('click', '.indicator_edit', function() {
		$(this).hide();
		$(this).next().show();
		$(this).prev().removeAttr("disabled").focus();
		_id = $(this).attr("data-id");
		//		console.log($(this).next());
	});

	// 确定修改
	$(document).on('click', '.edit_ok', function() {
		$(this).parent().hide();
		$(this).parent().prev().show();
		var $input = $(this).parent().prevAll('input'),
			data, _url;
		$input.attr('disabled', 'disabled');
		var _idName = $input.attr("id");
		if(type.indexOf("group") >= 0) {
			_url = _href + interfacelist.group + _id;
			if(_idName.indexOf('indicatorName') >= 0) {
				data = {
					token: token,
					name: $input.val()
				}
			} else if(_idName.indexOf('indicatorDescpG') >= 0) {
				data = {
					token: token,
					descp: $input.val()
				}
			}
		} else if(type.indexOf("country") >= 0) {
			_url = _href + interfacelist.country + _id;
			if(_idName.indexOf('countryCnName') >= 0) {
				data = {
					token: token,
					name_zh: $input.val()
				}
			} else if(_idName.indexOf('countryEnName') >= 0) {
				data = {
					token: token,
					name_en: $input.val()
				}
			}
		} else if(type.indexOf("indicator.html") >= 0) {
			_url = _href + interfacelist.indicator + _id;
			if(_idName.indexOf('indicatorCnName') >= 0) {
				data = {
					token: token,
					name_zh: $input.val()
				}
			} else if(_idName.indexOf('indicatorEnName') >= 0) {
				data = {
					token: token,
					name_es: $input.val()
				}
			} else if(_idName.indexOf('indicatorDescp') >= 0) {
				data = {
					token: token,
					descp: $input.val()
				}
			}
		}
		$.ajax({
			type: "put",
			url: _url,
			async: true,
			data: data,
			success: function(data) {
				if(data.code === 1) {
					$('#dialogPulic').find('.modal-body').text('修改成功！');
					$('#dialogPulic').modal('show');
				} else {
					$('#dialogPulic').find('.modal-body').text('修改失败！');
					$('#dialogPulic').modal('show');
				}
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		});
	});

	// 取消
	$(document).on('click', '.edit_change', function() {
		$(this).parent().hide();
		$(this).parent().prev().show();
		$(this).parent().prevAll('input').attr('disabled', 'disabled');
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

// 返回顶部
$(document).on('click', '.go-top', function(e) {
	$("html, body").animate({
		scrollTop: 0
	}, "slow");
	e.preventDefault();
});

//验证码倒计时
function code_time() {
	var code_num = 60;
	var time = setInterval(function() {
		code_num--;
		//		console.log(code_num);
		$("#code_num i").html(code_num);
		if(code_num <= 0) {
			code_num = 60;
			$("#code_num i").html(code_num);
			clearInterval(time);
			$("#code_btn1").hide();
			$("#code_btn").show();
		}
	}, 1000);
}
//验证表单信息
function forms(p, c) {
	var _phone = $("#input_Phone").val(),
		_password = $("#input_password").val(),
		_code = $("#input_Phone_code").val();
	/*if (p) {
		if (_phone.length=0||_phone=="") {
			alert("请输入手机号，不能为空！");
			$("#input_Phone").focus();
			return false;
		}
		if (_phone.length>11||_phone.length<11) {
			alert("请输入正确的11位手机号！");
			$("#input_Phone").focus();
			return false;
		}
		if (_password.length=0||_password=="") {
			alert("请输入密码，密码不能为空！");
			$("#input_password").focus();
			return false;
		}
	} else */
	if(c) {
		if(_phone.length = 0 || _phone == "") {
			$('#dialogPulic').find('.modal-body').text('请输入手机号，不能为空！');
			$('#dialogPulic').modal('show');
			$("#input_Phone").focus();
			return false;
		}
		if(_phone.length > 11 || _phone.length < 11) {
			$('#dialogPulic').find('.modal-body').text('请输入正确的11位手机号！');
			$('#dialogPulic').modal('show');
			$("#input_Phone").focus();
			return false;
		}
		if(_code.length = 0 || _code == "") {
			$('#dialogPulic').find('.modal-body').text('请输入验证码，不能为空！');
			$('#dialogPulic').modal('show');
			$("#input_Phone_code").focus();
			return false;
		}
	}

}
//上传图片
function uploadImg(fileId, imgId) {
	var formData = new FormData();
//	console.log($(fileId)[0].files[0])
	formData.append('file', $(fileId)[0].files[0]);
//	console.log(formData);
	$.ajax({
		url: 'http://api.jjrb.grsx.cc/upload',
		type: 'POST',
		cache: false,
		data: formData,
		processData: false,
		contentType: false,
		success: function(data) {
//			console.log(data);
//			console.log(fileId);
//			console.log(imgId);
			$(imgId).prop("src", data.url);
		},
		error: function(data) {
			console.log(data);
			if(data.status == 0) {
				$('#dialogPulic').find('.modal-body').text('上传头像失败，图片不要超过1M！');
				$('#dialogPulic').modal('show');
			}
		}
	}).done(function(res) {}).fail(function(res) {});
}