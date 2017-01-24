H.add_action(it, 'new_game');

it.clock = new function () {
	
	var ticks, clock = this;
	
	clock.id = 'clock';
	clock.aut = 1;
	clock.tick_fragments = 0;
	clock.ticks_this_aut = 0;
	clock.atoms = [];
	clock.tick_list = [];
	
	H.add_action(clock, 'start_time');
	
	H.time_moving = false;
	
	var fps = 4;
	Object.defineProperty(clock, 'fps', {
		get: function () {return fps},
		set: function (v) {
			clock.stop();
			fps = v;
			clock.start();
		}
	})
	
	clock.register_tick = function (id, target, variant) {
		var tick_name;
		if (!target) target = 'value';
		if (variant) tick_name = variant + '_tick'; else tick_name = 'tick';
		clock.tick_list.push({id: id, target: target, tick_name: tick_name});
		var new_atom = {type: tick_name, target: id, order: 999, func: function (x) {return x * clock.tick_amount}}
		clock.atoms.push(new_atom);
		H.apply_atom(new_atom);
	}
	
	H.add_cvar(clock, 'aut_length', 1800);
	H.add_cvar(clock, 'dilation', 1);
	
	var random_adjuster = {
		target: 'clock',
		type: 'dilation',
		order: 700,
		func: function (x) {return x * dilation_roll}
	}
	
	var dilation_roll = H.g(1, 1/8);
	Object.defineProperty(clock, 'dilation_roll', {
		get: function () {return dilation_roll},
		set: function (v) {
			dilation_roll = v;
			it.cvars.dilation.clock.compute_value();
		}
	})
	
	it.cvars.dilation.clock.add_atom(random_adjuster);
			
	var adjust_for_fps = H.atom('clock', 'aut_length', 10, function (x) {return x * fps})
	function calculate_tick_amount () {
		clock.tick_amount = 1 / clock.aut_length
	}
	function calculate_time_adjustment () {
		clock.time_adjustment = clock.aut_length * clock.dilation / fps
	}
			
	it.cvars.aut_length.clock.add_atom(adjust_for_fps);
	it.cvars.aut_length.clock.update.add_result(calculate_tick_amount);
	it.cvars.aut_length.clock.update.add_result(calculate_time_adjustment);
	it.cvars.dilation.clock.update.add_result(calculate_time_adjustment);
	calculate_tick_amount();
	calculate_time_adjustment();
	
	clock.node = H.e('div', it.regions.log, 'clock');
	clock.node.text = H.e('div', clock.node, 'clock_text');
	
	H.add_action(clock, 'check_time');
	function check_time (args) {
		args.time = 1 - (clock.ticks_this_aut + clock.tick_fragments) / clock.aut_length;
		if (args.time<0) aut();
	}
	clock.check_time.add_result(check_time, 101);
	
	function tick () {
		var num_ticks = 1 / clock.dilation;
		if (clock.last_time) {
			var new_time = new Date().getTime();
			var time_elapsed = new_time - clock.last_time;
			num_ticks = time_elapsed / 1000 / clock.dilation * fps;
			clock.last_time = new_time;
		} else {
			clock.last_time = new Date().getTime();
		}
		clock.tick_fragments += num_ticks;
		while (clock.tick_fragments>=1) {
			it.each_tick();
			var i, obj;
			for (i in clock.tick_list) {
				obj = it.ids[clock.tick_list[i].id]
				obj[clock.tick_list[i].target] += obj[clock.tick_list[i].tick_name];
			}
			clock.ticks_this_aut++;
			clock.tick_fragments--;
		}
		clock.check_time();
	}
	
	function aut () {
		clock.aut ++;
		var i;
		clock.ticks_this_aut = 0;
		it.each_aut();
		clock.dilation_roll = H.g(1, 1/8);
		H.save_game();
	}
	
	clock.start = function () {
		clock.last_time = new Date().getTime();
		clock.start_time();
		H.time_moving = true;
		H.update_all_cvars({clock_start: true});
		ticks = setInterval(tick, 1000/fps)
	}
	
	clock.stop = function () {
		H.time_moving = false;
		clearInterval(ticks)
	}
	
	clock.save_id = 'clock'
	clock.save_parameters = {}
	Object.defineProperties (clock.save_parameters, {
		ticks_this_aut: {
			get: function () {
				return clock.ticks_this_aut
			},
			set: function (x) {
				clock.ticks_this_aut = x
			},
			enumerable: true
		},
		dilation_roll: {
			get: function () {
				return dilation_roll;
			},
			set: function (x) {
				clock.dilation_roll = x
			},
			enumerable: true
		},
		aut: {
			get: function () {
				return clock.aut
			},
			set: function (x) {
				clock.aut = x
			},
			enumerable: true
		},
		last_time: {
			get: function () {
				return clock.last_time
			},
			set: function (x) {
				clock.last_time = false
			},
			enumerable: true
		}
	})
	
	H.register_for_save(clock);
	
}

it.dosh = {}

