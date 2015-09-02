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
    var displays = [];

    for (var i = 0; i < allImages.length; i++) {
        var image = allImages[i];
        //console.log(image.innerHTML);
        //console.log($(image.innerHTML).attr("href"));
        displays.push({
            count: 0,
            html: "<img style=\"height:725px;max-width:725px;width: expression(this.width > 725 ? 725: true);\" src=\"" + $(image.innerHTML).attr("href") + "\"/>"
        });
    }

    var descSections = $("div[class*='patent-section patent-description-section'] p");

    descSections.each(function(index) {
		
        //console.log(this.innerText);
		
        var matches = this.innerText.match(/FIG. \d+/g);
		
		if (matches === null)
			return;
		
		for (var m = 0; m < matches.length; m++) {
			var figure = matches[m];
			
			//console.log(figure);
			
			var image = figure.match(/\d+/g)[0] - 1;
			
			if (image >= allImages.length)
				break;
			
			if (displays[image].count++ < 2)
				$(this).append(displays[image].html);
		}
    });
	
	
	var angle = 0;
	$("img").rotate({
	    bind: {
	        click: function() {
				angle +=90;
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