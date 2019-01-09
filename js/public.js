var sever = "1";
var formUrl = {} ;
switch (sever){
    case "0":
        formUrl = {
            "projectMain": '../../data/projectMain/ProjectMain.json',
            "taskKpi": '../../data/taskKpi/TaskKpi.json',
            "evalScore": '../../data/taskKpi/EvalScore.json',
            "evalRank": '../../data/taskKpi/EvalRank.json',
            "evalScoreDetail": '../../data/taskKpi/ScoreDetail.json',
            "evalTaskExpert": '../../data/taskExpert/TaskExpert.json',
            "getExpertsScoreDetails": '../../data/getExpertsScoreDetails/getExpertsScoreDetails.json'
        };
        break ;
    case  "1":
        formUrl = {
            "projectMain": 'http://10.15.1.34:8081/df-pe/api/ProjectMain?',
            "taskKpi": 'http://10.15.1.34:8081/df-pe/api/TaskKpi?',
            "evalScore": 'http://10.15.1.34:8081/df-pe/api/EvalScore?',
            "evalRank": 'http://10.15.1.34:8081/df-pe/api/EvalRank?',
            "evalScoreDetail": 'http://10.15.1.34:8081/df-pe/api/EvalScoreDetail?',
            "evalTaskExpert": 'http://10.15.1.34:8081/df-pe/api/TaskExpert?',
            "getExpertsScoreDetails": 'http://10.15.1.34:8081/df-pe/api/EvalScoreDetail/getExpertsScoreDetails?'
        };
        break;
    case  "2":
        formUrl = {
            "projectMain": 'http://127.0.0.1:8202/df-peeval/api/ProjectMain?',
            "taskKpi": 'http://127.0.0.1:8202/df-peeval/api/TaskKpi?',
            "evalScore": 'http://127.0.0.1:8202/df-peeval/api/EvalScore?',
            "evalRank": 'http://127.0.0.1:8202/df-peeval/api/EvalRank?',
            "evalScoreDetail": 'http://127.0.0.1:8202/df-peeval/api/EvalScoreDetail?',
            "evalTaskExpert": 'http://10.15.1.34:8081/df-pe/api/TaskExpert?',
            "getExpertsScoreDetails": 'http://10.15.1.34:8081/df-pe/api/EvalScoreDetail/getExpertsScoreDetails?'
        };
        break;
}