Object.defineProperties(it.dosh, {
	consider: {
		value: function (cost_object) {
			
			if (H.cheat_like_fuck) {
				return {
					pay: function () {},
					format: 'Cheating'
				}
			}
			
			var price = {}, format = '', result = {}, cant_pay = false;
			var i, j;
			
			for (i in cost_object.cost) {
				price[i] = cost_object.cost[i]
				if (!it.dosh[i]) console.log('Dosh not found: ' + i); //debugging
			}
			
			if (cost_object.paid) {
				for (i in cost_object.paid) {
					if (price[i]) price[i] -= cost_object.paid[i]
					if (price[i]<0) price[i]=0;
				}
			}
			
			if (cost_object.installments) {
				var r = cost_object.installments.max - cost_object.installments.made;
				if (r>0) {
					for (i in price) {
						price[i] /= r
					}
				}
			}
			
			for (i in price) {
				price[i] = Math.max(0,Math.ceil(price[i]))
			}
			
			var unpaid = {};
			for (i in price) {
				if (price[i]>0) {
					unpaid[i] = price[i] - it.dosh[i].value;
					var u = (unpaid[i]>0)
					if (it.dosh[i].format) {
						format += it.dosh[i].format(price[i], u)
					} else {
						format += it.dosh[i].name + ' ' + (u ? '<span class=\'resource_warn_bright\'>' : '') + price[i] + (u ? '</span>' : '')
					}
					format += ', ';
					if (u) cant_pay = true;
				}
			}
			
			if (format.length>0) {
				format = format.substring(0, format.length - 2);
				if (cost_object.installments&&cost_object.installments.max>1) {
					format += ' (Part ' + (cost_object.installments.made + 1) + '/' + cost_object.installments.max + ')';
				}
			}
			else format = 'Nothing';
			
			
			function cant_pay_result() {
				return {
					cant_pay: true,
					format: format,
					pay: function () {
						console.log('Hey, you called pay despite not being able to pay, that\'s not right')
					}
				}
			}
			
			function normal_pay_result () {
				var result = {
					format: format,
					pay: function () {
						var is_paid = true;
						for (i in price) {
							if (!cost_object.paid) cost_object.paid = {};
							if (!cost_object.paid[i]) cost_object.paid[i]=0;
							cost_object.paid[i] += price[i];
							it.dosh[i].value -= price[i];
							if (cost_object.cost[i] >cost_object.paid[i]) is_paid = false;
						}
						if (cost_object.installments) {cost_object.installments.made += 1};
						if (is_paid) result.is_paid = true;
					}
				}
				return result
			}
			
			if (!cost_object.substitutions) {
				if (cant_pay) return cant_pay_result();
				else return normal_pay_result();
			}
			
			var subs = {}, sub_made = false;
			cant_pay = false;
			
			for (i in unpaid) {
				if (unpaid[i]>0) {
					if (cost_object.substitutions[i]) {
						sub_made = true;
						for (j in cost_object.substitutions[i]) {
							if (!subs[j]) subs[j]=0;
							subs[j] = Math.ceil(unpaid[i]/cost_object.substitutions[i][j]);
							if (!subs[i]) subs[i]=0;
							subs[i] -= subs[j] * cost_object.substitutions[i][j];
							sub_made = true;
						}
					} else {
						cant_pay = true
					}
				}
			}
			
			if (cant_pay) return cant_pay_result();
			if (!sub_made) return normal_pay_result();
			
			var price_s = H.d(price);
						
			for (i in subs) {
				if (!price_s[i]) price_s[i] = 0;
				price_s[i] += subs[i];
				if (price_s[i]<0) price_s[i] = 0;
			}			
			
			var format_s = format + '<br>Buy now: ';
			var can_sub = true;
			for (i in price_s) {
				if (price_s[i]) {
					if (price_s[i]>it.dosh[i].value) {
						return cant_pay_result();
					}
					else format_s += it.dosh[i].format ? it.dosh[i].format(price_s[i]) : it.dosh[i].name + ' ' + price_s[i] + ', ';
				}
			}
			
			format_s = format_s.substring(0, format_s. length - 2)
			if (cost_object.installments&&cost_object.installments.max>1) {
				format_s += ' (Part ' + (cost_object.installments.made + 1) + '/' + cost_object.installments.max + ')';
			}
			
			result = {
				format: format_s,
				had_substitution: true,
				pay: function () {
					var is_paid = true;
					for (i in price) {
						if (!cost_object.paid) cost_object.paid = {};
						if (!cost_object.paid[i]) cost_object.paid[i] = price[i];
						if (cost_object.cost[i] >cost_object.paid[i]) is_paid = false;
					}
					for (i in price_s) {
						it.dosh[i].value -= price_s[i];
					}
					if (cost_object.installments) {cost_object.installments.made += 1};
					if (is_paid) result.is_paid = true;
				}
			}
			return result;
			
		}
	},
	format: {
		value: function (amount) {
			var i, r = '', a={};
			
			for (i in amount) a[i] = Math.round(amount[i]);
			
			
			for (i in a) {
				if (a[i]>0) {
					if (it.dosh[i].format) {
						r += it.dosh[i].format(a[i])
					} else {
						r += it.dosh[i].name + ' ' + a[i]
					}
					r += ', ';
				}
			}
			
			if (r.length>0) r = r.substring(0, r.length - 2);
			else r = 'Nothing';
			return r
			
		}
	},
	appreciate: {
		value: function (r) {
			var gain = {}, format = '', i;
			for (i in r) {
				gain[i] = Math.floor(it.dosh[i].value + r[i]) - Math.floor(it.dosh[i].value);
				format += it.dosh[i].name + ' ' + gain[i] + ', '
			}
			format = format.substring(0, format.length - 2)
			return {
				gain: function () {
					var i;
					for (i in gain) {
						it.dosh[i].value += gain[i]
					}
				},
				format: format
			}
		}
	},
	
	register: {
		value: function (x) {
			it.dosh[x.id] = x
		}
	}
})


it.log = new function () {
	var log = this;
	
	log.logs = {}
	
	var showing = false;
	
	log.node = H.e('div', it.regions.log, 'log');
	log.node.header = H.e('div', log.node, 'log_header');
	log.node.body = H.e('div', log.node, 'log_body');
	var kludge = H.e('div', log.node.header, 'float_kludge');
	
	log.add_tab = function (new_tab) {
		log.logs[new_tab.id] = new_tab;
		log.node.header.removeChild(kludge);
		log.node.header.appendChild(new_tab.node.header);
		log.node.header.appendChild(kludge);
	}
	
	log.show = function (x) {
		if (showing) {
			showing.highlight = false;
			log.node.body.removeChild(showing.node.body)
		}
		log.node.body.appendChild(x.node.body);
		x.highlight = true;
		showing = x
	}
	
	log.add = function (message, type) {
		if (!H.time_moving) return;
		var i;
		if (it.clock.format_time) {
			message = '<span class=\'strong\'>' + it.clock.aut + ':' + it.clock.format_time + '</span> - '+ '<span class=\'log_line_' + type + '\'>' + message + '</span>';
		} else {
			message = '<span class=\'log_line_' + type + '\'>' + message + '</span>';
		}
		for (i in log.logs) {
			log.logs[i].add (message, type)
		}
	}
}

it.save_station = new function () {
	var station = this;
	
	station.node = H.e('div', it.regions.log, 'locked_node');
	station.node.style.display = 'block';
	station.node.style.borderTop = '1px solid black';
	it.construct_ui (station.node);
	station.ui = station.node.it;
	var ui = {}
	
	ui.name = H.e('td', 0, 'node_title', 'Console');
	ui.save_button = H.e('td', 0, 'node_button node_button_wide', 'Save');
	ui.import_button = H.e('div', 0, 'node_inline_button', 'Import');
	ui.export_button = H.e('div', 0, 'node_inline_button', 'Export');
	ui.import_button.style.width = '90%';
	ui.export_button.style.width = '90%';
	
	var import_box = H.e('div', document.body, 'import_box');
	var import_control = H.e('textarea', import_box, 'import_text');
	var import_button = H.e('div', import_box, 'import_button', 'Import');
	var close_import = H.e('div', import_box, 'import_close', 'X');
	
	var export_box = H.e('div', document.body, 'import_box');
	var export_control = H.e('textarea', export_box, 'import_text');
	var close_export = H.e('div', export_box, 'import_close', 'X');
	export_control.readOnly = true;
	
	var next_auto_save = 1/30;
	function autosave_tick () {
		next_auto_save -= it.clock.tick_amount;
		if (next_auto_save<=0) {
			next_auto_save= 1/30;
			H.save_game();
			console.log('Autosaved');
		}
	}
	it.each_tick.add_result(autosave_tick, 999)
	
	station.ui.add(ui.name, 'heading');
	station.ui.add(ui.save_button, 'heading');
	station.ui.add(ui.import_button);
	station.ui.add(ui.export_button);
	
	function show_import () {
		import_box.style.display = 'block';
	}
	
	function do_import () {
		new_save = import_control.value;
		if (new_save.length==0) return;
		H.replace_save(new_save);
	}
	
	function show_export () {
		export_box.style.display = 'block';
		H.save_game();
		export_control.value = it.export_text;
		export_control.select();
	}
	
	function close_boxes () {
		import_box.style.display = 'none';
		export_box.style.display = 'none';
	}
	
	ui.import_button.addEventListener('click', show_import);
	import_button.addEventListener('click', do_import);
	close_import.addEventListener('click', close_boxes);
	
	ui.export_button.addEventListener('click', show_export);
	close_export.addEventListener('click', close_boxes);
	
	ui.save_button.addEventListener('click', H.save_game)
	
}

