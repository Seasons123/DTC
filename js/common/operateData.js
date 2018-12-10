var operateData = {};

//加载div中input,select和textarea数据
operateData.getDataFromDiv = function(divId){
	var data = {};
	$("#"+divId+" input").each(function(){
		if(this.type=="radio"&&this.checked!=true&&this.checked!="checked"){//如果是radio按钮,且未被选中
			return ;
		}else if(this.type=="checkbox"&&this.checked!=true&&this.checked!="checked"){//如果是checkbox按钮,且未被选中
			return ;
		}else {
			data[this.name] = this.value;
		}
	});
	$("#"+divId+ " select").each(function(){
		data[this.name] = this.value;
		if(this.name.endsWith("CODE")) {//如果以code结尾,添加name数据
			var arr = this.name.split("_");
			data[arr[0]+"_NAME"] = $(this).find("option:selected").text();
		}
	});
	$("#"+divId+" textarea").each(function(){
		data[this.name] = this.value;
	})
	//options[storeName] = JSON.stringify([ data ]);
	return data;
}
//加载div中input,select和textarea数据2,加了ID
operateData.getDataFromDiv2 = function(divId){
	var data = {};
	$("#"+divId+" input").each(function(){
		if(this.type=="radio"&&this.checked!=true&&this.checked!="checked"){//如果是radio按钮,且未被选中
			return ;
		}else if(this.type=="checkbox"&&this.checked!=true&&this.checked!="checked"){//如果是checkbox按钮,且未被选中
			return ;
		}else {
			data[this.name] = this.value;
		}
	});
	$("#"+divId+ " select").each(function(){
		var value = this.value.split("@");
		for(var i = 0;i<value.length;i++){
			if( value[i] == 'undefined' || value[i] == 'null'){
				value[i] = '';
			}
		}
		
		if(this.name.endsWith("CODE")) {//如果以code结尾,添加name和id数据
			data[this.name] = value[1];
			var arr = this.name.split("_");
			data[arr[0]+"_ID"] =  value[0]?value[0]:'';
			data[arr[0]+"_NAME"] = value[2]?value[2]:'';
		}else{
			data[this.name] = value[2];
		}
	});
	$("#"+divId+" textarea").each(function(){
		data[this.name] = this.value;
	})
	//options[storeName] = JSON.stringify([ data ]);
	return data;
}

//加载div中input,select和textarea数据3,获取CODE
operateData.getDataFromDiv3 = function(divId){
	var data = {};
	$("#"+divId+" input").each(function(){
		if(this.type=="radio"&&this.checked!=true&&this.checked!="checked"){//如果是radio按钮,且未被选中
			return ;
		}else if(this.type=="checkbox"&&this.checked!=true&&this.checked!="checked"){//如果是checkbox按钮,且未被选中
			return ;
		}else {
			data[this.name] = this.value;
		}
	});
	$("#"+divId+ " select").each(function(){
		var value = this.value.split("@");
		for(var i = 0;i<value.length;i++){
			if( value[i] == 'undefined' || value[i] == 'null'){
				value[i] = '';
			}
		}
		data[this.name] = value[1];
		if(this.name == 'PRJ_NAME') {
			data[this.name] = value[2];
		}
	});
	$("#"+divId+" textarea").each(function(){
		data[this.name] = this.value;
	})
	//options[storeName] = JSON.stringify([ data ]);
	return data;
}

//加载div中input,select和textarea数据4,获取CODE
operateData.getDataFromDiv4 = function(divId){
	var data = {};
	$("#"+divId+" input").each(function(){
		if(this.type=="radio"&&this.checked!=true&&this.checked!="checked"){//如果是radio按钮,且未被选中
			return ;
		}else if(this.type=="checkbox"&&this.checked!=true&&this.checked!="checked"){//如果是checkbox按钮,且未被选中
			return ;
		}else {
			if($(this).attr("id").indexOf("_") < 0){
				data[this.name] = this.value;
			}
		}
	});
	$("#"+divId+ " select").each(function(){
		if(this.value.indexOf("@") >= 0){
			var value = this.value.split("@");
			var tempStr = this.name.substring(0,this.name.length-4);
			for(var i = 0;i<value.length;i++){
				if( value[i] == 'undefined' || value[i] == 'null'){
					value[i] = '';
				}
			}
			data[tempStr+"Id"] =  value[0]?value[0]:'';
			data[tempStr+"Code"] = value[1]?value[1]:'';
			data[this.name] = value[2];
		}else{
			data[this.name] = this.value;
		}
	});
	$("#"+divId+" textarea").each(function(){
		data[this.name] = this.value;
	})
	//options[storeName] = JSON.stringify([ data ]);
	return data;
}

