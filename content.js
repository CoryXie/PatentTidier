function toggleVisibility() {
    var el = $("div[class*='patent-section patent-claims-section']");

    if (el.is(':hidden')) {
        el.show();
    } else {
        el.hide();
    }
}

toggleVisibility();