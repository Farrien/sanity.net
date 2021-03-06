var sideBar = 0;
var bottomPopup = 1;


mr.Dom(function() {
	if (mr.Dom('.BottomPopupWindow').Object == null) {
		Popups.CreateBottomPopup();
	}
	if (typeof _cLocation != 'undefined') {
		if (_cLocation == 'list') {
			var b = {els:[{attr:'searchButton'}]};
			mr.Dom('.rightSideButton').ClearSelf().CreateDOMbyRules(b).eClick(function() {
				Popups.ShowSearchInBottom();
			});
			var HttpGet = mr.HttpGet();
			if (HttpGet && HttpGet['q'] == 'search' && HttpGet['s'] ) {
				ug.SearchUsersComp(HttpGet['s'], 'Из Вашей группы никого не найдено.');
				return;
			}
			mr.Query('server/control.php', {operation : 3}, function(response) {
				mr.Dom('.studentsListing').ClearSelf();
				var a = {els:[]};
				var r = JSON.parse(response);
				for (var k in r) {
					var namespace = r[k].b,
						iden = r[k].iden,
						sg = r[k].e,
						edu = r[k].c,
						img_res = 'res/userdata/'+r[k].d;
					var preparedModel = {
						attr:{'class':'newStudentRow','onclick':'return Popups.ShowUserInfoInBottom('+iden+');'},
						inner:[{attr:'c1 studentAvatar',inner:[{tag:'img',attr:{'src':img_res,'width':50,'height':50}}]},{attr:'c2',inner:[{attr:'c2-1',inner:[{inner:namespace}]},{attr:'c2-2',inner : [{inner:sg}]}]}]
					};
					a.els.push(preparedModel);
				};
				mr.Dom('.studentsListing').CreateDOMbyRules(a);
			});
		};
		if (_cLocation == 'vote') {
			_loadNewPerson();
		}
	}
});

function toggleSidemenu() {
	if (sideBar == 0) {
		mr.Dom('.pageWrap').NewClass('OffsetLeft');
		mr.Dom('body').NewClass('pda_scroll_lock');
		sideBar = 1;
	} else {
		mr.Dom('.pageWrap').DelClass('OffsetLeft');
		mr.Dom('body').DelClass('pda_scroll_lock');
		sideBar = 0;
	}
}

var Popups = {}
Popups.CreateBottomPopup = function() {
	var arr = {els:[{attr:'BottomPopupWindow',inner:[{attr:'PopupBody'}]}]};
	if (mr.Dom('.pageWrap').i()) mr.Dom('.pageWrap').CreateDOMbyRules(arr);
}
Popups.clsBttmPpp = function() {
	mr.Dom('.pageWrap').DelClass('OffsetBottom');
	mr.Dom('.BottomPopupWindow').DelClass('Opened');
	mr.Dom('.BottomPopupWindow .PopupBody').ClearSelf();
	mr.Dom('body').DelClass('pda_scroll_lock');
}
Popups.ShowUserInfoInBottom = function (id) {
	mr.Dom('.pageWrap').NewClass('OffsetBottom');
	mr.Dom('body').NewClass('pda_scroll_lock');
	mr.Dom('.BottomPopupWindow').NewClass('Opened');
	mr.Dom('.BottomPopupWindow .PopupBody').NewClass('Loading');
	mr.Query('server/control.php', {target_id : id, operation : 0}, function(response) {
		var r = JSON.parse(response);
		var a = {els:[{attr:'userInfoCompact',inner:[{attr:'userPhoto-Small',inner:[{tag:'img',attr:{'src':'res/userdata/'+r.d,'width':100,'height':100}}]},{attr:'userFullname',inner:[{inner:r.b}]},{attr:'userGroup',inner:[{inner:r.e}]},{attr:'userStudyTimings',inner:[{inner:r.c}]},{attr:'userRatingInfo',inner:[{attr:'userCounts bigger',inner:[{attr:'countU',inner:[{tag:'span',attr:'iconStar',inner:[{inner:''+r.f.pnts}]}]},{attr:'countU',inner:[{tag:'span',attr:'iconEye',inner:[{inner:r.f.v}]}]},{attr:'countU',inner:[{tag:'span',attr:'iconArrow',inner:[{inner:r.f.rating+'%'}]}]}]}]},{attr:'relationStates',inner:[{inner:r.rs}]}]}]};
		mr.Dom('.BottomPopupWindow .PopupBody').DelClass('Loading');
		mr.Timers.CreateTimer(0.6, function() {
			mr.Dom('.BottomPopupWindow .PopupBody').CreateDOMbyRules(a);
		});
	});
}
Popups.ShowSearchInBottom = function (id) {
	mr.Dom('.pageWrap').NewClass('OffsetBottom');
	mr.Dom('body').NewClass('pda_scroll_lock');
	mr.Dom('.BottomPopupWindow').NewClass('Opened');
	var searchForm = {els:[
		{tag:'form',attr:'Student-Search-Popup',inner:[
			{attr:'PopupHeader',inner:[{inner:'Поиск студентов'}]},
			{attr:'littleSpace',inner:[
				{tag:'input',
				attr:{'type':'hidden','name':'operation','value':3}
				}
			]},
			{attr:'littleSpace',inner:[
				{tag:'input',
				attr:{'class':'xver adaptScreen bgGrey','type':'text','name':'text_query','placeholder':'Имя, фамилия или группа...','autocomplete':'off','required':'yes'}
				}
			]},
			{attr:'littleSpace',inner:[
				{attr:{'class':'xverCheckboxBody byRows r-2','style':'padding: 0 16px'},
				inner:[
					{
						tag:'label',
						attr:{'class':'xver','for':'choose_female'},
						inner:[
							{
								tag:'input',
								attr:{'class':'xver','type':'checkbox','name':'choose_female'}
							},
							{
								tag:'span',
								attr:'for-xver',
								inner:[
									{inner:'Девушки'}
								]
							}
						]
					},
					{
						tag:'label',
						attr:{'class':'xver','for':'choose_male'},
						inner:[
							{
								tag:'input',
								attr:{'class':'xver','type':'checkbox','name':'choose_male'}
							},
							{
								tag:'span',
								attr:'for-xver',
								inner:[
									{inner:'Парни'}
								]
							}
						]
					}
				]
				}
			]},
			{attr:'littleSpace',inner:[
				{tag:'button',attr:{'class':'xver adaptScreen','onclick':'return ug.SearchUsers(this);'},inner:[{inner:'Найти'}]}
			]}
		]}
	]};
	mr.Dom('.BottomPopupWindow .PopupBody').CreateDOMbyRules(searchForm);
	mr.Dom('form.Student-Search-Popup input[name="text_query"]').FocusOn();
}

