it.regions = {
	junction: document.getElementById('left_column'),
	resources: document.getElementById('middle_column'),
	log: document.getElementById('right_column')
}

it.tooltip = new function () {
	var current_text;
	var tooltip = this;
	
	tooltip.node = H.e('div', it.regions.resources, 'tooltip');
	tooltip.head = H.e('div', tooltip.node, 'tooltip_heading');
	tooltip.body = H.e('div', tooltip.node, 'tooltip_body');
	
	tooltip.show = function (e, t, h) {
		if (t) current_text = t;
		if (!h) h = '';
		tooltip.head.innerHTML = H.c(h);
		tooltip.body.innerHTML = H.c(current_text);
		if (e) {
			tooltip.node.style.display = 'block'
		}
	}
	
	tooltip.update = function () {
		if (tooltip.node.style.display == 'block') tooltip.body.innerHTML = H.c(current_text)
	}
	
	it.each_tick.add_result(tooltip.update);
	
	tooltip.hide = function () {
		tooltip.node.style.display = 'none';
	}
}

it.junction = new function () {
	var junction = this;
	
	junction.tabs = {}
	
	junction.node = H.e('div', it.regions.junction, 'junction');
	junction.node.header = H.e('div', junction.node, 'junction_header');
	junction.node.content = H.e('div', junction.node, 'junction_body');
	junction.node.body = [];
	junction.node.body.push(H.e('div', junction.node.content, 'junction_body_left'));
	junction.node.body.push(H.e('div', junction.node.content, 'junction_body_right'));
	
	var showing = [false, false], kludge = H.e('div', junction.node.header, 'float_kludge');
	
	junction.add_tab = function (new_tab) {
		junction.tabs[new_tab.id] = new_tab;
		junction.node.header.removeChild(kludge);
		junction.node.header.appendChild(new_tab.node.button);
		junction.node.header.appendChild(kludge);
	}
	
	junction.add_node = function (element, need_update, tab_name, section_name) {
		junction.tabs[tab_name].add_node(element, need_update, section_name)
	}
	
	junction.alert_tab = function (tab, off) {
		var target = junction.tabs[tab];
		if (!off) if (showing.indexOf(target)==-1) target.alert(true);
		else target.alert(false);
	}
	
	junction.unlock = function (tab, section) {
		junction.tabs[tab].show();
		if (section) junction.tabs[tab].sections[section].show();
	}
	
	junction.show = function (tab, side) {
		var x = Math.abs(side-1), i;
		if (showing[x]==tab) showing[x] = false;
		if (showing[side]) {
			showing[side].highlight(false)
		}
		junction.node.body[side].innerHTML = '';
		tab.update();
		junction.node.body[side].appendChild(tab.node);
		tab.highlight(true);
		showing[side] = tab
	}
	
	function update() {
		var i;
		for (i in showing) {
			if (showing[i]) showing[i].update()
		}
	}
	
	it.each_tick.add_result(update)	
	
}

it.construct_tab = function (args) {
	var tab = {
		name: args.name,
		
		id: args.id,
		
		node: H.e('div', false, 'tab_body'),
		
		sections: {},
		
		show: function () {
			tab.node.button.style.display='block';
			tab.shown = 1;
		},
		
		updates: [],
		
		update: function () {
			var i;
			for (i in tab.updates) {
				tab.updates[i].update();
			}
		},
		
		add_node: function (new_element, need_update, section) {
			if (need_update) tab.updates.push(new_element);
			if (section) tab.sections[section].node.body.appendChild(new_element.node);
			else tab.node.appendChild(new_element.node)
		},
		
		highlight: function (t) {
			if (t) tab.node.button.className = 'tab_header tab_header_select';
			else tab.node.button.className = 'tab_header'
		},
		
		alert: function (on) {
			if (on) H.add_class(tab.node.button, 'tab_header_alert');
			else H.remove_class(tab.node.button, 'tab_header_alert');
		}
		
	}
	
	tab.node.button = H.e('div', false, 'tab_header', tab.name);
	
	if (args.sections) {
		for (i in args.sections) {
			it.section(args.sections[i], tab);
		}
	}
	
	function select_me (e) {
		it.junction.show(tab, e.shiftKey ? 1 : 0)
	}
	tab.node.button.addEventListener('click', select_me);
	
	if (args.show) tab.show();
	it.junction.add_tab(tab)
	
}

it.section = function (args, tab) {
	var section = {
		
		name: args.name,
		
		id: args.id,
		
		node: H.e('div', tab.node, 'section'),
		
		show: function () {
			section.node.style.display = 'block';
			section.shown = 1;
		},
		
		toggle_collapse: function () {
			section.collapsed = !section.collapsed;
			section.node.body.style.display = section.collapsed ? 'none' : 'block';
			section.node.collapse_button.innerHTML = section.collapsed ? '+' : '-';
		},
		
		collapsed: false
	}
	
	section.node.heading = H.e('div', section.node, 'section_header', section.name);
	section.node.body = H.e('div', section.node);
	section.node.collapse_button = H.e('div', section.node.heading, 'section_button', '-');
	
	section.node.collapse_button.addEventListener('click', section.toggle_collapse);
	
	if (args.show) section.show();
	
	tab.sections[section.id] = section;
}

