
var timer;
var count = 0;
var dataArray;
var randomSelect;
var RandomQuest; 
var info;
var output_csv;


function save() {
    document.cookie = "MHRiseQuestData=" + Array.from(dataArray.filter(quest => quest.CheckBox.checked), q => q.id);
}

$('#all').on('click', function() {
    dataArray.filter(quest => $(quest.TableLine).is(':visible')).forEach((quest) => {
        quest.CheckBox.checked = true;
    });
    save();
});

$('#allDisable').on('click', function() {
    dataArray.filter(quest => $(quest.TableLine).is(':visible')).forEach((quest) => {
        quest.CheckBox.checked = false;
    });
    save();
});

$('#kogata').on('click', function() {
    dataArray.filter(quest => quest.kogata).forEach((selectquest) => {
        selectquest.CheckBox.checked = false;
    });
    save();
});

$('#hokaku').on('click', function() {
    dataArray.filter(quest => quest.hokaku).forEach((selectquest) => {
        selectquest.CheckBox.checked = false;
    });
    save();
});

$('#HR4Quest').on('click', function() {
    dataArray.filter(quest => quest.id.substring(0, 2)=='O4').forEach((selectquest) => {
        selectquest.CheckBox.checked = false;
    });
    save();
});

$('#HR5Quest').on('click', function() {
    dataArray.filter(quest => quest.id.substring(0, 2)=='O5').forEach((selectquest) => {
        selectquest.CheckBox.checked = false;
    });
    save();
});

$('#EventQuest').on('click', function() {
    dataArray.filter(quest => quest.id.substring(0, 1)=='E').forEach((selectquest) => {
        selectquest.CheckBox.checked = false;
    });
    save();
});

$('#next').on('click', function() {
    count = 0;
    if(timer)
    clearInterval(timer);
    randomSelect = dataArray.filter(quest => quest.CheckBox.checked);

    while (info.firstChild) {
    info.removeChild(info.lastChild);
    }

    
    if(!randomSelect.length){
    while (RandomQuest.firstChild) {
        RandomQuest.removeChild(RandomQuest.lastChild);
    }
    let dengerInfo = document.createElement("div");
    dengerInfo.setAttribute('class', 'alert alert-danger');
    dengerInfo.setAttribute('role', 'alert');
    dengerInfo.appendChild(document.createTextNode('選出クエストが選択されていません。'))
    info.appendChild(dengerInfo);
    return;
    }
    timer = setInterval(getQuest, 10);
});


$('#find').bind("click",function(){
    var re = new RegExp($('#search').val());
    dataArray.forEach((quest) => {
        $(quest.TableLine).hide();
    });

    dataArray.filter(quest => $(quest.TableLine).find("td:eq(3)").html().match(re) != null).forEach((selectquest) => {
        $(selectquest.TableLine).show();
    });
});

$('#clear').bind("click",function(){
    $('#search').val('');
    dataArray.forEach((quest) => {
        $(quest.TableLine).show();
    });
});

var getQuest = function(){
    if (!randomSelect.length)
    {
    clearInterval(timer);
    timer=null;
    return;
    }

    while (RandomQuest.firstChild) {
    RandomQuest.removeChild(RandomQuest.lastChild);
    }

    quest = randomSelect[Math.floor(Math.random() * randomSelect.length)];
    let tbody = document.createElement("tbody");
    let questLine = document.createElement("tr");

    let questRank = document.createElement("td");
    let span = document.createElement("span");
    if(quest.HR == 8){
        span.setAttribute('id', 'HR8');
    }else{
        span.setAttribute('id', 'HR4');
    }
    
    span.appendChild(
        document.createTextNode(
            (quest.event?'E':'') +
            ('★'.repeat(quest.rank))
            ));
    questRank.appendChild(span);
    questLine.appendChild(questRank);
    
    let questTitle = document.createElement("td");
    questTitle.appendChild(document.createTextNode(quest.title))
    questLine.appendChild(questTitle);
    
    let questTarget = document.createElement("td");
    questTarget.appendChild(document.createTextNode(quest.target))
    questLine.appendChild(questTarget);

    tbody.appendChild(questLine);
    RandomQuest.appendChild(tbody);
    
    clearInterval(timer);
    timer=null;
}

$(function(){
    RandomQuest = document.getElementById('RandomQuest');
    info = document.getElementById('info');
    output_csv = document.getElementById('Quest_List');

    var pagetop = $('#page_top');
    // ボタン非表示
    pagetop.hide();

    // 100px スクロールしたらボタン表示
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            pagetop.fadeIn();
        } else {
            pagetop.fadeOut();
        }
    });

    pagetop.click(function () {
    $('body, html').animate({ scrollTop: 0 }, 500);
        return false;
    });

    $.getJSON("QuestList.json", (data) => {
        const updateDay = document.getElementById('updateDay');
        updateDay.innerHTML = data.updateDay;
        dataArray = data.quest;

        let tbody = document.createElement("tbody");
        data.quest.forEach((quest) => {
            let questLine = document.createElement("tr");
            quest.TableLine = questLine;

            let questCheck = document.createElement("td");
            let questdiv = document.createElement("div");
            let questlabel = document.createElement("label");
            let questinput = document.createElement("input");
            questinput.setAttribute('type', 'checkbox');
            questinput.setAttribute('id', 'select');
            questinput.setAttribute('value', quest.id);
            questlabel.appendChild(questinput);
            questdiv.appendChild(questlabel);
            questCheck.appendChild(questdiv);
            questLine.appendChild(questCheck);
            questinput.checked = true;
            quest.CheckBox = questinput;

            let questRank = document.createElement("td");
            let span = document.createElement("span");
            if(quest.HR == 8){
                span.setAttribute('id', 'HR8');
            }else{
                span.setAttribute('id', 'HR4');
            }
            
            span.appendChild(
                document.createTextNode(
                    (quest.event?'E':'') +
                    ('★'.repeat(quest.rank))
                    ));
            questRank.appendChild(span);
            questLine.appendChild(questRank);
            
            let questTitle = document.createElement("td");
            questTitle.appendChild(document.createTextNode(quest.title))
            questLine.appendChild(questTitle);
            
            let questTarget = document.createElement("td");
            questTarget.appendChild(document.createTextNode(quest.target))
            questLine.appendChild(questTarget);

            tbody.appendChild(questLine);
        });
        output_csv.appendChild(tbody);

        let cookies = document.cookie;
        let cookiesArray = cookies.split(';');
    
        for(let c of cookiesArray){
            let cArray = c.split('=');
            if( cArray[0] == 'MHRiseQuestData'){
                dataArray.forEach((quest) => {
                    quest.CheckBox.checked = false;
                });
                let savedata = cArray[1].split(',');
                savedata.forEach((saveId) => {
                    let found = dataArray.find(element => element .id == saveId);
                    if(found)
                        found.CheckBox.checked = true;
                });
            }
        }

        $('[id=select]').on('change', function() {
            save();
        });
    });
});
