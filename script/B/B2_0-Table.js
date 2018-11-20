// B2.0 Table
B.settings.ScrollingTable = {
	highlightItem: 'tr',
	embedScrollbar: false,
	wrapCells: false,
	fieldBackgroundColor: 'ghostwhite',
	footerStyle: 'buttons',
	footerBackgroundColor: 'gainsboro',
	footerHoverColor: 'aqua',
	JQTheme: true // false for using stylesheet (BQTable, BQTableHeader)
};

B.ScrollingTable = function (rootId, height, ColumnSet, txt1, txt2, embedScrollbar) {
	this.embedScrollbar = B.settings.ScrollingTable.embedScrollbar;
	if (embedScrollbar != undefined) this.embedScrollbar = embedScrollbar;
	this.defaultDetails = "&nbsp;";
	this.title = "";
	this.sortColumn = ""; // Display arrow in header on this column-Blank means no columns marked
	this.sortDirection = "ASC"; // A (Ascending) or D (Descending)
	this.subTitle = "";
	this.rootId = rootId;
	this.height = height;
	this.frozen = false;
	this.dataset = new B.Dataset(ColumnSet);
	this.actualRowCount = 0;
	this.highlightItem = B.settings.ScrollingTable.highlightItem.toUpperCase();
	if (this.highlightItem == undefined) this.highlightItem = "TR";
	this.txt1 = txt1;
	this.txt2 = txt2;
	this.header = document.getElementById(this.rootId);
	this.userDefinedWidth = null;
	var data = this.header.getAttribute("data");
	if (data != null) this.userDefinedWidth = parseInt(data, 10);

	B.addClass(this.header, "BScrollingTableHeader");
	this.header.style.cssText = "border-collapse:collapse; border-right:2px solid transparent; border-left:2px solid transparent";
	// Create the container div
	this.container = document.createElement("div");
	$(this.container).on("keydown", $.proxy(function (event) {
		var rn = this.current.rownum;
		if (event.key == "Down") {
			var numrows = this.dataset.data.length - 1;
			if (rn < numrows) {
				this.unpick;
				var row = this.pick(rn + 1);
				try {
					var brect = this.surround.getBoundingClientRect();
					var elrect = row.getBoundingClientRect();
					if (elrect.top + elrect.height > brect.top + brect.height) {
						row.scrollIntoView(false);
					}
				} catch (e) { }
			}
			return false;
		} else if (event.key == "Up") {
			if (rn > 0) {
				this.unpick();
				var row = this.pick(rn - 1);
				try {
					var brect = this.surround.getBoundingClientRect();
					var elrect = row.getBoundingClientRect();
					if (elrect.top < brect.top) {
						row.scrollIntoView(true);
					}
				} catch (e) { }
			}
			return false;
		} else if (event.key == "Enter") {
			if (this.editForm.allowEdit) this.editForm.startEdit();
			return false;
		} else {
			//say("You pressed the " + event.key + " key on table " + this.rootId);
			return false;
		}
		//say("You pressed the " + event.key + " key on table " + this.rootId);
	}, this));
	this.container.style.marginBottom = ".5em";
	this.titleContainer = document.createElement("div");
	this.container.appendChild(this.titleContainer);
	this.container.id = rootId + "_container";
	// Insert it before the existing header table
	this.header.parentNode.insertBefore(this.container, this.header);
	// Move the header table inside the container.
	this.container.appendChild(this.header.parentNode.removeChild(this.header));
	this.freezeData = { element: null, timer: null, timerSpan: null, freezeStart: null }; // Used when displaying freeze message
	this.columns = [];
	this.dataWidth = 0;

	this.contextMenu = new B.PopupMenu();
	this.maxSelectedRows = 1;
	this.onBeforeExport = function () { return true; };
	this.onBeforeRowRender = function (rn, rd, tr, tds) { return; };
	this.onDetailRender = function (rn, rd) { return ""; };
	this.onRefresh = function (form, action) { return true; };
	if (B.settings.ScrollingTable.JQTheme) B.addClass(this.header, "ui-widget-header,ui-priority-primary");

	var asteriskColumns = [];
	// Build the actual header from the template
	for (var rn = 0; rn < this.header.rows.length; rn++) {
		var row = this.header.rows[rn];
		for (var cn = 0; cn < row.cells.length; cn++) {
			var cell = row.cells[cn];
			B.addClass(cell, "BScrollingTableHeaderCell,ui-widget-header,ui-priority-primary");
			if (cell.getAttribute("colspan") != null) {
				var numcols = parseInt(cell.getAttribute("colspan"), 10);
				if (numcols > 1) {
					if (this.header.rows.length > 1) cell.setAttribute("colspan", numcols + 1);
					cell.style.cssText = "text-align:center; border-bottom:1px solid white !important;";
					cell.innerHTML = "<span style='text-shadow: 1px 1px 2px black; z-index:100;'>" + cell.innerHTML + "</span>";
					continue;
				}
			}
			cell.style.cssText = "border-left:1px solid white; border-right:1px solid white";
			var data = cell.getAttribute("data").split(","); // columnName, widthInPixels, attributes
			var id = data[0];
			cell.id = this.rootId + "_HEADER_" + id;
			var col = { cell: cell, index: cn, id: id, headText: cell.innerText, width: 0, bold: false, align: 'left', wrap: false, sortable: false };
			var wid = 100; // 100 pixels -- will get overridden by data value next
			if (data.length > 1) {
				if (isNaN(parseInt(data[1], 10))) {
					asteriskColumns.push(this.columns.length); // So I can find it later
				} else {
					wid = parseInt(data[1], 10);
					this.dataWidth += wid;
					cell.style.width = wid + "px";
					col.width = wid;
				}
			} else {
				asteriskColumns.push(this.columns.length); // So I can find it later
			}
			this.columns.push(col);
			var attribs = "L"; // Left justification as default
			if (data.length > 2) attribs = data[2].toUpperCase(); // CB (Center Bold), etc
			if (attribs.indexOf("C") >= 0) col.align = "center";
			if (attribs.indexOf("R") >= 0) col.align = "right";
			if (attribs.indexOf("B") >= 0) col.bold = true;
			if (attribs.indexOf("W") >= 0) col.wrap = true;
			if (attribs.indexOf("S") >= 0) col.sortable = true;
			if (attribs.indexOf("A") >= 0) { this.sortColumn = id; this.sortDirection = "ASC"; }
			if (attribs.indexOf("D") >= 0) { this.sortColumn = id; this.sortDirection = "DESC"; }

			cell.style.textAlign = col.align;
			cell.innerHTML = "<span style='text-shadow: 1px 1px 2px black; z-index:100;'>" + cell.innerHTML + "</span>";
			// Display div for sorting
			var el = document.createElement("div");
			el.style.cssText = "display: table-cell; position: absolute; right: 0; top: 0; width: 5px;";
			el.style.height = (100 * cell.rowSpan) + "%"; // Handles multiple row span heights, but not "wrapped" text
			cell.appendChild(el);

			if (col.sortable) {
				B.addClass(cell, "sortable");
				cell.style.cursor = "pointer"; // Clickable

				cell.onclick = $.proxy(function (event) {
					var el = $(event.target)[0]; // A collection even though only one
					var cell = $(el).closest("th")[0];
					var parts = cell.id.split("_");
					if (parts.length == 3) {
						this.onHeaderClick(parts[2], cell);
					}
				}, this);
			} else {
				cell.style.cursor = "default"; // Nope
			}
		}
	}
	if (asteriskColumns.length > 0) {
		var neededWidth = this.userDefinedWidth;
		if (neededWidth == null) {
			// User did not provide width, so we need to come up with one
			// Default is 100px width columns.
			neededWidth = this.dataWidth + (100 * asteriskColumns.length);
		} else if (neededWidth - this.dataWidth < (10 * asteriskColumns.length)) {
			// Handle case where user provided a width,
			// but that width is too small. Minimum width must be 10px.
			// If too small, push them all out to 100px
			neededWidth = this.dataWidth + (100 * asteriskColumns.length);
		}
		var remaining = neededWidth - this.dataWidth;
		this.dataWidth += remaining;
		var calculatedWidth = remaining / asteriskColumns.length;
		for (var i = 0; i < asteriskColumns.length; i++) {
			var col = this.columns[asteriskColumns[i]];
			var cell = col.cell;
			// Calculate the remaining width;
			cell.style.width = calculatedWidth + "px";
			col.width = calculatedWidth;
		}
	}
	this.onHeaderClick = function (id, thcell) { };
	if (this.embedScrollbar) {
		// Grab the last row
		var row = this.header.rows[this.header.rows.length - 1];
		// Make the last row's right border transparent
		row.cells[row.cells.length - 1].style.borderRight = "1px solid transparent";
		var pad = document.createElement("th");
		pad.style.width = "17px";
		pad.style.border = "1px solid transparent";
		row.appendChild(pad);
	}
	this.header.style.tableLayout = "fixed";
	this.getHeaderRow = function () {
		var tbl = document.getElementById(this.rootId);
		return tbl.rows[0];
	};

	this.surround = document.createElement("div");
	this.surround.id = this.rootId + "_surround";
	this.surround.style.cssText = "position:relative; overflow-x:hidden; overflow-y:scroll";
	this.surround.style.height = this.height + "px";
	this.surround.style.width = (this.dataWidth + 17) + "px"; // Add width for the scroll bar
	this.surround.style.backgroundColor = B.settings.ScrollingTable.fieldBackgroundColor;

	this.container.style.width = (this.dataWidth + 17) + "px";

	this.dataTable = document.createElement("table");
	this.dataTable.setAttribute("tabindex", "0");
	this.dataTableBody = document.createElement("tbody");
	this.dataTable.appendChild(this.dataTableBody);
	this.dataTable.id = this.rootId + "_data";
	this.dataTable.style.cssText = "border-left:2px solid gainsboro; border-right:2px solid transparent; " +
		"border-collapse:collapse; table-layout:fixed; cursor:pointer";
	this.dataTable.style.width = this.dataWidth + "px";
	this.dataTable.onclick = $.proxy(function (event) {
		if (this.frozen) return;
		var wasRow = this.current.rownum;
		if (this.maxSelectedRows == 0) return;
		var el = $(event.target)[0]; // A collection even though only one
		var cell = $(el).closest("td")[0];
		if (cell == undefined) return;
		var row = $(cell).closest("tr")[0];
		if (row == undefined) return;
		this.unpick();
		var rd = this.getDataRow(row.rowIndex);
		rd["clickedColumn"] = this.columns[cell.cellIndex];
		var rslt = this.onbeforeclick(this.dataTable, row, cell, row.rowIndex, cell.cellIndex, rd, row.rowIndex != wasRow);
		if (rslt == undefined) rslt = true;
		if (rslt) {
			this.pick(row, cell, wasRow);
		}
	}, this);
	$(this.dataTable).on("contextmenu", $.proxy(function (event) {
		if (this.frozen) return;
		if (this.maxSelectedRows == 0) return;
		var wasRow = this.current.rownum;
		var el = $(event.target)[0]; // A collection even though only one
		var cell = $(el).closest("td")[0];
		if (cell == undefined) return;
		var row = $(cell).closest("tr")[0];
		if (row == undefined) return;
		this.unpick();
		var rd = this.dataset.getRow(row.rowIndex);
		rd["clickedColumn"] = this.columns[cell.cellIndex];
		for (var key in this.footer.buttons) {
			if (this.footer.buttons[key].watchpick) this.footer.enableButton(key);
		}
		var rslt = this.onbeforeclick(this.dataTable, row, cell, row.rowIndex, cell.cellIndex, rd, row.rowIndex != this.current.rownum);
		if (rslt == undefined) rslt = true;
		if (rslt) {
			this.pick(row, cell, wasRow);
			if (this.contextMenu.itemlist.length > 0) {
				if (this.contextMenu.showing) this.contextMenu.hide();
				var rslt = this.onBeforeRightClick(this.dataTable, row, cell, row.rowIndex, cell.cellIndex, rd, row.rowIndex != this.current.rownum);
				if (rslt == undefined) rslt = true;
				if (rslt) this.contextMenu.show(event);
			}
		}
	}, this));
	this.onBeforeRightClick = function (rownum, tr, td, dataRow, changed, event) {
		if (this.maxSelectedRows == 0) return;
		try { event.preventDefault(); } catch (e) { ; }
		if (this.contextMenu.items.length > 0) this.contextMenu.show(event);
	};
	this.dataTable.ondblclick = $.proxy(function (event) {
		var wasRow = this.current.rownum;
		B.clearSelection();
		if (this.maxSelectedRows == 0) return;
		var el = $(event.target)[0]; // A collection even though only one
		var cell = $(el).closest("td")[0];
		if (cell == undefined) return;
		var row = $(cell).closest("tr")[0];
		if (row == undefined) return;
		this.unpick();
		var rd = this.dataset.getRow(row.rowIndex);
		rd["clickedColumn"] = this.columns[cell.cellIndex];
		for (var key in this.footer.buttons) {
			if (this.footer.buttons[key].watchpick) this.footer.enableButton(key);
		}
		var rslt = this.onbeforeclick(this.dataTable, row, cell, row.rowIndex, cell.cellIndex, rd, row.rowIndex != wasRow);
		if (rslt == undefined) rslt = true;
		if (rslt) {
			this.pick(row, cell, wasRow);
			if (this.ondblclick != undefined) {
				this.ondblclick(this.dataTable, row, cell, row.rowIndex, cell.cellIndex, rd);
			}
		}
	}, this);

	this.surround.appendChild(this.dataTable);

	this.container.appendChild(this.surround);
	B.addClass(this.header, "BTable,BTableHeader");
	B.addClass(this.dataTable, "BTable,BTableData");
	$(this.header).show();

	this.footerDIV = document.createElement("div");
	var pad = 0;
	if (this.embedScrollbar) pad += 17;
	this.footerDIV.style.width = (this.dataWidth + pad) + "px";
	this.footerDIV.style.backgroundColor = B.settings.ScrollingTable.footerBackgroundColor;
	this.footerDIV.style.height = "25px";
	this.footerButtonsDIV = document.createElement("div");
	this.footerButtonsDIV.style.cssText = "height:23px; display:inline-block; background-color:transparent";
	this.footerDIV.appendChild(this.footerButtonsDIV);

	this.footerMessageDIV = document.createElement("div");
	this.footerMessageDIV.style.cssText = "text-align:right; display:inline-block; float:right; height:19px; " +
		"vertical-align:middle; padding-right: 5px; padding-top:5px; color:navy; background-color:transparent; font-size:9pt";
	this.footerMessageDIV.innerHTML = "Howdy";
	this.footerMessageDIV.ondblclick = $.proxy(function () {
		var rslt = this.onBeforeExport();
		if (rslt == undefined) rslt = true;
		if (!rslt) return;
		if (!this.frozen) B.exportToNewWindow(this); // this = this table element
	}, this);
	this.footerDIV.appendChild(this.footerMessageDIV);

	// Add a status message section
	this.footerStatusDIV = document.createElement("div");
	this.footerStatusDIV.style.cssText = "text-align:left; display:inline-block; float:left; height:19px; " +
		"vertical-align:middle; padding-top:5px; color:navy; background-color:transparent; font-size:9pt";
	this.footerStatusDIV.innerHTML = "";
	this.footerDIV.appendChild(this.footerStatusDIV);

	this.container.appendChild(this.footerDIV);
	this.footer = {
		table: this,
		buttons: {},
		setStatus: function (h) {
			if (h.length > 0) h = "&nbsp;" + h + "&nbsp;&nbsp;&nbsp;";
			this.table.footerStatusDIV.innerHTML = h;
		},
		addSpace: function () {
			var div = document.createElement("div");
			div.style.cssText = "display:inline-block; background-color:transparent; vertical-align:middle; height:17px; " +
				"padding-right:5px; padding-left: 5px; padding-top: 4px; padding-bottom: 4px; border:1px solid transparent: color:navy; font-size:9pt; cursor:pointer";
			div.innerHTML = "|";
			div.onclick = function () { };
			this.table.footerButtonsDIV.appendChild(div);
		},
		addButton: function (id, txt, onclick, watchpick) {
			if (watchpick == undefined) watchpick = false;
			var div = document.createElement("div");
			div.style.cssText = "display:inline-block; background-color:transparent; vertical-align:middle; height:17px; " +
				"padding-right:5px; padding-left: 5px; padding-top: 4px; padding-bottom: 4px; border:1px solid transparent; color:navy; font-size:9pt; cursor:pointer";
			div.id = this.rootId + "_footer_" + id;
			div.onmouseover = function () { this.style.backgroundColor = B.settings.ScrollingTable.footerHoverColor; };
			div.onmouseout = function () { this.style.backgroundColor = "transparent"; };
			div.innerHTML = txt;
			if (onclick == undefined) onclick = function () { };
			div.onclick = onclick;
			this.table.footerButtonsDIV.appendChild(div);
			this.buttons[id] = { id: id, table: this.table, div: div, onclick: onclick, disabled: false, watchpick: watchpick, frozen: false };
			this.buttons[id].disable = function () {
				this.table.footer.disableButton(this.id);
			};
			this.buttons[id].enable = function () {
				this.table.footer.enableButton(this.id);
			};
			this.buttons[id].setDisabled = function (isDisabled) {
				if (isDisabled) {
					this.table.footer.disableButton(this.id);
				} else {
					this.table.footer.enableButton(this.id);
				}
			};
			this.buttons[id].show = function () {
				$(this.div).show();
			};
			this.buttons[id].hide = function () {
				$(this.div).hide();
			};
			return this.buttons[id]; // The footer
		},
		setText: function (id, html) {
			var div = this.buttons[id].div;
			div.innerHTML = html;
		},
		disableButton: function (id) {
			var btn = this.buttons[id];
			btn.disabled = true;
			this.drawButton(btn);
			return this;
		},
		enableButton: function (id) {
			var btn = this.buttons[id];
			btn.disabled = false;
			this.drawButton(btn);
			return this;
		},
		drawButton: function (id) {
			var btn = null;
			if (typeof id == "string") {
				btn = this.buttons[id];
			} else {
				btn = id; // Passed in a button object
			}
			var div = btn.div;
			if (!btn.disabled && !this.table.frozen) {
				div.onclick = btn.onclick;
				div.onmouseover = function () { this.style.backgroundColor = B.settings.ScrollingTable.footerHoverColor; };
				div.style.color = "navy";
				div.style.cursor = "pointer";
			} else {
				div.onclick = function () { };
				div.onmouseover = function () { };
				div.style.color = "peru";
				div.style.cursor = "default";
			}
			return this;
		}
	};
	this.onAfterEditFormDisplay = function () { return; };
	this.editForm = {
		tbl: this,
		allowAdd: false, allowEdit: false, allowCopy: false, allowDel: false,
		formAction: "none",
		formid: null,
		deletePrompt: "",
		remote: null,
		save: function () {
			if (this.formAction == "del") {
				if (this.remote != null) this.remote.run();
			} else if (B.is.ONEOF(this.formAction, "add,copy")) {
				if (this.remote != null) this.remote.run();
			} else if (this.formAction == "edit") {
				if (this.remote != null) this.remote.run();
			} else {
				sayError("I dont know what form action '" + this.formAction + "' is. Sorry");
			}

		},
		refresh: function () {
			var frm = new B.Form(this.formid);
			if (B.is.ONEOF(this.formAction, "edit,copy")) {
				frm.setFromTableRow(this.tbl.getDataRow());
			} else if (this.formAction == "add") {
				frm.reset();
			}
			if (frm.isLiveValidate) frm.triggerLiveValidate();
			this.tbl.onRefresh(frm, this.formAction);
		},
		startAdd: $.proxy(function () {
			this.editForm.formAction = "add";
			this.editForm.remote.setParameter("FORM_ACTION", "add");
			var frm = new B.Form(this.editForm.formid);
			frm.reset();
			this.setKeysReadOnly("add");
			openDialog(this.editForm.formid);
			var btn = document.getElementById(this.editForm.formid + "_saveButton");
			btn.innerHTML = "Save New";
			this.onAfterEditFormDisplay("ADD");
			frm.setClean();
			if (frm.isLiveValidate) frm.triggerLiveValidate();
		}, this),
		startEdit: $.proxy(function () {
			this.editForm.formAction = "edit";
			this.editForm.remote.setParameter("FORM_ACTION", "edit");
			var frm = new B.Form(this.editForm.formid);
			if (frm.isLiveValidate) frm.triggerLiveValidate();
			this.setKeysReadOnly("edit");
			frm.setFromTableRow(this.getDataRow());
			openDialog(this.editForm.formid);
			var btn = document.getElementById(this.editForm.formid + "_saveButton");
			btn.innerHTML = "Save Changes";
			this.onAfterEditFormDisplay("EDIT");
			frm.setClean();
			if (frm.isLiveValidate) frm.triggerLiveValidate();
		}, this),
		startCopy: $.proxy(function () {
			this.editForm.formAction = "copy";
			this.editForm.remote.setParameter("FORM_ACTION", "copy");
			var frm = new B.Form(this.editForm.formid);
			this.setKeysReadOnly("copy");
			frm.setFromTableRow(this.getDataRow());
			openDialog(this.editForm.formid);
			var btn = document.getElementById(this.editForm.formid + "_saveButton");
			btn.innerHTML = "Save Copy";
			this.onAfterEditFormDisplay("COPY");
			frm.setClean();
			if (frm.isLiveValidate) frm.triggerLiveValidate();
		}, this),
		startDelete: $.proxy(function () {
			this.editForm.formAction = "del";
			this.editForm.remote.setParameter("FORM_ACTION", "del");
			askWarn(B.format.TEMPLATE(this.editForm.deletePrompt, this.getRowValues()), "Delete " + this.txt1, $.proxy(function (rslt) {
				if (rslt == "YES") {
					this.editForm.save();
				}
			}, this));
		}, this)
	};
	this.setTitle = function (title, subtitle) {
		if (title == undefined) title = "";
		this.title = title;
		if (subtitle == undefined) subtitle = "";
		this.subTitle = subtitle;
		var h = "";
		if (title != "") {
			h += "<span style='font-size:1.2em;font-weight:bold;color:navy;padding:2px;'>";
			h += title;
			h += "</span>";
		}
		if (subtitle != "") {
			if (h != "") h += "&nbsp;&nbsp;";
			h += "<span style='color:navy; padding:2px;'>";
			h += subtitle;
			h += "</span>";
		}
		this.titleContainer.innerHTML = h;
	};
	this.getTitle = function () { return this.title; };
	this.setKeysReadOnly = function (act) {
		var frm = new B.Form(this.editForm.formid);
		for (var k in frm.fields) {
			if (frm.fields[k].key) frm.setReadOnly(k, (act == "edit"));
		}
	};
	this.setForm = function (formid, remote, supportCodes, deletePrompt) {
		var allowEdit = false;
		var allowAdd = false;
		var allowCopy = false;
		var allowDelete = false;
		if (supportCodes.toUpperCase().indexOf("E") >= 0) allowEdit = true;
		if (supportCodes.toUpperCase().indexOf("A") >= 0) allowAdd = true;
		if (supportCodes.toUpperCase().indexOf("C") >= 0) allowCopy = true;
		if (supportCodes.toUpperCase().indexOf("D") >= 0) allowDelete = true;
		this.editForm.allowEdit = allowEdit;
		this.editForm.allowAdd = allowAdd;
		this.editForm.allowCopy = allowCopy;
		this.editForm.allowDel = allowDelete;
		var frm = new B.Form(formid);
		// Assume there are no buttons on the form
		var obj = document.getElementById(formid);
		var btn = document.createElement("button");
		btn.className = "BDialogButton";
		btn.onclick = $.proxy(function () { this.editForm.save(); }, this);
		btn.setAttribute("data-id", "saveButton");
		obj.appendChild(btn);

		btn = document.createElement("button");
		btn.className = "BDialogButton";
		btn.onclick = function () { popDialog(); };
		btn.innerHTML = "Cancel";
		obj.appendChild(btn);

		btn = document.createElement("button");
		btn.className = "BDialogButton";
		btn.style.marginLeft = "1.5em";
		btn.onclick = $.proxy(function () { this.editForm.refresh(); }, this);
		btn.innerHTML = "Refresh";
		obj.appendChild(btn);

		this.editForm.formid = formid;
		this.editForm.remote = remote;
		this.editForm.deletePrompt = deletePrompt;
		if (allowAdd) {
			this.footer.addButton("add_item", "Add", $.proxy(function () { this.editForm.startAdd(); }, this), false);
			this.contextMenu.addMenu("add_item", B.img("ADD"), "Add " + this.txt1 + "...", $.proxy(function () { this.editForm.startAdd(); }, this), false);
		}
		if (allowEdit) {
			this.footer.addButton("edit_item", "Edit", $.proxy(function () { this.editForm.startEdit(); }, this), true).disable();
			this.contextMenu.addMenu("edit_item", B.img("PENCIL"), "Edit " + this.txt1 + "...", $.proxy(function () { this.editForm.startEdit(); }, this), false);
		}
		if (allowCopy) {
			this.footer.addButton("copy_item", "Copy", $.proxy(function () { this.editForm.startCopy(); }, this), true).disable();
			this.contextMenu.addMenu("copy_item", B.img("COPY"), "Copy " + this.txt1 + "...", $.proxy(function () { this.editForm.startCopy(); }, this), false);
		}
		if (allowDelete) {
			this.footer.addButton("delete_item", "Delete", $.proxy(function () { this.editForm.startDelete(); }, this), true).disable();
			this.contextMenu.addMenu("delete_item", B.img("X"), "Delete " + this.txt1 + "...", $.proxy(function () { this.editForm.startDelete(); }, this), false);
		}
		//this.footer.addSpace();
		if (allowEdit) {
			//this.contextMenu.addSpace();
			this.ondblclick = function (tbl, row, cell, rn, cn, rd) {
				this.editForm.startEdit();
			};
		} else {
			this.ondblclick = function () { };
		}
	};
	this.onbeforeclick = function () { return true; };
	this.onclick = function () { };
	this.current = { rownum: -1, cellnum: -1 };
	if (this.header.getAttribute("title") != "") {
		this.setTitle(this.header.getAttribute("title"));
		this.header.removeAttribute("title");
	}
	this.setFooterMessage();
	if (this.sortColumn != "") this.setSortColumn(this.sortColumn, this.sortDirection);
};
B.ScrollingTable.prototype.setDetails = function (html) {
	if (html == undefined) html = this.defaultDetails;
	if (html == "") html = this.defaultDetails;
	if (this.detailContainer == undefined) {
		this.detailContainer = document.createElement("div");
		this.detailContainer.innerHTML = "";
		// Add a detailContainer after the main table
		this.container.parentNode.insertBefore(this.detailContainer, this.container.nextSibling);
	}
	this.detailContainer.innerHTML = html;
};
B.ScrollingTable.prototype.getDetails = function () {
	if (this.detailContainer == undefined) {
		return "";
	} else {
		var h = this.detailContainer.innerHTML;
		if (h == "&nbsp;") {
			return "";
		} else {
			return h;
		}
	}
};
B.ScrollingTable.prototype.handleSaveResult = function (isSuccess, rpc, dataResult) {
	if (dataResult == undefined) dataResult = "ROW";
	var act = rpc.getParameter("FORM_ACTION");
	var rownum = null;
	if (!isSuccess) {
		return rpc.getError();
	}
	if (B.isOneOf(act, "ADD,COPY")) {
		var row = rpc.getResult(dataResult);
		if (row == null) row = rpc.getResult("DATA");
		if (rpc.cls == null) { // Simulated method call
			this.addRows(row);
		} else {
			this.addRows(row);
			this.pick(this.dataset.data.length - 1);
			this.dataTable.rows[this.dataset.data.length - 1].scrollIntoView();
			this.actualRowCount++;
			popDialog();
		}
	} else if (B.isOneOf(act, "EDIT,EDIT-SILENT")) {
		var row = rpc.getResult(dataResult);
		if (row == null) row = rpc.getResult("DATA");
		rownum = this.current.rownum;
		if (rpc.cls == null) {
			this.updateRow(row);
		} else {
			this.updateRow(row);
		}
		popDialog();
		this.pick(rownum);
	} else if (B.isOneOf(act, "DEL")) {
		rownum = this.current.rownum;
		this.unpick();
		// Remove it from the dataset
		this.dataset.data.splice(rownum, 1);
		// Remove from the table
		this.dataTableBody.deleteRow(rownum);
		if (this.actualRowCount > 0) this.actualRowCount--;
	}
	this.setFooterMessage();
};
B.ScrollingTable.prototype.deleteRow = function (rownum) {
	if (rownum == undefined) rownum = this.current.rownum;
	if (this.current.rownum >= 0) this.unpick();
	// Remove it from the dataset
	this.dataset.data.splice(rownum, 1);
	// Remove from the table
	this.dataTableBody.deleteRow(rownum);
};