it.construct_ui = function (node, args) {
	
	if (!args) args = {};
	
	node.it = {
		heading_element: H.e('div', node, 'node_heading'),
		
		line: H.e('div', node, 'node_first_line'),
		
		footer: H.e('div', node, 'node_footer'),
		
		pinned: false,
		
		click_pin: function (e) {
			if (node.it.pinned) {
				node.it.pinned = false;
				node.it.lock.style.color = '#000';
			} else {
				node.it.pinned = true;
				node.it.lock.style.color = '#fff';
			}
		},
		
		heading_content: [],
		
		body_content: [],
		
		interval: false,
		
		current_height: -45,
		
		add: function (new_element, type, position) {
			
			if (!type) type='body';
			
			var content = node.it[type + '_content'];
			
			if (typeof(position)=='number'&&position<content.length) {
				content.splice(position, 0, new_element);
			}
			else content.push(new_element);
			
			node.it.draw(type);
			
		},
	
		remove: function (old_element, type) {
			if (!type) type='body';
			
			var content = node.it[type + '_content'];
			
			var k = content.indexOf(old_element);
			if (k==-1) return;
			content.splice(k, 1);
			
			node.it.draw(type)
		},
		
		draw: function (type) {
			var content = node.it[type + '_content'];
			var element = (type=='heading' ? node.it.heading_element : node)
			
			element.innerHTML = '';
			if (type!='heading') {
				element.appendChild(node.it.heading_element);
				element.appendChild(node.it.line);
			}
			
			var i;
			for (i=0; i<content.length; i++) element.appendChild(content[i]);
				
			if (type!='heading') element.appendChild(node.it.footer);
		},
		
		expand: function () {
			if (node.it.current_height >= node.scrollHeight) clearInterval(node.it.interval);
			else {
				node.it.current_height += 3;
				node.style.height = Math.max(23, node.it.current_height)
			}
		},
		
		contract: function () {
			if (node.it.current_height <= -45) {
				clearInterval(node.it.interval);
				node.it.revealed = false;
			} else {
				node.it.current_height -= 3;
				node.style.height = Math.max(23, node.it.current_height)
			}
		},
		
		mouseover: function () {
			node.it.revealed = true;
			clearInterval(node.it.interval);
			node.it.interval = setInterval(node.it.expand, 20);
		},
		
		mouseout: function () {
			clearInterval(node.it.interval);
			if (!node.it.pinned) node.it.interval = setInterval(node.it.contract, 20);
		},
		
		update: function () {
			if (node.style.display == 'none') return;
			var i;
			for (i=0; i<node.it.heading_content.length; i++) if (node.it.heading_content[i].update) node.it.heading_content[i].update();
			if (node.it.revealed) for (i=0; i<node.it.body_content.length; i++) if (node.it.body_content[i].update) node.it.body_content[i].update();
		},
		
		show: function () {
			node.style.display = 'block';
		},
		
		hide: function () {
			node.style.display = 'none';
		}
		
	}
	
	if (!args.no_contract) {
		node.it.lock = H.e('div', node.it.line, 'node_lock_button', '&#128274;&#65038;');
		node.addEventListener('mouseover', node.it.mouseover);
		node.addEventListener('mouseout', node.it.mouseout);
		node.it.lock.addEventListener('click', node.it.click_pin);
		if (args.pinned) {
			node.it.current_height = node.scrollHeight;
			node.style.height = Math.max(23, node.it.current_height);
			node.it.pinned = true;
			node.it.lock.style.color = '#fff';
		}
	} else {
		node.style.height = 'auto';
		node.it.revealed = true;
	}
	
}

