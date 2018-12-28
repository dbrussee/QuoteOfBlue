B.GenericMenu = function(hardwidth) {
    if (hardwidth == undefined) hardwidth = null;
    this.hardwidth = hardwidth;
    this.menuLevel = 0;
    this.itemlist = [];
    this.items = {};
    this.parent = null;
    this.onlyOneLevel = false;
    this.host = B.stringToElement("<div class='BGenericMenu main' style='border-top:3px solid navy; " +
        "background-image: linear-gradient(to bottom right, gainsboro, lightsteelblue); " +
        "border-left:1px solid silver;'></div>");
    if (this.hardwidth != null) this.host.style.width = this.hardwidth + "px";
    return this;
}
B.GenericMenu.prototype.addItem = function(id, img, text, action, disabled, autoclose) {
    if (autoclose == undefined) autoclose = false;
    if (disabled == undefined) disabled = false;
    if (action == undefined || action == null) action = function() { };
    var gmi = new B.GenericMenuItem(id, this, img, text, disabled, action, autoclose);
    this.itemlist.push(gmi);
    this.items[id] = gmi;
    return gmi;
}
B.GenericMenu.prototype.addSpace = function() {
    this.itemlist.push({kind:"space"});
}
B.GenericMenu.prototype.addSubmenu = function(id, text, action, disabled) {
    if (disabled == undefined) disabled = false;
    if (action == undefined || action == null) action = function() { };
    var gsm = new B.GenericSubmenu(id, this, null, text, disabled, action);
    this.itemlist.push(gsm);
    this.items[id] = gsm;
    if (this.onlyOneLevel) gsm.setOnlyOneOpen(true);
    return gsm;
}
B.GenericMenu.prototype.get = function(code) {
    var parts = code.split("."); // sub.sub.item
    var sub = this; // Start at root of menu tree
    for (var i = 0; i < parts.length; i++) {
        var itm = sub.items[parts[i]];
        if (itm == undefined) return null;
        if (itm instanceof B.GenericMenuItem) return itm;
        if (itm instanceof B.GenericSubmenu) {
            sub = itm;
        }
    }
    // Exhausted code items without hitting an menu item...
    // Just return the last menu
    return sub;
}
B.GenericMenu.prototype.setOnlyOneLevel = function(yn) {
    if (yn == undefined) yn = true;
    this.onlyOneLevel = yn;
    return this;
}
B.GenericMenu.prototype.render = function() {
    for (var i = 0; i < this.itemlist.length; i++) {
        var item = this.itemlist[i];
        if (item.constructor == B.GenericMenuItem) {
           item.render(this.host);
        } else if (item.constructor == B.GenericSubmenu) {
            item.render(this.host);
        } else if (item.kind == "space") {
            var tbl = B.stringToElement("<table style='width:100%;'><tr><td style='width:1.5em; align:right; vertical-align:top'></td><td style='vertical-align:top'><hr></td></tr></table>");
            this.host.appendChild(tbl);
        } else {
            // What is this thing??
        }
    }
}

