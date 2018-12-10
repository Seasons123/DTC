//政府采购前端通用统一参数调用js
var PeConstant = {};

// 采购通用调用
PeConstant.Ctx = "/df/pe/";
//采购方式
var GPM = [{key:'GKZB',value:'公开招标'},{key:'YQZB',value:'邀请招标'},{key:'JZXCS',value:'竞争性磋商'}];
//组织形式
var GOT = [{key:'ZFJZCG',value:'政府集中采购'},{key:'BMJZCG',value:'部门集中采购'},{key:'FSCG',value:'分散采购'}];
//代理机构
var GA = [{key:'ZFCGZX',value:'政府采购中心'},{key:'SHDLJG',value:'社会代理机构'}];
var GA_ZFJZCG = [{key:'ZFCGZX',value:'政府采购中心'}];
//判断
var WHETHER = [{key:0,value:'否'},{key:1,value:'是'}];
//资金性质
var MK = [{key:'ZCZJ',value:'自筹资金'},{key:'YHNDAP',value:'以后年度安排'}]

// 采购通用调用地址
PeConstant.CommonUrl = {
		QUERY_LIST : "common/queryList.do" ,// 列表数据查询地址
		QUERY_WF : "common/getWfLog.do"   ,  //工作流操作日志
		SUB_PRJ_LIST : PeConstant.Ctx + "project/getSubprojectList.do" ,// 查询子项目列表
		
};
//弹框调用
PeConstant.templateUrl = {
	MODULE: "project/template/"	
}

PeConstant.ViewId = {
		SUB_PRJ_GRID_ID : "{1F2E51DB-13C1-453A-803F-0028B5DE714F}",//子项目列表
		CZ_EXP_GRID_ID : "{B7CF9147-849F-43BF-B86A-08C4C96A5022}",//财政评价专家组
		MEDIARY_EXP_GRID_ID : "{2A67EE54-A317-4453-8DD6-76FE9113504E}",//中介评价专家组
		WORK_GROUP_GRID_ID : "{AF612A44-D242-413F-8C8D-6F3FA5B1AEFB}",//工作组
		INDEX_SYS_GRID_ID : "{2EF442D3-E2D9-4F1B-A63A-F13B26C28BC6}",//指标体系
		MEDIA_ATTACH_GRID_ID : "{57AC6DFB-63DC-4B78-9931-29DD8669DB51}",//中介上传资料
		LEADER_ATTACH_GRID_ID : "{3F7E7314-3EB7-465D-ADF4-BEF7A1867893}",//专管员上传资料
		CZ_ATTACH_GRID_ID : "{28BC1B68-7088-42AA-BBEF-712000C6A2FA}",//财政上传资料
	};
// 采购合同模块调用的url
PeConstant.ContractUrl = {
    MODULE: "contract/"
};

//指标库模块调用的url
PeConstant.IndexUrl = {
    MODULE: "indexlib/"
};
//中介模块调用的url
PeConstant.IntermediaryUrl = {
    MODULE: "intermediary/"
};

// 平台-采购通用视图类型
PeConstant.ViewType = {
	VIEWTYPE_INPUT : "001",// 录入视图
	VIEWTYPE_LIST : "002",// 列表视图
	VIEWTYPE_QUERY : "003"// 查询视图
};
// 工作流操作类型ActionType
PeConstant.WfActionType = {
	NEXT : "NEXT",// 审核
	RECALL : "RECALL",// 收回
	BACK : "BACK",// 退回
	INPUT : "INPUT",// 录入
	EDIT : "EDIT",// 修改
	HANG : "HANG",// 挂起
	DELETE : "DELETE",// 删除
	DISCARD : "DISCARD"// 作废
};

// 按钮ID
PeConstant.BtnId = {
	BTN_ADD : "btn-add",// 新增
	BTN_DETAIL : "btn-detail",// 详细、明细
	BTN_BAT_EDIT : "btn-bat-edit",// 批量修改
	BTN_BAT_INPUT : "btn_bat_input",// 批量录入
	BTN_EDIT : "btn-edit",// 修改
	BTN_BAT_DELETE : "btn-bat-delete",// 批量删除
	BTN_DELETE : "btn-delete",// 删除
	BTN_BAT_SEND : "btn-bat-send",// 批量送审(批量发送)
	BTN_SAVE_SEND : "btn_save_send",// 保存并送审
	BTN_SEND : "btn-send",// 送审(发送)
	BTN_RESEND : "btn-resend",// 再发送
	BTN_BAT_RESEND : "btn-bat-resend",// 批量再发送
	BTN_BAT_AUDIT : "btn-bat-audit",// 批量审核
	BTN_AUDIT : "btn-audit",// 审核
	BTN_RECALL : "btn-recall",// 撤销(收回)
	BTN_BAT_RECALL : "btn-bat-recall",// 批量撤销(收回)
	BTN_BAT_BACK : "btn-bat-back",// 批量退回
	BTN_BACK : "btn-back",// 退回
	BTN_BAT_UN_BACK : "btn-bat-un-back",// 批量撤销退回
	BTN_UN_BACK : "btn-un-back",// 撤销退回
	BTN_BAT_DISCARD : "btn-bat-discard",// 批量作废
	BTN_DISCARD : "btn-discard",// 作废
	BTN_EDIT : "btn-bat-edit",// 编辑
	BTN_BAT_PRINT : "btn-bat-print",// 批量打印
	BTN_PRINT : "btn-print",// 打印
	BTN_BAT_UN_PRINT : "btn-bat-un-print",// 批量撤销打印
	BTN_UN_PRINT : "btn-un-print",// 撤销打印
	BTN_PREVIEW : "btn-preview", // 预览
	BTN_COMMON_PRINT : "btn-common-print", // 通用打印
	BTN_WFLOG : "btn-wflog"	  //操作日志
};

/*
 * 采购工作流状态，平台状态配置 TODO_001004 待处理页签 PROCESSED_002003 已处理页签 COMPLETED_008 终审页签
 * ALL_000 全部页签
 */
PeConstant.WfStatus = {
	ALL_000 : "000",// 全部
	TODO_001 : "001",// 待审核
	TODO_001004 : "001|004",// 待审核+退回
	AUDITED_002 : "002",// 已审核
	RETURNED_003 : "003",// 已退回
	PROCESSED_002003 : "002|003",// 已审核+已退回
	UNAUDIT_004 : "004",// 被退回
	MODIFIED_005 : "005",// 已修改
	DELETED_006 : "006",// 已删除
	INVALID_007 : "007",// 已作废
	COMPLETED_008 : "008",// 终审
	ALL_999 : "999"//全部 -目标填报
};
// 采购计划基础表
PeConstant.PlanTables = {
	GP_PLAN_BILL : "GP_PLAN_BILL",// 采购计划主表
	GP_PLAN_BILL_ITEM : "GP_PLAN_BILL_ITEM",// 采购计划商品明细表
	GP_PLAN_BILL_BUDGET : "GP_PLAN_BILL_BUDGET",// 采购计划资金明细表
};
//枚举项类型
PeConstant.enumTypes = [
	{key:'01',value:'指标类别'},
	{key:'02',value:'指标性质'},
	{key:'03',value:'指标状态'},
	{key:'04',value:'4E属性'},
	{key:'05',value:'绩效目标指标分类'},
	{key:'06',value:'评价机构类型'},
	{key:'07',value:'评价对象分类'}
];
