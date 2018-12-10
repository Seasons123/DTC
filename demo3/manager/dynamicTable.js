var tdNum = 0;
var expertInfoGlobal={};
var projectInfoGlobal={};
var kpiTableInfoGlobal={};
var evalContent={};
var checkedArry=[];//存放选中单选按钮的id
var scoreList=[];
var rolename="groupmanager";//角色
var levelNum;
var kpiLevelName = ["一级指标","二级指标","三级指标","四级指标","五级指标","六级指标","七级指标","八级指标","九级指标","十级指标"];
var is_leader=1;
var user_info=[];
var htmlTableBody = '<tr>';

TablecommonFn = {

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
            html += '<th class="cc" width="300px" id="managerTH" style="display:none;" rowspan="1" colspan="'+ user_info.length +'">组员评审</th>';
        html += '</tr>';
        html += '<tr>';
            for(var i=1; i<= user_info.length; i++){
                html += '<th class="aa" width="100px" id="member'+ i +'" style="display:none;" rowspan="1"></th>';
            }
        html += '</tr>';
        $('#tableHeader').append(html);
    },

    //不确定共有几级指标，表格左侧内容动态生成+获取分值显示
    initTable: function (tableInfo) {
        kpiTableInfoGlobal = tableInfo;
        //行排序
        evalContent = tableInfo.eval_content.sort(commonFn.sortByPro('eval_num'));
        console.log(evalContent);
        //表格左侧json数据转换start
        var data = [];
        var trNum =evalContent.length;
        levelNum = parseInt(evalContent[0].kpi_level); //一共有几级指标
        TablecommonFn.initTableHeader(levelNum);
        //完善表头,如果是组长，追加组员的表头
        if( rolename == "groupmanager" ){
            $('#managerTH').css("display","");
            for(var i=0; i<user_info.length; i++){
                $('#member'+ (i+1)).css("display", "").html(user_info[i].eval_user_name);
            }
        }
        tdNum = levelNum ;
        var indicatorArry = [];
        var indicatorObject = {};

        //声明全局变量，生成计算每一列已经生成多少行，用于向data中塞值时使用
        for(var i=1;i<=trNum ;i++) {
            window["td" + i + "trCount"] = 0;
        }
        //获取每一级指标需要合并多少行。注意每一级可能会有多个，如二级指标有三个。无需计算最后一个指标的合并行，都为1。
        for(var i=1;i<levelNum;i++) {
            creact_parentIdValueCount(i); //初始化合并行
            mergeRowsCal(i); //合并行计算
            create_indicatorArry(i); //创建指标对象
        }
        function creact_parentIdValueCount(num){
            var parentId = "chr_id" + num ;
            var parentIdValue = ""; //id的值，用于对比
            for(var m = 0;m < trNum; m++) {
                for (var n in evalContent[m]) {
                    if ((n == parentId && parentIdValue == "")|| (n == parentId && parentIdValue != evalContent[m][n])) {
                        parentIdValue = evalContent[m][n];
                        window[parentIdValue + "Count"] = 0;
                    }
                }
            }
        }
        function mergeRowsCal(num) {
            var parentId = "chr_id" + num ;
            var parentIdValue = "";
            for(var m = 0;m < trNum + 1; m++) {
                for (var n in evalContent[m]) {
                    if (n == parentId) {
                        parentIdValue = evalContent[m][n];
                        window[parentIdValue + "Count"]++;
                    }
                }
            }

        }
        function create_indicatorArry(num){
            var parentId = "chr_id" + num ;
            var indicatorsLevel = num ;
            var parentIdValue = ""; //id的值
            var parentIdName = "kpi_name" + num;
            var parentIdNameValue = "";
            var parentIdweight = "kpi_weight" + num;
            var parentIdweightValue = "";
            var parentIdExplain = "kpi_explain" + num;
            var parentIdExplainValue = "";
            for(var m = 0;m < trNum; m++) {
                for (var n in evalContent[m]) {
                    if ((n == parentId && parentIdValue == "")|| (n == parentId && parentIdValue != evalContent[m][n])) {
                        //定义对象,拿三个数据：指标的id、指标的名字、指标的合并行
                        parentIdValue = evalContent[m][n];
                        mergeRows = window[parentIdValue + "Count"];
                        for (var n in evalContent[m]) {
                            if (n == parentIdName) {
                                parentIdNameValue = evalContent[m][n];
                            }
                        }
                        for (var n in evalContent[m]) {
                            if (n == parentIdweight) {
                                parentIdweightValue = evalContent[m][n];
                            }
                        }
                        for (var n in evalContent[m]) {
                            if (n == parentIdExplain) {
                                parentIdExplainValue = evalContent[m][n];
                            }
                        }
                        indicatorObject = {
                            id: parentIdValue,
                            level: indicatorsLevel,
                            name: parentIdNameValue,
                            rows: mergeRows,
                            weight: parentIdweightValue,
                            explain: parentIdExplainValue
                        };
                        indicatorArry.push(indicatorObject);

                    }
                }
            }
        }
        //向指标对象中塞入末级指标对象，末级指标对象无“说明explain”字段。打分字段score、备注字段remark加入末级指标对象。
        for(var i= 0;i < trNum; i++) {
            indicatorObject = {
                id: evalContent[i].id,
                level: evalContent[i].kpi_level,
                name: evalContent[i].kpi_name,
                rows: 1,
                weight: evalContent[i].kpi_weight,
                explain: evalContent[i].kpi_explain,
                score: evalContent[i].kpi_score,
                remark: evalContent[i].kpi_remark,
                standard: evalContent[i].kpi_stand,
                type: evalContent[i].value_type,
                unit: evalContent[i].kpi_unit,
                defaultScore: evalContent[i].default_score
            };
            //如果是组长，再加入组员打分信息
            if( rolename == "groupmanager" ){
                indicatorObject["groupMemberInfo"] = evalContent[i].group_member_info;
            }else{
                indicatorObject["groupMemberInfo"] = "";
            }
            indicatorArry.push(indicatorObject);
        }
        console.log(indicatorArry);

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
        console.log(data);

        //遍历indicatorArry，向data中塞值
        for(var i = 0; i< indicatorArry.length; i ++){
            var num = indicatorArry[i].level;
            var tdIndicatorName = "t" + num;
            //var tdtdIndicatorweight = "t" + (2 * num);
            var tdIndicatorNameTrCount = "td" + num + "trCount";
            var temp = window[tdIndicatorNameTrCount];
            for(var j = 0; j < indicatorArry[i].rows ; j ++){
                for (var n in data[temp]) {
                    if (n == tdIndicatorName) {
                        data[temp][n] = {
                            name: indicatorArry[i].name,
                            weight: indicatorArry[i].weight,
                            rows: indicatorArry[i].rows,
                            explain: indicatorArry[i].explain,
                            id: indicatorArry[i].id,
                            score: indicatorArry[i].score,
                            remark: indicatorArry[i].remark,
                            groupMemberInfo: indicatorArry[i].groupMemberInfo,
                            standard: indicatorArry[i].standard,
                            type: indicatorArry[i].type,
                            unit: indicatorArry[i].unit,
                            defaultScore: indicatorArry[i].defaultScore
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
            htmlTableBody += '<td class="bb"><textarea id="col004row' + kpiObjectFinal.id + '" class="easyui-validatebox quantify" required="true" onchange="commonFn.checkQuantity(value,this.id)" disabled></textarea><span>' + kpiObjectFinal.unit +'</span></td>';//评价结果
            if(kpiObjectFinal.score == 0 || kpiObjectFinal.score == null){
                htmlTableBody += '<td class="bb"><textarea id="col005row' + kpiObjectFinal.id + '" class="easyui-validatebox grade" required="true" onchange="commonFn.checkGrade(value,this.id),commonFn.calScore()" disabled>' + kpiObjectFinal.defaultScore + '</textarea></td>';//专家评分
            }else{
                htmlTableBody += '<td class="bb"><textarea id="col005row' + kpiObjectFinal.id + '" class="easyui-validatebox grade" required="true" onchange="commonFn.checkGrade(value,this.id),commonFn.calScore()" disabled>' + kpiObjectFinal.score + '</textarea></td>';//专家评分
            }
             htmlTableBody += '<td class="bb"><textarea id="col006row' + kpiObjectFinal.id + '" class="easyui-validatebox remark" disabled>' + kpiObjectFinal.remark + '</textarea></td>';//扣分原因

            //显示组员的打分列
           if(kpiObjectFinal.groupMemberInfo && kpiObjectFinal.groupMemberInfo != ""){
                for( var i = 0; i<user_info.length ; i++){
                    var id =( "" + user_info[i].eval_user_id).split("{")[1].split("}")[0];//去除外层括号
                    for(var j = 0; j < user_info.length ; j++){
                        if( kpiObjectFinal.groupMemberInfo[j] && kpiObjectFinal.groupMemberInfo[j].eval_user_id == user_info[i].eval_user_id ){
                            htmlTableBody += '<td class="bb member" id="col'+id+'row'+ kpiObjectFinal.id +'">'+ kpiObjectFinal.groupMemberInfo[j].kpi_score + '</td>';
                        }
                    }
                    if($("#col"+user_info[i].eval_user_name +"row"+ kpiObjectFinal.id ).val() == ""){
                        htmlTableBody += '<td class="bb member"></td>';
                    }
                }
            }else{
                for(var j = 0; j < user_info.length ; j++){
                    htmlTableBody += '<td class="bb member"></td>';
                }
            }
            htmlTableBody += '</tr>';
        });
        //渲染主体表格页面  end
        TablecommonFn.generateSumRow(evalContent);
        TablecommonFn.initVal(evalContent);
        TablecommonFn.cssStyleControl(evalContent);
    },

    //查询项目信息
    searchProject: function (projectInfo){
        projectInfoGlobal = projectInfo;
        $('#enName').val(projectInfo.exec_dept_name).attr("disabled",true);
        $('#itmName').val(projectInfo.prj_name).attr("disabled",true);
        $('#totalPrice').val(projectInfo.budget_total/10000).attr("disabled",true);
    },

    //查询专家评价情况
    searchReview: function (scoreSumInfo){
        expertInfoGlobal = scoreSumInfo; //评分总表
        user_info = scoreSumInfo.total_member;
        console.log(user_info);
        $('#suggestR1').val(scoreSumInfo.suggestR1);
        $('#suggestR2').val(scoreSumInfo.suggestR2);
        $('#suggestR3').val(scoreSumInfo.suggestR3);
        $('#moneyR1').val(scoreSumInfo.prj_reduce_amount);
        $('#moneyR2').val(scoreSumInfo.prj_reduced_amount);
        $('#moneyR3').val(scoreSumInfo.prj_yr_amount);
        $('#moneyR4').val(scoreSumInfo.prj_yr_reduce_amount);
    },

    //生成合计行和评价等级行，使用评分总表对象expertInfoGlobal
    generateSumRow: function(data){
        htmlTableBody += '<tr><td class="cc" >合计</td><td class="cc" >100</td>';
        htmlTableBody += '<td class="cc" colspan="'+(levelNum+5) +'">' +expertInfoGlobal.total_score_describe + '</b></td>';
        htmlTableBody += '<td class="bb" colspan="2"><textarea id="scoreSum" name="scoreSum" class="easyui-validatebox member" required="true" ></textarea></td>';

        //显示组员的合计分
        for( var i = 0; i<user_info.length ; i++){
            htmlTableBody += '<td class="bb member" id="col'+ id +'rowScoreSum">' + user_info[i].total_score.toFixed(1) +'</td>';
        }
        htmlTableBody += '</tr>';

        //评价等级行
        htmlTableBody += '<tr><td class="cc"><b>等级评价</b></td>';
        //动态拼接评价等级描述
        htmlTableBody += '<td class="cc" colspan="'+(levelNum+6) +'"><b>对项目进行评价等级：';
        for(var i=0; i<expertInfoGlobal.eval_rank.length; i++){
            var period = expertInfoGlobal.eval_rank[i].period.split(",");
            var min = parseInt(period[0]);
            var max = parseInt(period[1]);
            htmlTableBody += ''+ min +'-'+ max +'分为'+ expertInfoGlobal.eval_rank[i].name +'';
            if(min != 0 && i == expertInfoGlobal.eval_rank.length-1){
                htmlTableBody += '。';
            }else if(min == 0 && i == expertInfoGlobal.eval_rank.length-1){
                htmlTableBody += '，建议不予立项。';
            }else if(min == 0 && i != expertInfoGlobal.eval_rank.length-1){
                htmlTableBody += '，建议不予立项，';
            }else{
                htmlTableBody += '，';
            }
        }
        htmlTableBody += '<td class="bb" colspan="2"><textarea id="evalRank" name="evalRank" class="easyui-validatebox member" required="true" ></textarea></td>';
        //显示三个组员的评价等级
        for( var i = 0; i<user_info.length ; i++){
            var id =( "" + user_info[i].eval_user_id).split("{")[1].split("}")[0];
            var memberScoreSum = user_info[i].total_score;
            var memberEvalRank = "";
            for(var j=0; j<expertInfoGlobal.eval_rank.length; j++){
                var period = expertInfoGlobal.eval_rank[j].period.split(",");
                var min = parseInt(period[0]);
                var max = parseInt(period[1]);
                if(memberScoreSum>min && memberScoreSum<max){
                    memberEvalRank = expertInfoGlobal.eval_rank[j].name ;
                }
            }
            htmlTableBody += '<td class="bb member" id="col'+ id +'rowEvalRank">'+ memberEvalRank +'</td>';
        }
        htmlTableBody += '</tr>';
        $('#tableBody').append(htmlTableBody);
    },

    //样式控制
    cssStyleControl: function(data){
        var num=0;//计数器
        for(var i=0; i<data.length; i++){
            scoreList.push(data[i].kpi_score);
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
    initVal: function(data){
        //1. 评分标准列单选按钮赋checked值
        for(var i=0; i<data.length; i ++){
            checkedArry.push(data[i].check_stand_id);
        }
        for(var i=0; i<checkedArry.length; i++){
            if(checkedArry[i]){
                $('#'+ checkedArry[i]).prop('checked',true);
            }
        }
        //2. 定量分值列赋值
        for(var i=0; i<data.length; i ++){
            if(data[i].value_type == "1" && checkedArry[i]){//value_type为1，定量分值列取eval_score_result
                var standard = data[i].kpi_stand;
                for(var j=0; j< standard.length; j++){
                    if(standard[j].id == checkedArry[i]){
                        $('#col004row' + data[i].id).text(standard[j].short_name).attr("disabled",true);
                    }
                }
            }
            if(data[i].value_type == "2" && checkedArry[i]){//value_type为2，定量分值列取eval_quantity
                $('#col004row' + data[i].id).css("width","60%").text(data[i].eval_quantity );
            }
        }
        //3.合计行和评价等级行赋值
        commonFn.calScore();
    },
};

var getInfo = function(){
    var data = {
        "eval_user_id":"{E6BE8909-F454-4695-B878-EF7B6AF10304}",
        "eval_obj_id":"{HGPC52C1-BE68-4EE4-9955-E6B43AED0ABC}",
        "eval_goal_id":"35c60e92-ce03-417f-aebe-ea1c72a18c93",
        "eval_task_id":"ed9d8592-18be-486d-96ae-6cd1623df5ca",
        "is_leader":is_leader
    };
    $.ajax({
        type: 'GET',
        url: formUrl.getReviewManagerEmpty,
        dataType: 'JSON',
        data: data,
        async: false,
        success: function (map) {
            if(map.status == '0'){
                /*TablecommonFn.searchProject((JSON.parse(map.data)).project_info);//使用本地服务器数据
                TablecommonFn.searchReview((JSON.parse(map.data)).eval_score_info);//使用本地服务器数据
                TablecommonFn.initTable((JSON.parse(map.data)).kpi_score_detail_info);//使用本地服务器数据*/

                TablecommonFn.searchProject(map.data.project_info);//使用本地json数据
                TablecommonFn.searchReview(map.data.eval_score_info);//使用本地json数据
                TablecommonFn.initTable(map.data.kpi_score_detail_info);//使用本地json数据
            }else{
                ip.ipInfoJump(map.error_msg, 'error');
            }
        }
    });
};

getInfo();