B.GenericSubmenu = function(id, parent, img, text, disabled, action) {
    this.menuLevel = parent.menuLevel + 1;
    this.topMenu = parent;
    while (this.topMenu.constructor != B.GenericMenu) this.topMenu = this.topMenu.parent;
    this.id = id;
    this.parent = parent;
    this.text = text;
    this.disabled = null;
    this.opened = false;
    this.host = null;
    this.onlyOneOpen = false;

    this.itemlist = [];
    this.items = {};

    return this;
}
B.GenericSubmenu.prototype.setOnlyOneOpen = function(yn) {
    if (yn == undefined) yn = true;
    this.onlyOneOpen = yn;
    return this;
}
B.GenericSubmenu.prototype.addItem = function(id, img, text, action, disabled) {
    if (disabled == undefined) disabled = false;
    if (action == undefined || action == null) action = function() { };
    var gmi = new B.GenericMenuItem(id, this, img, text, disabled, action);
    this.itemlist.push(gmi);
    this.items[id] = gmi;
    return gmi;
}
B.GenericSubmenu.prototype.addSpace = function() {
    this.parent.addSpace.call();
}
B.GenericSubmenu.prototype.addSubmenu = function(id, text, action, disabled) {
    if (disabled == undefined) disabled = false;
    if (action == undefined || action == null) action = function() { };
    var gsm = new B.GenericSubmenu(id, this, null, text, disabled, action);
    this.itemlist.push(gsm);
    this.items[id] = gsm;
    if (this.topMenu.onlyOneLevel) gsm.setOnlyOneOpen(true);
    return gsm;
}
B.GenericSubmenu.prototype.render = function() {
    if (this.host == null) {
        var div = B.stringToElement("<div style='border-left: 3px solid transparent;' class='BGenericMenu hilite'></div>");
        div.innerHTML = "<div style='border:3px solid transparent; font-weight:bold; color:brown;'>" +
            "-" + "<span style='text-shadow:1px 1px white;'> " + this.text + "</span></div>";
        div.style.marginLeft = 10 * (this.parent.menuLevel) + "px";
        div.onclick = $.proxy(function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (this.opened) {
                $(this.host).hide(100);
                this.opened = false;
            } else {
                $(this.host).show(100);
                this.opened = true;
                if (this.onlyOneOpen) {
                    for (var i = 0; i < this.parent.itemlist.length; i++) {
                        var item = this.parent.itemlist[i];
                        if (item.constructor == B.GenericSubmenu) {
                            if (item != this) {
                                if (item.opened) {
                                    $(item.host).hide(100);
                                    item.opened = false;
                                }
                            }
                        }
                    }
                }
            }
        }, this);
        this.parent.host.appendChild(div);
        this.host = B.stringToElement("<div></div>");
        this.parent.host.appendChild(div);
    }
    for (var i = 0; i < this.itemlist.length; i++) {
        var item = this.itemlist[i];
        if (item.constructor == B.GenericMenuItem) {
           item.render(this.host);
        } else if (item.constructor == B.GenericSubmenu) {
            item.render(this.host);
        } else if (item.kind == "space") {
            this.host.appendChild(B.stringToElement("<hr style='padding:0; margin:1px 0'>"));
        } else {
            // What is this thing??
        }
    }
    this.parent.host.appendChild(this.host);
    if (!this.opened) $(this.host).hide();
}

B.GenericMenuItem = function(id, parent, img, text, disabled, action, autoclose) {
    this.id = id;
    this.parent = parent;
    this.container = null;
    this.img = img;
    this.text = text;
    this.disabled = disabled;
    this.action = action;
    this.autoclose = autoclose;
    this.hidden = false;
    this.imageTD = null;
    this.textTD = null;
    this.disabled = false;
    return this;
}
B.GenericMenuItem.prototype.enableAction = function(yn) {
    if (yn == undefined) yn = true;
    if (yn) {
        this.container.onclick = $.proxy(function(event) {
            if (this.disabled) return;
            event.stopPropagation();
            event.preventDefault();
            var rslt = this.action();
            if (rslt == undefined) rslt = true;
            if (rslt) {
                if (this.autoclose) {
                    if (this.parent.contextMenu != undefined) this.parent.contextMenu.hide();
                }
            }
        }, this);
    } else {
        event.stopPropagation();
        event.preventDefault();
        this.container.style.cursor = "default";
        this.container.onclick = function() { };
    }
}
B.GenericMenuItem.prototype.render = function(host) {
    var div = B.stringToElement("<div style='border-left: 3px solid transparent;' class='BGenericMenuItem hilite'></div>");
    this.container = div;
    div.style.marginLeft = 10 * (this.parent.menuLevel) + "px";
    host.appendChild(div);
    var tbl = B.stringToElement("<table style='width:100%;'><tr><td style='width:1.1em; padding-right: .2em; text-align:right; vertical-align:top'></td><td style='vertical-align:top'></td></tr></table>");
    this.imageTD = tbl.rows[0].cells[0];
    this.textTD = tbl.rows[0].cells[1];
    if (this.img == null || this.img == "") this.img = "&bull;";
    this.imageTD.innerHTML = this.img;
    this.textTD.innerHTML = this.text;
    div.appendChild(tbl);
    this.enableAction(true);
    host.appendChild(div);
    return div;
}
B.GenericMenuItem.prototype.disable = function(yn) {
    if (yn == undefined) yn = true;
    if (yn) {
        this.container.style.color = "silver";
        this.container.style.cursor = "";
        this.disabled = true;
        this.enableAction(false);
    } else {
        this.container.style.color = "";
        this.container.style.cursor = "pointer";
        this.enableAction(true);
        this.disabled = false;
    }
}

