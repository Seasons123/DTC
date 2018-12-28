var tdNum = 0;
var evalScoreInfoGlobal=[]; //EvalScore表中信息，下侧的打分汇总数据
var evalScoreDetailInfoGlobal={};
var projectInfoGlobal={};
var kpiTableInfoGlobal={};
var rankGlobal=[];
var evalContent=[];
var checkedArray=[];//存放选中单选按钮的id
var scoreList=[];
var levelNum;
var kpiLevelName = ["一级指标","二级指标","三级指标","四级指标","五级指标","六级指标","七级指标","八级指标","九级指标","十级指标"];
var htmlTableBody = '<tr>';
var expertId=3; //专家id，页面打开时自动带过来的参数值{1:李老师;2:赵老师;3:贺老师}
var taskId=1;
var objectId=1;
var isLeader=0; //组员角色，页面打开时自动带过来的参数值

tableCommonFn = {

    initTableHeader: function () {
        //总共的列数为：指标级次数levelNum+5
        var html = '<tr>';
        for(var i=0; i < levelNum; i++){
            html += '<th class="aa" width="100px" rowspan="2">' + kpiLevelName[i] + '</th>';
        }
        html += '<th class="aa" width="100px" rowspan="2">分数</th>';
        html += '<th class="aa" width="500px" id="003" rowspan="2" colspan="5">评分标准</th>';
        html += '<th class="aa" width="150px" id="004" rowspan="2">评价结果</th>';
        html += '<th class="aa" width="100px" id="005" rowspan="2">专家评分</th>';
        html += '<th class="aa" width="100px" id="006" rowspan="2">扣分原因</th>';
        html += '</tr>';
        $('#tableHeader').append(html);
    },

    //不确定共有几级指标，表格左侧内容动态生成+获取分值显示
    initTable: function () {
        var data = {
            "evalObject.id":objectId,
            "dataStatus":"new",
            "fetchProperties":"*,kpi[*,parent[id,kpiName,kpiWeight,kpiLevel,kpiExplain],parentKpi1[id,kpiName,kpiWeight,kpiLevel,kpiExplain],parentKpi2[id,kpiName,kpiWeight,kpiLevel,kpiExplain],parentKpi3[id,kpiName,kpiWeight,kpiLevel,kpiExplain],parentKpi4[id,kpiName,kpiWeight,kpiLevel,kpiExplain]]",
            "sort":"orderNum,asc"
        };
        $.ajax({
            type: 'GET',
            url: formUrl.taskKpi,
            dataType: 'json',
            data:data,
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            async: false,
            success: function (tableInfo) {
                if(tableInfo.message){
                    $.messager.alert('错误', tableInfo.message, 'error');
                }else{
                    //行排序
                    kpiTableInfoGlobal = tableInfo.sort(commonFn.sortByPro('orderNum'));
                    for(var i = 0;i < kpiTableInfoGlobal.length ;i ++) {
                        evalContent.push(kpiTableInfoGlobal[i].kpi);   //每次都push一行
                        evalContent[i]["kpiStandard"] = JSON.parse(kpiTableInfoGlobal[i].kpiStandard);
                        evalContent[i]["kpiWeight"] = kpiTableInfoGlobal[i].kpiWeight; //会把kpi对象里的kpiWeight覆盖
                    }
                    console.log(evalContent);
                    //表格左侧json数据转换start
                    var data = [];
                    var trNum =evalContent.length;
                    levelNum = parseInt(evalContent[0].kpiLevel); //一共有几级指标
                    tableCommonFn.initTableHeader(levelNum);
                    tdNum = levelNum ;
                    var indicatorArray = [];
                    var indicatorObject = {};

                    //声明全局变量，生成计算每一列已经生成多少行，用于向data中塞值时使用
                    for(var i=1;i<=trNum ;i++) {
                        window["td" + i + "trCount"] = 0;
                    }
                    //获取每一级指标需要合并多少行。注意每一级可能会有多个，如二级指标有三个。无需计算最后一个指标的合并行，都为1。
                    for(var i=1;i<levelNum;i++) {
                        create_parentIdValueCount(i); //初始化合并行
                        mergeRowsCal(i); //合并行计算
                        create_indicatorArray(i); //创建指标对象
                    }
                    function create_parentIdValueCount(num){
                        var parent = "parentKpi" + num ;
                        var parentIdValue = ""; //id的值，用于对比
                        for(var m = 0;m < evalContent.length; m++) {
                            for (var n in evalContent[m]) {
                                if ((n == parent && parentIdValue == "")|| (n == parent && parentIdValue != evalContent[m][n].id)) {
                                    parentIdValue = evalContent[m][n].id;
                                    window[parentIdValue + "Count"] = 0;
                                }
                            }
                        }
                    }
                    function mergeRowsCal(num) {
                        var parent = "parentKpi" + num ;
                        var parentIdValue = "";
                        for(var m = 0;m < evalContent.length + 1; m++) {
                            for (var n in evalContent[m]) {
                                if (n == parent) {
                                    parentIdValue = evalContent[m][n].id;
                                    window[parentIdValue + "Count"]++;
                                }
                            }
                        }
                    }
                    function create_indicatorArray(num){
                        var parent = "parentKpi" + num ;
                        var parentIdValue = "";
                        for(var m = 0;m < evalContent.length; m++) {
                            for (var n in evalContent[m]) {
                                if ((n == parent && parentIdValue == "")|| (n == parent && parentIdValue != evalContent[m][n].id)) {
                                    //定义对象,拿三个数据：指标的id、指标的名字、指标的合并行
                                    parentValue = evalContent[m][n];
                                    parentIdValue = evalContent[m][n].id;
                                    mergeRows = window[parentIdValue + "Count"];
                                    indicatorObject = {
                                        id: parentValue.id,
                                        level: num,
                                        name: parentValue.kpiName,
                                        rows: mergeRows,
                                        weight: parentValue.kpiWeight,
                                        explain: parentValue.kpiExplain
                                    };
                                    indicatorArray.push(indicatorObject);
                                }
                            }
                        }
                    }
                    //向指标对象中塞入末级指标对象，末级指标对象无“说明explain”字段。打分字段score、备注字段remark加入末级指标对象。
                    for(var i= 0;i < trNum; i++) {
                        indicatorObject = {
                            id: evalContent[i].id,
                            level: evalContent[i].kpiLevel,
                            name: evalContent[i].kpiName,
                            rows: 1,
                            weight: evalContent[i].kpiWeight,
                            explain: evalContent[i].kpiExplain,
                            score: evalScoreDetailInfoGlobal[i]?evalScoreDetailInfoGlobal[i].kpiScore: '',
                            remark: evalScoreDetailInfoGlobal[i]?evalScoreDetailInfoGlobal[i].remark:'',
                            standard: evalContent[i].kpiStandard,
                            type: evalContent[i].valueType,
                            unit: evalContent[i].kpiUnit,
                            defaultScore: "",//组长字段使用
                            checkStandId: evalScoreDetailInfoGlobal[i]?evalScoreDetailInfoGlobal[i].checkStandId:'',
                            evalQuantity: evalScoreDetailInfoGlobal[i]?evalScoreDetailInfoGlobal[i].evalQuantity:'',
                            evalScoreResult: evalScoreDetailInfoGlobal[i]?evalScoreDetailInfoGlobal[i].evalScoreResult:''
                        };
                        indicatorArray.push(indicatorObject);
                    }
                    console.log(indicatorArray);

                    //生成目标行列json空值数据
                    for(var i = 0;i < trNum ;i ++) {
                        //每一行即每一个json对象的键和值都需要动态生成
                        var row = {};
                        for(var j = 1;j <= tdNum ; j++){
                            var name = "t" + j; //先自动生成键
                            row[name] = {};
                        }
                        data.push(row);   //每次都push一行
                    }

                    //遍历indicatorArray，向data中塞值
                    for(var i = 0; i< indicatorArray.length; i ++){
                        var num = indicatorArray[i].level;
                        var tdIndicatorName = "t" + num;
                        //var tdIndicatorWeight = "t" + (2 * num);
                        var tdIndicatorNameTrCount = "td" + num + "trCount";
                        var temp = window[tdIndicatorNameTrCount];
                        for(var j = 0; j < indicatorArray[i].rows ; j ++){
                            for (var n in data[temp]) {
                                if (n == tdIndicatorName) {
                                    data[temp][n] = {
                                        name: indicatorArray[i].name,
                                        weight: indicatorArray[i].weight,
                                        rows: indicatorArray[i].rows,
                                        explain: indicatorArray[i].explain,
                                        id: indicatorArray[i].id,
                                        score: indicatorArray[i].score,
                                        remark: indicatorArray[i].remark,
                                        groupMemberInfo: indicatorArray[i].groupMemberInfo,
                                        standard: indicatorArray[i].standard,
                                        type: indicatorArray[i].type,
                                        unit: indicatorArray[i].unit,
                                        defaultScore: indicatorArray[i].defaultScore,//组长字段使用
                                        checkStandId: indicatorArray[i].checkStandId,
                                        evalQuantity: indicatorArray[i].evalQuantity,
                                        evalScoreResult: indicatorArray[i].evalScoreResult
                                    };
                                    window[tdIndicatorNameTrCount] ++ ;
                                    temp = window[tdIndicatorNameTrCount];
                                }
                            }
                        }
                    }
                    console.log(data);
                    //表格左侧json数据转换end

                    //批量定义
                    for (var i = 1; i <= (tdNum - 2); i++) {
                        create_variable(i);
                    }

                    function create_variable(num) {
                        var name = "t" + num; //生成函数名
                        window[name];
                    }
                    //渲染主体表格页面  start
                    $.each(data, function (i, item) {
                        for (var j = 1; j <= (tdNum - 1); j++) { //动态生成除最后两行的所有行（非填评分值部分）
                            var tdKey = "t" + j;
                            var kpiObject;
                            for (var m in item) {
                                if (m == tdKey) {
                                    kpiObject = item[m];
                                }
                            }
                            if (window[tdKey] == '' || window[tdKey] != kpiObject.id) {
                                htmlTableBody += '<td class="cc" title="'+ kpiObject.explain +'" rowspan="' + kpiObject.rows + '">' + kpiObject.name  + "（" +  kpiObject.weight+ "分）" + '</td>';
                                window[tdKey] = kpiObject.id;
                            }
                        }

                        //渲染剩余两列（非填评分值部分） start
                        var tdKey = "t" + tdNum;
                        var kpiObjectFinal;
                        //拿到末级指标对象
                        for (var m in item) {
                            if (m == tdKey) {
                                kpiObjectFinal = item[m];
                            }
                        }
                        htmlTableBody += '<td class="cc" title="'+ kpiObjectFinal.explain +'">' + kpiObjectFinal.name + '</td>';//末级指标名字
                        htmlTableBody += '<td class="cc">' + kpiObjectFinal.weight + '</td>';//末级指标权重
                        htmlTableBody += '<td class="aa" colspan="5">';
                        for(var m=0; m < kpiObjectFinal.standard.length; m++){//末级指标评分标准
                            htmlTableBody += '<p style="width:300px;">' +
                                '<label>' +  kpiObjectFinal.standard[m].kpi_stand_name + '</label>' +
                                '<input type="radio" class="standard" id="'+ kpiObjectFinal.standard[m].id + '" name="'+ kpiObjectFinal.id +'" value="' + m + '" onclick="commonFn.changeScoreStandardValue(this.name,this.value)" disabled/>' +
                                '</p>';
                        }
                        htmlTableBody += '</td>';
                        // 渲染剩余两列（非填评分值部分） end

                        //生成评分值部分，每一个单元格以id形式打标记信息，标记值包含横纵的信息（末级指标名称+末级评分名称）
                        htmlTableBody += '<td class="bb"><textarea id="col004row' + kpiObjectFinal.id + '" class="easyui-validatebox quantify" required="true" onchange="commonFn.checkQuantity(value,this.id)" disabled></textarea><span>';//评价结果
                        if(kpiObjectFinal.unit){
                            htmlTableBody += kpiObjectFinal.unit +'</span></td>';
                        }else{
                            htmlTableBody += '</span></td>';
                        }
                        if(kpiObjectFinal.score == 0 || kpiObjectFinal.score == null){
                            htmlTableBody += '<td class="bb"><textarea id="col005row' + kpiObjectFinal.id + '" class="easyui-validatebox grade" required="true" onchange="commonFn.checkGrade(value,this.id),commonFn.calScore()"></textarea></td>';//专家评分
                        }else{
                            htmlTableBody += '<td class="bb"><textarea id="col005row' + kpiObjectFinal.id + '" class="easyui-validatebox grade" required="true" onchange="commonFn.checkGrade(value,this.id),commonFn.calScore()" disabled>' + kpiObjectFinal.score + '</textarea></td>';//专家评分
                        }
                        htmlTableBody += '<td class="bb"><textarea id="col006row' + kpiObjectFinal.id + '" class="easyui-validatebox remark" disabled>';//扣分原因
                        if(kpiObjectFinal.remark){
                            htmlTableBody += kpiObjectFinal.remark + '</textarea></td>';
                        }else{
                            htmlTableBody +=  '</textarea></td>';
                        }
                        htmlTableBody += '</tr>';
                    });
                    //渲染主体表格页面  end
                    tableCommonFn.generateSumRow();
                    tableCommonFn.initVal();
                    tableCommonFn.cssStyleControl();
                }
            }
        });
    },

    //查询项目信息
    searchProject: function (){
        var data = {
            "evalObject.id":objectId
        };
        $.ajax({
            type: 'GET',
            url: formUrl.projectMain,
            dataType: 'json',
            data:data,
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            async: false,
            success: function (map) {
                if(map.message){
                    $.messager.alert('错误', map.message, 'error');
                }else{
                    projectInfoGlobal = map[0];
                    $('#enName').val(projectInfoGlobal.execDeptName).attr("disabled",true);
                    $('#itmName').val(projectInfoGlobal.prjName).attr("disabled",true);
                    $('#totalPrice').val(projectInfoGlobal.budgetTotal/10000).attr("disabled",true);
                }
            }
        });
    },

    //查询专家评价情况，评分汇总
    searchEvalScore: function (){
        var data = { //这些数据是在页面打开时能获取到的参数
            "object.id":objectId,
            "evalTask.id":taskId,
            "expert.id":expertId,
            "fetchProperties":"*,expert[id,expertName],task[id,setYear]"
        };
        $.ajax({
            type: 'GET',
            url: formUrl.evalScore,
            dataType: 'json',
            data:data,
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            async: false,
            success: function (scoreSumInfo) {
                if(scoreSumInfo.message){
                    $.messager.alert('错误', scoreSumInfo.message, 'error');
                }else{
                    evalScoreInfoGlobal = scoreSumInfo; //评分总表
                    if(evalScoreInfoGlobal.length){
                        //$('#suggestR1').val(scoreSumInfo.suggestR1);//目前还没有把建议的数据设计进来
                        //$('#suggestR2').val(scoreSumInfo.suggestR2);
                        //$('#suggestR3').val(scoreSumInfo.suggestR3);
                        $('#moneyR1').val(scoreSumInfo[0].prjReduceAmount);
                        $('#moneyR2').val(scoreSumInfo[0].prjReducedAmount);
                        $('#moneyR3').val(scoreSumInfo[0].prjYrReduceAmount);
                        $('#moneyR4').val(scoreSumInfo[0].prjYrAmount);
                        tableCommonFn.searchEvalScoreDetail();
                    }
                }
            }
        });
    },

    //查询右侧评分明细
    searchEvalScoreDetail: function(){
        var data = {
            "evalScore.id":evalScoreInfoGlobal[0].id, //其它的参数evalObject.id、evalTask.id、evalExpert.id，都能在pe_eval_score表中取到
            "expert.id":expertId,
        };
        $.ajax({
            type: 'GET',
            url: formUrl.evalScoreDetail,
            dataType: 'json',
            data:data,
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            async: false,
            success: function (scoreDetailInfo) {
                if(scoreDetailInfo.message){
                    $.messager.alert('错误', scoreDetailInfo.message, 'error');
                }else{
                    evalScoreDetailInfoGlobal = scoreDetailInfo.sort(commonFn.sortByPro('orderNum')); //评分总表
                    console.log(evalScoreDetailInfoGlobal);
                }
            }
        });
    },

    //查询设置的评级等级情况
    searchRank: function (){
        var data = {
            "evalObject.id":1,
            "evalTask.id":1,
            "goalInfo.id":3
        };
        $.ajax({
            type: 'GET',
            url: formUrl.evalRank,
            dataType: 'json',
            data:data,
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            async: false,
            success: function (map) {
                if(map.message){
                    $.messager.alert('错误', map.message, 'error');
                }else{
                    rankGlobal = map; //评分总表
                }
            }
        });
    },

    //生成合计行和评价等级行，使用评分总表对象evalScoreInfoGlobal
    generateSumRow: function(){
        htmlTableBody += '<tr><td class="cc" >合计</td><td class="cc" >100</td>';
        htmlTableBody += '<td class="cc" colspan="'+(levelNum+5) +'">如本表格评分后，总分（合计）未达到'+ rankGlobal[0].period.split(",")[1] +'分，下表留空为零，不作评分。</b></td>';
        htmlTableBody += '<td class="bb" colspan="2"><textarea id="scoreSum" name="scoreSum" class="easyui-validatebox member" required="true" ></textarea></td>';
        htmlTableBody += '</tr>';

        //评价等级行
        htmlTableBody += '<tr><td class="cc"><b>等级评价</b></td>';
        //动态拼接评价等级描述
        htmlTableBody += '<td class="cc" colspan="'+(levelNum+6) +'"><b>对项目进行评价等级：';
        for(var i=0; i<rankGlobal.length; i++){
            var period = rankGlobal[i].period.split(",");
            var min = parseInt(period[0]);
            var max = parseInt(period[1]);
            htmlTableBody += ''+ min +'-'+ max +'分为'+ rankGlobal[i].name +'';
            if(min != 0 && i == rankGlobal.length-1){
                htmlTableBody += '。';
            }else if(min == 0 && i == rankGlobal.length-1){
                htmlTableBody += '，建议不予立项。';
            }else if(min == 0 && i != rankGlobal.length-1){
                htmlTableBody += '，建议不予立项，';
            }else{
                htmlTableBody += '，';
            }
        }
        htmlTableBody += '<td class="bb" colspan="2"><textarea id="evalRank" name="evalRank" class="easyui-validatebox member" required="true" ></textarea></td>';
        htmlTableBody += '</tr>';
        $('#tableBody').append(htmlTableBody);
    },

    //样式控制
    cssStyleControl: function(){
        var num=0;//计数器
        for(var i=0; i<evalContent.length; i++){
            scoreList.push(evalContent[i].kpi_score);
        }
        //如果评分值都为0，则打开时为可编辑状态
        for(var i=0; i<scoreList.length; i++){
            if(scoreList[i]==0){
                num ++;
            }
        }
        if(num == scoreList.length){
            commonFn.setEdit();
            commonFn.setEditCellColor(true);
        }else{
            commonFn.setReadonly();
            commonFn.setEditCellColor(false);
        }
        $('#scoreSum').attr("disabled", true);
        $('#evalRank').attr("disabled", true);
    },

    //该方法放在最后是由于需要等到页面dom元素全部渲染完，才能进行dom操作
    initVal: function(){
        //1. 评分标准列单选按钮赋checked值
        for(var i=0; i<evalScoreDetailInfoGlobal.length; i ++){
            checkedArray.push(evalScoreDetailInfoGlobal[i].checkStandId);
        }
        for(var i=0; i<checkedArray.length; i++){
            if(checkedArray[i]){
                $('#'+ checkedArray[i]).attr("checked",true);
            }
        }
        //2. 定量分值列赋值
        for(var i=0; i<evalContent.length; i ++){
            if(evalContent[i].valueType == "1" && checkedArray[i]){//value_type为1，定量分值列取eval_score_result
                var standard = evalContent[i].kpiStandard;
                for(var j=0; j< standard.length; j++){
                    if(standard[j].id == checkedArray[i]){
                        $('#col004row' + evalContent[i].id).text(standard[j].short_name).attr("disabled",true);
                    }
                }
            }
            if(evalContent[i].valueType == "2" && checkedArray[i]){//value_type为2，定量分值列取eval_quantity
                $('#col004row' + evalContent[i].id).css("width","60%").text(evalScoreDetailInfoGlobal[i].evalQuantity );
            }
        }
        //3.合计行和评价等级行赋值
        commonFn.calScore();
    },
};

var getInfo = function(){
    tableCommonFn.searchEvalScore();
    tableCommonFn.searchProject();
    tableCommonFn.searchRank();
    tableCommonFn.initTable();
};

getInfo();