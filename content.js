function toggleVisibility() {
    var el = $("div[class*='patent-section patent-claims-section']");

    if (el.is(':hidden')) {
        el.show();
    } else {
        el.hide();
    }
	
	var allImages =$(".patent-thumbnail");
	for (i=0; i < allImages.length; i++) {
		image = allImages[i];
		console.log(image.innerHTML);
		console.log($(image.innerHTML).attr("href"));
	}
	
}

toggleVisibility();