B.exportToNewWindow = function () {
	var dta = "<html><head></head>";
	dta += "<body style='font-size:8pt;'>";
	dta += "<button onclick='window.print();' class='noprintREALLY' style='position:absolute; right:0; top:0;'>" + B.img("PRINT") + " Print...</button>";
	for (var argnum = 0; argnum < arguments.length; argnum++) {
		var obj = arguments[argnum];
		if (argnum > 0) dta += "<div style='height:.8em;'>&nbsp;</div>";
		if (typeof obj == "string") obj = document.getElementById(obj);
		if (obj instanceof B.ScrollingTable) {
			dta += obj.getExportHTML();
		} else if (obj.tagName.toUpperCase() == "CANVAS") {
			dta += "<img src='" + obj.toDataURL("image/png") + "'>";
		} else {
			var len = obj.outerHTML.length;
			var pos = 0;
			while (pos < obj.outerHTML.length) {
				var tmp = obj.outerHTML.substr(pos, 2000);
				dta += tmp;
				pos += 2000;
			}
		}
	}
	dta += "</body></html>";
	var winid = window.open("", "_blank?beef=" + new Date().getTime(), "height=400,width=600,resizable=1,scrollbars=1");
	try {
		$(winid.document.body).html(dta);
		B.addCSSToWindow(winid);
		winid.document.title = "Pop Out Data";
	} catch (e) {
		sayError("Could not open window to export. Check that you do not have a popup blocker in effect.");
	}
};
B.ScrollingTable.prototype.getExportHTML = function () {
	var dta = "<div style='padding:0; margin:0; font-size:10pt;'>";
	if (this.title != "") dta = "<div style='font-size:1.1em;font-family:arial;font-weight:bold;'>" + this.title + "</div>";
	var rows = document.getElementById(this.rootId).rows;
	dta += "<table class='BScrollingTableHeader BTable BTableData' style='border-collapse:collapse;display:table'>";
	var colcount = 0;
	for (var rn = 0; rn < rows.length; rn++) {
		var row = rows[rn];
		colcount = row.cells.length;
		dta += row.outerHTML;
	}
	var tbl = document.getElementById(this.rootId + "_data");
	for (var i = 0; i < tbl.rows.length; i++) {
		var row = tbl.rows[i];
		colcount = row.cells.length;
		dta += row.outerHTML;
	}
	dta += "<tr><td colspan='" + colcount + "' style='background-color:gainsboro;padding:.2em;text-align:right;font-size:9pt;'>" + this.footerMessageDIV.innerHTML + "</td></tr>";
	dta += "</table>";
	if (this.detailContainer != undefined) {
		dta += this.detailContainer.innerHTML;
	}
	dta += "</div>";
	return dta;
};