it.starchart = new function () {
	var starchart = this;
	starchart.node= H.e('div', false, 'starchart')
	var background = H.e('canvas', starchart.node, 'starchart_backdrop')
	var canvas = H.e('canvas', starchart.node, 'starchart_canvas')
	
	var radius = it.regions.junction.offsetWidth / 4 - 20;
	background.width = radius * 2;
	background.height = radius * 2;
	canvas.width = radius * 2;
	canvas.height = radius * 2;
	starchart.node.style.height = radius*2+10;
	
	var seventh = Math.PI * 2/7
	
	starchart.draw_background = function () {
		
		var seventh = Math.PI * 2 / it.heavens.foresight
		var brush = background.getContext('2d');
		brush.beginPath();
		brush.clearRect(0, 0, background.width, background.height)
		brush.arc(radius, radius, radius*.1, 0, 2*Math.PI);
		brush.strokeStyle = '#888';
		brush.stroke();
		
		brush.moveTo(radius, radius*1.1);
		brush.lineTo(radius, radius*2);
		brush.stroke();
		
		brush.moveTo(radius*.1*Math.sin(seventh) + radius, radius*.1 * Math.cos(seventh) + radius);
		brush.lineTo(radius*Math.sin(seventh) + radius, radius*Math.cos(seventh) + radius);
		brush.stroke();
	}
		
	starchart.update = function () {
		starchart.draw();
	}
	
	it.junction.add_node(starchart, true, 'heavens', 'starchart');
	
	starchart.draw = function () {
		
		var i, max=0;
		var seventh = Math.PI * 2 / it.heavens.foresight
		
		for (i in it.deities) {
			if (it.deities[i].ascension>max) max = it.deities[i].ascension;
		}
		max = 2/3*max + 1000/3
		
		var brush = canvas.getContext('2d');
		brush.beginPath();
		brush.clearRect(0, 0, canvas.width, canvas.height)
			
		var i;
		for (i in it.heavens.coming_signs) {
			if (it.heavens.coming_signs[i].placement<it.heavens.foresight) {
				brush = canvas.getContext('2d');
				var angle = (it.heavens.coming_signs[i].placement);
				angle *= seventh;
				var length = ((1 - it.heavens.coming_signs[i].deity.ascension/max) * .7 + .2) * radius
				var s = {
					x: Math.sin(angle) * radius * .1 + radius,
					y: Math.cos(angle) * radius * .1 + radius
				}
				var e = {
					x: Math.sin(angle) * length + radius,
					y: Math.cos(angle) * length + radius
				}
				brush.moveTo(s.x, s.y);
				brush.lineTo(e.x, e.y);
				brush.strokeStyle = '#888';
				brush.stroke();
				it.heavens.coming_signs[i].node.style.left = e.x-15;
				it.heavens.coming_signs[i].node.style.top = e.y-15;
				it.heavens.coming_signs[i].node.style.display = 'block';
			}
		}
		
		if (it.heavens.omen.state=='sky') {
			brush = canvas.getContext('2d');
			var angle = (it.heavens.omen.time*10 - it.heavens.foresight) * seventh;
			var length = it.heavens.omen.radius * radius;
			var s = {
				x: Math.sin(angle) * radius * .1 + radius,
				y: Math.cos(angle) * radius * .1 + radius
			}
			var e = {
				x: Math.sin(angle) * length + radius,
				y: Math.cos(angle) * length + radius
			}
			brush.moveTo(s.x, s.y);
			brush.lineTo(e.x, e.y);
			brush.strokeStyle = '#888';
			brush.stroke();
			it.heavens.omen_node.style.left = e.x-15;
			it.heavens.omen_node.style.top = e.y-15;
			it.heavens.omen_node.style.display = 'block';
		}
		
	}
	
}