//编辑数据初始化,将数据放到div中
operateData.initEditData = function(id,rowObj) {
	$("#"+id+" input").each(function(){
		if(this.type == "radio") {
			if(this.value==rowObj[this.name]) {
				this.checked = true;
			}
		}else if(this.type == "checkbox"){
			if(rowObj[this.name] && rowObj[this.name] == "1"){
				this.checked = true;
			}
		}else {
//			this.value = rowObj[this.name];
			//不能用三目运算符 this.value = rowObj[this.name] ? rowObj[this.name] : ""; 数值0也为false
			if(rowObj[this.name]==null || rowObj[this.name] == undefined)
				rowObj[this.name] = "";
			else             
				this.value = rowObj[this.name]; 

		}
	});
	$("#"+id+" select").each(function(){
		var selectVal = rowObj[this.name];
		var arr = $(this).children("option");
		arr.each(function(){
			if(this.value == selectVal){
				this.selected = "selected";
			}else {
				this.selected = "";
			}
		});
	});
	$("#"+id+" textarea").each(function(){
//		this.value = rowObj[this.name];
		if(rowObj[this.name]==null || rowObj[this.name] == undefined)
			rowObj[this.name] = "";
		else             
			this.value = rowObj[this.name]; 
	});
}
//编辑数据初始化,将数据放到div中
operateData.initEditData2 = function(id,rowObj) {
	$("#"+id+" input").each(function(){
		if(this.type == "radio") {
			if(this.value==rowObj[this.name]) {
				this.checked = true;
			}
		}else {
//			this.value = rowObj[this.name];
			//不能用三目运算符 this.value = rowObj[this.name] ? rowObj[this.name] : ""; 数值0也为false
			if(rowObj[this.name]==null || rowObj[this.name] == undefined)
				rowObj[this.name] = "";
			else             
				this.value = rowObj[this.name]; 

		}
	});
	$("#"+id+" select").each(function(){
		var selectVal;
		if(this.name.endsWith("CODE")) {//如果以code结尾,添加name和id数据
			selectName = this.name.split("_");
			selectVal = rowObj[selectName[0]+"_NAME"];
		}else{
			selectVal = rowObj[this.name];
		}
		
		var arr = $(this).children("option");
		arr.each(function(){
			var optionVal = this.value.split("@");
			var val = optionVal[2];
			if(val == selectVal){
				this.selected = "selected";
			}else {
				this.selected = "";
			}
		});
	});
	$("#"+id+" textarea").each(function(){
//		this.value = rowObj[this.name];
		if(rowObj[this.name]==null || rowObj[this.name] == undefined)
			rowObj[this.name] = "";
		else             
			this.value = rowObj[this.name]; 
	});
}

//编辑数据初始化,将数据放到div中
operateData.initEditData3 = function(id,rowObj) {


	$("#"+id+" input").each(function(){
		if(this.type == "radio") {
			if(this.value==rowObj[this.name]) {
				this.checked = true;
			}
		}else {
//			this.value = rowObj[this.name];
			//不能用三目运算符 this.value = rowObj[this.name] ? rowObj[this.name] : ""; 数值0也为false
			if(rowObj[this.name]==null || rowObj[this.name] == undefined)
				rowObj[this.name] = "";
			else             
				this.value = rowObj[this.name]; 

		}
	});
	$("#"+id+" select").each(function(){
		var selectVal;
		selectVal = rowObj[this.name];
		
		var arr = $(this).children("option");
		arr.each(function(){
			var optionVal = this.value.split("@");
			var val = optionVal[2];
			if(val == selectVal){
				this.selected = "selected";
			}else {
				this.selected = "";
			}
		});
	});
	$("#"+id+" textarea").each(function(){
//		this.value = rowObj[this.name];
		if(rowObj[this.name]==null || rowObj[this.name] == undefined)
			rowObj[this.name] = "";
		else             
			this.value = rowObj[this.name]; 
	});
}

//编辑数据初始化,将数据放到div中 -去掉checkbox赋值
operateData.initEditData4 = function(id,rowObj) {
	$("#"+id+" input").each(function(){
		if(this.type == "radio") {
			if(this.value==rowObj[this.name]) {
				this.checked = true;
			}
		}else if(this.type == "checkbox"){
			
		}else {
//			this.value = rowObj[this.name];
			//不能用三目运算符 this.value = rowObj[this.name] ? rowObj[this.name] : ""; 数值0也为false
			if(rowObj[this.name]==null || rowObj[this.name] == undefined)
				rowObj[this.name] = "";
			else             
				this.value = rowObj[this.name]; 

		}
	});
	$("#"+id+" select").each(function(){
		var selectVal = rowObj[this.name];
		var arr = $(this).children("option");
		arr.each(function(){
			if(this.value == selectVal){
				this.selected = "selected";
			}else {
				this.selected = "";
			}
		});
	});
	$("#"+id+" textarea").each(function(){
//		this.value = rowObj[this.name];
		if(rowObj[this.name]==null || rowObj[this.name] == undefined)
			rowObj[this.name] = "";
		else             
			this.value = rowObj[this.name]; 
	});
}

