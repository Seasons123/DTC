var zTree;
var tree;
var batchNo;
var enId;
var itmId;
var filePathTag = ""; // 定义绩效目标的路径

var grid;
var expertId;
/* 公共函数类  class commonFn */
var commonFn = {
    /*行排序*/
    sortByPro: function (pro) {
        return function (a, b) {
            var value1 = a[pro];
            var value2 = b[pro];
            return value1 - value2;
        }
    },
    /* 实现金额的千分符显示 */
    toThousands: function (num) {
        if (num == '-') {
            num = '0';
        }
        if (typeof num != 'String') {
            num = '' + num;
        }
        var flag = false;//一个标记判断是否存在小数输入
        var lastNum = '00';//保存小数后面的数值
        if (num.split('.')[1]) {//若存在输入小数点，则处理小数点左边的数字
            lastNum = num.split('.')[1].length >= 2 ?
                num.split('.')[1].substring(0, 2) : num.split('.')[1] + '0';
            num = num.split('.')[0];
            flag = true;
        }
        var result = [], counter = 0;
        num = (num || 0).toString().split('');
        for (var i = num.length - 1; i >= 0; i--) {
            counter++;
            result.unshift(num[i]);
            if (!(counter % 3) && i != 0) {
                result.unshift(',');
            }
        }
        result = result.join('');
        result = result + '.' + lastNum;
        if (result.indexOf("-,") != -1) {
            result = result.replace(/-,/g, "-");
        }
        return result;
    },
    /* 获取对象的长度 */
    getObjLength: function (obj) {
        var count = 0;
        if (typeof obj == 'object') {
            $.each(obj, function (key, val) {
                count++;
            });
        }
        return count;
    },
    refresh: function () {
        commonFn.refreshTree();
        commonFn.setVal();
        batchNo = null;
        enId = null;
        itmId = null;
        filePathTag = "";
        $('#tabs').tabs('select', '绩效目标');
    },
    /**
     * 评分标准赋选中的单选值
     */
    changeScoreStandardValue: function(id,value){
        $("input[name='"+ id +"'][value="+value+"]").attr("checked",true);
        for(var i=0; i<evalContent.length; i++){
            if(evalContent[i].id == id ) {
                if(evalContent[i].valueType == "1"){
                    $('#col004row' + id).val(evalContent[i].kpiStandard[value].short_name);
                }
                if(evalContent[i].valueType == "2"){
                    $('#col004row' + id).val('');
                }
                var yPeriod = evalContent[i].kpiStandard[value].y_period.split(",");
                if (yPeriod[0] == yPeriod[1] && evalContent[i].kpiStandard[value].order_num == 1) {
                    $('#col005row' + evalContent[i].id).val(parseFloat(yPeriod[0])).attr("disabled", true).css("background-color", "#D1EEEE");
                    $('#col006row' + evalContent[i].id).val('').attr("disabled", true).css("background-color", "#D1EEEE");
                } else if(yPeriod[0] == yPeriod[1] && evalContent[i].kpiStandard[value].order_num == evalContent[i].kpiStandard.length){
                    $('#col005row' + evalContent[i].id).val(parseFloat(yPeriod[0])).attr("disabled", true).css("background-color", "#D1EEEE");
                    $('#col006row' + evalContent[i].id).val('').removeAttr("disabled").css("background-color", "#FFFFFF");
                }else if(evalContent[i].valueType == "2"){
                    $('#col005row' + evalContent[i].id).val('').attr("disabled", true).css("background-color", "#D1EEEE");
                    $('#col006row' + evalContent[i].id).val('').removeAttr("disabled").css("background-color", "#FFFFFF");
                }else{
                    $('#col005row' + evalContent[i].id).val('').removeAttr("disabled").css("background-color", "#FFFFFF");
                    $('#col006row' + evalContent[i].id).val('').removeAttr("disabled").css("background-color", "#FFFFFF");
                }
            }
        }
    },
    /**
     * 对定量指标-校验数量，自动计算评分值
     */
    checkQuantity:function (value, id) {
        var number = value;
        var minQuantity ="";
        var maxQuantity ="";
        var minY = "";
        var maxY = "";
        var unit ="";
        var idStr = "" + id;
        var kpiId = idStr.split("row")[1];
        var val = $('input[name="'+ kpiId +'"]:checked').val();
        for(var i=0; i<evalContent.length; i++){
            if(evalContent[i].id == kpiId && evalContent[i].valueType == "2"){
                var xPeriod = evalContent[i].kpiStandard[val].x_period.split(",");
                var yPeriod = evalContent[i].kpiStandard[val].y_period.split(",");
                minQuantity = parseFloat(xPeriod[0]);
                maxQuantity = parseFloat(xPeriod[1]);
                minY =  parseFloat(yPeriod[0]);
                maxY =  parseFloat(yPeriod[1]);
                unit = evalContent[i].kpiUnit;
            }
        }
        var k = (maxY - minY)/(maxQuantity - minQuantity);//公示斜率
        var score = minY + k * (number - minQuantity); //评分列计算公示
        if(xPeriod.length == 2 && minQuantity != maxQuantity){ //自动为评分列打分
            $('#col005row' + kpiId).val(score);
        }else{
            $('#col005row' + kpiId).val(maxY);
        }
        if (!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(number))) {
            $('#' + id).val('');
            $('#col005row' + kpiId).val('');
            $.messager.alert('信息', '只能输入正数', 'info');
        }else if (parseFloat(value) < parseFloat(minQuantity)) {
            $('#' + id).val('');
            $('#col005row' + kpiId).val('');
            $.messager.alert('信息', "定量分值不能低于最小值：" + minQuantity + unit, 'info');
        }
        if (maxQuantity != 'NAN' && parseFloat(value) > parseFloat(maxQuantity)) {
            $('#' + id).val('');
            $('#col005row' + kpiId).val('');
            $.messager.alert('信息', "定量分值不能超过最大值：" + maxQuantity + unit, 'info');
        }
    },
    /**
     * 对定性指标-校验分数
     */
    checkGrade: function (value, id) {
        var number = value;
        var minValue ="";
        var maxValue ="";
        var idStr = "" + id;
        var kpiId = idStr.split("row")[1];
        var val = $('input[name="'+ kpiId +'"]:checked').val();
        for(var i=0; i<evalContent.length; i++){
            if(evalContent[i].id == kpiId && evalContent[i].valueType == "1"){
                var yPeriod = evalContent[i].kpiStandard[val].y_period.split(",");
                minValue = parseFloat(yPeriod[0]);
                maxValue = parseFloat(yPeriod[1]);
            }
        }
        if (!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(number))) {
            $('#' + id).val('');
            $.messager.alert('信息', '只能输入正数', 'info');
        }else if (parseFloat(value) < parseFloat(minValue)) {
            $('#' + id).val('');
            $.messager.alert('信息', "分值不能低于最小分值：" + minValue, 'info');
        }
        if (minValue != maxValue && parseFloat(value) > parseFloat(maxValue)) {
            $('#' + id).val('');
            $.messager.alert('信息', "分值不能超过最大分值：" + maxValue, 'info');
        }

    },
    /**
     * 计算总分
     */
    calScore: function () {
        score = 0;
        var obj = $(".grade");
        $.each(obj, function (i) {
            if (i != obj.length - 1) {
                if (parseInt(this.value)) {
                    score = parseFloat(score) + parseFloat(this.value);
                }
            }
        });
        if(score != 0){
            $("#scoreSum").val(score.toFixed(1));
        }
        for(var i=0; i<rankGlobal.length; i++){
            var period = rankGlobal[i].period.split(",");
            var min = parseInt(period[0]);
            var max = parseInt(period[1]);
            if(score>min && score<max){
                $("#evalRank").val(rankGlobal[i].name);
            }
        }
    },
    /**
     * 修改评分信息
     */
    editReview: function () {
        if ($('#editBtn').linkbutton('options').disabled == false) {
            $('.quantify,.grade,.remark').css("background-color", "#FFFFFF");
            commonFn.setEditCellColor(true);
            commonFn.setEdit();
            $('#saveBtn').linkbutton('enable');
            $('#cancelBtn').linkbutton('enable');
            $('#confirmBtn').linkbutton('enable');
            $('#editBtn').linkbutton('disable');
            /*old code
            $.post(
                'searchReview.action',
                {'expertId':expertId,'batchNo':batchNo,'enId':enId,'itmId':itmId,'num': Math.random()},

                function(data){
                    if(data.reviewState=='0'){
                        setEdit();
                        setEditCellColor(true);
                        $('#saveBtn').linkbutton('enable');
                        $('#cancelBtn').linkbutton('enable');
                        $('#confirmBtn').linkbutton('disable');
                        $('#editBtn').linkbutton('disable');
                    }else{
                        $.messager.alert('警告', '此状态已提交，不能修改', 'warning');
                    }
                }
                ,'json');
            //保存之后才能送审
            $('#submitBtn').linkbutton('disable');*/
        }

    },
    /*   submitReview: function () {
            if ($('#confirmBtn').linkbutton('options').disabled == false) {
                $('#editBtn').linkbutton('disable');
                $('#confirmBtn').linkbutton('disable');

                $.post(
                    'searchReview.action',
                    {'batchNo': batchNo, 'enId': enId, 'itmId': itmId},
                    function (data) {
                        if (data.reviewState == '0') {
                            $.messager.confirm('提示信息', '确认以后无法更改，需要确认吗？', function (data) {
                                if (data) {
                                    $.post(
                                        'submitReview.action',
                                        {
                                            'expertId': expertId,
                                            'batchNo': batchNo,
                                            'enId': enId,
                                            'itmId': itmId,
                                            'num': Math.random()
                                        },

                                        function (data) {
                                            if (data.bsuccess == "true") {
                                                commonFn.refresh();
                                                commonFn.setReadonly();
                                                $('#editBtn').linkbutton('disable');
                                                $('#confirmBtn').linkbutton('disable');
                                                $('#status').val('已提交');
                                                $.messager.alert('信息', '提交成功', 'info');
                                            } else {
                                                $.messager.alert('警告', '此状态已审核，不能修改', 'warning');
                                            }
                                        }
                                        , 'json');
                                } else {
                                    $('#editBtn').linkbutton('enable');
                                    $('#confirmBtn').linkbutton('enable');
                                }
                            });
                        } else {
                            $.messager.alert('警告', '此状态已提交，不能再提交', 'warning');
                        }
                    }
                    , 'json');
            }
        },*/
    /**
     * 保存右侧打分明细
     */
    saveEvalScoreDetail: function(){
        var evalContentSave = [];
        var id;
        $.each(evalContent, function(index, item){
            var score = {};
            var kpiId = evalContent[index].id;
            if(evalScoreDetailInfoInfoGlobal[index]){
                score["id"] = evalScoreDetailInfoInfoGlobal[index].id;
                score["lastModifiedVersion"] = evalScoreDetailInfoInfoGlobal[index].lastModifiedVersion;
            }
            score["evalScore"] = {
                "id":1,
                "lastModifiedVersion":0
            };
            score["expert"] = {
                "id":1,
                "lastModifiedVersion":0
            };
            score["kpi"] = {
                "id":kpiId,
                "lastModifiedVersion":0
            };
            score["isLeader"] = 0;
            score["kpiScore"] = $('#col005row' + kpiId).val();
            score["remark"] = $('#col006row' + kpiId).val();
            if(evalContent[index].valueType == "1" ){ //定性指标
                score["evalScoreResult"] = $('#col004row' + kpiId).val();
                score["evalQuantity"] = 0;
            }else{
                score["evalScoreResult"] = "";
                score["evalQuantity"] = $('#col004row' + kpiId).val();
            }
            score["checkStandId"] = $("input[name='"+ kpiId +"']:checked").attr("id");//获取单选按钮的id
            score["orderNum"] = index + 1;
            evalContentSave.push(score);
        });
        console.log(evalContentSave);
        $.ajax({
            type: 'POST',
            url: formUrl.evalScoreDetail,
            dataType: 'json',
            data:JSON.stringify(evalContentSave),
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            async: false,
            success: function (scoreSumInfo) {
                if(scoreSumInfo.message){
                    $.messager.alert('警告', '此状态已审核，不能修改', 'warning');
                }else{
                    //commonFn.refresh();
                    $('#editBtn').linkbutton('disable');
                    $('#confirmBtn').linkbutton('disable');
                    commonFn.setReadonly();
                    commonFn.setEditCellColor(false);
                    $.messager.alert('信息', '提交成功', 'info');
                }
            }
        });
    },
    /**
     * 保存下测打分汇总数据
     */
    saveEvalScore: function(){
        var evalScoreInfoSave = {
            "id": evalScoreInfoGlobal.id,
            "eval_obj_id": projectInfoGlobal.chr_id,
            "eval_user_id": kpiTableInfoGlobal.eval_user_id,
            "eval_user_name": kpiTableInfoGlobal.eval_user_name,
            "prj_reduce_amount":$('#moneyR1').val(),
            "prj_reduced_amount": $('#moneyR2').val(),
            "prj_yr_amount": $('#moneyR3').val(),
            "prj_yr_reduce_amount": $('#moneyR4').val(),
            "total_score": $('#scoreSum').val(),
            "eval_level":$('#evalRank').val()
        };
        console.log(evalScoreInfoSave);
        $.ajax({
            type: 'POST',
            url: formUrl.evalScore,
            dataType: 'json',
            data:JSON.stringify(evalScoreInfoSave),
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            async: false,
            success: function (scoreSumInfo) {
                if(scoreSumInfo.message){
                    $.messager.alert('警告', '此状态已审核，不能修改', 'warning');
                }else{
                    //commonFn.refresh();
                    $('#editBtn').linkbutton('disable');
                    $('#confirmBtn').linkbutton('disable');
                    commonFn.setReadonly();
                    commonFn.setEditCellColor(false);
                    $.messager.alert('信息', '提交成功', 'info');
                }
            }
        });
    },

    /**
     * 保存专家评价信息 ------ 暂无此需求
     */
    /*saveReview: function () {
        if ($('#saveBtn').linkbutton('options').disabled == false) {
            $("#saveBtn").linkbutton('disable');
            $("#cancelBtn").linkbutton('disable');
            $('.grade, .remark').css("background-color", "rgb(209, 238, 238)");
            commonFn.setReadonly();
            commonFn.setEditCellColor(false);
            $.post(
                'searchReview.action',
                {'batchNo': batchNo, 'enId': enId, 'itmId': itmId, 'num': Math.random()},
                function (data) {
                    if (data == null) {
                        $('#reviewState').val('0');
                        if ($(this).form('validate')) {
                            $("#saveBtn").linkbutton('enable');
                        }
                        $('#addReviewForm').form('submit', {
                            url: 'addReview.action',
                            onSubmit: function () {
                                return $(this).form('validate');
                            },
                            success: function (data) {
                                data = $.parseJSON(data);
                                if (data.bsuccess == "true") {
                                    $('#createName').val(name);
                                    commonFn.setReadonly();
                                    setEditCellColor(false);
                                    $('#editBtn').linkbutton('enable');
                                    $('#confirmBtn').linkbutton('enable');
                                    $('#saveBtn').linkbutton('disable');
                                    $('#cancelBtn').linkbutton('disable');
                                    $('#submitBtn').linkbutton('enable');
                                    $.messager.alert('信息', '保存成功', 'info');
                                }
                                else {
                                    $.messager.alert('错误', '保存失败', 'error');
                                }
                            }
                        });
                    }
                    else {
                        if (data.reviewState == '0') {
                            if (!$(this).form('validate')) {
                                $("#saveBtn").linkbutton('enable');
                                $("#cancelBtn").linkbutton('enable');
                            }
                            $('#addReviewForm').form('submit', {
                                url: 'addReview.action',
                                onSubmit: function () {
                                    return $(this).form('validate');
                                },
                                success: function (data) {
                                    data = $.parseJSON(data);
                                    if (data.bsuccess == "true") {
                                        $.messager.alert('信息', '保存成功', 'info');
                                        $('#createName').val(name);
                                        commonFn.setReadonly();
                                        commonFn.setEditCellColor(false);
                                        $('#editBtn').linkbutton('enable');
                                        $('#confirmBtn').linkbutton('enable');
                                        $('#saveBtn').linkbutton('disable');
                                        $('#cancelBtn').linkbutton('disable');
                                    }
                                    else {
                                        $.messager.alert('错误', '保存失败', 'error');
                                    }
                                }
                            });
                        } else {
                            $.messager.alert('警告', '此状态已提交，不能修改', 'warning');
                        }
                    }
                }
                , 'json');

        }
    },*/
    cancelReview: function () {
        if ($('#cancelBtn').linkbutton('options').disabled == false) {
            $('#addReviewForm').form('load', 'searchReview.action?batchNo=' + batchNo + '&enId=' + enId + '&itmId=' + itmId + '&num=' + Math.random());
        }
        commonFn.setReadonly();
        commonFn.setEditCellColor(false);
        $('#saveBtn').linkbutton('disable');
        $('#cancelBtn').linkbutton('disable');
        $('#confirmBtn').linkbutton('enable');
        $('#editBtn').linkbutton('enable');
    },
    /**
     * 专家提交审核
     */
    submitAppraise: function () {
        // 检查是否已经保存评价表
        $.post('checkIsSave.action', {
            'batchNo': batchNo,
            'enId': enId,
            'itmId': itmId,
            'expertId': expertId,
            'num': Math.random()
        }, function (data) {
            if (data.success == "true") {
                // 组员送审
                $.post(
                    'submitAppraise.action',
                    {'batchNo': batchNo, 'enId': enId, 'itmId': itmId, 'reviewState': "1", 'num': Math.random()},
                    function (data) {
                        if (data.success == "true") {
                            commonFn.refreshTree();
                            $.messager.alert('信息', '提交成功', 'info');
                            //刷新页面
                            commonFn.refresh();
                            commonFn.cleanTargetVal();
                        } else {
                            $.messager.alert('错误', '提交失败！', 'error');
                        }
                    }
                    , 'json');
            } else {
                $.messager.alert('错误', '请填写评审表所有必填项！', 'error');
            }
        }, 'json');


    },
    setReadonly:function() {
        $('#comAdvice').attr("disabled", "disabled");
        $('#review_table input:text[id!=createName]').attr("disabled", "disabled");
        $('#review_table textarea').attr("disabled", "disabled");
        $('#check_table textarea').attr("disabled", "disabled");
    },
    setEdit: function() {
        $('#review_table input:text[id!=createName]').removeAttr("disabled");
        $('#review_table textarea').removeAttr("disabled");
        $('.standard').removeAttr("disabled");
        for(var i=0; i<evalContent.length; i++){
            if( evalContent[i].valueType == "1"){
                $('#col004row' + evalContent[i].id).attr("disabled",true).css("background-color", "#D1EEEE");
            }
            if( evalContent[i].valueType == "2"){
                $('#col005row' + evalContent[i].id).attr("disabled",true).css("background-color", "#D1EEEE");
            }
            var standard = evalContent[i].kpiStandard;
            for(var j=0; j< standard.length; j++){
                if(standard[j].id == checkedArray[i]){
                    var yPeriod = standard[j].y_period.split(",");
                    if(yPeriod[0] == yPeriod[1] && standard[j].order_num==1){
                        $('#col005row' + evalContent[i].id).attr("disabled",true).css("background-color", "#D1EEEE");
                        $('#col006row' + evalContent[i].id).attr("disabled",true).css("background-color", "#D1EEEE");
                    }
                }
            }
        }
    },
    /**
     * 清空评审表数据
     */
    setVal: function() {
        $('#judgeR1').val("");
        $('#judgeR2').val("");
        $('#judgeR3').val("");
        $('#judgeR4').val("");
        $('#suggestR4').val("");
        $('#judgeR5').val("");
        $('#suggestR5').val("");
        $('#reviewRemark').val("");
        $('#createName').val("");
        $('#verifyName').val("");
        clearSelect();
        $('textarea').removeClass('validatebox-invalid');

        //清空绩效目标审核打分表数据
        $('#suggestR1').val("");
        $('#suggestR2').val("");
        $('#suggestR3').val("");
        $('#moneyR1').val("");
        $('#moneyR2').val("");
        $('#moneyR3').val("");
        $('#moneyR4').val("");

        //清空评分和备注
        $.each(evalContent, function(index, item){
            var id = evalContent[index].id;
            $('#col005row' + id).val("");
            $('#col006row' + id).val("");
        });
    },

    /**
     * 清空绩效目标数据
     */
    cleanTargetVal: function() {
        //项目名称
        $("#prjName").html("");
        //项目类型
        $("#prjType").val("");
        //项目属性
        $("#prjProperty").val("");
        //项目总金额
        $("#totalMoney").val("");
        //其中下年申报金额
        $("#nextyearMoney").val("");
        //开始时间
        $("#startDate").val("");
        //开始时间
        $("#endDate").val("");
        //单位负责人
        $("#prjOwner").val("");
        //项目负责人
        $("#prjManager").val("");
        //联系电话
        $("#phoneNumber").val("");


        //项目概况
        $("#prjContent").html("");
        //项目的必要性和可行性
        $("#prjFeasibility").html("");
        //项目概算 总额
        $("#prjTotalMoney").html("");
        //项目资金计算依据和方法
        $("#prjCount").html("");
        //上年预算资金
        $("#lastyearMoney").html("");
        //实际到位资金
        $("#inplaceMoney").html("");
        //实际使用资金
        $("#usedMoney").html("");
        //项目结余资金
        $("#overplusMoney").html("");
        //实际到位率
        $("#inplacePercentage").html("");
        //支出实现率
        $("#usedPercentage").html("");
        //完成进度
        $("#prjSchedule").html("");
        //当年金额
        $("#thisyearMoney").html("");
        //说明
        $("#explain").html("");
        //项目预计总体目标概述
        $("#prjTarget").html("");
        //数量指标
        $("#prjAmount").html("");
        //数量指标
        $("#prjQuality").html("");
        //时效指标
        $("#prjTimeliness").html("");
        //经济效益指标
        $("#prjEconomicEffect").html("");
        //社会效益指标
        $("#prjSocialEffect").html("");
        //生态效益指标
        $("#prjEcologicalEffect").html("");
        //申报单位需要说明的其他情况
        $("#otherInformation").html("");
        // 清除原来的项目概算明细数据
        $(".addDetail").remove();


    },
    /**
     * 评审表单元格背景颜色设置
     */
    setEditCellColor: function (flag) {
        if (flag == true) {
            document.getElementById("suggestR1").style.backgroundColor = "#FFFFFF";
            document.getElementById("suggestR1").disabled = false;
            document.getElementById("suggestR2").style.backgroundColor = "#FFFFFF";
            document.getElementById("suggestR2").disabled = false;
            document.getElementById("suggestR3").style.backgroundColor = "#FFFFFF";
            document.getElementById("suggestR3").disabled = false;
            document.getElementById("moneyR1").style.backgroundColor = "#FFFFFF";
            document.getElementById("moneyR1").disabled = false;
            document.getElementById("moneyR2").style.backgroundColor = "#FFFFFF";
            document.getElementById("moneyR2").disabled = false;
            document.getElementById("moneyR3").style.backgroundColor = "#FFFFFF";
            document.getElementById("moneyR3").disabled = false;
            document.getElementById("moneyR4").style.backgroundColor = "#FFFFFF";
            document.getElementById("moneyR4").disabled = false;
            //分数和备注可编辑
            $.each(evalContent, function(index, item){
                var id = evalContent[index].id;
                document.getElementById('col004row' + id).disabled = false;
                document.getElementById('col004row' + id).style.backgroundColor = "#FFFFFF";
                document.getElementById('col005row' + id).disabled = false;
                document.getElementById('col005row' + id).style.backgroundColor = "#FFFFFF";
                document.getElementById('col006row' + id).disabled = false;
                document.getElementById('col006row' + id).style.backgroundColor = "#FFFFFF";
            });
            //合计不可编辑
            /*document.getElementById("").style.backgroundColor = "#D1EEEE";
            document.getElementById("").disabled = true;
            document.getElementById("").style.backgroundColor = "#FFFFFF";
            document.getElementById("").disabled = false;*/
            /*//项目信息不可编辑
            document.getElementById("enName").style.background = "#D1EEEE";
            document.getElementById("enName").disabled = true;
            document.getElementById("itmName").style.background = "#D1EEEE";
            document.getElementById("itmName").disabled = true;
            document.getElementById("totalPrice").style.background = "#D1EEEE";
            document.getElementById("totalPrice").disabled = true;*/

        } else {
            document.getElementById("suggestR1").style.backgroundColor = "#D1EEEE";
            document.getElementById("suggestR2").style.backgroundColor = "#D1EEEE";
            document.getElementById("suggestR3").style.backgroundColor = "#D1EEEE";
            document.getElementById("moneyR1").style.backgroundColor = "#D1EEEE";
            document.getElementById("moneyR2").style.backgroundColor = "#D1EEEE";
            document.getElementById("moneyR3").style.backgroundColor = "#D1EEEE";
            document.getElementById("moneyR4").style.backgroundColor = "#D1EEEE";
            //分数和备注
            $.each(evalContent, function(index, item){
                var id = evalContent[index].id;
                document.getElementById('col005row' + id).style.backgroundColor = "#D1EEEE";
                document.getElementById('col006row' + id).style.backgroundColor = "#D1EEEE";
            });
            //项目信息不可编辑
            /*document.getElementById("enName").style.background = "#D1EEEE";
            document.getElementById("enName").disabled = true;
            document.getElementById("itmName").style.background = "#D1EEEE";
            document.getElementById("itmName").disabled = true;
            document.getElementById("totalPrice").style.background = "#D1EEEE";
            document.getElementById("totalPrice").disabled = true;
            /!*document.getElementById("comAdvice").style.backgroundColor = "#D1EEEE";*!/*/
        }
    },
    /**
     * 提交评分信息
     */
    submitReview: function(){
        commonFn.saveEvalScoreDetail();
        commonFn.saveEvalScore();
    }
};