it.heavens = new function () {
	var heavens = this;
	
	heavens.id = 'heavens';
	heavens.node = H.e('div', it.clock.node, 'heavens');
	heavens.omen_line = H.e('div', heavens.node);
	heavens.omen_node = H.e('div', it.starchart.node, 'starchart_sign', '!');
	heavens.omen = {};
	heavens.next_sign = 0.1;
	
	heavens.coming_signs = []
	
	H.add_cvar(heavens, 'foresight', 3)
	function redraw_starchart() {
		it.starchart.draw_background();
		it.starchart.draw();
	}
	it.cvars.foresight.heavens.update.add_result(redraw_starchart, 999)
	
	H.add_cvar(heavens, 'foreboding', 1);
	H.add_cvar(heavens, 'learnedness', 0);
		
	function get_new_sign () {
		var i, a=[], C=10;
		for (i in it.deities) {
			if (it.deities[i].awake) {
				a.push(it.deities[i]);
				C+=it.deities[i].chance
			}
		}
		var r = Math.random() * C;
		for (i in a) {
			r-= a[i].chance;
			if (r<=0) {
				heavens.coming_signs.push(a[i].get_sign());
				a[i].ascend();
				break;
			}
		}
		heavens.next_sign = H.r() + 0.5;
	}
	
	heavens.remove_sign = function (s) {
		var k = heavens.coming_signs.indexOf(s);
		heavens.coming_signs.splice(s, 1);
	}
		
	function omen_tick() {
		heavens.next_sign -= it.clock.tick_amount;
		if (heavens.next_sign<=0) get_new_sign();
		var i;
		for (i in heavens.coming_signs) {
			heavens.coming_signs[i].placement-=it.clock.tick_amount;
		}
		heavens.omen.time -= it.clock.tick_amount;
		if (heavens.omen.time<=0) {
			if (heavens.omen.state == 'none') {
				heavens.omen.state = 'sky';
				heavens.omen.time = heavens.foresight/10;
				it.junction.alert_tab('heavens');		
			} else {
				heavens.omen_node.style.display = 'none';
				heavens.omen_line.style.display = 'none';
				it.junction.alert_tab('heavens', 1);
				heavens.omen_atoms(false);
				get_new_omen();	
			}
		}
	}
	
	function get_new_omen() {
		var a = [], i, r, c=0;
		for (i in it.omens) {
			if (!it.omens[i].condition||it.omens[i].condition()) {
				a.push(it.omens[i]);
				c+=it.omens[i].chance;
			}
		}
		var r = H.r() * c;
		for (i in a) {
			r -= a[i].chance;
			if (r<0) break;
		}
		heavens.omen.id = a[i].id
		heavens.omen.time = H.r() * 2;
		heavens.omen.state = 'none';
		heavens.omen.radius = H.r() * .6 + .2;
	}
	
	H.add_action(heavens, 'click_omen');
	H.add_action(heavens, 'enable_omen');
	
	function gain_foreboding (args) {
		it.resources.foreboding.unlock();
		var f = args.foreboding || 1;
		it.resources.foreboding.value += 1;
	}

	function remove_sky_omen (args) {
		heavens.omen_node.style.display = 'none';
	}
	
	heavens.click_omen.add_result(gain_foreboding, 600);
	heavens.click_omen.add_result(heavens.enable_omen, 900);
	
	function redraw_omen (args) {
		if (heavens.omen.state == 'active') {
			heavens.omen_node.style.display = 'none';
			heavens.omen_line.innerHTML = it.omens[heavens.omen.id].name;
			heavens.omen_line.style.display = 'block';
			heavens.omen.time = it.omens[heavens.omen.id].duration;
		} else {
			heavens.omen.state = 'active';
			heavens.omen.time = 0;
		}
	}
	
	heavens.enable_omen.add_result(redraw_omen);
	
	heavens.omen_atoms = function (v) {
		var omen = it.omens[heavens.omen.id];
		var i;
		for (i in omen.atoms) {
			omen.atoms[i].disabled = !v
		}
		H.apply_atoms(omen)
	}
	
	it.new_game.add_result(get_new_omen);
	
	heavens.omen_node.addEventListener('click', heavens.click_omen);	
	
	it.each_tick.add_result(omen_tick);
	
	heavens.show = function () {
		heavens.sign_line.style.display = 'block';
	}
	
	heavens.show_omen_tooltip = function (e) {
		if (heavens.omen.state=='active') it.tooltip.show(e, it.omens[heavens.omen.id].description, it.omens[heavens.omen.id].name)
	}
	
	heavens.omen_line.addEventListener('mouseover', heavens.show_omen_tooltip);
	heavens.omen_line.addEventListener('mouseout', it.tooltip.hide);
	
	heavens.save_id = 'heavens';
	heavens.save_parameters = {}
	
	Object.defineProperties(heavens.save_parameters, {
		signs: {
			get: function () {
				var i, r=[];
				for (i in heavens.coming_signs) {
					if (heavens.coming_signs[i]) {
						r.push({
							id: heavens.coming_signs[i].id,
							placement: heavens.coming_signs[i].placement
						})
					}
					else r.push(false);
				}
				return r;
			},			
			set: function (x) {
				for (i in x) {
					if (x[i]) {
						heavens.coming_signs[i] = it.deities[x[i].id].get_sign(x[i])
					}
					else heavens.coming_signs[i] = false;
				}
			},
			enumerable: true
		},
		omen: {
			get: function () {return heavens.omen},
			set: function (v) {
				heavens.omen = v
				if (v.state=='sky') {
					heavens.omen.state = 'sky';
					it.junction.alert_tab('heavens');heavens.omen_node.style.display = 'block';					
				} else if (v.state=='active') {
					heavens.enable_omen();
				}
			},
			enumerable: true
		}
	})
	
	H.register_for_save(heavens)
}

it.deity_chooser = new function () {
	var dc = this;
	
	dc.node = H.e('div', 0, 'locked_node')
	
	it.construct_ui (dc.node, {no_contract: true});
	dc.ui = dc.node.it;
	var ui = {}
	
	ui.name = H.e('td', 0, 'node_title');
	ui.desc = H.e('div', 0, 'node_line');
		
	dc.ui.add(ui.name, 'heading');
	dc.ui.add(ui.desc);
	
	it.junction.add_node(dc, false, 'heavens', 'deities');
	
	H.add_action(dc, 'draw_sign');
	
	function set_name_and_description (args) {
		if (args.sign) {
			args.sign.select = true;
			ui.name.innerHTML = args.sign.name;
			ui.desc.innerHTML = args.sign.deity.description[it.heavens.learnedness];
			dc.node.style.display = 'block';
		} else {
			dc.node.style.display = 'none';
		}
	}
	dc.draw_sign.add_result(set_name_and_description);
	
	var sign = false;
	Object.defineProperties(dc, {
		sign: {
			get: function () {
				return sign;
			},
			set: function (v) {
				if (sign) {
					sign.select = false;
				}
				sign = v;
				dc.draw_sign({sign: sign})
			}
		}
	})
}

it.temple = new function temple () {
	var temple = this;
	temple.id = 'temple';
	temple.name = 'Temple';
	temple.unlocked = true;
	
	temple.node = H.e('div', false, 'temple_main');
	temple.node.cost = H.e('div', temple.node, 'temple_cost');
	temple.node.button = H.e('div', temple.node, 'upgrade', 'Gather Power');
	temple.node.button.style.display = 'block';
	
	temple.update = function () {
		var c = it.dosh.consider(temple.cost);
		if (c.cant_pay) temple.node.button.style.opacity = 0.5; else temple.node.button.style.opacity = 1;
		temple.node.cost.innerHTML = c.format;
	}
	
	temple.expand_heading = 'Gather Power';
	temple.expand_message = 'Your influence is diffused across aeons and untold spaces. Gather it in a single place in the darkness so that you may build upon it.';
	
	temple.atoms = [
		{
			type: 'cooldown',
			target: 'whisper',
			order: 700,
			func: function (x) {
				return x * (temple.level + 1)
			}
		},
		{
			type: 'gather',
			target: 'influence',
			order: 400,
			func: function (x) {
				return x + temple.level * 5
			}
		}
	]
	
	it.junction.add_node(temple, true, 'temple', 'expand')
	
	temple.level = 0;
	
	temple.cost = {cost: {influence: 5}}
	
	function level_up () {
		var c = it.dosh.consider(temple.cost)
		if (c.cant_pay) return;
		c.pay();
		if (temple.cost.humans) {
			it.log.add(temple.cost.humans + ' of your followers perish while building your temple.');
			it.resources.corpses.value += temple.cost.humans;
		}
		temple.level++;
		temple.paid = {influence: 0};
		set_level_info();
		H.apply_atoms(temple);
	}
	
	function level_up_tooltip(e) {
		it.tooltip.show(e, temple.expand_message, temple.expand_heading)
	}
	
	temple.node.button.addEventListener('click', level_up);
	temple.node.button.addEventListener('mouseover', level_up_tooltip);
	temple.node.button.addEventListener('mouseout', it.tooltip.hide);
	
	function set_level_info () {
		switch (temple.level) {
			case 1:
				temple.cost.cost = {
					influence: 50,
					labour: 10,
					humans: 2
				}
				temple.expand_heading = 'Dig Foundation';
				temple.expand_message = 'Have your followers dig a massive earthen pit to mark the place of your future temple.';
				temple.node.button.innerHTML = 'Dig Foundation';
				it.species.humans.counters.influence.count = it.species.humans.counters.influence.max * .85;
				it.species.humans.counters.influence.start();
				break;
			case 2:
				temple.cost.cost = {
					influence: 1000,
					labour: 600,
					fabrications: 200,
					knowledge: 100,
					humans: 10
				}
				it.junction.tabs.temple.node.button.innerHTML = 'Temple';
				temple.expand_heading = 'Construct Temple';
				temple.expand_message = 'Have your followers construct a temple at the locus of your influence.';
				it.visions.enlightenment.unlock();
				break;
			case 3:
				temple.cost.cost = {
					influence: 100000,
					labour: 1000000,
					fabrications: 1000000,
					knowledge: 1000000,
					humans: 1000000
				}
				temple.node.button.innerHTML = 'Construct Megastructure';
				temple.expand_message = 'Expand your temple to proportions large enough to hold the body of a god.';
				it.visions.the_world.unlock();
				break;
		}
		temple.node.button.innerHTML = temple.expand_heading;
		temple.cost.paid = {};
	}
	
	temple.save_id='temple'
	temple.save_parameters={}
	Object.defineProperties(temple.save_parameters, {
		level: {
			get: function () {
				return temple.level
			},
			set: function (x) {
				var i;
				for (i=0; i<x; i++) {
					temple.level = i+1;
					set_level_info();
				}
				H.apply_atoms(temple);
			},
			enumerable: true
		},
		paid: {
			get: function () {
				return temple.cost.paid
			},
			set: function (x)  {
				temple.cost.paid = x;
			},
			enumerable: true
		}
	})
	
	H.register_for_save(temple)
}