it.add_dropdown = function (obj, id, args) {
	
	var dropdown = {
		id: id,
		parent: obj,
		name: args.name,
		show_in: args.show_in
	}
	
	if (!obj.dropdowns) obj.dropdowns = {};
	
	obj.dropdowns[id] = dropdown;
	
	dropdown.ui = {}
	dropdown.ui.container = H.e('div', dropdown.show_in, 'dropdown');
	dropdown.ui.label = H.e('div', dropdown.ui.container, 'dropdown_text', dropdown.name);
	dropdown.ui.button = H.e('div', dropdown.ui.container, 'dropdown_button', 'Select One');
	dropdown.ui.menu = H.e('div', dropdown.ui.container, 'dropdown_menu');
	
	dropdown.options = {}
	
	dropdown.add_option = function (id, name, condition) {
		var new_option = {
			id: id,
			name: name,
			node: H.e('div', dropdown.ui.menu, 'dropdown_option', name),
			highlight: function () {H.add_class(new_option.node, 'dropdown_selected')},
			unhighlight: function () {H.remove_class(new_option.node, 'dropdown_selected')},
			click: function () {
				dropdown.selected = id;
			},
			condition: condition
		}
		new_option.node.addEventListener('mouseouver', new_option.highlight);
		new_option.node.addEventListener('mouseout', new_option.unhighlight);
		new_option.node.addEventListener('click', new_option.click);
		dropdown.options[id] = new_option;
		if (dropdown.parent[dropdown.id] == id) dropdown.selected = id;
	}
	
	dropdown.show_menu = function (e) {
		e.stopPropagation();
		for (i in dropdown.options) {
			if (dropdown.options[i].condition&&!dropdown.options[i].condition()) dropdown.options[i].node.style.display = 'none';
			else dropdown.options[i].node.style.display = 'block';
		}
		dropdown.ui.menu.style.display = 'block';
	}
	dropdown.hide_menu = function () {
		dropdown.ui.menu.style.display = 'none';
	}
	
	dropdown.ui.button.addEventListener('click', dropdown.show_menu)
	document.getElementById('game_page').addEventListener('click', dropdown.hide_menu)
	
	var i;
	for (i in args.options) {
		dropdown.add_option(args.options[i].id, args.options[i].name, args.options[i].condition)
	}
	
	Object.defineProperty(dropdown, 'selected', {
		get: function () {return dropdown.parent[id]},
		set: function (v) {
			if (!v) {
				dropdown.ui.button.innerHTML = 'Select One'
				dropdown.parent[id] = false;
			} else {
				dropdown.ui.button.innerHTML = dropdown.options[v].name;
				dropdown.parent[id] = v;
			}
		}
	})
	
	if (dropdown.parent[id]) dropdown.selected = dropdown.parent[id];
	
	if (!args.no_save) Object.defineProperty(dropdown.parent.save_parameters, 'dropdown_'+id, {
		get: function () {return dropdown.selected},
		set: function (x) {if (x) dropdown.parent[id] = x},
		enumerable: true
	})

}

it.add_spinner = function (obj, id, args) {
	
	var spinner = {
		id: id,
		parent: obj,
		name: args.name,
		show_in: args.show_in,
		click_value: args.click_value||1,
		shift_click_value: args.shift_click_value||5
	}
	
	var min = args.min, max = args.max;
	
	if (!obj.spinners) obj.spinners = {}
	
	obj.spinners[id] = spinner;
	
	spinner.ui = {}
	spinner.ui.container = H.e('div', spinner.show_in, 'spinner');
	spinner.ui.label = H.e('div', spinner.ui.container, 'spinner_text', spinner.name + ': 0');
	spinner.ui.plus = H.e('div', spinner.ui.container, 'spinner_plus', '+');
	spinner.ui.minus = H.e('div', spinner.ui.container, 'spinner_minus', '-');
	
	spinner.plus_click = function (e) {
		var n = (e.shiftKey ? spinner.shift_click_value : spinner.click_value);
		var x = spinner.value + n;
		if (typeof(spinner.max)=='number' && x > spinner.max) x = spinner.max;
		spinner.value = x;
	}
	
	spinner.minus_click = function (e) {
		var n = (e.shiftKey ? spinner.shift_click_value : spinner.click_value);
		var x = spinner.value - n;
		if (typeof(spinner.min)=='number' && x < spinner.min) x = spinner.min;
		spinner.value = x;
	}
	
	spinner.ui.plus.addEventListener('click', spinner.plus_click);
	spinner.ui.minus.addEventListener('click', spinner.minus_click);
	
	Object.defineProperties(spinner, {
		value: {
			get: function () {return spinner.parent[id]},
			set: function (v) {
				spinner.parent[id] = v;
				spinner.ui.label.innerHTML = spinner.name + ': ' + v;
			}
		},
		min: {
			get: function () {return min},
			set: function (v) {
				min = v;
				if (spinner.value<v) spinner.value=min
			}
		},
		max: {
			get: function () {return max},
			set: function (v) {
				max = v;
				if (spinner.value>v) spinner.value=max
			}
		}
	})
	
	value = parent[id] || args.min || 0;
		
	Object.defineProperty(spinner.parent.save_parameters, 'spinner_'+id, {
		get: function () {return spinner.value},
		set: function (x) {if (x) spinner.value = x},
		enumerable: true
	})
	
}

it.add_button_animation = function (obj) {

	var animate_timer
	function on_animate () {H.add_class(obj, 'rev_grad')}
	function on_finish () {H.remove_class(obj, 'rev_grad')}
	
	H.add_class(obj, 'grad_fill');
	obj.animate = function () {
		on_animate();
		clearTimeout(animate_timer);
		animate_timer = setTimeout(on_finish, 50);
	}
}

var i;
for (i in data.tabs) {
	it.construct_tab(data.tabs[i])
}