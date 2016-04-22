jQuery.noConflict();

(function($) {
    
    $(document).ready(function(){
        
        // Trigger script
        $().fixArticle();
        
        // Remove plus-overlay in article listing
        $().fixArticles();
        
    });
    
    // Remove plus-overlay in article listing
    $.fn.fixArticles = function()
    {
        
        // Check if we got an overlay
    	if($('.df-img-layer').length)
        {
        
            // Remove overlay
            $('.df-img-layer').remove();
            
        }
        
    }
    
    // Remove overlays and load article content via AJAX
    $.fn.fixArticle = function()
    {
        
        // Check if we got an overlay
    	if($('#aid-overlay').length || true)
        {
        
            // Remove overlay box
            $('.am.aid-incentive-overlay').remove();
        
            // Remote overlay background
            $('#aid-overlay').remove();
        
            // Remove blur
            $('.aid-background-blur').removeClass('aid-background-blur');
        
            // Load plus content
            $().loadPlusContent();
        
        }
        
    }
    
    
    
    // Load plug-content via API
    $.fn.loadPlusContent = function()
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
        if(typeof match[0] !== 'string') return;
        
        // Get id
        var id = match[0];

        // Base url
        var base_url = 'http://bed.api.no/api/acpcomposer/v1.1/content/';
    
        // Build request URL
        var request_url = base_url + id;
    
        // Fetch json-data
        $.getJSON( request_url, function( data ) {
        
            switch(data.model)
            {
                
                case 'story':
                
                    // Get summary element
                    var summary = $('.am-article-summary');
        
                    // Abort if cannot find summary-container
                    if(!summary.length) return;
                
                    // Load story
                    $().loadStory(id, data, summary);
                
                break;
                
                case 'video':
                    
                    // Load video
                    $().loadVideo(id, data);
                
                break;
            }
        
        });

    };
    
    $.fn.loadVideo = function(id, data)
    {
        var video_id = data.fields.videoId;
        
        var video_html = '<div class="am-gridComp-item am-gridBleed--xs am-gridBleed--s"><div class="am-video-placeholder am-js-video"><div class="am-video-placeholder am-js-video am-ratio am-ratio--16x9"><div id="video_' + video_id + '"><iframe width="100%" height="100%" frameborder="0" portrait="0;" byline="0;" title="0;" src="//ljsp.lwcdn.com/api/video/embed.jsp?id=' + video_id + '" allowfullscreen=""></iframe></div></div></div></div>';
        
        $('article .am-gridComp-items').prepend(video_html);
        
    };
    
    $.fn.loadStory = function(id, data, summary)
    {
        
        // Declare HTML-var
        var insert_html = '';
        
        summary.append('<div><a href="' + request_url + '" target="_blank">JSON-kilde</a></div><br>');
        
        // Get relation elements
        var relations = data._embedded.relations;
        
        // Loop through elements
        $(relations).each(function(i, el){

            // Check if relation is picture
            switch(el.model)
            {
                
                // Maps?
                
                case 'picture':
                    
                    // Check if this image should be inline
                    if(el.inline)
                    {
                        
                        // Do lookup here
                        
                        
                    }
                    else
                    {
                        
                        // Get caption
                        var caption = el.caption;
                
                        // Get image
                        var image = el.fields.versions.large.url;
             
                        // Add HTML
                        insert_html = insert_html + '<div class="am-articleItem am-articleItem--main am-articleItem--push am-articleItem--expandable"><div class=""><div><div itemprop="associatedMedia"><figure itemtype="http://schema.org/ImageObject" itemscope="itemscope" class="am-figure"><img itemprop="contentURL" class="am-figure-img" src="' + image + '"><figcaption itemprop="caption" class="am-figure-caption"><p>' + caption + '</p></figcaption></figure></div></div></div></div>';
                        
                    }
                
                break;
                    
                case 'video':
                    
                    // Skip if this image is inline
                    if(el.inline) return;
                    
                    // Fetch video id
                    var video_id = el.fields.videoId;
                    
                    // Fetch title
                    var title = el.fields.title;
                    
                    // Add HTML
                    insert_html = insert_html + '<div class="am-articleItem am-articleItem--main am-articleItem--push"><div class=""><div class="am-video-placeholder am-js-video"><div id="video_' + video_id + '"><div data-source="//ljsp.lwcdn.com/api/video/embed.jsp" data-settings="{&quot;acpId&quot;:&quot;5-76-282704&quot;,&quot;playerId&quot;:&quot;8fc44263-b579-4b02-afab-0bb1012e20e4&quot;,&quot;videoId&quot;:&quot;' + video_id + '&quot;,&quot;startTime&quot;:&quot;&quot;,&quot;a_virtual&quot;:&quot;tb&quot;,&quot;a_networksite&quot;:&quot;&quot;,&quot;title&quot;:&quot;' + title + '&quot;}" id="lw_' + video_id + '" class="lemonwhalewrapper"><div class="iframewrapper"><img src="data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7" class="ratio"><iframe data-settings="{&quot;acpId&quot;:&quot;5-76-282704&quot;,&quot;playerId&quot;:&quot;8fc44263-b579-4b02-afab-0bb1012e20e4&quot;,&quot;videoId&quot;:&quot;' + video_id + '&quot;,&quot;startTime&quot;:&quot;&quot;,&quot;a_virtual&quot;:&quot;tb&quot;,&quot;a_networksite&quot;:&quot;&quot;,&quot;title&quot;:&quot;' + title + '&quot;}" id="videoplayer_' + video_id + '" src="//ljsp.lwcdn.com/api/video/embed.jsp?id=' + video_id + '&amp;pi=8fc44263-b579-4b02-afab-0bb1012e20e4&amp;apiOn=1&amp;playerId=videoplayer_' + video_id + '"></iframe></div></div></div></div></div></div>';
                
                break;
                
            }

        });
    
        // Build new HTML-string
        insert_html = insert_html + '<div class="am-article-body am-txt--body" itemprop="articleBody"><div>' + data.body + '</div></div>';

        // Insert body
        summary.after(insert_html);
        
    };

})( jQuery );