//通过的初始化select标签的方法
//参数name:select name属性的值
//参数variable:数组变量
operateData.initSelect = function(name,variable) {
	var name = $("select[name='"+name+"']");
	name.html("");
	for(i = 0 ; i < variable.length ; i++) {
		if(i == 0) {
			name.append("<option value = "+variable[i].key+" selected='selected' >"+variable[i].value+"</option>");
		}else {
			name.append("<option value = "+variable[i].key+" >"+variable[i].value+"</option>");
		}
	}
};
operateData.initSelectById = function(id,variable) {
	var id = $("select[id='"+id+"']");
	id.html("");
	for(i = 0 ; i < variable.length ; i++) {
		if(i == 0) {
			id.append("<option selected='selected'>"+variable[i].value+"</option>");
		}else {
			id.append("<option>"+variable[i].value+"</option>");
		}
	}
};


//日期控件初始化
operateData.initDateInput = function() {
	$('.form_date').datetimepicker({
		language: 'zh-CN',
		weekStart: 1,
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
	});
}


//判断该div中的必填项是否填写完毕,如果填写完毕返回true 
operateData.validateData = function(id){
	var flag = true;
	//获取所有的必填项
	$("#"+id+" label.color-red").each(function(){
		$(this).next().children("input").each(function(){
			if(this.value == ""||this.value==null || this.value==undefined){
				flag = false;
			}
		});
		$(this).next().children("select").each(function(){
			if(this.value == ""||this.value==null || this.value==undefined){
				flag = false;
			}
		});
		$(this).next().children("textarea").each(function(){
			if(this.value == ""||this.value==null || this.value==undefined){
				flag = false;
			}
		});
	});
	return flag;
};



//清空数据,radio和select默认选中第一个
operateData.clearData = function(id){
	$("#"+id+" input").each(function(){
		if(this.type == "radio" || this.type == "checkbox") {
			this.checked = false;
		}else {
			this.value = "";
		}
		//默认选中第一个
		if(this.type == "radio"&&this.value == 1) {
			this.checked = true;
		}
	});
	$("#"+id+" select").each(function(){
		var arr = $(this).children("option");
		//默认选中第一个
		for(var i = 0;i < arr.length;i++){
			if(i == 0) {
				arr[i].selected = "selected";
			}else {
				arr[i].selected = "";
			}
		}
	});
	$("#"+id+" textarea").each(function(){
		this.value = "";
	});
};

//去掉金额形式的逗号
gpDealThousand = function(value) {
     if (value != "") {
     	    value+="";
			return value.replace(/,/g, '');
		} else {
			return value;
		}
};
/*
 * 将对象数组中部分含有千分位表示的字段去掉逗号
 * objArr:对象数组    strArr：含有千分位的字段的数组
 * data:objArr数组中每一项的值
 * i:objArr数组中每一项对应的下标
 * */
var notThousand = function(objArr,strArr){
	objArr.forEach(function(data,i){
    	strArr.forEach(function(value,j){
    		data[strArr[j]] = gpDealThousand(data[strArr[j]]);
    	});            	
    });
};

//将一个对象B的中属性名相同的值赋给另外一个对象A
operateData.objToObj = function( objA , objB ) {
	for(var keyA in objA) {
		for(var keyB in objB){
			if(keyA == keyB){
				if(objB[keyB]==null || objB[keyB]==undefined){
					objA[keyA] = "";
				}else{
					objA[keyA] = objB[keyB];
				}        				
				}
			}
		} 
	return objA
};

//将一个对象B的中属性名不相同的值赋给另外一个对象A
var objNotToObj = function ( objA , objB ) {
	for(var keyA in objA) {
		for(var keyB in objB){
			if(keyA != keyB){
				if(objB[keyB]==null || objB[keyB]==undefined){
					objA[keyA] = "";
				}else{
					objA[keyA] = objB[keyB];
				}        				
				}
			}
		}        	
};


