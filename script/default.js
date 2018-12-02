// Requires B library
var BQ = { ver: 0.1 };
BQ.SideMenu = function(id) {
    if (id == undefined) id = "menu";
    this.items = {};
    this.container = document.getElementById(id);
    if (this.container == undefined) {
        var el = B.stringToElement("<div id='" + id + "'></div>");
        document.getElementsByTagName("BODY")[0].appendChild(el);
        this.container = el;
    }
}
BQ.SideMenu.prototype.addItem = function(id, img, text, action) {

    var div = document.createElement("div");
    div.className = "BQMenuItem"
    div.style.cssText = "text-align: center; cursor: pointer";
    div.onclick = function() { action.call(); }
    if (img == null || img == "") {
        // Skip image
    } else {
        var el = B.stringToElement(B.img(img));
        el.style.width = "50%";
        div.appendChild(el);
    }
    var spn = document.createElement("span");
    spn.style.cssText = "font-size:8pt;";
    spn.innerHTML = "<br>" + text;
    div.appendChild(spn);
    this.container.appendChild(div);
    this.items[id] = { id:id, img:img, text:text, action:action };
}
BQ.setHeaderTitle = function(title) {
    BQ.setHeader(title, null);
}
BQ.setHeaderMessage = function(message) {
    BQ.setHeader(null, message);
}
BQ.setHeader = function(title, message) {
    var head = document.getElementById("headline");
    var pagetitle = document.getElementById("pagetitle");
    var pagemessage = document.getElementById("pagemessage");
    if (head == undefined) {
        head = B.stringToElement("<div id='headline'></div>");
        document.getElementsByTagName("BODY")[0].appendChild(head);
        pagetitle = B.stringToElement("<div id='pagetitle'></div>");
        head.appendChild(pagetitle);
        pagemessage = B.stringToElement("<div id='pagemessage'></div>");
        head.appendChild(pagemessage);
    }
    if (title != null) pagetitle.innerHTML = title;
    if (message != null) pagemessage.innerHTML = message;
}

BQ.setFooter = function(left, right) {
    var doc = document;
    if (window.location != parent.window.location) doc = parent.document;
    doc.getElementById("footerLeft").innerHTML = left;
    if (right != undefined) {
        doc.getElementById("footerRight").innerHTML = right;
    }
}

BQ.loadPage = function(page) {
    var loc = window.location;
    if (window.location != parent.window.location) doc = parent.window.location;
    loc.href = page;
}
