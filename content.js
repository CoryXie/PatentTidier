function toggleVisibility() {
    var el = $("div[class*='patent-section patent-claims-section']");

    if (el.is(':hidden')) {
        el.show();
    } else {
        el.hide();
    }

    var el = $("div[class*='patent-section patent-drawings-section']");

    if (el.is(':hidden')) {
        el.show();
    } else {
        el.hide();
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
            html: "<img style=\"height:725px;max-width:725px;width: expression(this.width > 725 ? 725: true);\" src=\"" + href + "\"/>"
        });
    }

    var descSections = $("div[class*='patent-section patent-description-section'] p");

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
                $(this).append(displays[image].html);
            }
        }
    });


    var angle = 0;
    $("img").rotate({
        bind: {
            click: function() {
                angle += 90;
                if (angle === 450)
                    angle = 0;
                $(this).rotate({
                    angle: angle
                })
            }
        }
    });
}

toggleVisibility();