it.research = new function research () {
	var research = this;
	
	research.id = 'research';
	research.node = H.e('div', false, 'label', '');
		
	H.add_cvar(research, 'effect', 1)
	H.add_cvar(research, 'time_expansion', 1.15);
	H.add_cvar(research, 'cost_expansion', 1.145);
	H.add_cvar(research, 'cost_decay', .99);
			
	research.update = function () {
		research.node.innerHTML = 'Research Effectiveness: ' + Math.round(research.effect*100) + '%';
	}
	it.junction.add_node(research, true, 'research', 'researching')
	
	research.start_researching = function (x) {
		if (research.researching) research.queue.push(x);
		else research.researching = x;
	}
	
	research.stop_researching = function () {
		research.researching = false;
	}

	research.unlock = function () {
		research.unlocked = true;
		it.junction.unlock('research');
	}
	
	H.add_action(research, 'update_tech_costs')
	
	function set_tech_constants (args) {
		args.innovations = 0;
		args.relevant_techs = {};
		var i;
		for (i in it.techs) {
			if (it.techs[i].bought&&!it.techs[i].no_knowledge&&!it.techs[i].ancient) args.innovations+=1;
			else if (it.techs[i].unlocked&&!it.techs[i].no_knowledge) args.relevant_techs[i] = it.techs[i];
		}
		if (args.innovations<0) args.innovations = 0;
		return args;
	}
	
	function set_cost_multipliers (args) {
		args.time_multiplier = Math.pow(research.time_expansion, args.innovations)/6 * (1 + args.innovations/4) * (args.innovations>=10 ? 12 : Math.pow(1.30, args.innovations));
		args.cost_multiplier = Math.pow(research.cost_expansion, args.innovations)/10 * (1 + args.innovations/2);
		args.extra_knowledge_cost = Math.pow(Math.max(args.innovations-3,0),2) * 5;
		return args;
	}
	
	function reset_costs (args) {
		var i, j;
		for (i in args.relevant_techs) {
			it.techs[i].cost.cost = H.d(it.techs[i].cost_factor)
			it.techs[i].time = it.techs[i].time_factor;
		}
	}
	
	function multiply_costs (args) {
		var i, j;
		for (i in args.relevant_techs) {
			for (j in it.techs[i].cost.cost) {
				it.techs[i].cost.cost[j] *= args.cost_multiplier
			}
			if (!it.techs[i].cost.cost.knowledge) it.techs[i].cost.cost.knowledge = 0;
			it.techs[i].cost.cost.knowledge += args.extra_knowledge_cost;
			for (j in it.techs[i].cost.cost) {
				 it.techs[i].cost.cost[j] *= Math.pow(research.cost_decay, it.clock.aut - it.techs[i].unlocked) 
			}
			for (j in it.techs[i].fixed_cost) {
				if (!it.techs[i].cost.cost[j]) it.techs[i].cost.cost[j]=0;
				it.techs[i].cost.cost[j]+=it.techs[i].fixed_cost[j]
			}
			it.techs[i].time *= args.time_multiplier / (it.techs[i].bought ? research.time_expansion : 1);
		}
	}
	
	research.update_tech_costs.add_result(set_tech_constants, 10);
	research.update_tech_costs.add_result(set_cost_multipliers, 100);
	research.update_tech_costs.add_result(reset_costs, 200);
	research.update_tech_costs.add_result(multiply_costs, 500);
		
	it.each_aut.add_result(research.update_tech_costs);
	
	research.dosh = {}
	Object.defineProperties(research.dosh, {
		id: {
			value: 'research'
		},
		name: {
			value: 'Research'
		},
		value: {
			get: function () {
				return (research.researching ? research.researching.progress : 0)
			},
			set: function (v) {
				if (!research.researching) return;
				research.researching.progress = v;
			}
		},
		format: {
			value: function (v, u) {
				return (u ? '<span class=\'resource_warn_bright\'>' : '') + v + ' epoch' + (v==1 ? '' : 's') + (u ? '</span>' : '') + ' of Research'
			}
		}
	})
	
	it.dosh.register(research.dosh);
		
	research.save_id = 'research';
	research.save_parameters = {};
	Object.defineProperties(research.save_parameters, {
		researching: {
			get: function () {if (research.researching) return research.researching.id; else return false},
			set: function (v) {
				if (v) {
					research.researching = it.techs[v] || it.improvements[v];
				}
			},
			enumerable: true
		}
	})
	
	H.register_for_save(research);
	
}

