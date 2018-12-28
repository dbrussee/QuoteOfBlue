// Requires B library
var BQ = { ver: 0.1 };
BQ.setupDropdown = function(disableList, target) {
    if (window.location == parent.window.location) return; // Dont load on root
    if (disableList == undefined) disableList = "";
    window.menu = new B.DropdownMenu("dropmenu");
    var mnu = menu.addMenu("hamburger", B.img("MENU"));
    mnu.addMenu("test", "", "Testing", function() { say("Howdy"); });
    mnu = menu.addMenu("prosp", "Prospect");
    mnu.addMenu("add", "", "New Prospect", function() { newProspect(); });
    mnu.addMenu("edt", "", "Edit Prospect", function() { editProspect(); });
    if (target == undefined || target == null) target = "dropmenu";
    menu.render(target);
    var lst = disableList.split("|");
    for (var i = 0; i < lst.length; i++) {
        if (lst[i] == "") continue;
        var parts = lst[i].split(",");
        menu.disableItem(parts[0], parts[1]);
    }
}



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
        this.div.className = "BQMenuItemDisabled noprint";
        this.div.onclick = null;
        this.disabled = true;
    } else {
        this.div.className = "BQMenuItem noprint";
        this.div.onclick = this.action;
        this.disabled = false;
    }
}
BQ.SideMenu.prototype.Item.prototype.enable = function(yorn) {
    if (yorn == undefined) yorn = true;
    this.disable(!yorn);
}
BQ.SideMenu.prototype.clear = function() {
    this.items.length = 0;
    this.container.innerHTML = "";
    return this;
}
BQ.SideMenu.prototype.addSpace = function() {
    var div = document.createElement("div");
    div.className = "BQMenuSpace noprint";
    this.container.appendChild(div);
}
BQ.SideMenu.prototype.addItem = function(id, img, text, action) {
    var div = document.createElement("div");
    div.className = "BQMenuItem noprint"
    div.onclick = action;

    //TODO: Two material icons overlaying each other
    //TODO: Specify color of normal icon
    //      Hover would always show in standard way
    if (img == null || img == "") {

    } else {
        var imgs = img.split("/"); // Slash separates multiple icons to overlay
        for (var imgnum = 0; imgnum < imgs.length; imgnum++) {
            var parts = imgs[imgnum].split(":"); // [0] = image name, [1] = color
            var icon = null;
            if (parts[0].substr(0,3) == "FAS") {
                parts[0] = parts[0].substr(3);
                var icon = B.stringToElement("<i class='fas fa-" + parts[0] + "'></i>");
            } else if (parts[0].substr(0,2) == "FA") {
                parts[0] = parts[0].substr(2);
                var icon = B.stringToElement("<i class='far fa-" + parts[0] + "'></i>");
            } else {
                var icon = B.stringToElement("<i class='material-icons'>" + parts[0] + "</i>");
            }
            var css = "position:relative;";
            if (parts.length > 1) css += "color:" + parts[1] + ";";
            icon.style.cssText = css;
            div.appendChild(icon);
        }
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

BQ.setBanner = function(title, message) {
    var doc = document;
    if (window.location != parent.window.location) doc = parent.document;
    var pagetitle = doc.getElementById("pagetitle");
    var pagemessage = doc.getElementById("pagemessage");
    if (title != null) pagetitle.innerHTML = title;
    if (message != null) pagemessage.innerHTML = message;
}

BQ.setFooter = function(left) {
    var doc = document;
    if (window.location != parent.window.location) doc = parent.document;
    doc.getElementById("footerLeft").innerHTML = left;
}
BQ.setRegion = function(txt) {
    if (txt == undefined) return;
    var doc = document;
    if (window.location != parent.window.location) doc = parent.document;
    doc.getElementById("footerRegion").innerHTML = txt;
}
BQ.setUser = function(txt,  icon) {
    if (icon == undefined) icon = "";
    if (txt == undefined) return;
    var doc = document;
    if (window.location != parent.window.location) doc = parent.document;
    if (icon == "verified") {
        icon = "<i style='color:green;font-size: 1em;' class='material-icons'>verified_user</i> ";
    }
    doc.getElementById("footerUser").innerHTML = icon + txt;
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

// hhttps://fontawesome.com/cheatsheet
var fontAwesomeLink = document.createElement("link");
fontAwesomeLink.href = "https://use.fontawesome.com/releases/v5.5.0/css/all.css";
fontAwesomeLink.rel = "stylesheet";
//fontAwesomeLink.integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"; 
//fontAwesomeLink.crossorigin="anonymous"
document.head.appendChild(fontAwesomeLink);
