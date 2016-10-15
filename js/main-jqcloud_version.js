var overlaps = (function() {
    function getPositions(elem) {
        var pos, width, height;
        pos = $(elem).position();
        width = $(elem).width();
        height = $(elem).height();
        return [[pos.left, pos.left + width], [pos.top, pos.top + height]];
    }

    function comparePositions(p1, p2) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function(a, b) {
        var pos1 = getPositions(a),
            pos2 = getPositions(b);
        return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
    };
})();


jQuery(function($) {

    var flag = true;
    var z = 1;
    var group_id=0;

    var group_id_close;

    var lastTop;
    var lastLeft;
    var lastHeight;
    var lastWidth;

    
    $(document)

        
        .click(function() {
            if (flag) {
                $('.selected').removeClass('selected');
            } else {
                flag = !flag;
            }

            $("#area").find(".selection-group").remove();
        })
        .drag("start", function(ev, dd) {

            $("#area").find(".selection-group").remove();

            $.drop({
                mode: 'overlap'
            });
            return $('<div class="selection" />')
                .css('opacity', .65)
                .appendTo(document.body);
        })
        .drag(function(ev, dd) {
            $(dd.proxy).css({
                top: Math.min(ev.pageY, dd.startY),
                left: Math.min(ev.pageX, dd.startX),
                height: Math.abs(ev.pageY - dd.startY),
                width: Math.abs(ev.pageX - dd.startX)
            });

            lastTop = $(dd.proxy).position().top-50;
            lastLeft = $(dd.proxy).position().left;
            lastWidth = $(dd.proxy).width();
            lastHeight = $(dd.proxy).height();
        })
        .drag("end", function(ev, dd) {

            $.drop({
                mode: 'fit'
            });

            $(dd.proxy).remove();

            $(area).append("<div class='selection-group' style='top: " + lastTop + "px; left: " + lastLeft + "px; width: " + lastWidth + "px; height: " + lastHeight + "px;' ><div class='buttons'><div style='display:inline' class='minus-btn hidden'></div><div class='more-btn'></div><div class='plus-btn' style='left:" + (lastWidth-30) + "px;display:inline;z-index:999999' ></div><div class='share-btn'></div></div></div>");


            $(".plus-btn").click(function() {
                   
                    var random_x = Math.floor((Math.random() * lastWidth) + 1);
                    var random_y = Math.floor((Math.random() * lastHeight) + 1);
                    var card_space = 20;
                    var dis = card_space;
                    
                    var t1=0;
                    var l1=0;

                    var highest;
                    var object;


                    $('.selected').each(function(index, data) {

                        var rcolor = 'rgb('
                        + (Math.floor(Math.random() * 256)) + ','
                        + (Math.floor(Math.random() * 256)) + ','
                        + (Math.floor(Math.random() * 256)) + ')';
                        $(".selected > .front > .footer-front, .selected > .back > .footer-back").css("background-color", rcolor);


                        var cur_x = $(this).position().left;
                        var cur_y = $(this).position().top;
                        var dis_x = random_x - dis + "px";
                        var dis_y = random_y - dis + "px";
                        t1=dis_y;
                        l1=dis_x;
                        $(this).animate({
                            "top": dis_y,
                            "left": dis_x
                        }, "fast");
                        //$(this).css({top: random_y-card_space, left:random_x-card_space});
                        $(this).css('zIndex', z++);
                        dis += card_space;
                        $(this).attr("group_id", group_id);

                        if ( index == 0 || $(this).css("z-index") > highest )
                        {
                            highest = $(this).css("z-index");
                            object = $(this);
                        }

                        $(this).children(".buttons").addClass("hidden");

                        //$(this).addClass("grouped");

                        
                    });
                 //   var gr= $(area).append('<div class="group" styles="" ></div>');
                   // gr.position().top=dis_y;
                    //gr.position().left=dis_x;
                    
                //    $(".selected").appendTo(".group");




                    object.children(".buttons").removeClass("hidden");
                    object.find(".plus-btn").addClass("hidden");
                    object.find(".minus-btn").removeClass("hidden");

                    $("#area").find(".selection-group").remove();

                    

                    group_id++;
                });

            $(".close-btn").click(function() {

                    if ( $(this).closest('.note').attr('group_id') == '' ) 
                    {
                        $(this).closest('.note').fadeOut('slow');
                    } 
                    else 
                    {
                        group_id_close = $(this).closest('.note').attr('group_id');
                        //$('note').attr('group_id', group_id_close).fadeOut('slow');

                        //$(this).filter("[group_id=0]").fadeOut('slow');

                        $('[group_id='+ group_id_close +']').each(function(){
                          $(this).fadeOut('slow');
                        });
                    }

                    

                    if ($('.selection-group').length) {
                        $('.selected').each(function(){
                          $(this).fadeOut('slow');
                        });
                    }
                    
                });


        });
    
    $.drop({
        multi: true
    });
    $.drop({
        mode: 'fit'
    });
    $.drop({
        click: false
    });

    var area = $('#area')[0],
        html, x, a;
    j = 0;
    kkp = 0;
    flag1 = false;

    function generate_new_note(width, height, text, image_url) {

        j += 1;
        x1 = Math.floor((Math.random() * 800) + 1);
        y1 = Math.floor((Math.random() * 600) + 50);

        var new_note = '<div class="note last" noteId=' + j + ' group_id="" style="width:' + width + 'px; height:' + height + 'px;" >' +
            '<div class="buttons">' +
            '<div class="minus-btn hidden"></div>' +
            '<div class="more-btn"></div>' +
            '<div class="plus-btn"></div>' +
            '<div class="share-btn"></div>' +
            '<div class="close-btn"></div>' +
            '</div>' +
            '<div class="front">' +
            '<div class="content-front" style="background-image:url(' + image_url + ')" ></div>' +
            '<div class="footer-front"></div>' +
            '</div>' +
            '<div class="back">' +
            '<div class="content-back">' +
            '<textarea class="edit" style=height:100% >' + text + '</textarea>' +
            '</div>' +
            '<div class="footer-back"></div>' +
            '</div>' +
            '</div>';

        //var snote = $(area).append(new_note);


        /*var img = new Image;
        img.src = $('.content-front').css('background-image').replace(/url\(|\)$/ig, "");
        var bgImgWidth = img.width;
        var bgImgHeight = img.height;

        alert(bgImgHeight);
        alert(bgImgWidth);*/

        /*if (bgImgWidth > bgImgHeight) 
        {
            alert("landscape");
        }
        else
        {
            alert("portait");
        }*/

        var last = $('.last')[0];

        /*a = $(area).children().not(last).map(function(i) {
			return overlaps(last, this);
		}).get();


		var alength = a.length;


		for (var k = 0; k < alength; k++) {
			if (a[k] == true) {
				flag1 = true;
				break;
			}
		}

		if (flag1 == true) {
			$(".last").remove();
			flag1 = false;
			
			generate_new_note(width,height,text,image_url);
		} */

        $("#area > div").removeClass("last");

        return new_note;

    }

    $("#search-btn").on("click", function(e) {

        $("#area").empty();

        var spinner = new Spinner().spin();

        document.getElementById("area").appendChild(spinner.el);

        $.ajax({
            url: 'http://cruise.imuresearch.eu/ui/service/results?query=' + $("#textSearchInput").val() + '&source=images,videos',
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
            success: function(response) {

                var kkp = 0;
                var nnote = new Array();
                var word_array;

                /*$(function() {

                    // When DOM is ready, select the container element and call the jQCloud method, passing the array of words as the first argument.
                    $("#area").jQCloud(word_array);
                });*/

                

                for (var x = 0; x <= response.length - 1; x++) {


                    if (response[x].source == "image-results" && kkp <= 5) {

                        kkp++;

                        console.log(response[x]);



                        //console.log(response[x].source);
                        //alert();
                        nnote[0] = generate_new_note(200, 250, response[x].data[0], response[x].link.substring(1, response[x].link.length));
                        //nnote[3] = kkp;
                        //word_array[x] = [{text: nnote, weight: 10}];

                        
                        //newNote(200, 250, , response[x].source, );


                        

                    }

                    /* if (response[x].source == "video-results") {

                                newNote(400, 650, response[x].link.substring(1, response[x].link.length), response[x].source, response[x].data[0]);
                            }
                            */

                           

                }

                word_array = [
                                {text: nnote[0], weight: 10},
                                {text: nnote[0], weight: 5},
                                {text: nnote[0], weight: 60},
                                {text: nnote[0], weight: 45},
                                {text: nnote[0], weight: 2},
                                {text: nnote[0], weight: 87},
                                {text: nnote[0], weight: 52},
                                {text: nnote[0], weight: 90}
                ];

                $(function() {
                     $("#area").jQCloud(word_array);
                });

                spinner.stop();

                

                $(".more-btn").click(function() {

                    

                    if ( $(this).closest('.note').attr('group_id') == '' ) 
                    {
                        var front = $(this).closest('.note').find('.front');
                        var back = $(this).closest('.note').find('.back');
                        var toHide = front.is(':visible') ? front : back;
                        var toShow = back.is(':visible') ? front : back;
                        
                        toHide.removeClass('flip in').addClass('flip out').hide();
                        toShow.removeClass('flip out').addClass('flip in').show();
                    } 
                    else 
                    {
                        group_id_close = $(this).closest('.note').attr('group_id');
                        

                        $('[group_id='+ group_id_close +']').each(function(){
                          var front = $(this).closest('.note').find('.front');
                          var back = $(this).closest('.note').find('.back');
                          var toHide = front.is(':visible') ? front : back;
                          var toShow = back.is(':visible') ? front : back;
                        
                          toHide.removeClass('flip in').addClass('flip out').hide();
                          toShow.removeClass('flip out').addClass('flip in').show();
                        });
                    }





                    //$(this).closest('.note').find('.front').toggleClass("hide");
                    //$(this).closest('.note').find('.back').toggleClass("hide");
                });

                

                $(".minus-btn").click(function() {
                    var random_x;// = Math.floor((Math.random() * window.innerWidth) + 1);
                    var random_y;// = Math.floor((Math.random() * window.innerHeight) + 50);
                    var card_space = 20;
                    var dis = card_space;
                    $('.selected').each(function(index, data) {

                        random_x = Math.floor((Math.random() * window.innerWidth) + 1);
                        random_y = Math.floor((Math.random() * window.innerHeight) + 50);

                        var rcolor = 'rgb('
                        + (Math.floor(Math.random() * 256)) + ','
                        + (Math.floor(Math.random() * 256)) + ','
                        + (Math.floor(Math.random() * 256)) + ')';
                        
                        $(this).find(".footer-front, .footer-back").css("background-color", rcolor);


                        var cur_x = $(this).position().left;
                        var cur_y = $(this).position().top;
                        var dis_x = random_x - dis + "px";
                        var dis_y = random_y - dis + "px";

                        $(this).animate({
                            "top": dis_y,
                            "left": dis_x
                        }, "fast");
                        //$(this).css({top: random_y-card_space, left:random_x-card_space});
                        $(this).css('zIndex', z++);
                        dis += card_space;
                        $( this ).attr("group_id", "");

                        $(this).children(".buttons").removeClass("hidden");
                        $(this).find(".plus-btn").removeClass("hidden");
                        $(this).find(".minus-btn").addClass("hidden");
                    });


                    group_id++;



                });
                
                $('.note')
                    .click(function() {
                        flag = false;
                        $('.selected').removeClass('selected');
                        $(this).toggleClass('selected');
                    })
                    .drop("start", function() {
                        $('.selected').removeClass('selected');
                        $(this).addClass("active");
                    })
                    .drop(function(ev, dd) {
                        $(this).addClass("selected");
                    })
                    .drop("end", function() {
                        flag = false;
                        $(this).removeClass("active");
                    })
                    .drag("init", function() {
                        $( this ).css('zIndex', z++ );

                    if( $( this ).attr("group_id")==""){

                        if ( $( this ).is('.selected') )
                            return $('.selected');}
                    else
                    {
                        return $("[group_id|=" + $( this ).attr("group_id") + "]");
                    }

                    })
                    .drag(function(ev, dd) {
                        $(this).css({
                            top: dd.offsetY,
                            left: dd.offsetX
                        });
                    });

                //var myJsonString = JSON.stringify(allNotes);
                //var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(myJsonString));

                //$('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#save-btn');
                //alert(JSON.stringify(myJsonString));

            },
            error: function() {
                alert('Failed!');
                spinner.stop();
            },
        });
    });

    $("#clear-btn").on("click", function(e) {
        $("#area").empty();
    });
    
    $('#textSearchInput').keypress(function(e) {
        if (e.keyCode == 13)
            $('#search-btn').click();
    });

});