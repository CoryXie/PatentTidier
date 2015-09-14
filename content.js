function toggleVisibility() {
    var selectors = ["div[class='patent-section patent-drawings-section']",
        "div[class='patent-section patent-claims-section']",
        "div[class='patent-section patent-tabular-section']",
        "table[class='patent-bibdata']",
        "table[class='patent-bibdata patent-drawings-missing']"
    ];

    var isHidden = $(selectors[0]).is(':hidden');

    for (var i = 0; i < selectors.length; i++) {

        var el = $(selectors[i]);

        if (isHidden) {
            el.show();
        } else {
            el.hide();
        }
    }

    isHidden = !isHidden;

    var allImages = $(".patent-thumbnail");

    if (allImages === null)
        return;

    var displays = [];

    for (var i = 0; i < allImages.length; i++) {
        var image = allImages[i];
        var href = $(image.innerHTML).attr("href");

        //the first image maybe the summary page image which should be removed
        var match = href.match(/\d+\.png/g)[0];
        if (match === "00000.png")
            continue;

        displays.push({
            count: 0,
            html: "<br><img class=\"drawings\" style=\"height:725px;max-width:725px;width: expression(this.width > 725 ? 725: true);\" src=\"" + href + "\"/>"
        });
    }

    $("div[class='patent-section patent-description-section'] heading").css('font-weight', 'bold');

    var descSections = $("div[class='patent-section patent-description-section'] p");
    var savepatentbar = $("#savepatentbar");
    if (savepatentbar.length === 0) {
        var horizontalToolbar = $("#left-toolbar-buttons");
        horizontalToolbar.append("<div class='viewport-chrome-toolbar viewport-chrome-toolbar-horizontal' role='toolbar' tabindex='0' style='-webkit-user-select: none;' id='savepatentbar'></div>");
        $("#savepatentbar").append("<div role='button' class='goog-inline-block jfk-button jfk-button-standard' style='-webkit-user-select: none;' href='javascript:void(0)' id='savepatentword'>Save Patent as Word</div>");
        $("#savepatentbar").append("<div role='button' class='goog-inline-block jfk-button jfk-button-standard' style='-webkit-user-select: none;' href='javascript:void(0)' id='sendpatentdesc'>Send Patent as Blog</div>");


        $("#savepatentword").click(function(event) {
            $("#intl_patents_v").wordExport();
        });

        var patentTitle = $(".patent-number")[0].innerText + " - " + $("invention-title")[0].innerText;
        var patentAbstract = $(".abstract")[0].innerText;

        $("#sendpatentdesc").click(function(event) {
            $.post("http://www.justsmart.mobi/patents/add", {
                    "data[Patent][title]": patentTitle,
                    "data[Patent][body]": patentAbstract
                },
                function(data) {
                    alert("Patent Information Sent!");
                });
        });
    }
    var lastImageSection = null;
    var totalImages = displays.length;
    descSections.each(function(index) {

        // do not insert images into the description-of-drawings section
        if ($(this).parent('description-of-drawings').length)
            return;

        var matches = this.innerText.match(/FIG. \d+/g);

        if (matches === null)
            return;

        for (var m = 0; m < matches.length; m++) {
            var figure = matches[m];

            //try our best luck to assue index match 
            var image = figure.match(/\d+/g)[0] - 1;

            if (image >= displays.length)
                break;

            if (displays[image].count === 0) {
                displays[image].count = 1;
                totalImages--;
                var inserted = $(this).has("img[class='drawings']");
                if (inserted.length === 0) {
                    lastImageSection = $(this);
                    $(this).append(displays[image].html);
                } else {
                    lastImageSection = null;
                }
            }
        }
    });

    //if there are images not inserted yet, insert them just after the last image.
    if (totalImages > 0) {
        for (var m = 0; m < displays.length; m++) {
            if ((displays[m].count === 0) && (lastImageSection != null)) {
                displays[m].count = 1;
                lastImageSection.append(displays[m].html);
            }
        }
    }

    var angle = 0;
    $("img").rotate({
        bind: {
            click: function() {
                angle += 90;
                if (angle === 360)
                    angle = 0;
                $(this).rotate({
                    angle: angle
                })
            }
        }
    });

    // Use default value loadPDF = true.
    chrome.storage.sync.get({
        loadPatentPDF: false,
        editPatentDesc: true
    }, function(items) {

        if (items.editPatentDesc === true) {
            descSections.editable(function(value, settings) {
                //console.log(this);
                //console.log(value);
                //console.log(settings);
                return (value);
            }, {
                indicator: "<img src='images/loading.gif'>",
                type: "textarea",
                submit: "OK",
                cancel: "Cancel",
                tooltip: "Click to edit patent descriptions..."
            });
        }

        if ($("#patentpdf").length > 0) {
            if (items.loadPatentPDF === true) {
                if (isHidden)
                    $("#patentpdf").show();
                else
                    $("#patentpdf").hide();
            } else {
                $("#patentpdf").hide();
            }
        }

        if ((items.loadPatentPDF === true) && ($("#patentpdf").length === 0) && (isHidden === true)) {
            var url = $("#appbar-read-patent-link").attr("href") + "&embedded=true";
            var iframe = "<iframe id=\"patentpdf\" width=\"750\" height=\"850\" frameborder=\"0\" scrolling=\"yes\" marginheight=\"0\" marginwidth=\"0\" src=\"" + url + "\"> </iframe>";
            $("div[class='patent-section patent-description-section']").after(iframe);
            var descSection = $("div[class*='patent-section patent-description-section']");
            var descPosition = descSection.position();
            $("#patentpdf").css({
                position: 'absolute',
                top: descPosition.top,
                left: descPosition.left + descSection.width() + 10,
                width: 900,
                height: descSection.height()
            });
        }
    });
}

toggleVisibility();