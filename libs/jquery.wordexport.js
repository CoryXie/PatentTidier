if (typeof jQuery !== "undefined" && typeof saveAs !== "undefined") {
    (function($) {
        $.fn.wordExport = function(fileName) {
            fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
            var static = {
                mhtml: {
                    top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
                    head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
                    body: "<body>_body_</body>"
                }
            };
            var options = {
                maxWidth: 624
            };
            // Clone selected element before manipulating it
            var markup = $(this).clone();

            // Remove hidden elements from the output
            markup.each(function() {
                var self = $(this);
                if (self.is(':hidden'))
                    self.remove();
            });

            // Embed all images using Data URLs
            var images = 0;
            var img = markup.find('img');
            var mhtmlBottom = "\n";
            for (var i = 0; i < img.length; i++) {
                // Calculate dimensions of output image
                var w = Math.min(img[i].width, options.maxWidth);
                var h = img[i].height * (w / img[i].width);
                var image = new Image();
                img[i].width = w;
                img[i].height = h;
                image.crossOrigin = "Anonymous";
                image.onload = function() {
                    // Create canvas for converting image to data URL
                    var canvas = document.createElement("CANVAS");
                    // Draw image to canvas
                    var context = canvas.getContext('2d');
                    var uri;
                    canvas.width = this.width;
                    canvas.height = this.height;
                    context.drawImage(this, 0, 0, canvas.width, canvas.height);
                    // Get data URL encoding of image
                    uri = canvas.toDataURL("image/png");

                    mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
                    mhtmlBottom += "Content-Location: " + this.src + "\n";
                    mhtmlBottom += "Content-Type: " + uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")) + "\n";
                    mhtmlBottom += "Content-Transfer-Encoding: " + uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")) + "\n\n";
                    mhtmlBottom += uri.substring(uri.indexOf(",") + 1) + "\n\n";
                    images++;
                    if (images === img.length) {
                        mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

                        //TODO: load css from included stylesheet
                        var styles = "";

                        // Aggregate parts of the file together
                        var fileContent = static.mhtml.top.replace("_html_", static.mhtml.head.replace("_styles_", styles) + static.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

                        // Create a Blob with the file contents
                        var blob = new Blob([fileContent], {
                            type: "application/msword;charset=utf-8"
                        });
                        saveAs(blob, fileName + ".doc");
                    }
                }

                //trigger the onload method
                image.src = img[i].src;

                // make sure the load event fires for cached images too
                if (image.complete || image.complete === undefined) {
                    image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                }
            }
        };
    })(jQuery);
} else {
    if (typeof jQuery === "undefined") {
        console.error("jQuery Word Export: missing dependency (jQuery)");
    }
    if (typeof saveAs === "undefined") {
        console.error("jQuery Word Export: missing dependency (FileSaver.js)");
    }
}