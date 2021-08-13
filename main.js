
var timer;
var count = 0;
var dataArray;
var randomSelect;
var RandomQuest; 
var info;
var output_csv;


$('#save').on('click', function() {
    document.cookie = "MHRiseQuestData=" + Array.from(dataArray.filter(quest => quest.CheckBox.checked), q => q.id);
});

$('#load').on('click', function() {
    let cookies = document.cookie;
    let cookiesArray = cookies.split(';');

    dataArray.forEach((quest) => {
    quest.CheckBox.checked = false;
    });

    for(let c of cookiesArray){
        let cArray = c.split('=');
        if( cArray[0] == 'MHRiseQuestData'){
            let savedata = cArray[1].split(',');
            savedata.forEach((saveId) => {
            let found = dataArray.find(element => element .id == saveId);
            if(found)
                found.CheckBox.checked = true;
            });
        }
    }
});

$('#all').on('click', function() {
    dataArray.forEach((quest) => {
    quest.CheckBox.checked = true;
    });
});

$('#kogata').on('click', function() {
    dataArray.filter(quest => quest.kogata).forEach((selectquest) => {
    selectquest.CheckBox.checked = false;
    });
});

$('#hokaku').on('click', function() {
    dataArray.filter(quest => quest.hokaku).forEach((selectquest) => {
    selectquest.CheckBox.checked = false;
    });
});

$('#HR4Quest').on('click', function() {
    dataArray.filter(quest => quest.id.substring(0, 2)=='O4').forEach((selectquest) => {
    selectquest.CheckBox.checked = false;
    });
});

$('#HR5Quest').on('click', function() {
    dataArray.filter(quest => quest.id.substring(0, 2)=='O5').forEach((selectquest) => {
    selectquest.CheckBox.checked = false;
    });
});

$('#EventQuest').on('click', function() {
    dataArray.filter(quest => quest.id.substring(0, 1)=='E').forEach((selectquest) => {
    selectquest.CheckBox.checked = false;
    });
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
    questRank.appendChild(document.createTextNode(quest.rank))
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


	$('#find').bind("click",function(){
		var re = new RegExp($('#search').val());
		$('#Quest_List tbody tr').each(function(){
			var txt = $(this).find("td:eq(3)").html();
			if(txt.match(re) != null){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
	});

	$('#clear').bind("click",function(){
		$('#search').val('');
		$('#Quest_List tr').show();
	});


    $.getJSON("QuestList.json", (data) => {
        const updateDay = document.getElementById('updateDay');
        updateDay.innerHTML = data.updateDay;
        dataArray = data.quest;

        let tbody = document.createElement("tbody");
        data.quest.forEach((quest) => {
            let questLine = document.createElement("tr");

            let questCheck = document.createElement("td");
            let questdiv = document.createElement("div");
            let questlabel = document.createElement("label");
            let questinput = document.createElement("input");
            questinput.setAttribute('type', 'checkbox');
            questinput.setAttribute('value', quest.id);
            questlabel.appendChild(questinput);
            questdiv.appendChild(questlabel);
            questCheck.appendChild(questdiv);
            questLine.appendChild(questCheck);
            questinput.checked = true;
            quest.CheckBox = questinput;

            let questRank = document.createElement("td");
            questRank.appendChild(document.createTextNode(quest.rank))
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
    });
});