mr.CreateDialogWindow = function(name) {
	if (this.Dom('#Dialog').i()) this.DestroyDialogWindow();
	var a = {els:[
		{attr:{class:'DialogWindow',id:'Dialog'},inner:[
			{attr:'DialogTop',inner:[{inner:name},{tag:'button',attr:{class:'whiteBlue',onclick:'mr.DestroyDialogWindow()'},inner:[{inner:'Закрыть'}]}]},
			{attr:'DBody'}
		]}
	]};
	this.Dom('body').CreateDOMbyRules(a);
}

mr.DialogSetContent = function(content) {
	if (typeof content === 'string') this.Dom('#Dialog .DBody').Object.innerHTML = content;
	if (typeof content === 'object') this.Dom('#Dialog .DBody').CreateDOMbyRules(content);
}

mr.DestroyDialogWindow = function() {
	this.Dom('#Dialog').RemoveSelf();
}

mr.openSpoiler = function(target) {
	var t = this.Dom(target).GetParent();
	if (t.OwnsClass('opened')) {
		t.DelClass('opened');
		return;
	}
	t.NewClass('opened');
}

mr.ScrollDownChat = function(id) {
	mr.Timers.CreateTimer(0.5, function() {
		document.getElementById(id).parentNode.scrollTop = document.getElementById(id).parentNode.scrollHeight;
	});
}

SN.CheckLogin = function(res) {
	if (res.tagName.toLowerCase() === 'input') {
		str = res.value;
	}
	if (str.length < 10) return;
	mr.Query('/', {shared_login : str}, function(response) {
		console.log(response);
		var r = JSON.parse(response);
		if (!r.correct) {
			SN.ShowTooltip('Неверно указан номер.', res);
			return;
		}
		if (r.exist && r.correct) SN.ShowTooltip('Указанный Вами номер телефона уже зарегистрирован.\n<br />Если это были Вы, <a href="../login/?ownp=origin">Войдите</a> сперва на сайт.', res);
	});
}


SN.ShowTooltip = function(html, elem) {
	if (elem instanceof Manipulation) {
		elem = elem.Object;
	}
	var br = elem.getBoundingClientRect();
	var a = {els:[
		{attr:'SN_Tooltip',inner:[
			{inner:html}
		]}
	]};
	var TooltipBody = mr.Dom('body').CreateDOMbyRules(a).Object;
	SN.TooltipIsPresent = true;
	TooltipBody.style.left = br.left + 'px';
	if (elem.offsetWidth < 180) {
		TooltipBody.style.left =	br.left - 90 + elem.offsetWidth / 2 + 'px';
	}
	var top = br.top + pageYOffset + elem.offsetHeight;
	TooltipBody.style.top = top + 'px';
	var width = br.right - br.left;
	TooltipBody.style.width = width + 'px';
	mr.Timers.CreateTimer(3.14, function() {
		if (SN.TooltipIsPresent) mr.Dom(TooltipBody).RemoveSelf();
	});
}

SN.DestroyTooltips = function() {
	var x = document.querySelectorAll('.UE_Tooltip');
	for (i = 0; i < x.length; i++) {
		mr.Dom(x[i]).RemoveSelf();
	}
	SN.TooltipIsPresent = false;
}

sn.PostVoid = function(rel, formID, handler) {
	let t = event.target;
	var nrel = '../get/' + rel;
	mr.SendForm(nrel, formID, function(response) {
		if (handler && typeof handler === 'function') {
			handler(JSON.parse(response).result);
		}
	});
	return false;
}

function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp * 1000);
//	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
	var year = a.getFullYear().toString().substr(-2);
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	if (min.toString().length == 1) min = '0'+min;
	var sec = a.getSeconds();
	var time = date + '.' + month + '.' + year + ' ' + hour + ':' + min;
	return time;
}
