jQuery.noConflict();

(function($) {
    
    // PLUSS-O-RAMA
    // Read + articles with ease!
    // Version 1.1
    // Author: Henry Fiskum
    
    // Things to consider & improve:
    
    // Improve view-handling instead of biggass and long strings
    
    // When multiple images / items in to the right is present it pushes the social actions-btns down. Why? Pls fix.
    
    // Test more and add solutions for every template available in the Amedia-framework.
    // Example: http://www.tb.no/teater/tonsberg/kultur/man-slipper-ikke-av-barna-sine-her-og-reiser-hjem/f/5-76-286244
    // Example: http://www.amta.no/frogn/nesodden/bolig-og-eiendom/se-hva-boliger-ble-solgt-for-i-frogn-og-pa-nesodden/s/5-3-64051
    
    // Trigger when document is ready
    $(document).ready(function(){
        
        // Init extension
        $.fn.plussoramaInit();
        
    });
    
    // Check if we got an overlay
    $.fn.plussoramaInit = function()
    {
        
        // Check if current page is plus-article
        var $is_plus = $.fn.isPlusArticle();
        
        // Stop execution if current page not plus article
        if(!$is_plus) return;
        
        // Remove overlay
        $.fn.removeOverlay();
        
        // Display loader
        $.fn.loader(true);
        
        // Execute again with delay to ensure that we remove it
        setTimeout(function(){
            
            // Remove overlay
            $.fn.removeOverlay();
            
        }, 1000);
        
        // Fetch article ID from the URL
        var $article_id = $.fn.getArticleId();
        
        // Wait for one sec
        setTimeout(function(){
        
            // Fill the article with content with data from the API
            $.fn.doMagic($article_id);
            
        }, 750);
        
    };
    
    /*
    // Add stylesheet to header
    $.fn.addStylesheet = function(file_path)
    {
        
        // Get chrome-url to stylesheet-file
        var file = chrome.extension.getURL(file_path);
        
        // Add to header
        $("<link/>", {
           rel: "stylesheet",
           type: "text/css",
           href: file
        }).appendTo("head");
        
    };
    */
    
    // Display/hide loader
    $.fn.loader = function(display)
    {
        
        // Check if should display loader
        if(display)
        {
            
            // Fetch header
            var header_container = $('.am-siteHeader2-branding').first();
        
            // Get header background color
            var background_color = header_container.css('background-color');
            
            // Add loader-markup
            $('body').prepend('<div id="pluss-o-rama-loader"></div>');
            
            // Check if we got background color
            if(background_color)
            {
                // Set loader color
                $('#pluss-o-rama-loader').css('border-left-color', background_color);
            }
            
        }
        else
        {
            // Hide loader
            $('#pluss-o-rama-loader').remove();
        }
        
    };
    
    // Check if we got an overlay
    $.fn.isPlusArticle = function()
    {
        // Get any overlay-elements
        var overlay = $('#aid-overlay');
        
        // Count number of overlay-elements, check if visible and return boolean result
        return ( overlay.length > 0 && overlay.is(':visible') );
    };
    
    // Remove overlay
    $.fn.removeOverlay = function()
    {
        
        // Remove overlay box
        $('.am.aid-incentive-overlay').remove();
    
        // Remote overlay background
        $('#aid-overlay').remove();
    
        // Remove blur from wrapper-comtainer
        $('.aid-background-blur').removeClass('aid-background-blur');
        
    }
    
    // Get article ID from URL
    $.fn.getArticleId = function()
    {
        // Get current url
        var current_url = window.location.href;
    
        // Fetch article ID
        var raw_id = current_url.substr(current_url.lastIndexOf('/') + 1);

        // Regex-pattern
        var regex = /([0-9]+\-[0-9]+\-[0-9]+)/i;
        
        // Do regex match
        match = regex.exec(raw_id);
        
        // Check if we got match
        if(typeof match[0] !== 'string') return false;
        
        // Return id
        return match[0];
        
    };
    
    // Build URL to fetch article content
    $.fn.buildEndpointURL = function(article_id)
    {
        // API endpoint base URL
        var base_url = 'http://bed.api.no/api/acpcomposer/v1.1/content/';
    
        // Build complete request URL
        return base_url + article_id;
        
    };
    
    // Load article content from API, generate html and put into the document
    $.fn.doMagic = function(article_id)
    {
        
        // Get request url
        var request_url = $.fn.buildEndpointURL(article_id);
        
        // Fetch article-data from API
        $.getJSON( request_url, function( response ) {
            
            // Trigger callback-function
            $.fn.contentCallback(article_id, response);
            
        });
        
    };
    
    // Parse content from API
    $.fn.contentCallback = function( article_id, response )
    {
        
        // Check what kind of article this is
        switch(response.model)
        {
            
            // Feature-article
            case 'feature':
            
                // Load feature
                $.fn.loadFeature( article_id, response );
            
            break;
            
            // Story-article
            case 'story':

                // Load story
                $.fn.loadStory( article_id, response );

            break;
            
            // Video-article
            case 'video':
                
                // Load video
                $.fn.loadVideo( article_id, response );
            
            break;
        }
        
        // Hide loader
        $.fn.loader(false);

    };
    
    // This debug-function remove the content and image from document
    $.fn.resetArticle = function()
    {
        
        // Remove article body
        $('.am-article-body').remove();
        
        // Remove image
        $('.am-articleItem').remove();
        
    };
    
    // Get markup for social icons
    $.fn.getSocialActions = function(data)
    {
        
        // Get current url
        var article_url = encodeURIComponent(window.location.href);
        
        // Get current title
        var article_title = $(document).attr('title');;
        
        // Return markup
        return '<div class="am-article-actions"><amedia-share class="am-article-sharingIsCaring"><span id="share-title">DEL</span><ul aria-labelledby="share-title" class="am-list">'
        + '<li><a href="https://www.facebook.com/sharer/sharer.php?u=' + article_url + '" aria-label="Del på facebook"><i class="am-icon am-icon--facebook am-icon--circle" aria-hidden="true"></i></a></li>'
        + '<li class="am-extendedItem am-hidden-listelement" aria-hidden="false"><a href="http://twitter.com/intent/tweet/?url=' + article_url + '&amp;text=' + article_title + '" aria-label="Del på Twitter"><i class="am-icon am-icon--twitter am-icon--circle" aria-hidden="true"></i></a></li>'
        + '<li class="am-extendedItem am-hidden-listelement" aria-hidden="false"><a href="mailto:?subject=' + article_title + '&amp;body=' + article_title + '%0A' + article_url + '" aria-label="Del på e-post"><i class="am-icon am-icon--mail am-icon--circle" aria-hidden="true"></i></a></li>'
        + '<li aria-hidden="true"><span role="button" aria-label="Flere valg" class="am-btnSharingIsCaring" aria-hidden="true" tabindex="0"><i class="am-icon am-icon--menuDotsH am-icon--circle"></i></span></li></ul></amedia-share></div>';
        
    };
    
    
    // Load a feature-article from the API
    $.fn.loadFeature = function( article_id, data )
    {
        
        // Get relation elements
        var relations = data._embedded.relations;
        
        // Create a jQuery-object from article-body
        var article_body_object = $(data.body);

        // Loop through elements
        $(relations).each(function(i, el){

            // Check if relation is picture
            switch(el.model)
            {
                
                // Embed element
                case 'embed':
                    
                    // Do lookup here
                    var inline_embed_element = article_body_object.find('[inlineid="' + el.fields.inlineid + '"]');
                    
                    // Build HTML
                    var inline_embed_html = '<div class=" am-articleItem am-articleItem--full">'
                    + el.fields.embedCode
                    + '</div>';
                    
                    // Replace embed placeholder
                    inline_embed_element.replaceWith(inline_embed_html);
                
                break;
                
                // Image element
                case 'picture':
                    
                    // Check if this is an inline image
                    if(el.inline)
                    {
                        
                        // Do lookup here
                        var inline_image_element = article_body_object.find('[inlineid="' + el.fields.inlineid + '"]');
                     
                        // Fix inline image
                        $.fn.fixInlineImage( 'feature', inline_image_element, el );
                        
                    }
                    
                break;
                
            }
            
        });
        
        // Build article html
        var article_html_build = '<div class="am-article-body am-txt--body" itemprop="articleBody"><div>' + article_body_object.html() + '</div></div>';
        
        // Get article container
        var container = $('article .am-gridComp-body .am-gridComp-item amedia-share').first();
        
        // Insert content
        container.after(article_html_build);
        
    };
    
    // Load an article from the API
    $.fn.loadStory = function( article_id, data )
    {
        
        // Get summary element
        //var summary = $('.am-article-summary');
        
        // Remove summary
        $('.am-article-summary').remove();

        // DEBUG
        $().resetArticle();

        // Create var with summary-text
        var article_html_build = '<div class="am-article-summary am-txt--medium am-txt--lead ">' + data.leadText + '</div>';
        
        // Get social markup
        var social_markup = $.fn.getSocialActions(data);
        
        // Get relation elements
        var relations = data._embedded.relations;
        
        // Create a jQuery-object from article-body
        var article_body_object = $(data.body);
        
        // Loop through elements
        $(relations).each(function(i, el){

            // Check if relation is picture
            switch(el.model)
            {
                
                // Embed element
                case 'embed':
                    
                    var embed_html = '<div class="am-articleItem am-articleItem--pull am-articleItem--expandable"><div itemprop="associatedMedia">'
                    + '<amedia-embed id="' + el._links.self.href + '" inlineid="' + el.fields.inlineid + '">'
                    + el.fields.embedCode
                    + '</amedia-embed></div></div>';
                    
                    // Add to main html-var
                    article_html_build = article_html_build + embed_html;
                    
                break;
                
                // Image element
                case 'picture':
                    
                    // Check if this is an inline image
                    if(el.inline)
                    {

                        // Get the inline id of image
                        var inline_id = el.fields.inlineid;
                        
                        // Do lookup here
                        var inline_image_element = article_body_object.find('[inlineid="' + inline_id + '"]');
                        
                        $.fn.fixInlineImage( 'story', inline_image_element, el );
                        
                    }
                    // Main image
                    else
                    {
                
                        // Get image URL
                        var image_url = el.fields.versions.large.url;
             
                        // Add image markup
                        var image_html = '<div class="am-articleItem am-articleItem--main am-articleItem--push am-articleItem--expandable"><div class=""><div><div itemprop="associatedMedia"><figure itemtype="http://schema.org/ImageObject" itemscope="itemscope" class="am-figure"><img itemprop="contentURL" class="am-figure-img" src="' + image_url + '">'
                        + $.fn.getCaption(el)
                        + '</figure></div></div></div></div>';
                        
                        // Add to main html-var
                        article_html_build = article_html_build + image_html;
                        
                    }
                
                break;
                
                // Video-element 
                case 'video':
                    
                    
                    // Check if this is an inline image
                    if(el.inline)
                    {

                        // Get the inline id of image
                        var inline_id = el.fields.inlineid;
                        
                        // Find inline video element
                        var inline_video_element = article_body_object.find('[inlineid="' + inline_id + '"]');
                        
                        
                        $.fn.fixInlineVideo( 'story', inline_video_element, el );

                    }
                    else
                    {
                        
                        // Fetch video id
                        var video_id = el.fields.videoId;
                    
                        // Fetch title
                        var title = el.fields.title;
                    
                        // Add videoplayer-markup
                        article_html_build = article_html_build + '<div class="am-articleItem am-articleItem--main am-articleItem--push"><div class=""><div class="am-video-placeholder am-js-video"><div id="video_' + video_id + '"><div data-source="//ljsp.lwcdn.com/api/video/embed.jsp" data-settings="{&quot;acpId&quot;:&quot;5-76-282704&quot;,&quot;playerId&quot;:&quot;8fc44263-b579-4b02-afab-0bb1012e20e4&quot;,&quot;videoId&quot;:&quot;' + video_id + '&quot;,&quot;startTime&quot;:&quot;&quot;,&quot;a_virtual&quot;:&quot;tb&quot;,&quot;a_networksite&quot;:&quot;&quot;,&quot;title&quot;:&quot;' + title + '&quot;}" id="lw_' + video_id + '" class="lemonwhalewrapper"><div class="iframewrapper"><img src="data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7" class="ratio"><iframe data-settings="{&quot;acpId&quot;:&quot;5-76-282704&quot;,&quot;playerId&quot;:&quot;8fc44263-b579-4b02-afab-0bb1012e20e4&quot;,&quot;videoId&quot;:&quot;' + video_id + '&quot;,&quot;startTime&quot;:&quot;&quot;,&quot;a_virtual&quot;:&quot;tb&quot;,&quot;a_networksite&quot;:&quot;&quot;,&quot;title&quot;:&quot;' + title + '&quot;}" id="videoplayer_' + video_id + '" src="//ljsp.lwcdn.com/api/video/embed.jsp?id=' + video_id + '&amp;pi=8fc44263-b579-4b02-afab-0bb1012e20e4&amp;apiOn=1&amp;playerId=videoplayer_' + video_id + '"></iframe></div></div></div></div></div></div>';
                        
                    }
                
                break;
                
            }

        });
    
        // Build new HTML-string
        article_html_build = article_html_build + '<div class="am-article-body am-txt--body" itemprop="articleBody">' + social_markup + '<div>' + article_body_object.html() + '</div></div><aside class="am-article-aside" role="complementary"></aside>';

        // Get article container
        var container = $('article .am-gridComp-body .am-gridComp-item').first();
        
        // Insert content
        container.prepend(article_html_build);

    };
    
    // 
    $.fn.fixInlineVideo = function(model, video_el, el)
    {
        // Check if we found element
        if(video_el.length)
        {
            
            // Get wrapper class
            switch(model)
            {
                case 'feature':
                    var video_container_class = 'am-articleItem am-articleItem--full am-articleItem--expandable am-is-expanded';
                break;
                case 'story':
                    var video_container_class = 'am-articleItem am-articleItem--pull am-articleItem--expandable';
                break;
            }
            
            // Create inline html
            var video_inline_html = '<div class="' + video_container_class + '"><div itemprop="associatedMedia"><figure class="am-figure" itemscope="itemscope" itemtype="http://schema.org/ImageObject"><picture style="height:auto !important;" class="am-figure-img am-ratio" ;="">'
            + '<img src="' + el.fields.versions.large.url + '" style="position:static;left:auto;top:auto;" itemprop="contentURL"></picture>';
        
            // Add caption and photographer
            video_inline_html = video_inline_html + $.fn.getCaption(el);
            
            // End inline-element
            video_inline_html = video_inline_html + '</figure></div></div>';
        
            // Replace image placeholder
            video_el.replaceWith(video_inline_html);
            
        }
    }
    
    
    // 
    $.fn.fixInlineImage = function(model, image_el, el)
    {
        // Check if we found element
        if(image_el.length)
        {
            
            // Get wrapper class
            switch(model)
            {
                case 'feature':
                    var image_container_class = 'am-articleItem am-articleItem--full am-articleItem--expandable am-is-expanded';
                break;
                case 'story':
                    var image_container_class = 'am-articleItem am-articleItem--pull am-articleItem--expandable';
                break;
            }
            
            // Create inline html
            var image_inline_html = '<div class="' + image_container_class + '"><div itemprop="associatedMedia"><figure class="am-figure" itemscope="itemscope" itemtype="http://schema.org/ImageObject"><picture style="height:auto !important;" class="am-figure-img am-ratio" ;="">'
            + '<img src="' + el.fields.versions.large.url + '" style="position:static;left:auto;top:auto;" itemprop="contentURL"></picture>';
        
            // Add caption and photographer
            image_inline_html = image_inline_html + $.fn.getCaption(el);
            
            // End inline-element
            image_inline_html = image_inline_html + '</figure></div></div>';
        
            // Replace image placeholder
            image_el.replaceWith(image_inline_html);
            
        }
    };
    
    // Load video
    $.fn.loadVideo = function(id, data)
    {
        
        // Get video ID
        var video_id = data.fields.videoId;
        
        // Build videoplayer markup
        var video_html = '<div class="am-gridComp-item am-gridBleed--xs am-gridBleed--s"><div class="am-video-placeholder am-js-video"><div class="am-video-placeholder am-js-video am-ratio am-ratio--16x9"><div id="video_' + video_id + '"><iframe width="100%" height="100%" frameborder="0" portrait="0;" byline="0;" title="0;" src="//ljsp.lwcdn.com/api/video/embed.jsp?id=' + video_id + '" allowfullscreen=""></iframe></div></div></div></div>';
        
        // Inser to DOM
        $('article .am-gridComp-items').prepend(video_html);
        
    };
    
    // Create markup for image caption
    $.fn.getCaption = function(el)
    {
        
        // Define HTML-var
        var html = '';
        
        // Check if we got caption or a photographer
        if( typeof el.fields.caption != 'undefined' || typeof el.fields.photographer != 'undefined' )
        {
            // Start paragraph
            html = html + '<figcaption class="am-figure-caption" itemprop="caption"><p>';
        
            // Check if we got caption
            if( typeof el.fields.caption != 'undefined' )
            {
                html = html + el.fields.caption + ' ';
            }
        
            // Check if we got a photographer
            if( typeof el.fields.photographer != 'undefined' )
            {
                html = html + '(Foto: <span itemprop="author">' + el.fields.photographer + '</span>)';
            }
        
            // Stop paragraph
            html = html + '</p></figcaption>';
        }
        
        // Return html
        return html;
    }

})( jQuery );