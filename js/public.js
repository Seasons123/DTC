var sever = "1";
var formUrl = {} ;
switch (sever){
    case "0":
        formUrl = {
            "markingFormShow": 'http://47.105.52.254:7001/df/file/getreview.do?',
            "previewFile": 'http://47.105.52.254:7001/df/file/savescore.do?'
        };
        break ;
    case  "1":
        formUrl = {
            "getReviewMember": '../../data/targetMember.json',
            "getReviewManager": '../../data/targetManager.json',
            "getReviewManagerEmpty": '../../data/targetManagerEmpty.json',
            "previewFile": '../../data/score/scoreTest0.json'
        };
        break;
    case  "2":
        formUrl = {
            "getReview": 'http://localhost:8002/df/pe/expert/getreview.do?',
            "saveExpertScore": 'http://localhost:8002/df/pe/expert/saveexpertscore.do?'
        }
}