it.construct_flag = function (args, parent) {
	
	var flag = {
		name: H.c(args.name, parent),
		icon: args.icon + '&#65038;',
		apply: args.apply,
		toggle: H.c(args.toggle, parent),
		toggle_cost: args.toggle_cost,
		description: H.c(args.description, parent),
		atoms: [],
		expiry: args.expiry
	}
	
	var i;
	
	function create_atom_from_seed (z) {
		flag.atoms[z] = {
			type: H.c(args.atoms[z].type, parent),
			target: H.c(args.atoms[z].target, parent),
			order: args.atoms[z].order,
			func: function (x) {return args.atoms[z].seed_func(x, parent)},
			disabled: args.atoms[z].disabled,
			id: args.atoms[z].id
		}
	}
	
	for (i in args.atoms) {
		create_atom_from_seed(i)
	}
	
	function tooltip () {
		var r = '';
		if (flag.toggle_cost[on]) {
			var c = it.dosh.consider({cost: flag.toggle_cost[on]});
			r += 'Cost:' + c.format + '<br>';
		}
		r += flag.description;
		return r;
	}
	
	function show_tooltip (e) {
		it.tooltip.show(e, tooltip, flag.name)
	}
	
	flag.div = H.e('div', 0, 'interest_flag', flag.icon)
	
	flag.toggle_line = H.e('div', 0, 'large_button');
	
	if (args.shut_off) {
		flag.shut_off = function () {
			if (args.shut_off(parent)) flag.on = 0;
		}
	}
		
	var on;
	Object.defineProperty(flag, 'on', {
		get: function () {return on},
		set: function (v) {
			on = v;
			var i;
			for (i in flag.atoms) {
				flag.atoms[i].disabled = !on;
			}
			if (flag.shut_off) {
				if (on) it.each_tick.add_result(flag.shut_off);
				else it.each_tick.remove_result(flag.shut_off);
			}
			H.apply_atoms(flag);
			if (flag.apply) flag.apply(flag, parent, on);
			flag.div.style.display = on ? 'block' : 'none'
			flag.toggle_line.innerHTML = flag.toggle[on]
		}
	})
	if (args.on) flag.on = 1; else flag.on = 0;
		
	function click_me (e) {
		e.stopPropagation();
		if (parent.expired) return;
		if (flag.toggle_cost[on]) {
			var c = it.dosh.consider({cost: flag.toggle_cost[on]});
			if (c.cant_pay) return;
			c.pay();
		}
		flag.on = on ? 0 : 1
	}
	
	flag.toggle_line.addEventListener('click', click_me);
	flag.toggle_line.addEventListener('mouseover', show_tooltip);
	flag.toggle_line.addEventListener('mouseout', it.tooltip.hide);
	
	parent.desc_lines.push(flag.toggle_line);
	parent.flag_div.appendChild(flag.div)
	
	if (parent.saved_flags) flag.on = (parent.saved_flags.indexOf(flag.name)>=0 ? 1 : 0)
	
	return flag;
	
}

it.construct_effort = function (args, parent) {
	
	var effort = {
		name: H.c(args.name, parent),
		icon: args.icon + '&#65038;',
		apply: args.apply,
		cost: args.cost,
		length: args.length(parent),
		description: H.c(args.description, parent),
		interest: parent,
		expired: false
	}
	
	var i;
	
	function tooltip () {
		var r = '';
		if (effort.cost) {
			var c = it.dosh.consider({cost: effort.cost});
			r += 'Cost: ' + c.format + '<br>';
		}
		r += effort.description;
		return r;
	}
	
	function show_tooltip (e) {
		it.tooltip.show(e, tooltip, effort.name)
	}
	
	function effort_tick () {
		effort.progress += it.clock.tick_amount;
	}
	
	function start_doing () {
		effort.div.style.display = 'block';
		doing = true;
		progress = 0;
		it.each_tick.add_result(effort_tick);
	}
	
	function stop_doing () {
		effort.div.style.display = 'none';
		doing = false;
		it.each_tick.remove_result(effort_tick);
	}
	
	effort.div = H.e('div', 0, 'interest_flag', effort.icon)
	
	effort.activate_line = H.e('div', 0, 'node_inline_button');
	effort.activate_fill = H.e('div', effort.activate_line, 'node_button_fill');
	effort.activate_text = H.e('div', effort.activate_line, 'node_button_text', effort.name);
	
	var doing = false;
	var progress = 0;
	
	Object.defineProperties(effort, {
		progress: {
			get: function () {return progress},
			set: function (v) {
				progress = v;
				if (progress>=effort.length) {
					effort.activate_text.innerHTML = effort.name;
					effort.activate_fill.style.left = '100%';
					stop_doing();
					effort.apply(me, parent);
				} else if (progress>0) {
					var p = Math.round(progress/effort.length * 100);
					effort.activate_fill.style.left = p + '%';
					var t = effort.name + ' (' + p + '%)';
					effort.activate_text.innerHTML = t;
				} else {
					effort.activate_fill.style.lieft = '100%'
				}
			}
		},
		doing: {
			get: function () {return doing}
		}
	})
	
	function click_me (e) {
		e.stopPropagation();
		if (doing) return;
		if (effort.cost) {
			var c = it.dosh.consider({cost: effort.cost});
			if (c.cant_pay) return;
			c.pay();
		}
		start_doing();
	}
	
	effort.activate_line.addEventListener('click', click_me);
	effort.activate_line.addEventListener('mouseover', show_tooltip);
	effort.activate_line.addEventListener('mouseout', it.tooltip.hide);
	
	parent.desc_lines.push(effort.activate_line);
	parent.flag_div.appendChild(effort.div);
	
	var p = parent.saved_efforts && parent.saved_efforts[effort.name];
	if (p) {
		start_doing();
		effort.progress = p;
	}
	
	return effort;
	
}

