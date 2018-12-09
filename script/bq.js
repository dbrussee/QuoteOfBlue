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
BQ.SideMenu.prototype.Item = function(id, div, text, action, icon) {
    this.id = id;
    this.div = div;
    this.text = text;
    this.action = action;
    this.icon = icon;
    this.enabled = true;
}
BQ.SideMenu.prototype.Item.prototype.disable = function(yorn) {
    if (yorn == undefined) yorn = true;
    if (yorn) {
        this.div.className = "BQMenuItemDisabled";
        this.div.onclick = null;
        this.disabled = true;
    } else {
        this.div.className = "BQMenuItem";
        this.div.onclick = this.action;
        this.disabled = false;
    }
}
BQ.SideMenu.prototype.Item.prototype.enable = function(yorn) {
    if (yorn == undefined) yorn = true;
    this.disable(!yorn);
}
BQ.SideMenu.prototype.addSpace = function() {
    var div = document.createElement("div");
    div.className = "BQMenuSpace";
    this.container.appendChild(div);
}
BQ.SideMenu.prototype.addItem = function(id, img, text, action) {
    var div = document.createElement("div");
    div.className = "BQMenuItem"
    div.onclick = action;
    var icon = null;
    if (img == null || img == "") {
        // Skip image
    } else {
        icon = B.stringToElement("<i class='material-icons'>" + img + "</i>");
        div.appendChild(icon);
    }
    var spn = document.createElement("span");
    spn.style.cssText = "font-size:8pt;";
    spn.innerHTML = "<br>" + text;
    div.appendChild(spn);
    this.container.appendChild(div);
    this.items[id] = new this.Item(id, div, text, action, icon);
    return this.items[id];
}
BQ.SideMenu.prototype.icon = function(id) {
    return ;
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
// https://material.io/tools/icons/
var materialIconsLink = document.createElement("link");
materialIconsLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
materialIconsLink.rel = "stylesheet";
document.head.appendChild(materialIconsLink);
