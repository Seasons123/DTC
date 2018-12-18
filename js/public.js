var sever = "1";
var formUrl = {} ;
switch (sever){
    case "0":
        formUrl = {
            "projectMain": '../../data/projectMain/ProjectMain.json',
            "taskKpi": '../../data/taskKpi/TaskKpi.json',
            "evalScore": '../../data/taskKpi/EvalScore.json',
            "evalRank": '../../data/taskKpi/EvalRank.json',
            "evalScoreDetail": '../../data/taskKpi/EvalScoreDetail.json'
        };
        break ;
    case  "1":
        formUrl = {
            "projectMain": 'http://10.15.1.34:8081/df-pe/api/ProjectMain?',
            "taskKpi": 'http://10.15.1.34:8081/df-pe/api/TaskKpi?',
            "evalScore": 'http://10.15.1.34:8081/df-pe/api/EvalScore?',
            "evalRank": 'http://10.15.1.34:8081/df-pe/api/EvalRank?',
            "evalScoreDetail": 'http://10.15.1.34:8081/df-pe/api/EvalScoreDetail?',
        };
        break;
}