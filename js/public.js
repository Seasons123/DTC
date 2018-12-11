var sever = "1";
var formUrl = {} ;
switch (sever){
    case "0":
        formUrl = {
            "projectMain": '../../data/projectMain/ProjectMain.json',
            "taskKpi": '../../data/taskKpi/TaskKpi.json'
        };
        break ;
    case  "1":
        formUrl = {
            "projectMain": 'http://10.15.1.34:8081/df-pe/api/ProjectMain?',
            "taskKpi": 'http://10.15.1.34:8081/df-pe/api/TaskKpi?'
        };
        break;
}