it.interest_instance = function (map, args) {
	
	if (!args) args = {};
	
	var inter = {
		saved_flags: args&&args.flags_on,
		saved_efforts: args&&args.effort_progress,
		map: map,
		selected: false,
		flags: [],
		efforts: [],
		consoles: {
			add: function (v) {
				var k = inter.console_list.indexOf(v+'_console');
				if (k!=-1) return;
				inter.console_list.push(v+'_console');
				inter.consoles.open();
			},
			remove: function (v) {
				var k = inter.console_list.indexOf(v);
				if (k==-1) return;
				inter.console_list.splice(k, 1);
				inter.consoles.open();
			},
			open: function () {
				var i, c;
				for (i in it.consoles) {
					if (inter.console_list.indexOf(i)==-1||!it.consoles[i].unlocked) {
						it.consoles[i].close();
					} else {
						it.consoles[i].open();
					}
				}
			},
			close: function () {
				var i;
				for (i in it.consoles) {
					it.consoles[i].close();
				}
			}
				
		}
	};
	var i;
	
	if (args.type) inter.type = args.type 
	else {
		var i, a={}, exclude = [];
		for (i in map.interest_list) {
			if (it.interests[map.interest_list[i].type].unique) exclude.push(map.interest_list[i].type);
		};
		var c = 0, n = 0;
		for (i in it.interests) {
			if (it.interests[i].unlocked&&H.c(it.interests[i].types[map.type])&&exclude.indexOf(i)==-1) {
				a[i] = H.c(it.interests[i].types[map.type]);
				c+=a[i];
			}
		}
		
		if (c==0) return;
		
		var r = Math.random() * c
		
		for (i in a) {
			r -= a[i];
			if (r<=0) {
				inter.type = i;
				break;
			}
		}
	}
	
	var parent = it.interests[inter.type];
	inter.parent = parent;
	if (!parent) return;
	
	inter.console_list = [];
	for (i in parent.consoles) {
		inter.consoles.add(parent.consoles[i]);
	}
	
	if (parent.construct) {
		parent.construct(inter, parent, args);
	}
	
	parent.children.push(inter);
	inter.name = parent.name;
	inter.icon = parent.icon;
	inter.description = parent.description;
	inter.description_expired = parent.description_expired;
	inter.desc_lines = [H.e('div', 0, 'node_line', inter.description)]
	inter.atoms = [];
	
	function create_atom_from_seed (z) {
		inter.atoms[z] = {
			type: parent.atoms[z].type,
			target: parent.atoms[z].target,
			order: parent.atoms[z].order,
			func: function (x) {return parent.atoms[z].seed_func(x, inter)},
			disabled: parent.atoms[z].disabled,
			id: parent.atoms[z].id
		}
	}
	
	for (i in parent.atoms) {
		create_atom_from_seed(i)
	}
	
	if (args.expiration) inter.expiration = args.expiration;
	else inter.expiration = 0;
	
	if (typeof(args.nonant)=='number') inter.nonant = args.nonant;
	else {
		var r = H.r(map.nonants.length) - 1;
		inter.nonant = map.nonants[r]
		map.nonants.splice(r,1)
	}
	
	inter.x = 8 + inter.nonant%3*33;
	inter.y = 8 + Math.floor(inter.nonant/3)*33;
		
	inter.div = H.e('div', map.tile.div, 'interest', inter.icon);
	inter.div.style.left = inter.x + '%';
	inter.div.style.top = inter.y + '%';
	
	inter.flag_div = H.e('div', inter.div, 'interest_flag_container');
	
	function tick () {
		var e = 0;
		var i;
		for (i in inter.flags) {
			if (inter.flags[i].on&&inter.flags[i].expiry) e += inter.flags[i].expiry() * it.clock.tick_amount;
		}
		e += parent.expiration_rate;
		inter.expiration += e;
		if (inter.expiration >= 1) inter.expire();
		if (parent.tick_handler) parent.tick_handler(inter, parent);
	}
	it.each_tick.add_result(tick);
	
	var highlight = false;
	Object.defineProperty(inter, 'selected', {
		get: function () {return highlight},
		set: function (v) {highlight = v;
			if (v) H.add_class(inter.div, 'interest_highlight');
			else H.remove_class(inter.div, 'interest_highlight');
		}
	})
	
	inter.click_me = function (e) {
		e.stopPropagation();
		if (inter.selected) {
			for (i in it.consoles) {
				it.consoles[i].close();
				it.world_map.selected_interest = false;
			}
			inter.selected = false;
		} else {
			if (it.world_map.selected_interest) {
				it.world_map.selected_interest.consoles.close();
			}
			it.world_map.selected_interest = inter;
			inter.consoles.open();
			inter.selected = true;
		}
	}
	
	inter.div.addEventListener('click', inter.click_me);
	
	inter.apply_atoms = function () {
		H.apply_atoms(inter);
		for (i in inter.flags) {
			H.apply_atoms(inter.flags[i]);
		}
	}
	
	H.apply_atoms(inter);
	
	inter.expire = function () {
		var k = parent.children.indexOf(inter);
		if (k!=-1) parent.children.splice(k,1);
		H.remove_atoms(inter);
		inter.expired = true;
		it.each_tick.remove_result(tick);
		H.add_class(inter.div, 'interest_expired');
		inter.desc_lines[0].innerHTML = inter.description_expired;
		if (inter.selected) inter.consoles.open();
		var i;
		for (i in inter.flags) {
			inter.flags[i].on = 0;
		}
	}
	
	inter.destroy = function () {
		inter.expire();
		map.tile.div.removeChild(inter.div);
	}
	
	if (args.expired) inter.expire();
	
	inter.get_saves = function () {
		var r = {
			type: inter.type,
			nonant: inter.nonant,
			expiration: inter.expiration,
			expired: inter.expire,
			flags_on: [],
			effort_progress: {}
		}
		var i;
		for (i in inter.flags) {
			if (inter.flags[i].on) r.flags_on.push(inter.flags[i].name);
		}
		for (i in inter.efforts) {
			if (inter.efforts[i].doing) r.effort_progress[inter.efforts[i].name] = inter.efforts[i].progress;
		}
		if (parent.saves) {
			r.custom_saves={}
			for (i in parent.saves) {
				r.custom_saves[parent.saves[i]] = inter[parent.saves[i]]
			}
		}
		return r;
	}
		
	if (parent.discover) {
		for (i in parent.discover) it.ids[parent.discover[i]].unlock({by: 'interest'})
	}

	if (args.custom_saves) {
		for (i in args.custom_saves) {
			inter[i] = args.custom_saves[i];
		}
	}
			
	for (i in parent.flags) {
		inter.flags[i] = it.construct_flag(parent.flags[i], inter);
	}
	
	for (i in parent.efforts) {
		inter.efforts[i] = it.construct_effort(parent.efforts[i], inter);
	}
		
	map.interest_list.push(inter);

}

it.expeditions = new function () {
	
	var exp = this;
	
	exp.cost = {};
	
	exp.cost_display = {
		node: H.e('div', false),
		update: function () {
			if (!exp.cost) exp.cost_display.node.innerHTML = 'Select a map to launch an expedition';
			else {
				var c = it.dosh.consider(exp.cost)
				exp.cost_display.node.innerHTML = 'Expedition cost: ' + c.format
			}
		}
	}
	
	it.junction.add_node(exp.cost_display, true, 'exploration', 'expeditions');
	
	var selected;
	Object.defineProperty(exp, 'selected', {
		get: function () {return selected},
		set: function (v) {
			if (selected) {
				selected.highlight=false;
			}
			selected = v;
			if (selected) {
				selected.highlight=true;
				exp.cost = selected.cost;
				exp.cost_display.update();
			} else {
				exp.cost = false
				exp.cost_display.update();
			}
		}
	})
	
}

