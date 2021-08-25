var dataArray;
var randomSelect;
var RandomQuest;
var info;
var output_csv;


var save = function() {
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

$('#rank4Disable').on('click', function() {
    dataArray.filter(quest => quest.rank == 4).forEach((selectquest) => {
        selectquest.CheckBox.checked = false;
    });
    save();
});

$('#rank5Disable').on('click', function() {
    dataArray.filter(quest => quest.rank == 5).forEach((selectquest) => {
        selectquest.CheckBox.checked = false;
    });
    save();
});

$('#rank6Disable').on('click', function() {
    dataArray.filter(quest => quest.rank == 6).forEach((selectquest) => {
        selectquest.CheckBox.checked = false;
    });
    save();
});

$('#rank74Disable').on('click', function() {
    dataArray.filter(quest => quest.rank == 7 && quest.HR != 8).forEach((selectquest) => {
        selectquest.CheckBox.checked = false;
    });
    save();
});
$('#rank78Disable').on('click', function() {
    dataArray.filter(quest => quest.rank == 7 && quest.HR == 8).forEach((selectquest) => {
        selectquest.CheckBox.checked = false;
    });
    save();
});

$('#next').on('click', function() {
    randomSelect = dataArray.filter(quest => quest.CheckBox.checked);

    while (info.firstChild) {
        info.removeChild(info.lastChild);
    }

    $('#QuestError').hide();
    $('#QuestCompleteLabel').hide();

    if (!randomSelect.length) {
        $('#QuestError').show();
        return;
    }
    getQuest();
});

$('#find').on("click", function() {
    targetname = new RegExp($('#search').val());
    query();
});

$('#clear').on("click", function() {
    $('#search').val('');
    dropdownrank = null;
    dropdownrankHR = null;
    targetname = "";
    dataArray.forEach((quest) => {
        $(quest.TableLine).show();
    });
});

var dropdownrank;
var dropdownrankHR;
var targetname = "";

var query = function() {
    dataArray.forEach((quest) => {
        $(quest.TableLine).hide();
    });

    dataArray.filter(quest => $(quest.TableLine).find("td:eq(3)").html().match(targetname) != null &&
            (!dropdownrank || quest.rank == dropdownrank) &&
            (!dropdownrankHR || quest.HR == dropdownrankHR))
        .forEach((selectquest) => {
            $(selectquest.TableLine).show();
        });

}
$('#dropdown4').on("click", function() {
    dropdownrank = 4;
    dropdownrankHR = 4;
    query();
});
$('#dropdown5').on("click", function() {
    dropdownrank = 5;
    dropdownrankHR = 4;
    query();
});
$('#dropdown6').on("click", function() {
    dropdownrank = 6;
    dropdownrankHR = 4;
    query();
});
$('#dropdown74').on("click", function() {
    dropdownrank = 7;
    dropdownrankHR = 4;
    query();
});
$('#dropdown78').on("click", function() {
    dropdownrank = 7;
    dropdownrankHR = 8;
    query();
});
$('#dropdownAll').on("click", function() {
    dropdownrank = null;
    dropdownrankHR = null;
    query();
});

var nowQuest;

$('#QuestComplete').on('click', function() {
    if (nowQuest) {
        nowQuest.CheckBox.checked = false
        nowQuest = null;
        save();


        while (RandomQuest.firstChild) {
            RandomQuest.removeChild(RandomQuest.lastChild);
        }
        $('#QuestCompleteLabel').show();
    }
});


var getQuest = function() {
    while (RandomQuest.firstChild) {
        RandomQuest.removeChild(RandomQuest.lastChild);
    }

    nowQuest = randomSelect[Math.floor(Math.random() * randomSelect.length)];
    let tbody = document.createElement("tbody");
    let questLine = document.createElement("tr");

    let questCheck = document.createElement("td");
    questLine.appendChild(questCheck);

    let questRank = document.createElement("td");
    let span = document.createElement("span");
    if (nowQuest.HR == 8) {
        span.setAttribute('id', 'HR8');
    } else {
        span.setAttribute('id', 'HR4');
    }

    span.appendChild(
        document.createTextNode(
            (nowQuest.event ? 'E' : '') +
            ('★'.repeat(nowQuest.rank))
        ));
    questRank.appendChild(span);
    questLine.appendChild(questRank);

    let questTitle = document.createElement("td");
    questTitle.appendChild(document.createTextNode(nowQuest.title))
    questLine.appendChild(questTitle);

    let questTarget = document.createElement("td");
    questTarget.appendChild(document.createTextNode(nowQuest.target))
    questLine.appendChild(questTarget);

    tbody.appendChild(questLine);
    RandomQuest.appendChild(tbody);
}

$(function() {
    $('#QuestError').hide();
    $('#QuestCompleteLabel').hide();

    RandomQuest = document.getElementById('RandomQuest');
    info = document.getElementById('info');
    output_csv = document.getElementById('Quest_List');

    var pagetop = $('#page_top');
    // ボタン非表示
    pagetop.hide();

    // 100px スクロールしたらボタン表示
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            pagetop.fadeIn();
        } else {
            pagetop.fadeOut();
        }
    });

    pagetop.click(function() {
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
            if (quest.HR == 8) {
                span.setAttribute('id', 'HR8');
            } else {
                span.setAttribute('id', 'HR4');
            }

            span.appendChild(
                document.createTextNode(
                    (quest.event ? 'E' : '') +
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

        for (let c of cookiesArray) {
            let cArray = c.split('=');
            if (cArray[0] == 'MHRiseQuestData') {
                dataArray.forEach((quest) => {
                    quest.CheckBox.checked = false;
                });
                let savedata = cArray[1].split(',');
                savedata.forEach((saveId) => {
                    let found = dataArray.find(element => element.id == saveId);
                    if (found)
                        found.CheckBox.checked = true;
                });
            }
        }

        $('[id=select]').on('change', function() {
            save();
        });
    });
});