B.ScrollingTable.prototype.editDataFromFormGet = function (rownum, chk) {

};
B.ScrollingTable.prototype.setMaxSelectedRows = function (num) {
	this.maxSelectedRows = num;
	this.dataTable.style.cursor = (num == 0 ? "default" : "pointer");
};
B.ScrollingTable.prototype.setFooterMessage = function (txt) {
	if (txt == undefined) {
		var cnt = this.dataTable.rows.length;
		var h = cnt;
		if (cnt == 0) {
			h = "No";
		} else {
			h = B.format.COMMAS(cnt);
		}
		if (this.actualRowCount > cnt) {
			if (cnt == 0) {
				txt = "0";
			} else {
				txt = B.format.COMMAS(cnt);
			}
			txt += " of <span style='color:sienna;'>" + B.format.COMMAS(this.actualRowCount) + "</span> " + this.txt2;
		} else {
			txt = h + " " + (this.dataTable.rows.length == 1 ? this.txt1 : this.txt2);
		}
	}
	this.footerMessageDIV.innerHTML = txt;
};
B.ScrollingTable.prototype.getDataRow = function (rownum) {
	if (rownum == undefined) rownum = this.current.rownum;
	if (rownum > (this.dataTable.rows.length - 1)) return null;
	return this.dataset.getRow(rownum);
};
B.ScrollingTable.prototype.getRowValues = function (rownum) {
	if (rownum == undefined) rownum = this.current.rownum;
	if (rownum > (this.dataTable.rows.length - 1)) return null;
	return this.dataset.getRow(rownum).getValues();
};
B.ScrollingTable.prototype.prepareRow = function (dr, rownum) {
	var tr = document.createElement("tr");
	var tds = {};
	var h = "";
	for (var i = 0; i < this.columns.length; i++) {
		var tblcol = this.columns[i];
		h += "<td";
		var sty = "";
		if (rownum == 0 && this.dataTableBody.rows.length == 0) {
			sty += "width:" + tblcol.width + "px;";
		}
		if (tblcol.align != "left") sty += "text-align:" + tblcol.align + ";";
		if (tblcol.bold) sty += "font-weight:bold;";
		if (tblcol.wrap) sty += "word-wrap:break-word;white-space:normal;";
		var dcol = dr[tblcol.id];
		if (sty.length > 0) h += " style='" + sty + "'";
		h += ">" + (dcol == null ? "" : dcol.disp) + "</td>";
	}
	tr.innerHTML = h;
	for (var i = 0; i < this.columns.length; i++) {
		tds[this.columns[i].id] = tr.cells[i];
	}
	return { tr: tr, tds: tds };
};
B.ScrollingTable.prototype.updateRow = function (data) {
	// Remove the current row and replace with new
	this.dataset.data.splice(this.current.rownum, 1, data);
	var dr = this.getDataRow();
	var itm = this.prepareRow(dr, this.current.rownum);
	this.onBeforeRowRender(this.current.rownum, dr, itm.tr, itm.tds);
	var curTR = this.dataTableBody.rows[this.current.rownum];
	for (var i = 0; i < curTR.cells.length; i++) {
		itm.tr.cells[i].style.width = curTR.cells[i].style.width;
	}
	this.dataTableBody.insertBefore(itm.tr, curTR);
	this.dataTableBody.removeChild(curTR);
	return itm.tr;
};
B.ScrollingTable.prototype.setActualRowCount = function (rowcount) {
	this.actualRowCount = rowcount;
	this.setFooterMessage();
};
B.ScrollingTable.prototype.addRows = function (data, clear, actualCount) {
	if (clear) this.clear();
	var rows = data.split("\n");
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].length == 0) continue;
		this.dataset.addRows(rows[i]);
		var dr = this.dataset.getRow(this.dataset.data.length - 1);
		var itm = this.prepareRow(dr, i); // Contains a tr and a tds collection
		// Call the onbefore method on the Scrolling table object
		var rslt = this.onBeforeRowRender(this.dataTableBody.rows.length, dr, itm.tr, itm.tds);
		if (rslt == undefined) rslt = true;
		if (rslt) this.dataTableBody.appendChild(itm.tr);
	}
	if (actualCount != undefined) {
		this.actualRowCount = parseInt(actualCount, 10);
	}
	this.setFooterMessage();
	return this.dataset.data.length;
};
B.ScrollingTable.prototype.pick = function (row, cell, wasRow) {
	this.unpick();
	//var initialRowNumber = this.current.rownum;
	for (var key in this.footer.buttons) {
		if (this.footer.buttons[key].watchpick) this.footer.disableButton(key);
	}
	if (isNaN(row)) {
		this.current.rownum = row.rowIndex;
	} else {
		if (row > (this.dataTableBody.rows.length - 1)) return;
		this.current.rownum = row;
		row = this.dataTableBody.rows[row];
	}
	if (cell == undefined) cell = 0;
	if (isNaN(cell)) {
		this.current.cellnum = cell.cellIndex;
	} else {
		this.current.cellnum = cell;
		if (row) cell = row.cells[cell];
	}
	if (B.isOneOf(this.highlightItem, ",TR,ROW,TRTD,BOTH")) {
		if (row) B.addClass(row, "picked");
	}
	if (B.isOneOf(this.highlightItem, "TD,CELL,COLUMN,TRTD,BOTH")) {
		if (row) B.addClass(cell, "picked");
	}
	for (var key in this.footer.buttons) {
		if (this.footer.buttons[key].watchpick) this.footer.enableButton(key);
	}
	var isDiff = true;
	if (wasRow != undefined) isDiff = (row.rowIndex != wasRow);
	if (row) {
		var rd = this.getDataRow(row.rowIndex);
		this.onclick(this.dataTable, row, cell, row.rowIndex, cell.cellIndex, rd, isDiff);
		var rslt = this.onDetailRender(row.rowIndex, rd);
		if (rslt == undefined) rslt = "";
		if (B.trim(rslt) != "") {
			this.setDetails(rslt);
		}
		return row;
	}
};
B.ScrollingTable.prototype.unpick = function () {
	for (var key in this.footer.buttons) {
		if (this.footer.buttons[key].watchpick) this.footer.disableButton(key);
	}
	if (this.current.rownum >= 0) {
		var tr = this.dataTable.rows[this.current.rownum];
		B.removeClass(tr, "picked");
		if (this.current.cellnum >= 0) {
			if (tr != undefined) B.removeClass(tr.cells[this.current.cellnum], "picked");
		}
	}
	this.current.rownum = -1;
	this.current.cellnum = -1;
	var rslt = this.onDetailRender(-1, null);
	if (rslt == undefined) rslt = "";
	if (rslt == "") rslt = "&nbsp;";
	//if (B.trim(rslt) != "") {
	this.setDetails(rslt);
	//}
};
B.ScrollingTable.prototype.clear = function () {
	this.unpick();
	this.current.rownum = -1;
	this.current.cellnum = -1;
	this.dataset.data = [];
	this.actualRowCount = 0;
	this.dataTableBody.innerHTML = "";
	this.setFooterMessage();
	var rslt = this.onDetailRender(-1, null);
	if (rslt == undefined) rslt = "";
	if (B.trim(rslt) != "") {
		this.setDetails(rslt);
	}
};
B.ScrollingTable.prototype.freeze = function (txt) {
	if (txt == undefined) txt = "Please wait...";
	this.frozen = true;
	this.surround.style.background = B.stripeCSS("azure,aliceblue");
	// Clean up just in case
	if (this.freezeData.timer != null) {
		try {
			clearInterval(this.freezeData.timer);
		} catch (e) { };
		this.freezeData.timer = null;
	}
	if (this.freezeData.element != null) {
		this.surround.removeChild(this.freezeData.element);
		this.freezeData.element = null;
	}
	this.freezeData.freezeStart = null;
	this.freezeData.timerSpan = null;

	this.freezeData.element = document.createElement("div");
	this.freezeData.element.style.cssText = "position:relative;width:100%;text-align:center;vertical-align:middle";
	//this.freezeData.element.style.display = "table"; // This allows the table below to be veritically aligned
	var img = B.imgObject("SPINNER");
	img.style.width = "1.5em";
	var tbl = document.createElement("table");
	tbl.style.cssText = "margin:0 auto;margin-top:1.1em; background-color:gainsboro;padding:.6em;border-radius:.6em;box-shadow: 3px 3px 15px grey;";
	$(tbl).fadeTo(0, .7);
	var tr = tbl.insertRow();
	var td = tr.insertCell(-1);
	td.style.cssText = "text-align:center;";
	td.appendChild(img);
	td.appendChild(document.createElement("br"));
	var tspn = document.createElement("span");
	tspn.innerHTML = "&nbsp;";
	tspn.style.color = "blue";
	tspn.style.fontSize = ".7em";
	td.appendChild(tspn);
	td = tr.insertCell(-1);
	td.style.cssText = "padding-left:1em;vertical-align:top";
	td.innerHTML = txt;
	this.freezeData.timerSpan = tspn;
	this.freezeData.element.appendChild(tbl);
	this.surround.appendChild(this.freezeData.element);
	// Set up a timer
	this.freezeData.freezeStart = new Date();
	this.freezeData.timer = setInterval($.proxy(function () {
		var et = B.format.ELAPSE(this.freezeData.freezeStart, new Date());
		this.freezeData.timerSpan.innerHTML = " " + et;
	}, this), 1005);

	for (var key in this.footer.buttons) {
		this.footer.drawButton(key);
	}
};
B.ScrollingTable.prototype.thaw = function () {
	this.frozen = false;
	this.surround.style.background = "";

	if (this.freezeData.timer != null) {
		try {
			clearInterval(this.freezeData.timer);
		} catch (e) { };
		this.freezeData.timer = null;
	}
	if (this.freezeData.element != null) {
		this.surround.removeChild(this.freezeData.element);
		this.freezeData.element = null;
	}
	this.freezeData.freezeStart = null;
	this.freezeData.timerSpan = null;

	for (var key in this.footer.buttons) {
		this.footer.drawButton(key);
	}
};
B.ScrollingTable.prototype.getSortColumn = function () {
	var rslt = { col: this.sortColumn, dir: this.sortDirection };
	return rslt;
};
B.ScrollingTable.prototype.setSortColumn = function (id, dir) {
	if (this.frozen) return;
	if (dir != undefined) {
		if (dir == "A") dir = "ASC";
		if (dir == "D") dir = "DESC";
	}
	// Turn off any existing column
	if (this.sortColumn != "") {
		cell = document.getElementById(this.rootId + "_HEADER_" + this.sortColumn);
		if (cell != null) {
			B.removeClass(cell, "sorted");
		}
	}
	if (id == this.sortColumn) {
		if (dir == undefined) { // Toggle it
			if (this.sortDirection == "ASC") {
				this.sortDirection = "DESC";
			} else {
				this.sortDirection = "ASC";
			}
		}
	} else {
		if (dir == undefined) {
			//this.sortDirection = "A"; // Leave it where it was
		} else {
			this.sortDirection = dir;
		}
	}
	B.removeClass(this.header, "sortASC");
	B.removeClass(this.header, "sortDESC");
	B.addClass(this.header, "sort" + this.sortDirection);
	var cell = document.getElementById(this.rootId + "_HEADER_" + id);
	if (cell != null) {
		B.addClass(cell, "sorted");
		this.sortColumn = id;
	}
};