it.world_map = new function () {
	var world_map = this;
	var i;
	
	var tiles = [];
	var rows = 2;
	var row_size = 47;
	world_map.id = 'world_map';
	world_map.map_list = [];
	world_map.active_interests = [];
	world_map.atoms = [];
	world_map.save_id = 'world_map'
	world_map.save_parameters = {}
	
	H.add_cvar(world_map, 'base_interests', 6);
	
	H.add_cvar(world_map, 'max_maps', 1);
	function check_new_tile() {
		if (world_map.map_list.length==tiles.length&&world_map.map_list.length<world_map.max_maps) world_map.make_tile();
	}
	it.cvars.max_maps.world_map.update.add_result(check_new_tile);
	
	Object.defineProperties(world_map.save_parameters, {
		tiles: {
			get: function () {return tiles.length},
			set: function (v) {
				if (v>tiles.length) {
					var i;
					for (i=tiles.length; i<v; i++) {
						world_map.make_tile();
					}
				}
			},
			enumerable: true
		},
		maps: {
			get: function () {
				var i, j, r = [], m, n;
				for (i in world_map.map_list) {
					m = {
						number: world_map.map_list[i].number,
						type: world_map.map_list[i].type,
						rotate: world_map.map_list[i].rotate,
						interests: world_map.map_list[i].interests,
						image: world_map.map_list[i].image,
						nonants: world_map.map_list[i].nonants,
						discoveries: world_map.map_list[i].discoveries,
						interest_list: []
					};
					for (j in world_map.map_list[i].interest_list) {
						n = world_map.map_list[i].interest_list[j].get_saves()
						m.interest_list.push(n)
					}
					r[m.number]=m
				}
				return r;
			},
			set: function (v) {
				var i;
				for (i in v) {
					world_map.make_map(v[i].number, v[i])
				}
			},
			enumerable: true
		}
	})
		
	world_map.node = H.e('div', false, 'world_map');
	
	world_map.make_tile = function () {
		
		var tile = {
			number: tiles.length,
			map: false,
			div: H.e('div', world_map.node, 'map_tile')
		}
		
		tile.cost = {
			cost: {
				humans: tile.number + 1,
				food: (tile.number + 1) * 5,
				labour: (tile.number + 1) * 10,
				boats: (tile.number < 4 ? 0 : Math.pow(tile.number - 3,2) + tile.number - 2)
			}
		}
		
		tile.new_map = function () {
			world_map.make_map(tile.number);
		}
		
		tile.explore = function () {
			tile.new_map();
			if (tile.number == tiles.length - 1&&tiles.length<world_map.max_maps) world_map.make_tile();
		}
		
		tiles.push(tile);
									
		tile.click_me = function () {
			if (it.expeditions.selected == tile) it.expeditions.selected=false;
			else it.expeditions.selected = tile;
		}
		
		tile.div.addEventListener('click', tile.click_me);
		
		var highlight = false;
		Object.defineProperty(tile, 'highlight', {
			get: function () {return highlight},
			set: function (v) {highlight = v;
				if (v) H.add_class(tile.div, 'map_tile_highlight');
				else H.remove_class(tile.div, 'map_tile_highlight');
			}
		})
		
		rows = Math.ceil(Math.sqrt(tiles.length));
		row_size = Math.floor(100/rows) - 3;
		world_map.node.style.fontSize = world_map.map_size / (6*rows);
		
		for (i = 0; i < tiles.length; i++) {
			tiles[i].div.style.top = Math.floor(i/rows) * (row_size+3) + '%';
			tiles[i].div.style.left = i % rows * (row_size+3) + '%';
			tiles[i].div.style.height = row_size + '%';
			tiles[i].div.style.width = row_size + '%';
		}
	}
	
	world_map.make_map = function (tile_number, args) {
		
		if (world_map.map_list[tile_number]) {
			world_map.map_list[tile_number].clear();
		}
		
		if (!args) args =  {};
		
		var map = {
			type: (args.type ? args.type : 'land'),
			number: tile_number,
			tile: tiles[tile_number],
			rotate: (args.rotate ? args.rotate : Math.floor(Math.random()*4)),
			div: H.e('div', false, 'map_image'),
			interests: (args.interests ? args.interests : Math.ceil(Math.random()*(world_map.base_interests+tile_number)/5)),
			interest_list: [],
			discoveries: args.discoveries || 0,
			nonants: (args.nonants) || [0, 1, 2, 3, 4, 5, 6, 7, 8],
			clear: function () {
				var i;
				for (i in map.interest_list) {
					map.interest_list[i].destroy();
					delete map.interest_list[i];
				}
			}
		}
		
		if (args.image) map.image = args.image;
		else switch (map.type) {
			case 'land':
				map.image = 'images/tile_land_1.png';
				break;
		}

		map.div.style.backgroundImage = 'url(\''+map.image+'\')';
		
		if (map.rotate) map.div.className = 'map_image map_image_rotate_' + map.rotate;
		
		world_map.map_list[tile_number] = map;
		map.tile.div.innerHTML = '';
		map.tile.div.appendChild(map.div);
		
		var i;
		if (args.interest_list) {
			for (i in args.interest_list) {
				it.interest_instance(map, args.interest_list[i])
			}
		} else {
			for (i=0; i<map.interests; i++) {
				it.interest_instance(map);
			}
		}	
		
		map.has_space = function () {
			return map.nonants.length;
		}
		
		map.new_interest = function (args) {
			if (typeof(args.nonant)=='number') {
				var i;
				for (i in map.interest_list) {
					if (map.interest_list[i].nonant == args.nonant) {
						map.interest_list[i].destroy();
						delete map.interest_list[i];
					}
				}
			}
			it.interest_instance(map, args)
		}
		
	}
	
	var selected_interest = false;
	Object.defineProperty(world_map, 'selected_interest', {
		get: function () {return selected_interest;},
		set: function (v) {
			if (selected_interest) {
				selected_interest.selected = false;
			}
			selected_interest = v;
			selected_interest.selected = true;
		}
	})
	
	it.junction.add_node(world_map, false, 'exploration', 'maps');
	
	var exploring = false;
		
	world_map.map_size = it.regions.junction.offsetWidth / 2 - 40;
	world_map.node.style.width = world_map.map_size;
	world_map.node.style.height = world_map.map_size;
	world_map.make_tile();
	
	H.register_for_save(world_map);
	
	
	
}

it.resource_table=[];
for (var i = 0; i<4; i++) {
	it.resource_table[i] = H.e('table', it.regions.resources, 'resource_table');
}
H.add_class(it.resource_table[3], 'warehouse_table');

it.warehouse = new function () {
	var warehouse = this;
	warehouse.id = 'warehouse';
	
	H.add_cvar(warehouse, 'max', 0);
	H.add_cvar(warehouse, 'value', 0);
	
	warehouse.has_space = function () {
		return warehouse.value < warehouse.max
	}
	
	warehouse.node = H.e('tr', it.resource_table[3], 'resource');
	warehouse.node.name = H.e('td', warehouse.node, 'resource_name', 'Storage');
	warehouse.node.current = H.e('td', warehouse.node, 'resource_current', '0');
	warehouse.node.max = H.e('td', warehouse.node, 'resource_max', ' / 10');
	warehouse.node.tick = H.e('td', warehouse.node, 'resource_tick');
	
	function draw_max () {
		warehouse.node.max.innerHTML = ' / ' + warehouse.max
	}
	function draw_value () {
		warehouse.node.current.innerHTML = warehouse.value
	}
	it.cvars.max.warehouse.update.add_result(draw_max)
	it.cvars.value.warehouse.update.add_result(draw_value)
	
	warehouse.unlock = function () {
		warehouse.unlocked = true;
		warehouse.node.style.display = 'table-row';
		it.resource_table[3].style.display = 'table';
	}
}
