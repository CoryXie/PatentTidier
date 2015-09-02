function toggleVisibility() {
    var selectors = ["div[class*='patent-section patent-drawings-section']",
                     "div[class*='patent-section patent-claims-section']",
                     "div[class*='patent-section patent-tabular-section']",
                     "table[class*='patent-bibdata']"];
    
    for (var i = 0; i < selectors.length; i++) {
        
        var el = $(selectors[i]);

        if (el.is(':hidden')) {
            el.show();
        } else {
            el.hide();
        }        
    }
    
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
            html: "<img class=\"drawings\" style=\"height:725px;max-width:725px;width: expression(this.width > 725 ? 725: true);\" src=\"" + href + "\"/>"
        });
    }
    
    $("div[class*='patent-section patent-description-section'] heading").css('font-weight', 'bold');
    
    var descSections = $("div[class*='patent-section patent-description-section'] p");
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
                var inserted = $(this).has("img[class*='drawings']");
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

    var url = $("#appbar-read-patent-link").attr("href") + "&embedded=true";
    var iframe = "<iframe id=\"patentdoc\" width=\"750\" height=\"850\" frameborder=\"0\" scrolling=\"yes\" marginheight=\"0\" marginwidth=\"0\" src=\"" + url + "\"> </iframe>";
    $("div[class*='patent-section patent-description-section']").after(iframe);
    var descSection = $("div[class*='patent-section patent-description-section']");
    var descPosition = descSection.position();
    $("#patentdoc").css({
        position: 'absolute',
        top: descPosition.top,
        left: descPosition.left + descSection.width() + 10,
        width: 750,
        height: descSection.height()
    });
}

toggleVisibility();