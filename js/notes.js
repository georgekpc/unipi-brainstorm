var db;

try {
    if (window.openDatabase) {
        db = openDatabase("NoteTest", "1.0", "HTML5 Database API example", 200000);
        if (!db)
            alert("Failed to open the database on disk.  This is probably because the version was bad or there is not enough space left in this domain's quota");
    } else
        alert("Couldn't open the database.  Please try with a WebKit nightly with this feature enabled");
} catch (err) {}

const SupportsTouches = ('createTouch' in document);
const StartEventType = SupportsTouches ? 'touchstart' : 'mousedown';
const MoveEventType = SupportsTouches ? 'touchmove' : 'mousemove';
const EndEventType = SupportsTouches ? 'touchend' : 'mouseup';

var captured = null;
var highestZ = 0;
var highestId = 0;
var allNotes = new Array();

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function Note(width, height, bg_img_link, source_type, data) {
  
    var self = this;

    var flip3d = document.createElement('div');
    flip3d.className = "flip3D elements";
    //flip3d.style.left=this.left+"px";
    //flip3d.style.top=this.top+"px";
    this.note = flip3d;

    var front = document.createElement('div');
    front.className = "front";
    this.note.appendChild(front);

    var back = document.createElement('div');
    back.className = "back";
    this.note.appendChild(back);

    var note = document.createElement('div');
    note.className = 'note';
    note.addEventListener('click', this, false);
    note.style.width = width + "px";
    note.style.height = height + "px";

    if (source_type == "video-results") {
        ifrm = document.createElement("embed");
        ifrm.setAttribute("src", bg_img_link);
        //ifrm.style.width = 400+"px";
        //ifrm.style.height = 650+"px";
        note.appendChild(ifrm);
    } else {
        note.style.backgroundImage = "url(" + bg_img_link + ")";
        note.style.backgroundSize = "100% 100%";
    }




    var overlay = document.createElement('div');
    overlay.addEventListener(StartEventType, this, false);
    overlay.className = 'overlay';
    note.appendChild(overlay);
    this.overlay = overlay;

    var ts = document.createElement('div');
    ts.className = 'timestamp';
    //ts.addEventListener(StartEventType, this, false);
    note.appendChild(ts);
    this.lastModified = ts;

    var close = document.createElement('div');
    close.className = 'closebutton';
    close.addEventListener(StartEventType, this, false);
    note.appendChild(close);

    var minus = document.createElement('div');
    minus.className = 'minusbutton';
    // more.id = 'morebutton';
    minus.addEventListener(StartEventType, this, false);
    note.appendChild(minus);

    var more = document.createElement('div');
    more.className = 'morebutton';
    // more.id = 'morebutton';
    more.addEventListener(StartEventType, this, false);
    note.appendChild(more);

    var pluss = document.createElement('div');
    pluss.className = 'plussbutton';
    // more.id = 'morebutton';
    pluss.addEventListener(StartEventType, this, false);
    note.appendChild(pluss);

    var share = document.createElement('div');
    share.className = 'sharebutton';
    // more.id = 'morebutton';
    share.addEventListener(StartEventType, this, false);
    note.appendChild(share);

    var note2 = note.cloneNode(true);

    var edit = document.createElement('textarea');
    // alert("from js________" + data);
    edit.value = data;
    edit.className = 'edit';
    edit.addEventListener('keyup', this, false);
    edit.style.backgroundColor = "rgb(255, 240, 70)";

    note2.appendChild(edit);

    //note
    note.addEventListener('click', this, false);
    //edit
    note2.childNodes[0].addEventListener('keyup', this, false);
    //timestamp
    note2.childNodes[2].addEventListener(StartEventType, this, false);
    //closebutton
    note2.childNodes[3].addEventListener(StartEventType, this, false);
    //morebutton
    note2.childNodes[4].addEventListener(StartEventType, this, false);

    note2.style.backgroundImage = "none";
    note2.style.backgroundColor = "rgb(255, 240, 70)";


    //edit.style.backgroundImage="url("+bg_img_link+")";
    //edit.style.backgroundSize="100% 100%";
    this.editField = edit;

    //note.removeChild(edit);
    front.appendChild(note);
    back.appendChild(note2);

    document.getElementById("board").appendChild(flip3d);

    return this;
}

