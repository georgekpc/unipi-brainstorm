jQuery(function ($) {

    Array.prototype.contains = function (v) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === v) return true;
        }
        return false;
    }
    Array.prototype.unique = function () {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            if (!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    }


    var flag = true;
    var z = 1;
    var group_id = generateUUID();
    var group_id_close;
    var lastTop;
    var lastLeft;
    var lastHeight;
    var lastWidth;
    var area_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var area_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    $("#area").css("height", area_h - 50);
    $("#area").css("width", area_w);

    $(document)
        .click(function () {

            if (flag) {
                $('.selected').removeClass('selected');
            } else {
                flag = !flag;
            }

            $("#area").find(".selection-group").remove();

        })
        .drag("start", function (ev, dd) {

            $("#area").find(".selection-group").remove();

            $.drop({
                mode: 'overlap'
            });

            return $('<div class="selection" />')
                .css('opacity', .65)
                .appendTo(document.body);
        })
        .drag(function (ev, dd) {
            $(dd.proxy).css({
                top: Math.min(ev.pageY, dd.startY),
                left: Math.min(ev.pageX, dd.startX),
                height: Math.abs(ev.pageY - dd.startY),
                width: Math.abs(ev.pageX - dd.startX)
            });

            lastTop = $(dd.proxy).position().top - 50;
            lastLeft = $(dd.proxy).position().left;
            lastWidth = $(dd.proxy).width();
            lastHeight = $(dd.proxy).height();
        })
        .drag("end", function (ev, dd) {

            $.drop({
                mode: 'fit'
            });

            $(dd.proxy).remove();

            $(area).append("<div class='selection-group' style='top: " + lastTop + "px; left: " + lastLeft + "px; width: " + lastWidth + "px; height: " + lastHeight + "px;' ><div class='buttons'><div style='display:inline' class='minus-btn hidden'></div><div class='more-btn'></div><div class='plus-btn' style='left:" + (lastWidth - 30) + "px;display:inline;z-index:999999' ></div><div class='share-btn'></div></div></div>");

            $(".plus-btn").click(function () {

                var random_x = Math.floor((Math.random() * lastWidth) + 1);
                var random_y = Math.floor((Math.random() * lastHeight) + 1);
                var card_space = 20;
                var dis = card_space;

                var t1 = 0;
                var l1 = 0;

                var highest;
                var object;


                $('.selected').each(function (index, data) {


                    var rcolor = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
                    $(".selected > .front > .footer-front, .selected > .back > .footer-back").css("background-color", rcolor);

                    var cur_x = $(this).position().left;
                    var cur_y = $(this).position().top;
                    var dis_x = random_x - dis + "px";
                    var dis_y = random_y - dis + "px";

                    t1 = dis_y;
                    l1 = dis_x;

                    $(this).animate({
                        "top": dis_y,
                        "left": dis_x
                    }, "fast");

                    //$(this).css({top: random_y-card_space, left:random_x-card_space});
                    $(this).css('zIndex', z++);
                    dis += card_space;
                    $(this).attr("group_id", group_id);

                    if (index == 0 || $(this).css("z-index") > highest) {
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



                group_id = generateUUID();
            });

            $(".close-btn").click(function () {

                if ($(this).closest('.note').attr('group_id') == '') {
                    $(this).closest('.note').fadeOut('slow');
                } else {
                    group_id_close = $(this).closest('.note').attr('group_id');
                    //$('note').attr('group_id', group_id_close).fadeOut('slow');

                    //$(this).filter("[group_id=0]").fadeOut('slow');

                    $('[group_id=' + group_id_close + ']').each(function () {
                        $(this).fadeOut('slow');
                    });
                }



                if ($('.selection-group').length) {
                    $('.selected').each(function () {
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
        html, x, a, j;

    flag1 = false;


    function generate_existing_note(zindex, top, left, width, height, noteId, groupId, text, image_url, groupcolor) {



        var snote = $(area).append(
            '<div class="note last" noteId=' + noteId + ' group_id="' + groupId + '" ' +
            'style="width:' + width + 'px; height:' + height + 'px; top:' + top + 'px; left:' + left + 'px; z-index:' + zindex + ';">' +
            '<div class="buttons">' +
            '<div class="minus-btn"></div>' +
            '<div class="more-btn"></div>' +
            '<div class="plus-btn hidden"></div>' +
            '<div class="share-btn"></div>' +
            '<div class="close-btn"></div>' +
            '</div>' +
            '<div class="front">' +
            '<div class="content-front" style="background-image:' + image_url + '" ></div>' +
            '<div class="footer-front" style="background-color:' + groupcolor + ';"></div>' +
            '</div>' +
            '<div class="back">' +
            '<div class="content-back">' +
            '<textarea class="edit" style=position:relative >' + text + '</textarea>' +
            '</div>' +
            '<div class="footer-back" style="background-color:' + groupcolor + ';"></div>' +
            '</div>' +
            '</div>');




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

    }

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    function setup_notes() {

        $(".more-btn").click(function () {

            if ($(this).closest('.note').attr('group_id') == '') {
                var front = $(this).closest('.note').find('.front');
                var back = $(this).closest('.note').find('.back');
                var toHide = front.is(':visible') ? front : back;
                var toShow = back.is(':visible') ? front : back;

                toHide.removeClass('flip in').addClass('flip out').hide();
                toShow.removeClass('flip out').addClass('flip in').show();
            } else {
                group_id_close = $(this).closest('.note').attr('group_id');


                $('[group_id=' + group_id_close + ']').each(function () {
                    var front = $(this).closest('.note').find('.front');
                    var back = $(this).closest('.note').find('.back');
                    var toHide = front.is(':visible') ? front : back;
                    var toShow = back.is(':visible') ? front : back;

                    toHide.removeClass('flip in').addClass('flip out').hide();
                    toShow.removeClass('flip out').addClass('flip in').show();
                });
            }
        });

        $(".minus-btn").click(function () {
            var random_x; // = Math.floor((Math.random() * window.innerWidth) + 1);
            var random_y; // = Math.floor((Math.random() * window.innerHeight) + 50);
            var card_space = 20;
            var dis = card_space;

            group_id_close = $(this).closest('.note').attr('group_id');

            $('[group_id=' + group_id_close + ']').each(function (index, data) {

                random_x = Math.floor((Math.random() * window.innerWidth) + 1);
                random_y = Math.floor((Math.random() * window.innerHeight) + 50);

                var rcolor = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';

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
                $(this).attr("group_id", "");

                $(this).children(".buttons").removeClass("hidden");
                $(this).find(".plus-btn").removeClass("hidden");
                $(this).find(".minus-btn").addClass("hidden");
            });


            group_id = generateUUID();



        });

        $(".close-btn").click(function () {

            if ($(this).closest('.note').attr('group_id') == '') {
                $(this).closest('.note').fadeOut('slow');
            } else {
                group_id_close = $(this).closest('.note').attr('group_id');
                //$('note').attr('group_id', group_id_close).fadeOut('slow');

                //$(this).filter("[group_id=0]").fadeOut('slow');

                $('[group_id=' + group_id_close + ']').each(function () {
                    $(this).fadeOut('slow');
                });
            }



            if ($('.selection-group').length) {
                $('.selected').each(function () {
                    $(this).fadeOut('slow');
                });
            }

        });

        $('.note')
            .click(function () {
                flag = false;
                $('.selected').removeClass('selected');
                $(this).toggleClass('selected');
            })
            .drop("start", function () {
                $('.selected').removeClass('selected');
                $(this).addClass("active");
            })
            .drop(function (ev, dd) {
                $(this).addClass("selected");
            })
            .drop("end", function () {
                flag = false;
                $(this).removeClass("active");
            })
            .drag("init", function () {
                $(this).css('zIndex', z++);

                if ($(this).attr("group_id") == "") {

                    if ($(this).is('.selected'))
                        return $('.selected');
                } else {
                    return $("[group_id|=" + $(this).attr("group_id") + "]");
                }

            })
            .drag(function (ev, dd) {
                $(this).css({
                    top: dd.offsetY,
                    left: dd.offsetX
                });
            });

        $('.content-back').on('keyup', 'textarea', function (e) {
            $(this).css('height', 'auto');
            $(this).height(this.scrollHeight);
        });
        $('.content-back').find('textarea').keyup();
    }

    var area = $('#area')[0],
        html, x, a;

    j = 0;
    tries = 0;
    flag55 = false;

    function generateNotes(result) {

        var r1 = [];

        var addImageRes = $('#ch-img').prop('checked');
        var addVideoRes = $('#ch-vd').prop('checked');
        var addLinksRes = $('#ch-lnk').prop('checked');
        var addTwitterRes = $('#ch-twe').prop('checked');

        if (addImageRes) {
            for (l = 0; l <= result.length - 1; l++) {
                if (result[l].source === "image-results") {
                    r1.push(result[l]);
                }
            }
        }

        if (addVideoRes) {
            for (l = 0; l <= result.length - 1; l++) {
                if (result[l].source === "video-results") {
                    r1.push(result[l]);
                }
            }
        }

        if (addLinksRes) {
            for (l = 0; l <= result.length - 1; l++) {
                if (result[l].source === "bing-results") {
                    r1.push(result[l]);
                }
            }
        }

        if (addTwitterRes) {
            for (l = 0; l <= result.length - 1; l++) {
                if (result[l].source === "twitter") {
                    r1.push(result[l]);
                }
            }
        }

        //var rr = r1.sort(dynamicSort("frequency"));
        var rr = r1.sort(function (a, b) {
            return parseFloat(b.frequency) - parseFloat(a.frequency);
        });

        console.log(rr);

        var resultslim = $("#sel1").val() - 1;

        var minFreq = rr[resultslim].frequency;
        console.log("min freq :" + minFreq);
        var maxFreq = rr[0].frequency;
        console.log("max freq :" + maxFreq);

        var maxClass = 5;
        var classDist = (maxFreq - minFreq) / maxClass;

        console.log("classDist :" + classDist);


        var u1 = 1;

        for (i = 0; i <= rr.length - 1; i++) {

            if (i <= resultslim - 1) {

                for (z = maxClass; z >= 1; z--) {

                    if (rr[i].frequency >= minFreq + (z * classDist) && rr[i].frequency <= maxFreq + (z * classDist)) {

                        u1 = z;

                        break;
                    }

                }

                //hotfix...
                if (u1 == 0) {
                    u1 = 1;
                }

                var noteText = rr[i].data[0];

                //fix ulr leading char .... 
                var noteImageUrl = rr[i].link.substring(1, rr[i].link.length);
                var term = rr[i].term;

                var note_src = rr[i].source;

                switch (rr[i].source) {
                case "image-results":
                    addImgeNote(u1, noteText, noteImageUrl);
                    break;
                case "video-results":
                    addVideoNote(u1, noteText, noteImageUrl, term);
                    break;
                case "bing-results":
                    //alert(u1 + "--------------" + noteText + "----------" + noteImageUrl + "------------" + term);
                    addLinkNote(u1, noteText, noteImageUrl, term);
                    break;
                case "twitter":
                    //alert(u1 + "--------------" + noteText + "----------" + "------------" + term);
                    addTwitterNote(u1, noteText, term);
                    break;
                }

                u1 = 0;
            }
        }

    }

    function addVideoNote(size, text, url, screenshot) {

        url = url.replace("watch?v=", "v/");
        nId = generateUUID();
        x = Math.floor((Math.random() * area_w) + 1);
        y = Math.floor((Math.random() * area_h) + 1);

        console.log("screenshot-" + screenshot);

        $(area).append(
            '<div class="note note' + size + ' last" noteId=' + nId + ' group_id="" style="top:' + y + 'px; left:' + x + 'px;" >' +
            '<div class="buttons">' +
            '<div class="minus-btn hidden"></div>' +
            '<div class="more-btn"></div>' +
            '<div class="plus-btn"></div>' +
            '<div class="share-btn"></div>' +
            '<div class="close-btn"></div>' +
            '</div>' +
            '<div class="front">' +
            '<a style="position:relative;" href="' + url + '" target="_blank">' +
            '<img class="videoicon" src="img/play_icon.png" >' +
            '</a>' +
            '<div class="content-front" style="background-image:url(' + screenshot + ')" ></div>' +
            '<div class="footer-front"></div>' +
            '</div>' +
            '<div class="back">' +
            '<div class="content-back">' +
            '<textarea class="edit" style=position:relative >' + text + '</textarea>' +
            '</div>' +
            '<div class="footer-back"></div>' +
            '</div>' +
            '</div>');

        var last = $('.last')[0];

        j += 1;

        tries++;

        a = $(area).children().not(last).map(function (i) {
            //return alert( overlaps( box, this ) );
            return overlaps(last, this);
            //alert ( "x" );
        }).get();

        var alength = a.length;


        for (var k = 0; k < alength; k++) {
            if (a[k] == true) {
                flag55 = true;
                //alert("ggg");
                break;
            }
        }

        if (flag55 == true) {
            $(".last").remove();
            flag55 = false;
            addVideoNote(size, text, url, screenshot);
        } else {
            console.log('note :' + nId + ':' + tries);
            tries = 0;
            $("#area > .note").removeClass("last");

        }

    }

    function addImgeNote(size, text, url) {

        nId = generateUUID();
        x = Math.floor((Math.random() * area_w) + 1);
        y = Math.floor((Math.random() * area_h) + 1);

        $(area).append('<div class="note note' + size + ' last" noteId=' + nId + ' group_id="" style="top:' + y + 'px; left:' + x + 'px;" >' +
            '<div class="buttons">' +
            '<div class="minus-btn hidden"></div>' +
            '<div class="more-btn"></div>' +
            '<div class="plus-btn"></div>' +
            '<div class="share-btn"></div>' +
            '<div class="close-btn"></div>' +
            '</div>' +
            '<div class="front">' +
            '<div class="content-front" style="background-image:url(' + url + ')" ></div>' +
            '<div class="footer-front"></div>' +
            '</div>' +
            '<div class="back">' +
            '<div class="content-back">' +
            '<textarea class="edit" style=position:relative >' + text + '</textarea>' +
            '</div>' +
            '<div class="footer-back"></div>' +
            '</div>' +
            '</div>');

        var last = $('.last')[0];

        j += 1;

        tries++;

        a = $(area).children().not(last).map(function (i) {
            //return alert( overlaps( box, this ) );
            return overlaps(last, this);
            //alert ( "x" );
        }).get();

        var alength = a.length;


        for (var k = 0; k < alength; k++) {
            if (a[k] == true) {
                flag55 = true;
                //alert("ggg");
                break;
            }
        }

        if (flag55 == true) {
            $(".last").remove();
            flag55 = false;
            addImgeNote(size, text, url);
        } else {
            console.log('note :' + nId + ':' + tries);
            tries = 0;
            $("#area > .note").removeClass("last");

        }

    }

    function addLinkNote(size, text, url, title) {

        nId = generateUUID();
        x = Math.floor((Math.random() * area_w) + 1);
        y = Math.floor((Math.random() * area_h) + 1);

        $(area).append('<div class="note note' + size + ' last" noteId=' + nId + ' group_id="" style="top:' + y + 'px; left:' + x + 'px;" >' +
            '<div class="buttons">' +
            '<div class="minus-btn hidden"></div>' +
            '<div class="more-btn"></div>' +
            '<div class="plus-btn"></div>' +
            '<div class="share-btn"></div>' +
            '<div class="close-btn"></div>' +
            '</div>' +
            '<div class="front">' +
            '<div class="content-front" style="font-size:15px"><a href="' + url + '" target="_blank">' + title + '</a></div>' +
            '<div class="footer-front"></div>' +
            '</div>' +
            '<div class="back">' +
            '<div class="content-back">' +
            '<textarea class="edit" style=position:relative >' + text + '</textarea>' +
            '</div>' +
            '<div class="footer-back"></div>' +
            '</div>' +
            '</div>');

        var last = $('.last')[0];

        j += 1;

        tries++;

        a = $(area).children().not(last).map(function (i) {
            //return alert( overlaps( box, this ) );
            return overlaps(last, this);
            //alert ( "x" );
        }).get();

        var alength = a.length;


        for (var k = 0; k < alength; k++) {
            if (a[k] == true) {
                flag55 = true;
                //alert("ggg");
                break;
            }
        }

        if (flag55 == true) {
            $(".last").remove();
            flag55 = false;
            addLinkNote(size, text, url, title);
        } else {
            console.log('note :' + nId + ':' + tries);
            tries = 0;
            $("#area > .note").removeClass("last");

        }
    }

    function addTwitterNote(size, text, hashtag) {

        nId = generateUUID();
        x = Math.floor((Math.random() * area_w) + 1);
        y = Math.floor((Math.random() * area_h) + 1);

        $(area).append('<div class="note note' + size + ' last" noteId=' + nId + ' group_id="" style="top:' + y + 'px; left:' + x + 'px;" >' +
            '<div class="buttons">' +
            '<div class="minus-btn hidden"></div>' +
            '<div class="more-btn"></div>' +
            '<div class="plus-btn"></div>' +
            '<div class="share-btn"></div>' +
            '<div class="close-btn"></div>' +
            '</div>' +
            '<div class="front">' +
            '<div class="content-front" style="font-size: 15px;">' + hashtag + '</div>' +
            '<div class="footer-front"></div>' +
            '</div>' +
            '<div class="back">' +
            '<div class="content-back">' +
            '<textarea class="edit" style=position:relative >' + text + '</textarea>' +
            '</div>' +
            '<div class="footer-back"></div>' +
            '</div>' +
            '</div>');

        var last = $('.last')[0];

        j += 1;

        tries++;

        a = $(area).children().not(last).map(function (i) {
            //return alert( overlaps( box, this ) );
            return overlaps(last, this);
            //alert ( "x" );
        }).get();

        var alength = a.length;


        for (var k = 0; k < alength; k++) {
            if (a[k] == true) {
                flag55 = true;
                //alert("ggg");
                break;
            }
        }

        if (flag55 == true) {
            $(".last").remove();
            flag55 = false;
            addTwitterNote(size, text, hashtag);
        } else {
            console.log('note :' + nId + ':' + tries);
            tries = 0;
            $("#area > .note").removeClass("last");

        }
    }

    function dynamicSort(property) {
        var sortOrder = 0;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

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

    function overlaps(a, b) {
        var pos1 = getPositions(a),
            pos2 = getPositions(b);
        return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
    };

    function setAuthData(data) {
        localStorage.setItem("userId", data);
    }

    function getAuthData() {
        return localStorage.getItem("userId");
    }

    function saveGroups() {

        var user_id = getAuthData();

        if (!user_id) {

            var base = new Firebase('https://unipibrainstorm.firebaseio.com/Users');
            base.authWithOAuthPopup("google", function (error, authData) {
                if (error) {
                    alert("Login Failed!");
                } else {
                    setAuthData(authData.uid);
                    saveGroups();
                }
            });

        } else {
            var notes_to_save = [];
            var base2 = new Firebase('https://unipibrainstorm.firebaseio.com/Users/' + user_id);
            base2.remove();

            $('.note').each(function (index, data) {
                base2.push({
                    description: $(this).find("textarea").val(),
                    group: $(this).attr("group_id"),
                    height: $(this).css("height").replace("px", ""),
                    id: $(this).attr("noteid"),
                    left: $(this).css("left").replace("px", ""),
                    top: $(this).css("top").replace("px", ""),
                    url: $(this).find(".content-front").css("background-image").replace('"', ''),
                    width: $(this).css("width").replace("px", ""),
                    zindex: $(this).css("z-index"),
                    groupcolor: $(this).find(".footer-front").css("background-color")
                });
            });

            alert("Your groups have been saved successfully!")

        }

    }

    function loadGroups() {

        var user_id = getAuthData();

        if (!user_id) {
            var base = new Firebase('https://unipibrainstorm.firebaseio.com/Users');

            base.authWithOAuthPopup("google", function (error, authData) {
                if (error) {
                    alert("Login Failed!");
                } else {
                    setAuthData(authData.uid);
                    loadGroups();
                }
            });
        } else {

            var base2 = new Firebase('https://unipibrainstorm.firebaseio.com/Users/' + user_id);

            var allnotes = [];

            base2.once("value", function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var key = childSnapshot.key();
                    var childData = childSnapshot.val();
                    generate_existing_note(childData.zindex, childData.top, childData.left, childData.width, childData.height, childData.id, childData.group, childData.description, childData.url, childData.groupcolor);

                    var result = $.grep(allnotes, function (e) {
                        return e.group == childData.group;
                    });

                    if (result.length == 0) {

                        allnotes.push({
                            group: childData.group,
                            zindex: childData.zindex
                        });

                    } else if (result.length == 1) {
                        if (childData.zindex > result[0].zindex) {
                            result[0].zindex = childData.zindex;
                        }
                    }


                });
            });

            $(".note").each(function () {
                var curGroupId = $(this).attr('group_id');
                var curZindex = $(this).css('z-index');

                var res = $.grep(allnotes, function (e) {
                    return e.group == curGroupId;
                });

                var curGroupMaxZindex = res[0].zindex;

                if (curZindex < curGroupMaxZindex) {
                    $(this).find(".buttons").each(function () {
                        $(this).addClass("hidden");
                    });
                }


            });

            setup_notes();
        }
    }

    // searchbtn click evet
    $("#search-btn").on("click", function (e) {

        $("#area").empty();

        if( $('input[type=checkbox]:checked').length == 0)
        {
            alert("Please choose a category.");
        }
        else
        {
            var spinner = new Spinner().spin();

            document.getElementById("area").appendChild(spinner.el);

            var addImageRes = $('#ch-img').prop('checked');
            var addVideoRes = $('#ch-vd').prop('checked');
            var addLinksRes = $('#ch-lnk').prop('checked');
            var addTwitterRes = $('#ch-twe').prop('checked');

            var query = '';

            if (addImageRes) {
                query = query + 'images,';
            }
            if (addVideoRes) {
                query = query + 'videos,';
            }
            if (addLinksRes) {
                query = query + 'links,';
            }
            if (addTwitterRes) {
                query = query + 'twitter,';
            }

            query = query.substring(0, query.length - 1);


            var qurl = 'http://cruise.imuresearch.eu/ui/service/results?query=' + $("#textSearchInput").val() + '&source=' + query;

            $.ajax({
                url: qurl,
                type: 'GET',
                crossDomain: true,
                dataType: 'json',
                success: function (response) {

                    generateNotes(response);

                    setup_notes();

                    spinner.stop();
                },
                error: function () {
                    alert('Failed!');
                    spinner.stop();
                },
            });

        }

        

    });

    // clearbtn click evet    
    $("#clear-btn").on("click", function (e) {
        $("#area").empty();
    });

    // savebtn click evet
    $("#save-btn").on("click", function (e) {

        saveGroups();




    });

    // loadbtn click evet    
    $("#load-btn").on("click", function (e) {


        loadGroups();




        /*for ( j = 0; j < k; j++)
        {
            if ( $('.note').attr('group_id') == groupid[j] ) {
                var rcolor = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
                $(this).css("background-color", rcolor);    
            } 
            else 
            {
                // do that
            }
        }*/





        /*

        $(".note[group_id]").each(function()
        {
             if ( $(this).css("z-index") > highest )
             {
                     highest = $(this).css("z-index");
                     object = $(this);
             }
         });

        */


    });

    //search on "enter key"
    $('#textSearchInput').keypress(function (e) {
        if (e.keyCode == 13)
            $('#search-btn').click();
    });

});