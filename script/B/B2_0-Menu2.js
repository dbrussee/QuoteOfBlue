B.GenericMenu = function(hardwidth) {
    if (hardwidth == undefined) hardwidth = null;
    this.hardwidth = hardwidth;
    this.menuLevel = 0;
    this.itemlist = [];
    this.items = {};
    this.parent = null;
    this.topMenu = this;
    this.onlyOneLevel = false;
    this.host = B.stringToElement("<div class='BGenericMenu main' style='position:relative; top:0; left: 0; border-top:3px solid navy; " +
        //"background-image: linear-gradient(to bottom right, rgb(227, 227, 236), lightsteelblue); " +
        "background-image: linear-gradient(to bottom right, mintcream, gainsboro); " +
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
    var tbl = B.stringToElement("<table style='width:100%;'><tr><td style='width:1.5em; align:right; vertical-align:top'></td><td style='vertical-align:top'><hr></td></tr></table>");
    this.host.appendChild(tbl);
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

B.GenericSubmenu = function(id, parent, img, text, disabled, action) {
    this.menuLevel = parent.menuLevel + 1;
    this.topMenu = parent;
    while (this.topMenu.constructor != B.GenericMenu) this.topMenu = this.topMenu.parent;
    this.id = id;
    this.parent = parent;
    this.text = text;
    this.disabled = null;
    this.opened = false;
    this.onlyOneOpen = false;

    this.itemlist = [];
    this.items = {};

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
            $(this.host).slideDown(200);
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
    this.parent.host.appendChild(this.host);
    if (!this.opened) $(this.host).hide();

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

B.GenericMenuItem = function(id, parent, img, text, disabled, action, autoclose) {
    this.id = id;
    this.parent = parent;
    this.img = img;
    this.text = text;
    this.disabled = disabled;
    this.action = action;
    this.autoclose = autoclose;
    this.hidden = false;
    this.imageTD = null;
    this.textTD = null;
    this.disabled = false;
    this.value = "";
    this.kind = "normal"; // as opposed to 'drop'

    var div = B.stringToElement("<div style='border-left: 3px solid transparent;' class='BGenericMenuItem hilite'></div>");
    this.container = div;
    div.style.marginLeft = 10 * (this.parent.menuLevel) + "px";
    //this.parent.host.appendChild(div);
    var tbl = B.stringToElement("<table style='width:100%;'><tr><td style='width:1.1em; padding-right: .2em; text-align:right; vertical-align:top'></td><td style='vertical-align:top'></td></tr></table>");
    this.imageTD = tbl.rows[0].cells[0];
    this.textTD = tbl.rows[0].cells[1];
    if (this.img == null || this.img == "") this.img = "&bull;";
    this.imageTD.innerHTML = this.img;
    this.textTD.innerHTML = this.text;
    div.appendChild(tbl);
    this.enableAction(true);
    this.parent.host.appendChild(div);
    return this;
}
B.GenericMenuItem.prototype.enableAction = function(yn) {
    if (yn == undefined) yn = true;
    if (yn) {
        this.container.onclick = $.proxy(function(event) {
            if (this.disabled) return;
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            var rslt = this.action();
            if (rslt == undefined) rslt = true;
            if (rslt) {
                if (this.kind == "drop") {
                    this.parent.contextMenu.hide();
                }
                if (this.autoclose) {
                    if (this.parent.contextMenu != undefined) this.parent.contextMenu.hide();
                }
            }
        }, this);
    } else {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.container.style.cursor = "default";
        this.container.onclick = function() { };
    }
    return this;
}
B.GenericMenuItem.prototype.setText = function(txt) {
    this.textTD.innerHTML = txt;
}
B.GenericMenuItem.prototype.setIconText = function(txt) {
    this.imageTD.innerHTML = txt;
    return this;
}
B.GenericMenuItem.prototype.setIconImage = function(img) {
    this.imageTD.innerHTML = "";
    this.imageTD.appendChild(img);
    return this;
}
B.GenericMenuItem.prototype.disable = function(yn) {
    if (yn == undefined) yn = true;
    if (yn) {
        this.container.style.textDecoration = "line-through";
        this.container.style.color = "darkgray";
        this.container.style.cursor = "";
        this.disabled = true;
        this.enableAction(false);
    } else {
        this.container.style.textDecoration = "";
        this.container.style.color = "";
        this.container.style.cursor = "pointer";
        this.enableAction(true);
        this.disabled = false;
    }
    return this;
}
B.GenericMenuItem.prototype.enable = function(yn) {
    if (yn == undefined) yn = true;
    return this.disable(!yn);
}

B.StaticTree = function(target, hardwidth) {
    this.target = document.getElementById(target);
    this.target.style.position = "relative";
    this.target.innerHTML = "";
    this.menu = new B.GenericMenu(hardwidth);
    this.target.appendChild(this.menu.host);
}
B.StaticTree.prototype.addItem = function(id, img, text, action, disabled) { return this.menu.addItem(id, img, text, action, disabled, true); }
B.StaticTree.prototype.addSpace = function() { this.menu.addSpace(); }
B.StaticTree.prototype.addSubmenu = function(id, text, action, disabled) { return this.menu.addSubmenu(id, text, action, disabled); }
B.StaticTree.prototype.get = function(code) { return this.menu.get(code); }
B.StaticTree.prototype.setOnlyOneLevel = function(yn) { return this.menu.setOnlyOneLevel(yn); }




B.DropMenu = function(hardwidth) {
    this.showing = false;
    this.menu = new B.GenericMenu(hardwidth);
    // inject the context menu reference
    this.menu.contextMenu = this;
    this.handler = null;
    this.menu.host.style.position = "absolute";
    $("body").append(this.menu.host);
    $(this.menu.host).hide();
    return this;
}
B.DropMenu.prototype.addItem = function(id, img, text, action, disabled) { 
    var itm = this.menu.addItem(id, img, text, action, disabled, true); 
    itm.kind = "drop";
    return itm;
}
B.DropMenu.prototype.addSpace = function() { this.menu.addSpace(); }
B.DropMenu.prototype.addSubmenu = function(id, text, action, disabled) { return this.menu.addSubmenu(id, text, action, disabled); }
B.DropMenu.prototype.get = function(code) { return this.menu.get(code); }
B.DropMenu.prototype.setOnlyOneLevel = function(yn) { return this.menu.setOnlyOneLevel(yn); }

B.DropMenu.prototype.showAt = function(element) {
    if (this.showing) {
        this.showing = false;
        this.hide();
        return;
    }
    this.showing = true;
    this.handler = $.proxy(function() {
        $("html").one("click", $.proxy(function(event) { 
            this.hide(); 
            this.showing = false;
        }, this));		
    }, this);
    window.setTimeout(this.handler, 10);

    var rect = element.getBoundingClientRect();
    $(this.menu.host).css("top", rect.bottom+0).css("left", rect.left+0);
    //event.preventDefault();
    //event.stopPropagation();
    
    $(this.menu.host).hide();
    $(this.menu.host).slideDown(200);
    this.showing = true;
}

B.DropMenu.prototype.show = function(event) { 
    this.hide();
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
        //event.preventDefault();
        //event.stopPropagation();
	}  

    $(this.menu.host).slideDown(200);
}
B.DropMenu.prototype.hide = function() {
    $(this.menu.host).hide();
    if (this.handler != null) {
        $("html").click();
    }
    this.handler = null;
    this.showing = false;
}