Note.prototype = {
    get id() {
        if (!("_id" in this))
            this._id = 0;
        return this._id;
    },

    set id(x) {
        this._id = x;
    },

    get text() {
        return this.editField.value;
    },

    set text(x) {
        this.editField.value = x;
    },

    get timestamp() {
        if (!("_timestamp" in this))
            this._timestamp = 0;
        return this._timestamp;
    },

    set timestamp(x) {
        if (this._timestamp == x)
            return;

        this._timestamp = x;
        var date = new Date();
        date.setTime(parseFloat(x));
        this.lastModified.textContent = modifiedString(date);
    },

    get left() {
        return this.note.style.left;
    },

    set left(x) {
        this.note.style.left = x;
    },

    get top() {
        return this.note.style.top;
    },

    set top(x) {
        this.note.style.top = x;
    },

    get zIndex() {
        return this.note.style.zIndex;
    },

    set zIndex(x) {
        this.note.style.zIndex = x;
    },

    get width() {
        return this.note.style.width;
    },

    set width(x) {
        this.note.style.width = x;
    },

    get height() {
        return this.note.style.height;
    },

    set height(x) {
        this.note.style.height = x;
    },

    get bg_img() {
        return this.note.style.backgroundImage;
    },

    set bg_img(x) {
        this.note.style.backgroundImage = x;
    },

    close: function(event) {
        this.cancelPendingSave();

        var self = this;
        db.transaction(function(tx) {
            tx.executeSql("DELETE FROM WebKitStickyNotes1 WHERE id = ?", [self.id]);
        });

        var duration = 250;

        if (event.shiftKey) {
            duration *= 10;
            this.note.style.webkitTransitionDuration = duration + 'ms';
        }
        this.note.className = "note closed";

        setTimeout(function() {
            self.delayedDestroy();
        }, duration);

    },

    more: function(event) {

        var self = this;

        if (this.note.childNodes[0].style.cssText.length == 0) {
            this.note.childNodes[0].style.cssText += " -webkit-transform: perspective(600px) rotateY(-180deg);transform: perspective(600px) rotateY(-180deg);";
            this.note.childNodes[1].style.cssText += " -webkit-transform: perspective(600px) rotateY(0deg);transform: perspective(600px) rotateY(0deg);";

        } else {
            this.note.childNodes[0].style.cssText = " ";
            this.note.childNodes[1].style.cssText = " ";
        }
    },

    delayedDestroy: function() {
        var index = allNotes.indexOf(this);
        array.splice(index, 1);
        document.body.removeChild(this.note);
    },

    saveSoon: function() {
        this.cancelPendingSave();
        var self = this;
        this._saveTimer = setTimeout(function() {
            self.save();
        }, 200);
    },

    cancelPendingSave: function() {
        if (!("_saveTimer" in this))
            return;
        clearTimeout(this._saveTimer);
        delete this._saveTimer;
    },

    save: function() {
        this.cancelPendingSave();

        if ("dirty" in this) {
            this.timestamp = new Date().getTime();
            delete this.dirty;
        }

        var note = this;
        db.transaction(function(tx) {
            tx.executeSql("UPDATE WebKitStickyNotes1 SET note = ?, timestamp = ?, left = ?, top = ?, zindex = ?, width = ?, height = ? WHERE id = ?", [note.text, note.timestamp, note.left, note.top, note.zIndex, note.width, note.height, note.id]);
        });
    },

    saveAsNew: function() {
        this.timestamp = new Date().getTime();

        var note = this;
        db.transaction(function(tx) {
            tx.executeSql("INSERT INTO WebKitStickyNotes1 (id, note, timestamp, left, top, zindex, width, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [note.id, note.text, note.timestamp, note.left, note.top, note.zIndex, note.width, note.height]);
        });
    },

    handleEvent: function(event) {
        switch (event.type) {
            case StartEventType:
                if (event.currentTarget.className == 'closebutton') {
                    event.preventDefault();
                    this.close(event);
                } else if (event.currentTarget.className == 'morebutton') {
                    event.preventDefault();
                    this.more(event);
                } else {
                    this.onDragStart(event);
                }
                break;
            case MoveEventType:
                this.onDragMove(event);
                $(document).unbind("mousemove", openSelector);
                $(document).unbind("mouseup", selectElements);
                break;
            case EndEventType:
                this.onDragEnd(event);
                break;
            case "click":
                this.onNoteClick();
                break;
            case "keyup":
                this.onKeyUp();
                break;
        }
    },

    onDragStart: function(event) {

        // stop page from panning on iPhone/iPad - we're moving a note, not the page
        event.preventDefault();

        var e = (SupportsTouches && event.touches && event.touches.length > 0) ? event.touches[0] : event;

        captured = this;

        
        this.startX = e.clientX - this.note.offsetLeft;
        this.startY = e.clientY - this.note.offsetTop;
        this.zIndex = ++highestZ;

        window.addEventListener(MoveEventType, this, true);
        window.addEventListener(EndEventType, this, true);

        return false;

    },

    onDragMove: function(event) {
        if (this != captured) {
            return;
        }

        // stop page from panning on iPhone/iPad - we're moving a note, not the page
        event.preventDefault();

        var e = (SupportsTouches && event.touches && event.touches.length > 0) ? event.touches[0] : event;

        this.left = e.clientX  - this.startX + 'px';
        this.top  = e.clientY  - this.startY + 'px';
        
        for (var x = 2; x <= allNotes.length-1; x++) 
        {
            allNotes[x].left = e.clientX - (e.clientX-allNotes[x].left)+ "px";
            allNotes[x].top  = e.clientY - (e.clientY-allNotes[x].top) + "px";
        }
        return false;
    },

    onDragEnd: function(event) {
        window.removeEventListener(MoveEventType, this, true);
        window.removeEventListener(EndEventType, this, true);

        this.save();
        return false;
    },

    onNoteClick: function(e) {
        this.editField.focus();
        getSelection().collapseToEnd();
    },

    onKeyUp: function() {
        this.dirty = true;
        this.saveSoon();
    }


};

function loaded() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT COUNT(*) FROM WebkitStickyNotes", [], function(result) {
            loadNotes();
        }, function(tx, error) {
            tx.executeSql("CREATE TABLE WebKitStickyNotes1 (id REAL UNIQUE, note TEXT, timestamp REAL, left TEXT, top TEXT, zindex REAL, width REAL, height REAL)", [], function(result) {
                loadNotes();
            });
        });
    });
}