B.Tree = function(target, hardwidth) {
    this.target = document.getElementById(target);
    this.menu = new B.GenericMenu(hardwidth);
}
B.Tree.prototype.addItem = function(id, img, text, action, disabled) { return this.menu.addItem(id, img, text, action, disabled, true); }
B.Tree.prototype.addSpace = function() { this.menu.addSpace(); }
B.Tree.prototype.addSubmenu = function(id, text, action, disabled) { return this.menu.addSubmenu(id, text, action, disabled); }
B.Tree.prototype.get = function(code) { return this.menu.get(code); }
B.Tree.prototype.setOnlyOneLevel = function(yn) { return this.menu.setOnlyOneLevel(yn); }

B.Tree.prototype.render = function() {
    this.menu.render(this.target);
    this.target.innerHTML = "";
    this.target.appendChild(this.menu.host);
}




B.ContextMenu = function(hardwidth) {
    this.menu = new B.GenericMenu(hardwidth);
    // inject the context menu reference
    this.menu.contextMenu = this;
    this.rendered = false;
    this.handler = null;
    return this;
}
B.ContextMenu.prototype.addItem = function(id, img, text, action, disabled) { return this.menu.addItem(id, img, text, action, disabled, true); }
B.ContextMenu.prototype.addSpace = function() { this.menu.addSpace(); }
B.ContextMenu.prototype.addSubmenu = function(id, text, action, disabled) { return this.menu.addSubmenu(id, text, action, disabled); }
B.ContextMenu.prototype.get = function(code) { return this.menu.get(code); }
B.ContextMenu.prototype.setOnlyOneLevel = function(yn) { return this.menu.setOnlyOneLevel(yn); }

B.ContextMenu.prototype.showAt = function(element) {
    if (!this.rendered) {
        this.menu.render();
        this.menu.host.style.position = "absolute";
        $("body").append(this.menu.host);
        this.rendered = true;
    }
    this.handler = $.proxy(function() {
        $("html").one("click", $.proxy(function(event) { 
            this.hide(); 
        }, this));		
    }, this);
    window.setTimeout(this.handler, 10);

    var rect = element.getBoundingClientRect();
    $(this.menu.host).css("top", rect.bottom+0).css("left", rect.left+0);
    event.preventDefault();
    event.stopPropagation();

    $(this.menu.host).show();
}

B.ContextMenu.prototype.show = function(event) { 
    if (!this.rendered) {
        this.menu.render();
        this.menu.host.style.position = "absolute";
        $("body").append(this.menu.host);
        this.rendered = true;
    }
    this.handler = $.proxy(function() {
        $("html").one("click", $.proxy(function(event) { 
            this.hide(); 
        }, this));		
    }, this);
    window.setTimeout(this.handler, 10);

    if (event != undefined) {
		if (B.is.IE()) {
			$(this.menu.host).css("top", event.clientY+5).css("left", event.clientX+5);
		} else {
			$(this.menu.host).css("top", event.pageY+5).css("left", event.pageX+5);
        }
        event.preventDefault();
        event.stopPropagation();
	}  

    $(this.menu.host).show();
}
B.ContextMenu.prototype.hide = function() {
    $(this.menu.host).hide();
    if (this.handler != null) $("html").unbind("click", this.handler);
    this.handler = null;

}