//--------------------------------------判断两个json对象{}是否相等------------------------------------------------------------------
function isObj(object) {
	return object && typeof(object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
}
function isArray(object) {
	return object && typeof(object) == 'object' && object.constructor == Array;
}
function getLength(object) {
	var count = 0;
	for(var i in object) count++;
	return count;
}
var CompareObj = function(objA, objB, flag) {
	for(var key in objA) {
		if(!flag) //跳出整个循环
			break;
		if(!objB.hasOwnProperty(key)) {
			flag = false;
			break;
		}
		if(!isArray(objA[key])) { //子级不是数组时,比较属性值
			if(objB[key] != objA[key]) {
				flag = false;
				break;
			}
		} else {
			if(!isArray(objB[key])) {
				flag = false;
				break;
			}
			var oA = objA[key],
				oB = objB[key];
			if(oA.length != oB.length) {
				flag = false;
				break;
			}
			for(var k in oA) {
				if(!flag) //这里跳出循环是为了不让递归继续
					break;
				flag = CompareObj(oA[k], oB[k], flag);
			}
		}
	}
	return flag;
};
//返回true 则objA==objB
var Compare = function (objA, objB) {
	if(!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
	if(getLength(objA) != getLength(objB)) return false; //判断长度是否一致
	return CompareObj(objA, objB, true); //默认为true
};
//--------------------------------------判断两个json对象是否相等------------------------------------------------------------------
//把对象中的undefined或者为Null的字段值转换成""
var dealUndefine = function (obj){
	for(key in obj){
		if(obj[key]==null || obj[key]==undefined){
			obj[key]="";
		}
	}
};


//把 对象 或者 对象数组 [{}]中的undefined或者为Null的字段值转换成""
var dealArrOrObjUndefine = function (arrOrObj){
	if(isObj(arrOrObj)){//arrOrObj是object类型
		dealUndefine(arrOrObj);
	}
	if(isArray(arrOrObj)){
		if(arrOrObj && arrOrObj.length>0){
			for(var i=0;i<arrOrObj.length;i++){
				var obj = arrOrObj[i];
				dealUndefine(obj);
			}
		}
	}	
};

/*根据出生日期算出年龄 yyyy-MM-dd   yyyy/MM/dd*/  
operateData.getAgeFromBD = function(strBirthday){
	//为空或者不符合格式的处理
	if(!strBirthday){return "";}
	
	if(strBirthday.indexOf("/")>=0){
		strBirthday = strBirthday.replace("/","-").replace("/","-");			
	}
	if(strBirthday && strBirthday.indexOf("-") < 0 ){return "";}
	/*	if(strBirthday && (strBirthday.indexOf("-") < 0 || strBirthday.indexOf("/") < 0)){return "";}*/
    var bDay = new Date(strBirthday),
	nDay = new Date(),
    nbDay = new Date(nDay.getFullYear(), bDay.getMonth(), bDay.getDate()),
	age = nDay.getFullYear() - bDay.getFullYear();
	if(bDay.getTime() > nDay.getTime()){return "";}
	return nbDay.getTime() <= nDay.getTime() ? age : --age;
}

operateData.isEmpty = function(val){
	var flag = false;
	if(!val || "" == val || " " == val || " "== val){
		flag = true;
	}
	return flag;
}

//绩效系统高级搜索条件拼接
// 获取动态生成的搜索、编辑、新增区域的值
operateData.getAreaData = function(data) {
	var area_data = {};
	var condition = "";
	var sym = "";
	for (var i = 0; i < data.length; i++) {
		switch (data[i].type) {
			case "text":
				var value = $("#" + data[i].id).val();
				if (value != "") {
					id = data[i].id.substring(0, data[i].id.indexOf("-"));
					area_data[id] = value;
					sym = ip.numToString(data[i].opetype);
					if ("like" == sym || "not like" == sym) {
						condition = condition + " and " + id + " " + sym + " '%" + value + "%'";
					} else {
						condition = condition + " and " + id + " " + sym + " '" + value + "'";
					}
				}
				break;
			case "int":
				var value = $("#" + data[i].id).val();
				if (value != "") {
					id = data[i].id.substring(0, data[i].id.indexOf("-"));
					area_data[id] = value;
					sym = ip.numToString(data[i].opetype);
					condition = condition + " and " + id + " " + sym + " " + value;
				}
				break;
			case "radio":
				var value = $("input[name='" + data[i].id + "']:checked").val();
				if (value != "") {
					id = data[i].id.substring(0, data[i].id.indexOf("-"));
					area_data[id] = value;
					sym = ip.numToString(data[i].opetype);
					if ("like" == sym || "not like" == sym) {
						condition = condition + " and " + id + " " + sym + " '" + value + "%'";
					} else {
						condition = condition + " and " + id + " " + sym + " '" + value + "'";
					}
				}
				break;
			case "combobox":
				var value = $("#" + data[i].id).val();
				if (value != "") {
					id = data[i].id.substring(0, data[i].id.indexOf("-"));
					area_data[id] = value;
					sym = ip.numToString(data[i].opetype);
					if ("like" == sym || "not like" == sym) {
						condition = condition + " and " + id + " " + sym + " '" + value + "%'";
					} else {
						condition = condition + " and " + id + " " + sym + " '" + value + "'";
					}
				}
				break;
			case "checkbox":
				var check_value = [];
				var check_values = $("input[name='" + data[i].id + "']:checked");
				if (check_values.length > 0) {
					for (var ii = 0; ii < check_values.length; ii++) {
						check_value.push(check_values[ii].value);
					}
				}
				if (check_value.length > 0) {
					id = data[i].id.substring(0, data[i].id.indexOf("-"));
					area_data[id] = check_value.join(",");
					sym = ip.numToString(data[i].opetype);
					var idst = "(";
					for (var qq = 0; qq < check_value.length; qq++) {
						idst = idst + "'" + check_value[qq] + "',";
					}
					idst = idst.substring(0, idst.length - 1) + ")";
					condition = condition + " and " + id + " in " + idst;
				}
				break;
			case "datetime":
				var value = $("#" + data[i].id).val();
				if (value != "") {
					id = data[i].id.substring(0, data[i].id.indexOf("-"));
					area_data[id] = value;
					sym = ip.numToString(data[i].opetype);
					if ("like" == sym || "not like" == sym) {
						condition = condition + " and " + id + " " + sym + " '%" + value + "%'";
					} else {
						condition = condition + " and " + id + " " + sym + " '" + value + "'";
					}
				}
				break;
			case "decimal":
				var value = $("#" + data[i].id).val();
				if (value != "") {
					id = data[i].id.substring(0, data[i].id.indexOf("-"));
					area_data[id] = value;
					sym = ip.numToString(data[i].opetype);
					condition = condition + " and " + id + " " + sym + " " + value;

				}
				break;
			case "treeassist":
				var value = $("#" + data[i].id).val();
				if (value != "") {
					id = data[i].id.substring(0, data[i].id.indexOf("-"));
					area_data[id] = value;
					sym = ip.numToString(data[i].opetype);
					// id=id.substring(0,id.length-2)+"code";
					var tempName = value.split(" ")[1];
					if(tempName && "" != tempName){
						if ("like" == sym || "not like" == sym) {
							condition = condition + " and " + id + " " + sym + " '" + value.split(" ")[1] + "%'";
						} else {
							condition = condition + " and " + id + " " + sym + " '" + value.split(" ")[1] + "'";
						}
					}else{
						condition += " and " + id + " like '%" + value + "%'"
					}

				}
				break;
			case "multreeassist":
				var value = $("#" + data[i].id).val();
				if (value != "") {
					id = data[i].id.substring(0, data[i].id.indexOf("-"));
					area_data[id] = value;
					// id=id.substring(0,id.length-2)+"code";
					sym = ip.numToString(data[i].opetype);
					var valueArr = value.split(",");
					var ids = "(";
					for (var q = 0; q < valueArr.length; q++) {
						var tempVal = valueArr[q].split(" ")[1];
						if(tempVal){
							if(q>0){
								ids += " or ";
							}
							ids += id + " like '%" + tempVal + "%'";
						}else{
							ids += id + " like '%" + value + "%'";
						}
					}
					ids = ids + ")";
					condition += " and " + ids;
				}
				break;
			case "doubledecimal":
				var money_values = [];
				for (var j = 1; j < 3; j++) {
					var money_value = $("#" + data[i].id + j).val();
					if (money_value != "") {
						money_values.push(money_value);
					}
				}
				if (money_values.length > 0) {
					var money_object = money_values.join(",");
					if (money_object != "") {
						id = data[i].id.substring(0, data[i].id.indexOf("-"));
						area_data[id] = money_object;
						sym = ip.numToString(data[i].opetype);
						if ("between" == sym) {
							condition = condition + " and " + id + " > " + money_object.split(",")[0];
							if(money_object.split(",")[1] != null && money_object.split(",")[1] != undefined){
								condition =  condition + " and " + id + " < " + money_object.split(",")[1];
							}
						};
						if ("betweenequal" == sym) {
							condition = condition + " and " + id + " >= " + money_object.split(",")[0];
							if(money_object.split(",")[1] != null && money_object.split(",")[1] != undefined){
								condition =  condition + " and " + id + " <= " + money_object.split(",")[1];
							}
						}
					}
				}
				break;
			case "doubletime":
				var date_values = [];
				for (var k = 1; k < 3; k++) {
					var date_value = $("#" + data[i].id + k).val();
					if (date_value != "") {
						date_values.push(date_value);
					}
				}
				if (date_values.length > 0) {
					var date_object = date_values.join(",");
					if (date_object != "") {
						id = data[i].id.substring(0, data[i].id.indexOf("-"));
						area_data[id] = date_object;
						sym = ip.numToString(data[i].opetype);
						if ("between" == sym) {
							condition = condition + " and " + id + " between '" + date_object.split(",")[0] +"'";
							if(date_object.split(",")[1] != null && date_object.split(",")[1] != undefined){
								condition = condition + " and '" + date_object.split(",")[1] + "'";
							}else{
								condition = condition + " and '9999-12-12'";
							}
							
						};
						if ("betweenequal" == sym) {
							condition = condition + " and " + id + " >= '" + date_object.split(",")[0] + "'";
							if(date_object.split(",")[1] != null && date_object.split(",")[1] != undefined){
								condition = condition  +" and " + id + " <= '" + date_object.split(",")[1] + "'";
							}
						}
					}
				}
				break;
		}
	}

	return condition;
}
//绩效系统专家管理用（查询视图初始化）
operateData.initArea = function(creatData, areaType, viewId, areaId) {
	var n = areaType == "edit" ? 6 : 4;
	var html = '';
	var aims = [];
	for (var i = 0; i < creatData.length; i++) {
		// if(areaType == "search"){
		creatData[i].editable = "true";
		// }
		switch (creatData[i].disp_mode) {
			case "text":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label for="' + creatData[i].id + '" class="col-md-3 col-sm-3 text-right">' + creatData[i].name + '</label>' +
						'<div class="col-md-9 ip-input-group modal-input-group">';
					if (creatData[i].editable == "true") {
						html += '<input type="text" class="form-control" id="' + creatData[i].id + '-' + viewId + '">' +
								'<span class="input-control-feedback" style="right: 5px;" onclick="ip.clearText(\'' + creatData[i].id + '-' + viewId + '\')">X</span>';
					} else {
						html += '<input type="text" class="form-control" id="' + creatData[i].id + '-' + viewId + '" disabled>';
					}
					html += '</div></div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "text",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
			case "int":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label for="" class="col-md-3 col-sm-3 text-right">' + creatData[i].name + '</label>' +
						'<div class="col-md-9 col-sm-9 ip-input-group modal-input-group">';
					if (creatData[i].editable == "true") {
						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '">' +
								'<span class="input-control-feedback" style="right: 5px;" onclick="ip.clearText(\'' + creatData[i].id + '-' + viewId + '\')">X</span>';
					} else {
						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '" disabled>';
					}
					html += '</div></div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "int",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
			case "radio":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label for="" class="col-md-3 col-sm-3 text-right">' + creatData[i].name + '</label>' +
						'<div class="col-md-9 col-sm-9 ip-input-group">';
					var m = creatData[i].ref_model.split("+");
					for (var t = 0; t < m.length; t++) {
						var k = m[t].split("#");
						if (creatData[i].editable == "true") {
							if (k.length > 1) {
								html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="' + k[0] + '">' + k[1] + '</label>';
							} else {
								html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="">' + k[0] + '</label>';
							}
						} else {
							if (k.length > 1) {
								html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="' + k[0] + '" disabled>' + k[1] + '</label>';
							} else {
								html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="" disabled>' + k[0] + '</label>';
							}
						}
					}
					html += '</div></div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "radio",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
			case "combobox":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label for="" class="col-md-3 col-sm-3 text-right">' + creatData[i].name + '</label>' +
						'<div class="col-md-9 col-sm-9 ip-input-group">';
					if (creatData[i].editable == "true") {
						html += '<select class="form-control" id="' + creatData[i].id + '-' + viewId + '">';
					} else {
						html += '<select class="form-control" id="' + creatData[i].id + '-' + viewId + '" disabled>';
					}
					var m = creatData[i].ref_model.split("+");
					for (var t = 0; t < m.length; t++) {
						var k = m[t].split("#");
						if (k.length > 1) {
							html += '<option value="' + k[0] + '">' + k[1] + '</option>';
						} else {
							html += '<option value="">' + k[0] + '</option>';
						}
					}
					html += '</select></div></div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "combobox",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
			case "checkbox":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label for="" class="col-md-3 col-sm-3 text-right">' + creatData[i].name + '</label>' +
						'<div class="col-md-9 col-sm-9 ip-input-group">';

					var m = creatData[i].ref_model.split("+");
					for (var nn = 0; nn < m.length; nn++) {
						var kk = m[nn].split("#");
						if (creatData[i].editable == "true") {
							if (kk.length > 1) {
								html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="' + kk[0] + '">' + kk[1] + '</label>';
							} else {
								html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="">' + kk[0] + '</label>';
							}
						} else {
							if (kk.length > 1) {
								html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="' + kk[0] + '" disabled>' + kk[1] + '</label>';
							} else {
								html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="" disabled>' + kk[0] + '</label>';
							}
						}
					}
					html += '</div></div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "checkbox",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
			case "decimal":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label for="" class="col-md-3 col-sm-3 text-right">' + creatData[i].name + '</label>' +
						'<div class="col-md-9 col-sm-9 ip-input-group modal-input-group">';
					if (creatData[i].editable == "true") {
						html += '<input type="number" min="0" class="form-control" id="' + creatData[i].id + '-' + viewId + '" onblur="ip.moneyQuset(this.id)">' + 
								'<span class="input-control-feedback" onclick="ip.clearText(\'' + creatData[i].id + '-' + viewId + '1' +'\')">X</span>';
					} else {
						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '" onblur="ip.moneyQuset(this.id)" disabled>';
					}
					html += '</div></div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "decimal",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
			case "doubledecimal":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label for="" class="col-md-3 col-sm-3 text-right">' + creatData[i].name + '</label>' +
						'<div class="col-md-4 col-sm-4 ip-input-group modal-input-group">';
					if (creatData[i].editable == "true") {
						html += '<input type="number" min="0" class="form-control" id="' + creatData[i].id + '-' + viewId + '1" onblur="ip.moneyQuset(this.id)">' +
								'<span class="input-control-feedback" onclick="ip.clearText(\'' + creatData[i].id + '-' + viewId + '1' +'\')">X</span>';
					} else {
						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '1" onblur="ip.moneyQuset(this.id)" disabled>';
					}
					html += '</div>' +
						'<div class="col-md-1 col-sm-1 ip-to-font">至</div>' +
						'<div class="col-md-4 col-sm-4 ip-input-group modal-input-group">';
					if (creatData[i].editable == "true") {
						html += '<input type="number" min="0" class="form-control" id="' + creatData[i].id + '-' + viewId + '2" onblur="ip.moneyQuset(this.id)">' +
								'<span class="input-control-feedback" onclick="ip.clearText(\'' + creatData[i].id + '-' + viewId + '1' +'\')">X</span>';
					} else {
						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '2" onblur="ip.moneyQuset(this.id)" disabled>';
					}
					html += '</div></div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "doubledecimal",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
			case "datetime":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label for="dtp_input2" class="col-md-3 col-sm-3 control-label text-right">' + creatData[i].name + '</label>' +
						'<div class="input-group date form_date col-md-9 col-sm-9 ip-input-group" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '" data-link-format="yyyy-mm-dd">';
					if (creatData[i].editable == "true") {
						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '" type="text" value="">' +
							'<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
							'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
					} else {
						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '" type="text" value="" disabled>' +
							'<span class="input-group-addon"><button class="glyphicon glyphicon-remove" disabled></button></span>' +
							'<span class="input-group-addon"><button class="glyphicon glyphicon-calendar" disabled></button></span>';
					}
					html += '</div>' +
						// '<input type="hidden" id="' + creatData[i].id +
						// '-' + viewId + '" value="" /><br/>' +
						'</div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "datetime",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
			case "doubletime":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label for="dtp_input2" class="col-md-3 col-sm-3 control-label text-right">' + creatData[i].name + '</label>' +
						'<div class="input-group date form_date col-md-4 col-sm-4 ip-input-group fleft start-time" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '1" data-link-format="yyyy-mm-dd">';
					if (creatData[i].editable == "true") {
						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '1" type="text" value="">' +
							'<span class="input-group-addon"><span class="glyphicon glyphicon-remove start-time-btn"></span></span>' +
							'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar start-time-btn"></span></span>';
					} else {
						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '1" type="text" value="" disabled>' +
							'<span class="input-group-addon"><button class="glyphicon glyphicon-remove" disabled></button></span>' +
							'<span class="input-group-addon"><button class="glyphicon glyphicon-calendar" disabled></button></span>';
					}
					// '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '1" type="text" value="" readonly>' +
					// '<span class="input-group-addon"><span
					// class="glyphicon
					// glyphicon-remove"></span></span>' +
					// '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
					html += '</div>' +
						'<div class="col-md-1 col-sm-1 ip-to-font">至</div>' +
						'<div class="input-group date form_date col-md-4 col-sm-4 ip-input-group fleft end-time" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '2" data-link-format="yyyy-mm-dd">';
					if (creatData[i].editable == "true") {
						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '2" type="text" value="">' +
							'<span class="input-group-addon"><span class="glyphicon glyphicon-remove end-time-btn"></span></span>' +
							'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar end-time-btn"></span></span>';
					} else {
						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '2" type="text" value="" disabled>' +
							'<span class="input-group-addon"><button class="glyphicon glyphicon-remove" disabled></button></span>' +
							'<span class="input-group-addon"><button class="glyphicon glyphicon-calendar" disabled></button></span>';
					}
					// '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '2" type="text" value="" readonly>' +
					// '<span class="input-group-addon"><span
					// class="glyphicon
					// glyphicon-remove"></span></span>' +
					// '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
					html += '</div>' +
						// '<input type="hidden" id="' + creatData[i].id +
						// '-' + viewId + '" value="" /><br/>' +
						'</div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "doubletime",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
			case "treeassist":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label class="col-md-3 col-sm-3 text-right">' + creatData[i].name + '</label>' +
						'<div class="input-group col-md-9 col-sm-9 modal-input-group">';
					if (creatData[i].editable == "true") {
						html += '<input type="text" class="form-control col-md-6 col-sm-6" id="' + creatData[i].id + '-' + viewId + '"  onkeydown="return ip.codeInto(this.id,this.name,0,{},0,this.title,true,event)">' +
							'<input type="hidden" id="' + creatData[i].id + '-' + viewId + '-h" name="' + creatData[i].source + '">' +
							'<span class="input-control-feedback" onclick="ip.clearText(\'' + creatData[i].id + '-' + viewId + '\')">X</span>' +
							'<span class="input-group-btn">' +
							'<button class="btn btn-default glyphicon glyphicon-list" style="color: #b3a9a9;font-size: 12px;height:28px;margin-top:-2px;" type="button" id="' + creatData[i].id + '-' + viewId + '-btn" name="' + creatData[i].source + '" data-toggle="modal"';
							if(false){
								html += ' onclick="ip.showAssitTree(this.id,this.name,0,{},0,this.title,0,0,true,'+"'name'"+')"></button>';
							} else {
								html += ' onclick="ip.showAssitTree(this.id,this.name,0,{},0,this.title)"></button>';
							}
					} else {
						html += '<input type="text" class="form-control col-md-6 col-sm-6" id="' + creatData[i].id + '-' + viewId + '"  onkeydown="return ip.codeInto(this.id,this.name)" disabled>' +
							'<input type="hidden" id="' + creatData[i].id + '-' + viewId + '-h" name="' + creatData[i].source + '" disabled>' +
							'<span class="input-group-btn">' +
							'<button class="btn btn-default glyphicon glyphicon-list" style="color: #b3a9a9;font-size: 12px;height:28px;margin-top:-2px;" type="button" id="' + creatData[i].id + '-' + viewId + '-btn" name="' + creatData[i].source + '" data-toggle="modal" disabled></button>';
					}
					html += '</span>' +
						'</div>' +
						'</div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "treeassist",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
			case "multreeassist":
				if (creatData[i].visible) {
					html += '<div class="col-md-' + n + ' col-sm-' + n + '">' +
						'<label class="col-md-3 col-sm-3 text-right">' + creatData[i].name + '</label>' +
						'<div class="input-group col-md-9 col-sm-9 modal-input-group">';
					if (creatData[i].editable == "true") {
						html += '<input type="text" class="form-control col-md-6 col-sm-6" id="' + creatData[i].id + '-' + viewId + '">' +
							'<input type="hidden" id="' + creatData[i].id + '-' + viewId + '-h" name="' + creatData[i].source + '">' +
							'<span class="input-control-feedback" onclick="ip.clearText(\'' + creatData[i].id + '-' + viewId + '\')">X</span>' +
							'<span class="input-group-btn">' +
							'<button class="btn btn-default glyphicon glyphicon-option-horizontal" style="color: #b3a9a9;font-size: 12px;height:28px;margin-top:-2px;"  type="button" id="' + creatData[i].id + '-' + viewId + '-btn" name="' + creatData[i].source + '" data-toggle="modal"';
							if(false){
								html += ' onclick="ip.showAssitTree(this.id,this.name,1,{},0,this.title,0,0,true,'+"'name'"+')"></button>';
							} else {
								html += ' onclick="ip.showAssitTree(this.id,this.name,1,{},0,this.title)"></button>';
							}	
					} else {
						html += '<input type="text" class="form-control col-md-6 col-sm-6" id="' + creatData[i].id + '-' + viewId + '" disabled>' +
							'<input type="hidden" id="' + creatData[i].id + '-' + viewId + '-h" name="' + creatData[i].source + '">' +
							'<span class="input-group-btn">' +
							'<button class="btn btn-default glyphicon glyphicon-option-horizontal" style="padding-top: 8px;color: #b3a9a9;font-size: 12px;height:28px;margin-top:-2px;"  type="button" id="' + creatData[i].id + '-' + viewId + '-btn" name="' + creatData[i].source + '" data-toggle="modal" disabled></button>';
					}
					html += '</span>' +
						'</div>' +
						'</div>';
					var current_aim = {
						"id": creatData[i].id + '-' + viewId,
						"type": "multreeassist",
						"opetype": creatData[i].query_relation_sign
					};
					aims.push(current_aim);
				}
				break;
		}
	}
	$("#" + areaId).html(html);
	$("#" + areaId).find("label").css({
		"font-size": "12px",
		"font-weight": "normal"
	});
	$("#" + areaId).find("div").css({
		"padding": "0"
	});
	$.fn.datetimepicker.dates['zh-CN'] = {
		days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
		daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
		daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
		months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
		today: "今天",
		meridiem: ["上午", "下午"]
	};
	//日历控件
	$('.form_date').datetimepicker({
		language: 'zh-CN',
		weekStart: 1,
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
	});
	//时间段开始日期
	$('.start-time').datetimepicker({
		language: 'zh-CN',
		weekStart: 1,
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
	}).on("click",function(){
		if($(".end-time input").val() != ""){
			$('.start-time').datetimepicker("setEndDate",$(".end-time input").val());
		}else{
			$('.start-time').datetimepicker("setEndDate","3000-01-01");
			$('.start-time').datetimepicker("setStartDate","1949-01-01");
		}

	});
	//时间段结束日期
	$('.end-time').datetimepicker({
		language: 'zh-CN',
		weekStart: 1,
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
	}).on("click",function(){
		if($(".start-time input").val() != ""){
			$('.end-time').datetimepicker("setStartDate",$(".start-time input").val());
		}else{
			$('.end-time').datetimepicker("setEndDate","3000-01-01");
			$('.end-time').datetimepicker("setStartDate","1949-01-01");
		}

	});
	$(function () {
		$(".end-time-btn").unbind("click");
		$(".start-time-btn").unbind("click");
		$(".end-time-btn").on('click',function(){
			$('.end-time').trigger("click");
		});
		$(".start-time-btn").on('click',function(){
			$('.start-time').trigger("click");
		});
	});
	return aims;
}