function loadNotes() {

    var exportData = new Array();

    db.transaction(function(tx) {
        tx.executeSql("SELECT id, note, timestamp, left, top, zindex, width, height FROM WebKitStickyNotes1", [], function(tx, result) {
            for (var i = 0; i < result.rows.length; ++i) {
                var row = result.rows.item(i);
                var note = new Note(row['width'], row['height']);
                note.id = row['id'];
                note.text = row['note'];
                note.timestamp = row['timestamp'];
                note.left = row['left'];
                note.top = row['top'];
                note.zIndex = row['zindex'];
                note.width = row['width'];
                note.height = row['height'];
                exportData.push(note);
                if (row['id'] > highestId)
                    highestId = row['id'];
                if (row['zindex'] > highestZ)
                    highestZ = row['zindex'];
            }

            if (!result.rows.length)
                newNote(row['width'], row['height']);
        }, function(tx, error) {
            alert('Failed to retrieve notes from database - ' + error.message);
            return;
        });
    });
}

function searchFieldUpdated() {
    if (!db)
        return;

    if (window.searchInProgress) {
        setTimeout(searchFieldUpdated, 200);
        return;
    }

    var query = document.getElementById("textSearchInput").value;
    if (!query.length) {
        for (i in allNotes) {
            allNotes[i].overlay.className = "overlay";
            allNotes[i].note.className = "note";
        }
        return;
    }

    window.searchInProgress = true;

    db.transaction(function(tx) {
        tx.executeSql("SELECT id FROM WebKitStickyNotes1 WHERE note LIKE ?", ["%" + query + "%"], function(tx, results) {
            for (i in allNotes) {
                allNotes[i].overlay.className = "overlay shown";
                allNotes[i].note.className = "note";
            }

            for (var i = 0; i < results.rows.length; ++i) {
                var note = null;
                for (n in allNotes) {
                    if (allNotes[n].id == results.rows.item(i)['id']) {
                        note = allNotes[n];
                        break;
                    }
                }
                if (note) {
                    note.overlay.className = "overlay";
                    note.note.className = "note selected";
                }
            }
            window.searchInProgress = false;
        }, function(tx, error) {
            alert('Failed to search notes in database - ' + error.message);
            window.searchInProgress = false;
            return;
        });
    });

}

function zeroPadIfNecessary(num) {
    if (num < 10)
        return "0" + num;
    else
        return "" + num;
}

function modifiedString(date) {
    return 'Last Modified: ' + date.getFullYear() + '-' + zeroPadIfNecessary(date.getMonth() + 1) + '-' + zeroPadIfNecessary(date.getDate()) + ' ' + zeroPadIfNecessary(date.getHours()) + ':' + date.getMinutes() + ':' + date.getSeconds();
}

function newNote(width, height, bg_img_link, source_type, data) {
    var note = new Note(width, height, bg_img_link, source_type, data);
    note.id = ++highestId;
    note.timestamp = new Date().getTime();
    note.left = Math.floor((Math.random() * 1000) + 1) + "px";
    // metaksi 500 kai 100
    note.top = Math.floor((Math.random() * 500) + 100) + "px";
    //Math.round(Math.random() * (document.height / 3)) + 'px';
    note.zIndex = ++highestZ;
    note.width = width;
    note.height = height;
    note.bg_img = bg_img_link;
    note.text = data;
    allNotes.push(note);

    note.saveAsNew();

}

addEventListener('load', loaded, false);