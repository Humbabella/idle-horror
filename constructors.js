it.constructors = {
	
	sub_log: function (args, id) {
		var i, sub_log = {
			id: id,
			lines: [],
			node : {
				header: H.e('div', false, 'sub_log_header', args.name),
				body: H.e('div', false, 'sub_log_body')
			},
		}
		
		Object.defineProperty (sub_log, 'highlight', {
			set: function (v) {
				if (v) sub_log.node.header.className = 'sub_log_header sub_log_header_select';
				else sub_log.node.header.className = 'sub_log_header'
			}
		})
		
		sub_log.add = function (message, type) {
			if (args.condition && !args.condition(type)) return;
			sub_log.lines.unshift(message);
			if (sub_log.lines.length>40) sub_log.lines.pop();
			draw()
		}
		
		function draw() {
			var x = '', i;
			for (i in sub_log.lines) x += sub_log.lines[i] + '<br>';
			sub_log.node.body.innerHTML = x;
		}
		
		function select_me (e) {
			it.log.show(sub_log)
		}
		sub_log.node.header.addEventListener('click', select_me)
		
		it.log.add_tab(sub_log)
		return sub_log
	},
	
	deity: function (args, id) {
		var deity = {
			id: id,
			name: args.name,
			description: args.description,
			effect_text: args.effect_text,
			love_text: args.love_text,
			sign_info: {
				name: args.sign.name,
				tooltip: args.sign.tooltip,
				apply: args.sign.apply,
				atoms: args.sign.atoms,
				icon: args.sign.icon + '&#65038;'
			},
			ascension: 0,
			awake: args.awake,
			stature: args.stature || 1,
			power: args.power || 1,
			ascend: function () {
				deity.ascension += deity.ascend_value;
				//if (deity.ascension>=N) SOMETHING HAPPENS
			},
			tribute_cost_function: args.tribute_cost_function,
			tribute_cost: {installments: {made: 0}},
			save_id: id,
			save_parameters: {}
		}
		
		deity.get_sign = function (load) {
			var h = (load&&typeof(load.hatred)=='number' ? load.hatred : deity.hatred)
			
			var r = {
				id: id,
				deity: deity,
				name: deity.sign_info.name,
				tooltip: deity.sign_info.tooltip,
				apply: deity.sign_info.apply,
				node: H.e('div', it.starchart.node, 'starchart_sign', deity.sign_info.icon),
				atoms: [],
				ascension: deity.ascension,
				used: (load&&load.used) || false,
				power: (load&&load.power) || deity.power
			};
			var select, i;
			
			function add_atom(z) {
				r.atoms.push({
					type: z.type,
					target: z.target,
					order: z.order,
					func: function (x) {
						return (z.func(x, r))
					}
				})
			}
			
			for (i in deity.sign_info.atoms) {
				if (deity.sign_info.atoms[i].hatred.indexOf(h)!=-1) add_atom(deity.sign_info.atoms[i])
			}
			
			Object.defineProperties(r, {
				active: {
					set: function (v) {
						if (v) {
							H.add_class(r.node, 'starchart_sign_highlight');
							H.apply_atoms(r);
							if (r.apply) r.apply(true);
						} else {
							H.remove_class(r.node, 'starchart_sign_highlight');
							H.remove_atoms(r);
							if (r.apply) r.apply(false);
						}
					}
				},
				select: {
					set: function (v) {
						if (v) {
							H.add_class(r.node, 'starchart_sign_selected')
						} else {
							H.remove_class(r.node, 'starchart_sign_selected')
						}
					}
				}
			})
			
			function click_sign(e) {
				if (it.deity_chooser.sign == r) {
					it.deity_chooser.sign = false;
				} else {
					it.deity_chooser.sign = r;
				}
			}
			
			r.node.addEventListener('click', click_sign)
			
			return r
		}
				
		tributes = 0, hatred = args.hatred;
		Object.defineProperties(deity, {
			tributes: {
				get: function () {
					return tributes
				},
				set: function (v) {
					var c = v - tributes;
					tributes = v;
					deity.hatred -= c;
					deity.power *= Math.pow(1.2, c);
					deity.stature *= Math.pow(1.05, c);
					reset_cost();
				}
			},
			hatred: {
				get: function () {
					return hatred
				},
				set: function (v) {
					hatred = Math.max(0, Math.min(5, v));
				}
			}
		})
		
		function reset_cost () {
			deity.tribute_cost.cost = deity.tribute_cost_function(tributes);
			deity.tribute_cost.installments.max = Math.pow((tributes+1), 2);
		}
		
		reset_cost();
		
		for (i in args.cvars) {
			H.add_cvar(deity, i, args.cvars[i]);
		}
		
		var base_ascend_value = H.atom(id, 'ascend_value', 10, function (x) {return deity.power});
		var base_chance = H.atom(id, 'chance', 10, function (x) {return deity.stature});
		
		H.add_cvar(deity, 'ascend_value', 0)
		H.add_cvar(deity, 'chance', 0)
		it.cvars.ascend_value[id].add_atom(base_ascend_value);
		it.cvars.chance[id].add_atom(base_chance);
			
		Object.defineProperties(deity.save_parameters, {
			ascension: {
				get: function () {return deity.ascension},
				set: function (v) {if (v) deity.ascension = v},
				enumerable: true
			},
			hatred: {
				get: function () {return deity.hatred},
				set: function (v) {if (v) deity.hatred = v},
				enumerable: true
			},
			power: {
				get: function () {return deity.power},
				set: function (v) {if (v) deity.power = v},
				enumerable: true
			},
			stature: {
				get: function () {return deity.stature},
				set: function (v) {if (v) deity.stature = v},
				enumerable: true
			},
			awake: {
				get: function () {return deity.awake},
				set: function (v) {if (v) deity.awake = v},
				enumerable: true
			},
			tributes: {
				get: function () {return deity.tributes},
				set: function (v) {
					tributes = v;
					reset_cost();
				},
				enumerable: true
			},
			paid: {
				get: function () {return deity.tribute_cost.paid},
				set: function (v) {
					deity.tribute_cost.paid = v
				}
			},
			installments: {
				get: function () {return deity.tribute_cost.installments.made},
				set: function (v) {
					deity.tribute_cost.installments.made = v
				}
			}
		})
		
		H.register_for_save(deity)	
		return deity
	},
	
	omen: function (args, id) {
		var omen = {
			id: id,
			name: args.name,
			description: args.description,
			atoms: args.atoms,
			apply: args.apply,
			duration: args.duration,
			icon: args.icon,
			condition: args.condition,
			chance: args.chance || 1
		}
		
		return omen;
	},
	
	act: function (args, id) {
		
		var act = {
			id: id,
			name: args.name,
			active: args.active,
			tooltip: args.tooltip,
			show_in: args.show_in,
			autocast_if: args.autocast_if,
			node: H.e('div', false, 'spell'),
		}
		
		var i;
			
		if (args.construct) args.construct(act);
		for (i in args.cvars) {
			H.add_cvar(act, i, args.cvars[i])
		}
		
		function remove_quicken() {
			act.quickened = 0;
		}
		H.add_action(act, 'cast');
		act.cast.add_result(args.result, 500);
		act.cast.add_result(remove_quicken, 10);
		
		var base_cooldown = args.cooldown;
		H.add_cvar(act, 'cooldown', 0);
		var set_base_cooldown = H.atom(id, 'cooldown', 10, function (x) {return base_cooldown});
		it.cvars.cooldown[id].add_atom(set_base_cooldown);
		Object.defineProperty(act, 'base_cooldown', {
			get: function () {return base_cooldown},
			set: function (v) {
				base_cooldown = v;
				it.cvars.cooldown[act.id].update();
			}
		})
		
		function adjust_cooling (args) {
			if (args.old_value) {
				act.cooling *= act.cooldown / args.old_value;
			} else {
				act.cooling = act.cooldown;
			}
		}
		quicken = {
			type: 'cooldown',
			target: id,
			order: 900,
			func: function (x) {if (!act.quickened) 	return x;
				return x * (1 - quickened);
			}
		}
		H.apply_atom(quicken);
		it.cvars.cooldown[id].update.add_result(adjust_cooling, 999);
		
		var quickened;
		Object.defineProperty(act, 'quickened', {
			get: function () {return quickened},
			set: function (v) {
				quickened = v;
				it.cvars.cooldown[act.id].update();
			}
		})
				
		act.update = function () {
			if (act.cooling < act.cooldown) {
				act.node.name.className = 'spell_name spell_cooldown';
				act.node.fill.style.left = (act.cooling / act.cooldown*100) + '%';
			} else {
				if (act.active && !act.active()) act.node.name.className = 'spell_name spell_cooldown';
				else act.node.name.className = 'spell_name';
				act.node.fill.style.left = '100%'
			}
		}

		act.node.update = act.update;
		act.node.fill = H.e('div', act.node, 'spell_fill');	
		act.node.name = H.e('div', act.node, 'spell_name', act.name);
		
		function click (e) {
			if (e&&e.shiftKey&&act.autocastable) {
				act.autocast = !act.autocast;
				return
			}
			if (act.cooling<act.cooldown || (act.active && !act.active())) return;
			act.cooling = 0;
			act.cast()
		}
		
		function show_tooltip (e) {
			if (act.tooltip) it.tooltip.show(e, act.tooltip, act.name)
		}

		act.node.addEventListener('click', click);
		act.node.addEventListener('mouseover', show_tooltip);
		act.node.addEventListener('mouseout', it.tooltip.hide)
		
		act.unlock = function () {
			if (act.unlocked) return;
			act.node.style.display = 'block';
			if (act.show_in.tab) {
				it.junction.add_node(act, true, act.show_in.tab, act.show_in.section);
				it.junction.unlock(act.show_in.tab, act.show_in.section);
			} else {
				it[act.show_in.type][act.show_in.id].ui.add(act.node)
			}
		}
		
		var cooling = act.cooldown;
		Object.defineProperty(act, 'cooling', {
			get: function () {return cooling},
			set: function (v) {
				cooling = v;
				if (act.autocast && act.cooling >= act.cooldown && (!act.active || act.active()) && act.autocast_if()) {
					click();
					return;
				}
			}
		});
		
		H.add_cvar(act, 'tick', 1);
		it.clock.register_tick(act.id, 'cooling');
		act.cooling = act.cooldown;
		
		act.save_id = id;
		act.save_parameters = {};
		Object.defineProperties(act.save_parameters, {
			unlocked: {
				get: function () {
					return act.unlocked
				},
				set: function (x) {
					if (x) act.unlock()
				},
				enumerable: true
			},
			base_cooldown: {
				get: function () {
					return act.base_cooldown
				},
				set: function (x) {
					if (x) act.base_cooldown = x
				},
				enumerable: true
			},
			cooling: {
				get: function () {
					return act.cooling / act.cooldown
				},
				set: function (x) {
					act.cooling = x * act.cooldown
				},
				enumerable: true
			},
			autocast: {
				get: function () {
					return act.autocast
				},
				set: function (x) {
					act.autocast = x
				},
				enumerable: true
			}
		})
		
		function add_save_parameter (x) {
			Object.defineProperty(act.save_parameters, x, {
				get: function () {
					return act[x]
				},
				set: function (v) {
					act[x] = v
				},
				enumerable: true
			})
		} 
		
		for (i in args.saves) {
			add_save_parameter (args.saves[i])
		}
		
		add_save_parameter ('quickened');
		
		if (args.unlocked) act.unlock()
		
		H.register_for_save(act)
		return act;
		
	},
	
	tech: function (args, id) {
		
		var tech = {
			id: id,
			name: args.name,
			description: args.description,
			show_in: args.show_in,
			atoms: args.atoms,
			apply: args.apply,
			cost_factor: args.cost_factor,
			fixed_cost: args.fixed_cost,
			announce: args.announce,
			time_factor: args.time_factor,
			no_knowledge: args.no_knowledge,
			type: args.type,
			progress: 0,
			locks: args.locks,
			unlocked: false,
			node: H.e('div', false, 'locked_node'),
			cost: {substitutions: {knowledge: {encyclopedia: 100}}}
		};
		
		var i;
		tech.cost.cost = H.d(tech.cost_factor);
		for (i in tech.cost.cost) {
			tech.cost.cost[i] /= 20;
		}
		for (i in tech.fixed_cost) {
			tech.cost.cost[i] = tech.fixed_cost[i];
		}
		tech.time = tech.time_factor/5;
		
		it.construct_ui (tech.node);
		tech.ui = tech.node.it;
		var ui = {}
			
		ui.name = H.e('td', 0, 'node_title', tech.name);
		ui.bar = H.e('td', 0, 'node_button node_button_wide');
		ui.fill = H.e('div', ui.bar, 'node_button_fill');
		ui.button_text = H.e('div', ui.bar, 'node_button_text', 'Impart Knowledge');
		//if (tech.tradition) ui.tradition = H.e('div', 0, 'node_line', it.jobs[tech.tradition].name + ' Tradition');
		ui.cost = H.e('div', 0, 'node_line')
		ui.time = H.e('div', 0, 'node_line')
		ui.desc = H.e('div', 0, 'node_line', tech.description);
		
		ui.bar.style.width = '60%'
		
		it.add_button_animation(ui.bar);
		
		tech.ui.add(ui.name, 'heading');
		tech.ui.add(ui.bar, 'heading');
		//if (tech.tradition) tech.ui.add(ui.tradition, 'heading');
		tech.ui.add(ui.cost);
		tech.ui.add(ui.desc);
		
		ui.bar.update = function () {
			if (!tech.unlocked) return;
			if (!tech.bought) {
				var c = it.dosh.consider(tech.cost);
				if (c.cant_pay||it.research.researching) H.add_class(ui.bar, 'node_button_no_press');
				else H.remove_class(ui.bar, 'node_button_no_press');
			} else if (!tech.built) {
				if (it.research.researching == tech) ui.bar.className = 'node_button node_button_wide node_button_highlight';
				else ui.bar.className = 'node_button node_button_wide';
				ui.fill.style.left = (tech.progress / tech.time * 100) + '%'
				ui.button_text.innerHTML = Math.floor(tech.progress/tech.time * 100) + '%'
			}
		}
		
		ui.cost.update = function () {
			if (!tech.bought) {
				var t = tech.time / (it.research.effect || 1);
				if (t<=.2) ui.cost.innerHTML = 'Cost: ' + it.dosh.consider(tech.cost).format + '<br>' + 'Your followers will comprehend this technology soon.';
				else {
					t -= 1 - it.clock.ticks_this_aut / it.clock.aut_length;
					ui.cost.innerHTML = 'Cost: ' + it.dosh.consider(tech.cost).format + '<br>' + 'Your followers will comprehend this technology' + (t<=0 ? ' this epoch.' : (t<= 1 ? ' next epoch.' : ' in ' + Math.ceil(t) + ' epochs.'));
				}
			}
		}
		
		ui.time.update = function () {
			var t = (tech.time - tech.progress) / (it.research.effect || 1);
			if (t<.2) ui.time.innerHTML = 'Humanity will discover this knowledge soon.'; 
			else { 
				t -= 1 - it.clock.ticks_this_aut / it.clock.aut_length;
				ui.time.innerHTML = 'Humanity will discover this knowledge ' + (t<=0 ? ' this epoch.' : (t<= 1 ? ' next epoch.' : ' in ' + Math.ceil(t) + ' epochs.'));
			}
		}
		
		tech.update = function () {
			tech.ui.update();
		}
		
		tech.ancient_discovery = function () {
			tech.unlock({unlock:true});
			make_ancient();
		}
		
		it.junction.add_node(tech, true, tech.show_in.tab, tech.show_in.section);
		
		function make_ancient() {
			tech.ancient = 1;
			H.add_class(ui.name, 'horrific');
			ui.ancient = H.e('div', 0, 'node_line horrific', 'Ancient Knowledge');
			tech.ui.add(ui.ancient, 'body', 1);
			if (!tech.built) acquire();
		}
		
		function acquire() {
			tech.bought = 1;
			tech.built = 1;
			ui.fill.style.left = '100%';
			ui.button_text.innerHTML = 'Complete';
			tech.ui.remove(ui.time);
			it.junction.add_node(tech, false, tech.show_in.tab, 'completed');
			it.junction.unlock('research', 'completed')
			it.each_tick.remove_result(tick);
			if (args.apply) args.apply(tech)
			it.research.update_tech_costs();
			H.apply_atoms(tech);
			var i;
			for (i in args.unlocks) {
				it.techs[args.unlocks[i]].unlock({by: id});
			}
		}
		
		function buy() {
			var c = it.dosh.consider(tech.cost)
			if (it.research.researching||c.cant_pay) return false;
			c.pay(tech.cost);
			it.research.start_researching(tech);
			research();
			it.research.update_tech_costs();
		}
		
		function research() {
			tech.ui.remove(ui.cost);
			tech.ui.add(ui.time, 'body', 0);
			it.each_tick.add_result(tick);
			tech.bought = 1;
			it.junction.add_node(tech, false, tech.show_in.tab, 'researching');
		}
		
		function build () {
			ui.fill.style.left = '100%';
			ui.button_text.innerHTML = '100%';
			var l = 'Humanity has discovered '+tech.name+'. '+tech.announce;
			it.log.add(l, 'tech');
			tech.progress = tech.time;
			it.each_tick.remove_result(tick);
			it.research.stop_researching();
			acquire();
			//if (tech.tradition) tech.tradition.enable();
		}
		
		function tick () {
			tech.progress += it.research.effect / it.clock.aut_length;
			if (tech.progress >= tech.time) build()
		}

		function apply_atoms () {
			H.apply_atoms(tech);
		}

		function click () {
			if (!tech.bought) {
				buy();	
				ui.bar.animate();
			}
		}
		
		ui.bar.addEventListener('click', click);
				
		var unlocked_by = [];
		tech.unlock = function (args) {
			if (args.by) {
				if (unlocked_by.indexOf(args.by) == -1) {
					unlocked_by.push(args.by);
					if (unlocked_by.length>=tech.locks) {
						args.unlock = true
					}
				}
			}
			if (args.unlock) {
				tech.unlocked = args.aut || it.clock.aut;
				tech.node.style.display = 'block';
				it.research.update_tech_costs();
			}		
		}
		
		tech.save_id = id;
		tech.save_parameters = {};
		
		Object.defineProperties(tech.save_parameters, {
			progress: {
				get: function () {return tech.progress},
				set: function (x) {tech.progress = x},
				enumerable: true
			},
			bought: {
				get: function () {
					if (tech.bought&&(!tech.built)) return {
						time: tech.time,
						cost: tech.cost
					} 
				},
				set: function (x) {
					if (x) {
						tech.time = x.time;
						tech.cost = x.cost;
						research()
					}
				},
				enumerable: true
			},
			built: {
				get: function () {return tech.built},
				set: function (x) {if (x) {acquire(); tech.bought=1}},
				enumerable: true
			},
			unlocked: {
				get: function () {return tech.unlocked},
				set: function (x) {if (x) {tech.unlock({unlock: true, aut: x})}},
				enumerable: true
			},
			ancient: {
				get: function () {return tech.ancient},
				set: function (x) {if (x) {make_ancient()}},
				enumerable: true
			}
			/*on: {
				get: function () {return tech.on},
				set: function (x) {if (x) tech.tradition.enable();},
				enumerable: true
			}*/
		})
		
		H.register_for_save(tech)
		
		return tech

	},
	
	improvement: function (args, id) {
		
		var improv = {
			id: id,
			name: args.name,
			description: args.description,
			show_in: args.show_in,
			atoms: args.atoms,
			apply: args.apply,
			type: args.type,
			progress: 0,
			level: 0,
			locks: args.locks,
			unlocked: false,
			node: H.e('div', false, 'locked_node'),
			cost: {}
		};
		
		function reset_cost () {
			improv.cost.cost = args.cost_function(improv);
		}
		reset_cost();
		
		function call_time () {
			return args.time_function(improv)
		}
		
		var set_time = H.atom(id, 'time', 10, call_time);
		H.add_cvar(improv, 'time');
		it.cvars.time[id].add_atom(set_time);
		
		it.construct_ui (improv.node);
		improv.ui = improv.node.it;
		var ui = {}
			
		ui.name = H.e('td', 0, 'node_title', improv.name);
		ui.bar = H.e('td', 0, 'node_button node_button_wide');
		ui.fill = H.e('div', ui.bar, 'node_button_fill');
		ui.button_text = H.e('div', ui.bar, 'node_button_text', 'Research');
		ui.cost = H.e('div', 0, 'node_line')
		ui.time = H.e('div', 0, 'node_line')
		ui.desc = H.e('div', 0, 'node_line', improv.description);
		
		it.add_button_animation(ui.bar);
		
		ui.bar.style.width = '60%';
		
		improv.ui.add(ui.name, 'heading');
		improv.ui.add(ui.bar, 'heading');
		improv.ui.add(ui.time);
		improv.ui.add(ui.cost);
		improv.ui.add(ui.desc);
		
		ui.bar.update = function () {
			if (!improv.unlocked) return;
			if (!improv.building) {
				var c = it.dosh.consider(improv.cost);
				if (c.cant_pay||it.research.researching) H.add_class(ui.bar, 'node_button_no_press');
				else H.remove_class(ui.bar, 'node_button_no_press');
			} else {
				if (it.research.researching == improv) ui.bar.className = 'node_button node_button_wide node_button_highlight';
				else ui.bar.className = 'node_button node_button_wide';
				ui.fill.style.left = (improv.progress / improv.time * 100) + '%'
				ui.button_text.innerHTML = Math.floor(improv.progress/improv.time * 100) + '%'
			}
		}
		
		ui.cost.update = function () {
			var c = it.dosh.consider(improv.cost);
			ui.cost.innerHTML = 'Cost: ' + c.format;
		}
		
		ui.time.update = function () {
			var t = improv.time;
			var t = (improv.time - improv.progress) / (it.research.effect || 1);
			if (t<.2) ui.time.innerHTML = 'Humanity will discover this knowledge soon.'; 
			else { 
				t -= 1 - it.clock.ticks_this_aut / it.clock.aut_length;
				ui.time.innerHTML = 'Humanity will discover this knowledge ' + (t<=0 ? ' this epoch.' : (t<= 1 ? ' next epoch.' : ' in ' + Math.ceil(t) + ' epochs.'));
			}
		}
		
		improv.update = function () {
			improv.ui.update();
		}
		
		it.junction.add_node(improv, true, improv.show_in.tab, improv.show_in.section);
		
		function acquire(level) {
			if (typeof(level)!='number') level = improv.level + 1;
			improv.level = level;
			ui.name.innerHTML = improv.name + ' (' + improv.level + ')';
			if (args.apply) args.apply(improv);
			H.apply_atoms(improv);
			reset_cost();
			improv.cost.paid={};
			it.cvars.time[improv.id].update();
		}
		
		function buy() {
			var c = it.dosh.consider(improv.cost)
			if (it.research.researching||c.cant_pay) return false;
			c.pay();
			it.research.start_researching(improv);
			research();
		}
		
		function research() {
			ui.cost.style.display = 'none';
			it.each_tick.add_result(tick);
			improv.building = 1;
			it.junction.add_node(improv, true, improv.show_in.tab, 'researching');
		}
		
		function build () {
			improv.progress = 0;
			improv.building = 0;
			ui.cost.style.display = 'block';
			it.each_tick.remove_result(tick);
			it.research.stop_researching();
			ui.fill.style.left = '0%';
			var l = 'Improvement complete: '+improv.name;
			it.junction.add_node(improv, true, improv.show_in.tab, improv.show_in.section);
			it.log.add(l, 'tech');
			ui.button_text.innerHTML = 'Research';
			acquire();
		}
		
		function tick () {
			improv.progress += it.research.effect / it.clock.aut_length;
			if (improv.progress >= improv.time) build()
		}

		function click () {
			if (!improv.building) {
				buy();
				ui.bar.animate();
			}
		}
		
		ui.bar.addEventListener('click', click);
				
		improv.unlock = function (all) {
			if (improv.unlocked) return
			if (improv.locks) {
				if (all) improv.locks=0;
				else improv.locks--;
				if (improv.locks) return
			}
			improv.unlocked = 1;
			it.junction.unlock(improv.show_in.tab, improv.show_in.section);
			improv.node.style.display = 'block';
			if (it.junction.tabs[improv.show_in.tab].sections[improv.show_in.section]) it.log.add('New improvement available: ' + improv.name, 'tech')
		}
		
		improv.save_id = id;
		improv.save_parameters = {};
		
		if (args.construct) args.construct(improv);
		
		if (args.dosh) {
			improv.dosh = {
				id: args.dosh.id,
				name: args.dosh.name,
			}
			Object.defineProperty(improv.dosh, 'value', {
				get: function () {
					return improv.level;
				},
				set: function (v) {
					acquire(v)
				}
			})
			
			it.dosh.register(improv.dosh)
		}
		
		
		Object.defineProperties(improv.save_parameters, {
			progress: {
				get: function () {return improv.progress},
				set: function (x) {improv.progress = x},
				enumerable: true
			},
			building: {
				get: function () {return improv.building},
				set: function (x) {if (x) research()},
				enumerable: true
			},
			level: {
				get: function () {return improv.level},
				set: function (x) {if (x) {acquire(x)}},
				enumerable: true
			},
			unlocked: {
				get: function () {return improv.unlocked},
				set: function (x) {if (x) improv.unlock(true)},
				enumerable: true
			}
		})
		
		H.register_for_save(improv)
		
		return improv;

	},
	
	vision: function (args, id) {
		var vis = {
			id: id,
			name: args.name,
			show_in: args.show_in,
			description: args.description,
			atoms: args.atoms,
			node: H.e('div', 0, 'locked_node'),
			cost: {cost: args.cost}
		}
		
		for (i in args.cvars) {
			H.add_cvar(vis, i, args.cvars[i])
		}
		
		it.construct_ui (vis.node);
		vis.ui = vis.node.it;
		var ui = {}
		
		ui.name = H.e('td', 0, 'node_title', vis.name);
		ui.button = H.e('td', 0, 'node_button node_button_wide', 'Behold');
		ui.cost = H.e('div', 0, 'node_line', vis.cost);
		ui.desc = H.e('div', 0, 'node_line', vis.description);
		
		vis.ui.add(ui.name, 'heading');
		vis.ui.add(ui.button, 'heading');
		vis.ui.add(ui.cost);
		vis.ui.add(ui.desc);
		
		it.add_button_animation(ui.button);
		
		ui.button.update = function () {
			var c = it.dosh.consider(vis.cost)
			if (vis.bought || !c.cant_pay) H.remove_class(ui.button, 'node_button_no_press');
			else H.add_class(ui.button, 'node_button_no_press');
			if (c.had_substitution) ui.button.innerHTML = 'Buy now';
			else ui.button.innerHTML = 'Behold';
		}
		
		ui.cost.update = function () {
			ui.cost.innerHTML = 'Cost: ' + it.dosh.consider(vis.cost).format;
		}
		
		vis.update = function () {
			vis.ui.update();
		}
		
		function buy () {
			ui.button.animate();
			var c = it.dosh.consider(vis.cost)
			if (c.cant_pay) return;
			c.pay();
			acquire();
		}
		
		function acquire () {
			vis.bought = 1;
			vis.ui.remove(ui.cost);
			it.junction.add_node(vis, false, vis.show_in.tab, 'completed');
			it.junction.unlock(vis.show_in.tab, 'completed');
			if (vis.ui.revealed) vis.ui.mouseout();
			vis.node.removeEventListener('click', buy);
			vis.ui.remove(ui.button, 'heading');
			H.apply_atoms(vis);
			if (args.apply) args.apply(vis)
		}

		ui.button.addEventListener('click', buy);
		
		vis.unlock = function () {
			if (vis.unlocked) return;
			vis.unlocked = true;
			vis.node.style.display = 'block';
			it.junction.tabs[vis.show_in.tab].show();
			it.junction.tabs[vis.show_in.tab].sections[vis.show_in.section].show();
			it.log.add('You have a vision: '+vis.name, 'tech');
		}
		
		vis.save_id = id;
		vis.save_parameters = {}
		Object.defineProperties(vis.save_parameters, {
			bought: {
				get: function () {
					return vis.bought
				},
				set: function (v) {
					if (v) acquire()
				},
				enumerable: true
			},
			unlocked: {
				get: function () {
					return vis.unlocked;
				},
				set: function (v) {
					if (v) {
						vis.unlock();
					}
				},
				enumerable: true
			},
			paid: {
				get: function () {
					return vis.cost.paid;
				},
				set: function (v) {
					if (v) {
						vis.cost.paid = v;
					}
				},
				enumerable: true
			}
		})
		
		it.junction.add_node(vis, true, vis.show_in.tab, vis.show_in.section)
		H.register_for_save(vis);
		
		if (args.construct) args.construct(vis);
		
		return vis;

	},
	
	scheme: function (args, id) {
		var scheme = {
			id: id,
			name: args.name,
			show_in: args.show_in,
			apply: args.apply,
			description: args.description,
			atoms: args.atoms,
			node: H.e('div', 0, 'locked_node')
		}
		
		it.construct_ui (scheme.node);
		scheme.ui = scheme.node.it;
		var ui = {}
		
		ui.name = H.e('td', 0, 'node_title', scheme.name);
		ui.desc = H.e('div', 0, 'node_line', scheme.description);
		
		scheme.ui.add(ui.name, 'heading');
		scheme.ui.add(ui.desc);
				
		scheme.update = function () {
			scheme.ui.update();
		}
		
		scheme.unlock = function () {
			if (scheme.unlocked) return;
			scheme.unlocked = true;
			scheme.node.style.display = 'block';
			it.junction.tabs[scheme.show_in.tab].show();
			it.junction.tabs[scheme.show_in.tab].sections[scheme.show_in.section].show();
			it.log.add('You have a new scheme: '+scheme.name, 'tech');
			if (scheme.apply) scheme.apply(scheme)
		}
		
		scheme.save_id = id;
		scheme.save_parameters = {}
		Object.defineProperties(scheme.save_parameters, {
			unlocked: {
				get: function () {
					return scheme.unlocked;
				},
				set: function (v) {
					if (v) {
						scheme.unlock();
					}
				},
				enumerable: true
			}
		})
		
		function add_save_parameter (x) {
			Object.defineProperty(scheme.save_parameters, x, {
				get: function () {
					return scheme[x]
				},
				set: function (v) {
					scheme[x] = v
				},
				enumerable: true
			})
		} 
		
		for (i in args.saves) {
			add_save_parameter (args.saves[i])
		}
		
		if (scheme.show_in)	it.junction.add_node(scheme, true, scheme.show_in.tab, scheme.show_in.section)
		H.register_for_save(scheme);
		
		if (args.construct) args.construct(scheme);
		
		return scheme;
	},
	
	work: function (args, id) {
		
		var i;
		
		var work = {
			node: H.e('div', false, 'locked_node', args.name),
			id: id,
			name: args.name,
			show_in: args.show_in,
			substitutions: args.substitutions || {fabrications: {currency: 1}, knowledge: {currency: 2}},
			description: args.description,
			atoms: args.atoms,
			level: 0,
			save_id: id,
			save_parameters: {},
			percent_complete: 100,
			build_word: args.build_word || 'Construct',
			cost_function: args.cost_function,
			cost: {installments: {made: 0}}
		};
		
		var description = args.description;
		Object.defineProperty(work, 'description', {
			get: function () {return description},
			set: function (v) {description = v; ui.desc.innerHTML = H.c(v);}
		})
		
		H.add_cvar(work, 'installments', 1);

		function reset_cost() {
			work.cost.cost = work.cost_function(work);
			work.cost.installments.max = work.installments;
		}
		
		reset_cost();
		
		function set_percent () {
			work.percent_complete = work.cost.installments.made ? Math.round(work.cost.installments.made / work.installments * 100) : 100
		}
		
		it.cvars.installments[id].update.add_result(reset_cost);
		it.cvars.installments[id].update.add_result(set_percent);
			
		it.construct_ui (work.node);
		work.ui = work.node.it;
		var ui = {}
		
		ui.name = H.e('td', 0, 'node_title', work.name);
		if (!args.toggle) {
			ui.button = H.e('td', 0, 'node_button node_button_wide');
			it.add_button_animation(ui.button);
		} else {
			ui.plus = H.e('td', 0, 'node_button node_button_plus', '+');
			ui.minus = H.e('td', 0, 'node_button node_button_minus', '-')
			ui.button = H.e('td', 0, 'node_button node_button_med');
			it.add_button_animation(ui.button);
			it.add_button_animation(ui.minus);
			it.add_button_animation(ui.plus);
		}
		
		ui.fill = H.e('div', ui.button, 'node_button_fill');
		ui.fill.style.left = '100%';
		ui.button_text = H.e('div', ui.button, 'node_button_text', work.build_word);
		ui.cost = H.e('div', 0, 'node_line');
		ui.desc = H.e('div', 0, 'node_line', work.description);
		
		work.ui.add(ui.name, 'heading');
		if (!args.toggle) {
			work.ui.add(ui.button, 'heading');
		} else {
			work.ui.add(ui.plus, 'heading');
			work.ui.add(ui.minus, 'heading');
			work.ui.add(ui.button, 'heading');
		}
		work.ui.add(ui.cost);
		work.ui.add(ui.desc);
		
		work.update = function () {
			work.ui.update();
		}
		
		ui.button.update = function () {
			var c = it.dosh.consider(work.cost);
			if (c.cant_pay) H.add_class(ui.button, 'node_button_no_press'); 
			else H.remove_class(ui.button, 'node_button_no_press');
			if (c.had_substitution) ui.button_text.innerHTML = 'Buy now' + (work.percent_complete!=100 ? ' (' + work.percent_complete + '%)' : '');
			else ui.button_text.innerHTML = work.build_word + (work.percent_complete!=100 ? ' (' + work.percent_complete + '%)' : '');
			ui.fill.style.left = work.percent_complete + '%';
		}
		
		ui.cost.update = function () {
			if (work.installments==1) {
				ui.cost.innerHTML = it.dosh.consider(work.cost).format
			} else {
				ui.cost.innerHTML = 'Next installment: ' + it.dosh.consider(work.cost).format
			}
		}
		
		if (typeof(work.description)=='function') {
			ui.desc.update = function () {
				ui.desc.innerHTML = work.description();
			}
		}
		
		it.junction.add_node(work, true, work.show_in.tab, work.show_in.section)
		
		function apply_atoms (args) {
			H.apply_atoms(work)
		}
		for (i in args.cvars) {
			H.add_cvar(work, i, args.cvars[i])
			it.cvars[i][work.id].update.add_result(apply_atoms)
		}
		
		work.unlock = function (no_show) {
			it.junction.unlock(work.show_in.tab, work.show_in.section);
			if (!no_show) work.node.style.display = 'block';
			work.unlocked = true;
		}
		
		work.buy = function () {
			ui.button.animate();
			var c = it.dosh.consider(work.cost)
			if (c.cant_pay) return false;
			c.pay();
			if (c.is_paid) {
				work.cost.paid = {};
				work.cost.installments.made = 0;
				set_percent();
				work.acquire()
			} else {
				set_percent();
			}
		}
		
		work.acquire = function (level) {
			if (typeof(level)!='number') level = work.level+1;
			work.level = level;
			work.draw_name();
			apply_atoms();
			reset_cost();
			if (args.apply) args.apply(work);
			work.installments.made = 0;
		}

		work.draw_name = args.toggle ? 
			function () {
				ui.name.innerHTML = work.name + ' (' + work.on + '/' + work.level + ')';
			} :
			function () {
				ui.name.innerHTML = work.name + ' (' + work.level + ')';
			}
			
		ui.button.addEventListener('click', work.buy);
		
		if (args.toggle) {
			var on = 0;
			work.shutoff = args.toggle.shutoff;
			Object.defineProperty(work, 'on', {
				get: function () {return on},
				set: function (v) {
					on = v;
					ui.name.innerHTML = work.name + ' (' + work.on + '/' + work.level + ')';
					apply_atoms();
				}
			})
			
			work.plus = function () {
				ui.plus.animate();
				if (work.on>=work.level) return;
				work.on++;
			}
		
			work.minus = function () {
				ui.minus.animate();
				if (work.on<=0) return;
				work.on--;
			}
			
			if (work.shutoff) {
				work.check_shutoff = function () {
					if (work.shutoff(work)) {
						work.on = 0;
						work.draw_name();
						apply_atoms();
					}
				}
				it.each_tick.add_result(work.check_shutoff);
			}
			
			ui.plus.addEventListener('click', work.plus);
			ui.minus.addEventListener('click', work.minus);
			
			Object.defineProperty(work.save_parameters, 'on', {
				get: function () {return work.on},
				set: function (v) {work.on = v},
				enumerable: true
			})
		}
		
		Object.defineProperties (work.save_parameters, {
			level: {
				get: function () {return work.level},
				set: function (x) {
					if (x) work.acquire(x)
				},
				enumerable: true
			},
			cost: {
				get: function () {return work.cost},
				set: function (x) {
					if (x) {
						work.cost = H.d(x);
					}
				},
				enumerable: true
			},
			percent_complete: {
				get: function () {return work.percent_complete},
				set: function (x) {
					if (x) work.percent_complete = x;
				},
				enumerable: true
			}
		})
		
		function add_save_parameter (x) {
			Object.defineProperty(work.save_parameters, x, {
				get: function () {
					return work[x]
				},
				set: function (v) {
					work[x] = v
				},
				enumerable: true
			})
		} 
		
		for (i in args.saves) {
			add_save_parameter (args.saves[i])
		}
		
		if (args.toggle) {
			add_save_parameter (on);
		}
		
		if (args.dosh) {
			work.dosh = {
				id: args.dosh.id,
				name: args.dosh.name,
				commerce_value: args.dosh.commerce_value
			}
			Object.defineProperty(work.dosh, 'value', {
				get: function () {
					return work.level;
				},
				set: function (v) {
					work.acquire(v)
				}
			})
			
			it.dosh.register(work.dosh)
		}
		
		if (args.construct) args.construct(work)
		H.register_for_save(work)
	
		return work;

	},
	
	governance: function (args, id) {
		var gov = H.d(args);
		gov.id = id;
		gov.unlocked = true;
		return gov;
	},
	
	console: function (args, id) {
		var console = {
			id: id,
			unlocked: args.unlocked,
			name: args.name,
			node: H.e('div', 0, 'locked_node'),
			select: args.select,
			unselect: args.unselect,
			post_select: args.post_select,
			save_id: 'console_'+id,
			save_parameters: {}
		}
		
		it.construct_ui(console.node, {no_contract: true});
		console.ui = console.node.it;
		console.ui_lines = {};
		
		console.ui_lines.name = H.e('td', 0, 'node_title', console.name);
		
		console.ui.add(console.ui_lines.name, 'heading');
		
		console.update = function () {
			console.ui.update();
		}
		
		it.junction.add_node(console, true, 'exploration', 'interests')
		
		if (args.construct) args.construct(console);
		
		console.open = function () {
			if (it.world_map.selected_interest) {
				console.select (console, it.world_map.selected_interest);
				console.ui.show();
			}
		}
		
		console.close = function () {
			if (it.world_map.selected_interest) {
				console.unselect (console, it.world_map.selected_interest);
			}
			console.ui.hide()
		}
			
		
		console.unlock = function () {
			console.unlocked = 1;
		}
		
		return console;
		
	},
	
	interest: function (args, id) {
		
		var inter = {
			id: id,
			name: args.name,
			icon: args.icon + '&#65038;',
			types: args.types,
			description_expired: args.description_expired,
			atoms: args.atoms || [],
			unlocked: args.unlocked,
			discover: args.discover,
			construct: args.construct,
			flags: args.flags || [],
			efforts: args.efforts || [],
			children: [],
			unique: args.unique,
			tick_handler: args.tick_handler,
			saves: args.saves,
			consoles: args.consoles || []
		}
		
		inter.consoles.push('description');
		
		H.add_cvar(inter, 'description', args.description);
		function update_children () {
			var i;
			for (i in inter.children) {
				inter.children[i].description = inter.description
			}
		}
		it.cvars.description[inter.id].update.add_result(update_children)
				
		inter.unlock = function () {
			inter.unlocked = true;
		}
		
		function add_atom_to_child (atom_def, z) {
			inter.children[z].atoms.push({
				type: atom_def.type,
				target: atom_def.target,
				order: atom_def.order,
				func: function(x) {return atom_def.seed_func(x, inter.children[z])},
				disabled: atom_def.disabled,
				id: atom_def.id
			})
		}
		
		inter.new_atom = function (atom_def) {
			inter.atoms.push(atom_def);
			for (i in inter.children) {
				add_atom_to_child(atom_def, i);
				H.apply_atoms(inter.children[i]);
			}
		}
		
		inter.new_flag = function (args) {
			inter.flags.push(args);
			for (i in inter.children) {
				inter.children[i].flags.push(it.construct_flag(args, inter.children[i]));
			}
		};
		
		inter.new_effort = function (args) {
			inter.efforts.push(args);
			for (i in inter.children) {
				inter.children[i].efforts.push(it.construct_effort(args, inter.children[i]));
			}
		};

		inter.new_console = function (id) {
			inter.consoles.push(id);
			for (i in inter.children) {
				inter.children[i].consoles.add(id)
			}
		}
		
		H.add_cvar(inter, 'expiration_rate', 0);
		var adjust_for_aut = H.atom(id, 'expiration_date', 900, function (x) {return x / it.clock.aut_length});
		it.cvars.expiration_rate[inter.id].add_atom(adjust_for_aut)
		
		var i;
		for (i in args.cvars) {
			H.add_cvar(inter, i, args.cvars[i])
		}
		if (args.construct_parent) {
			args.construct_parent(inter);
		}
		
		return inter

	},
	
	resource: function (args, id) {
	
		var i, res = {
			id: id,
			name: args.name,
			format: args.format,
			overflow: args.overflow || (args.no_max 
				? function (new_value, old_value, maximum) {
					return new_value;
				}
				: function (new_value, old_value, maximum) {
					if (old_value>maximum) return Math.min(old_value, new_value);
					return maximum;
				}	
			),
			on_tick: args.on_tick,
			on_value_update: args.on_value_update,
			whole_values: args.whole_values,
			save_id: id,
			save_parameters: {},
			table: args.table
		}
		
		if (args.on_tick) {
			H.add_action(res, 'on_tick');
			for (i in args.on_tick) {
				res.on_tick.add_result(args.on_tick[i].f, args.on_tick[i].o)
			}
			it.each_tick.add_result(res.on_tick);
		}
		
		if (args.on_update_value) {
			H.add_action(res, 'on_update_value');
			for (i in args.on_update_value) {
				res.on_update_value.add_result(args.on_update_value[i].f, args.on_update_value[i].o)
			}
		}
		
		H.add_cvar(res, 'max', args.base_max);
		H.add_cvar(res, 'tick', args.tick);
		
		res.div = H.e('tr', it.resource_table[res.table], 'resource');
		res.name_div = H.e('td', res.div, 'resource_name', res.name);
		res.current_div = H.e('td', res.div, 'resource_current', '0');
		res.max_div = H.e('td', res.div, 'resource_max', res.max ? ' / ' + Math.floor(res.max) : '');
		res.tick_div = H.e('td', res.div, 'resource_tick');
		
		res.draw_tick = function () {
			var t = res.tick * it.clock.aut_length;
			if (t>=5) t = Math.round(t);
			else t = Math.round(t*10) / 10;
			if (t!=0) res.tick_div.innerHTML = '(' + t + ' per Epoch)';
			else res.tick_div.innerHTML = ''
		}
		it.cvars.tick[id].update.add_result(res.draw_tick);
			
		res.draw_max = function () {
			if (res.max>0) res.max_div.innerHTML = ' / ' + Math.floor(res.max);
			res.draw_value();
		}
		it.cvars.max[id].update.add_result(res.draw_max);
		
		res.draw_value = function () {
			res.current_div.innerHTML = Math.floor(value);
			res.current_div.style.color = (res.max&&value>res.max)  ? '#700' : '000'
		}
		
		var value = 0;
		Object.defineProperty(res, 'value', {
			get: function () {
				return value
			},
			set: function (v) {
				if (v>res.max) {
					value = res.overflow(v, value, res.max);
				} else {
					value = (v<0 ? 0 : v);
				}
				if (res.on_update_value) {
					var args = {value: value}
					value = res.on_update_value(args).value;
				}
				res.draw_value();
			}
		})
		
		if (res.whole_values) {
			var fraction = 0;
			Object.defineProperty(res, 'fraction', {
				get: function () {
					return fraction
				},
				set: function (v) {
					if (v>1) {
						var r = v - Math.floor(v);
						fraction = v - r;
						res.value += r;
					} else if (v<-1) {
						var r = v - Math.ceil(v);
						fraction = v - r;
						res.value += r;
					} else {
						if (value==0&&v<0) fraction = 0;
						else fraction = v;
					}
				}
			})
		}
		
		var unlocked = 0;
		Object.defineProperty(res, 'unlocked', {
			get: function () {
				return unlocked;
			},
			set: function (v) {
				unlocked = v;
				if (unlocked) res.div.style.display = 'table-row';
				else res.div.style.display = 'none';
			}
		})
		
		res.unlock = function () {res.unlocked = 1}
		
		it.clock.register_tick(id, res.whole_values ? 'fraction' : 'value');
		
		Object.defineProperty(res.save_parameters, 'value', {
			get: function () {
				return value;
			},
			set: function (v) {
				value = v;
			},
			enumerable: true
		})
		
		function add_save_value(save_name) {
			Object.defineProperty (res.save_parameters, save_name, {
				get: function () {
					return res[save_name];
				},
				set: function (v) {
					res[save_name] = v;
				},
				enumerable: true
			})
		}
		
		var save_list = ['unlocked']
		if (res.whole_values) save_list.push('fraction');
		
		for (i in save_list) add_save_value(save_list[i]);
		for (i in args.saves) add_save_value(args.saves[i]);
		
		if (args.construct) args.construct(res);
		
		H.register_for_save(res);
		it.dosh.register(res);
		
		if (args.warehousing) {
			var warehousing = {
				id: 'warehouse_'+id,
				name: args.warehousing.name,
				cost: {cost: args.warehousing.cost},
				sell: {cost: args.warehousing.sell}
			}

			function w_apply_atoms () {
				H.apply_atoms(warehousing)
			}

			H.add_cvar(warehousing, 'effect', args.warehousing.effect);
			it.cvars.effect[warehousing.id].update.add_result(w_apply_atoms, 999);

			warehousing.atoms = [
				{
					type: 'max',
					target: id,
					order: 400,
					func: function (x) {
						return x + warehousing.effect * warehousing.value
					}
				},
				{
					type: 'value',
					target: 'warehouse',
					order: 400,
					func: function (x) {
						return x + warehousing.value
					}
				}
			]

			warehousing.node = H.e('tr', it.resource_table[3], 'resource');
			warehousing.node.name = H.e('td', warehousing.node, 'resource_name', warehousing.name);
			warehousing.node.current = H.e('td', warehousing.node, 'resource_current', '0');
			warehousing.node.plus = H.e('td', warehousing.node, 'table_button', '+');
			warehousing.node.minus = H.e('td', warehousing.node, 'table_button', '-');
			
			it.add_button_animation(warehousing.node.plus);
			it.add_button_animation(warehousing.node.minus);

			var w_value = 0;
			Object.defineProperty(warehousing, 'value', {
				get: function () {
					return w_value
				},
				set: function (v) {
					w_value = v;
					warehousing.draw_value();
					w_apply_atoms();
				}
			})

			warehousing.draw_value = function () {
				warehousing.node.current.innerHTML = w_value;
			}

			function w_plus () {
				warehousing.node.plus.animate();
				var c = it.dosh.consider(warehousing.cost)
				if (c.cant_pay || !it.warehouse.has_space()) return;
				c.pay();
				warehousing.cost.paid={};
				warehousing.value+=1
			}
			function w_minus () {
				warehousing.node.minus.animate();
				var c = it.dosh.consider(warehousing.sell)
				if (c.cant_pay || warehousing.value<=0) return;
				c.pay();
				warehousing.sell.paid={};
				warehousing.value-=1
			}
			function w_plus_tooltip (e) {
				var t = 'Cost: '+it.dosh.consider(warehousing.cost).format + '<br>';
				t += 'Allocate space in storage for ' + res.name + '.';
				it.tooltip.show(e, t, 'Build ' + warehousing.name)
			}
			function w_minus_tooltip (e) {
				var t = 'Cost: '+it.dosh.consider(warehousing.sell).format + '<br>';
				t += 'Deallocate space in storage for ' + res.name + ', freeing space for other resources.';
				it.tooltip.show(e, t, 'Remove ' + warehousing.name)
			}

			warehousing.unlock = function () {
				warehousing.unlocked = true;
				warehousing.node.style.display = 'table-row'
			}

			warehousing.node.plus.addEventListener('click', w_plus);
			warehousing.node.plus.addEventListener('mouseover', w_plus_tooltip);
			warehousing.node.plus.addEventListener('mouseout', it.tooltip.hide);
			warehousing.node.minus.addEventListener('click', w_minus);
			warehousing.node.minus.addEventListener('mouseover', w_minus_tooltip);
			warehousing.node.minus.addEventListener('mouseout', it.tooltip.hide);

			warehousing.save_id = 'warehousing_'+id;
			warehousing.save_parameters = {}

			Object.defineProperties(warehousing.save_parameters, {
				value: {
					get: function () {return warehousing.value},
					set: function (x) {warehousing.value = x},
					enumerable: true
				},
				unlocked: {
					get: function () {return warehousing.unlocked},
					set: function (x) {if (x) warehousing.unlock()},
					enumerable: true
				}
			})

			it.warehousing[warehousing.id] = warehousing;
			H.register_for_save(warehousing)
		}
		
		
		return res
		
	},

	job: function (args, id) {
		
		var i, job = {
			id: id,
			tooltip: args.tooltip,
			atoms: args.atoms || [],
			experience_level: 0,
			next_level: 0.3,
			levels: args.levels,
			traditions: {
				node: H.e('div', 0, 'locked_node'),
				enabled: []
			},
			species: []
		};
		
		// Task UI
		
		it.construct_ui (job.traditions.node);
		job.traditions.ui = job.traditions.node.it;
		var task_ui = {}
		
		task_ui.name = H.e('td', 0, 'node_title', args.name);
		task_ui.bar = H.e('td', 0, 'node_button node_button_wide');
		task_ui.fill = H.e('div', task_ui.bar, 'node_button_fill');
		task_ui.button_text = H.e('div', task_ui.bar, 'node_button_text');
		//task_ui.tradition_count = H.e('div', 0, 'node_line', 'Traditions: None');
		//task_ui.tradition_box = H.e('div', 0, 'node_line')
		
		task_ui.advancement = H.e('div', 0, 'node_line');
		task_ui.max_workers = H.e('div', 0, 'node_line');
		
		job.traditions.update = function () {
			job.traditions.ui.update();
		}
		
		task_ui.bar.update = function () {
			var p = (experience / job.next_level * 100)
			task_ui.fill.style.left = p + '%';
			task_ui.button_text.innerHTML = Math.floor(p) + '%';
		}
		task_ui.max_workers.update = function () {
			task_ui.max_workers.innerHTML = 'Maximum effective followers: ' + Math.round((1 / (1 - it.species.humans.jobs[id].efficiency))-1);
		}
		task_ui.advancement.update = function () {
			var t = job.next_level - experience;
			var r = it.species.humans.xp_values[it.species.humans.jobs[id].rank];
			if (!r) return task_ui.advancement.innerHTML = 'Assign more followers to practice this task.';
			t /= r;
			t -= 1 - it.clock.ticks_this_aut / it.clock.aut_length;
			task_ui.advancement.innerHTML = 'Your followers will improve their performance on this task ' + (t<=0 ? ' this epoch.' : (t<= 1 ? ' next epoch.' : ' in ' + Math.ceil(t) + ' epochs.'));
		}
		
		job.traditions.ui.add(task_ui.name, 'heading');
		job.traditions.ui.add(task_ui.bar, 'heading');
		job.traditions.ui.add(task_ui.max_workers);
		job.traditions.ui.add(task_ui.advancement);
		//job.traditions.ui.add(task_ui.tradition_count);
		//job.traditions.ui.add(task_ui.tradition_box);
		
		it.junction.add_node(job.traditions, true, 'tasks', 'task_section');
		
		/*job.add_tradition = function (tradition) {
			task_ui.tradition_box.appendChild(tradition.node);
		}

		job.traditions.enable = function (tradition) {
			if (job.traditions.enabled.length>=job.level) return false;
			if (job.traditions.enabled.indexOf(tradition)!=-1) return false;
			job.traditions.enabled.push(tradition);
			draw_tradition_count();
			return true;
		}

		job.traditions.disable = function (tradition) {
			var k = job.traditions.enabled.indexOf(tradition);
			if (k!=-1) job.traditions.enabled.splice(k,1);
			draw_tradition_count();
		}*/
				
		// Helper functions
		
		/*function draw_tradition_count () {
			task_ui.tradition_count.innerHTML = 'Traditions: '+job.traditions.enabled.length+'/'+job.experience_level;
		};*/
		
		function apply_atoms() {
			H.apply_atoms(job)
		};
		
		function show_tooltip (e) {
			it.tooltip.show(e, tooltip, job.name)
		};
				
		function level_up (args) {
			var i;
			job.experience = 0;
			job.experience_level += 1;
			if (job.experience_level<=2) job.next_level = [0.3, 1.5, 7][job.experience_level];
			else job.next_level = 16 * (job.experience_level - 2);
			var report = 'Your ' + job.name + 's advance their skills.';
			if (job.levels&&job.levels[job.experience_level]) report = job.levels[job.experience_level](job, report);
			if (!args||!args.silent) {
				it.log.add(report, 'tech');
			};
			for (i in job.species) {
				it.cvars.efficiency[job.species[i].jobs[id].id].update();
			};
			//draw_tradition_count ()
		};

		// Define cvars
			
		H.add_cvar(job, 'name', args.name);
		H.add_cvar(job, 'description', args.description);
		H.add_cvar(job, 'count', 0);
		
		it.cvars.count[id].update.add_result(apply_atoms);
		
		for (i in args.cvars) {
			H.add_cvar(job, i, args.cvars[i])
			it.cvars[i][job.id].update.add_result(apply_atoms, 999);
		}
		
		for (i in args.generates) {
			H.add_cvar(job, i + '_effect', args.generates[i])
			it.cvars[i+'_effect'][job.id].update.add_result(apply_atoms, 999);
			job.atoms.push(function (x) {return {
				type: 'tick',
				target: x,
				order: 400,
				func: function (z) {
					job[x+'_total_effect'] = job.count * job[x+'_effect'];
					return z + job[x+'_total_effect'];
				}
			}}(i))
		}
		
		// Properties
		
		job.unlock = function () {
			job.unlocked = 1;
			job.traditions.node.style.display = 'block';
		}
		
		var experience= 0;
		Object.defineProperties(job, {
			experience: {
				get: function () {return experience},
				set: function (v) {
					experience = v;
					if (experience >= job.next_level) level_up()
				}
			}
		})	
			
		// Save stuff
		
		job.save_id = job.id;
		job.save_parameters = {}
		Object.defineProperties(job.save_parameters, {
			experience_level: {
				get: function () {
					return job.experience_level
				},
				set: function (v) {
					var i;
					for (i=0; i<v; i++) level_up({silent: true, no_xp: true});
				},
				enumerable: true
			},
			experience: {
				get: function () {
					return experience;
				},
				set: function (v) {
					job.experience = v;
				},
				enumerable: true
			}
		})
		
		if (args.unlocked) job.unlock()
		
		H.register_for_save(job)
		
		return job
	},
	
	species: function (args, id) {
		
		var i, species = {
			id: id,
			name: args.name,
			atoms: [{
				target: args.food_type,
				type: 'tick',
				order: 900,
				func: function (x) {return x -= value * species.food_use}
			}],
			food_type: args.food_type,
			on_starve: args.on_starve,
			overflow: args.overflow,
			jobs: args.jobs,
			default_job: args.default_job,
			node: H.e('div', 0, 'species'),
			value_display: H.e('tr', it.resource_table[0], 'resource'),
			save_id: 'species_' + id,
			save_parameters: {}
		}
		
		it.junction.add_node(species, false, 'cult', id);
		
		function recompute_efficiency() {
			for (i in species.jobs) {
				it.cvars.efficiency[species.jobs[i].id].compute_value();
			}
		}
		
		function apply_atoms() {
			H.apply_atoms(species)
		}
		
		function post_assign_change () {
			for (i in species.jobs) {
				species.jobs[i].target = species.jobs[i].count;
			}
			draw_jobs();
			species.update_jobs();
			apply_atoms()
		}
		
		function cap_value () {
			if (species.value>species.max&&species.overflow&&H.time_moving) {
				species.overflow(species, species.value - species.max)
			}
		}
		
		function draw_jobs () {
			for (i in species.jobs) {
				species.jobs[i].name.innerHTML = it.jobs[i].name + ': ' + species.jobs[i].count;
			}
		}
		
		function draw_max () {
			if (species.max) species.max_div.innerHTML = '/ ' + species.max;
		}

		function redistribute () {
			var job_array= {fixed: [], priority: [], other: []};
			var ratios = {fixed: 0, priority: 0, other: 0};
			var order = ['fixed', 'priority', 'other'];
			var remaining = value;
			
			var i, ii, iii, category;
			
			for (i in species.jobs) {
				if (species.jobs[i].unlocked) {
					if (it.jobs[i].fixed) category = 'fixed';
					else if (species.jobs[i].priority) category = 'priority';
					else category = 'other';
					job_array[category].push({count: species.jobs[i].target, id: i})
					ratios[category] += species.jobs[i].target
			}}		
			
			for (i in order) {
				var cat = order[i];
				var outstanding_count = 0;
				for (ii = Number(i) + 1; ii < order.length; ii++) {
					outstanding_count += ratios[order[ii]]
				}
				if (ratios[cat] <= remaining && outstanding_count > 0) {
					for (ii in job_array[cat]) {
						species.jobs[job_array[cat][ii].id].count = job_array[cat][ii].count;
					}
					remaining -= ratios[cat];
				} else if (remaining <= 0) {
					for (ii in job_array[cat]) {
						species.jobs[job_array[cat][ii].id].count = 0;
					}
				} else {
					var base_count = 0;
					var remainder_array = [];
					for (ii in job_array[cat]) {
						var k = job_array[cat][ii].count / (ratios[cat] || 1) * remaining;
						job_array[cat][ii].base = Math.floor(k);
						job_array[cat][ii].remainder = k - job_array[cat][ii].base;
						base_count += job_array[cat][ii].base;
						for (iii=0; iii < remainder_array.length; iii++) {
							if (job_array[cat][ii].remainder>remainder_array[iii].remainder) {
								remainder_array.splice(iii,0,job_array[cat][ii]);
								break;
							} else if (job_array[cat][ii].remainder == remainder_array[iii].remainder) {
								if (H.r()<.5) {
									remainder_array.splice(iii,0,job_array[cat][ii]);
									break;
								}
							}
						}
						if (iii>=remainder_array.length) remainder_array.push(job_array[cat][ii])
					}
					var remainder_count = remaining - base_count;
					for (ii in remainder_array) {
						species.jobs[remainder_array[ii].id].count = remainder_array[ii].base + (remainder_count > 0 ? 1 : 0);
						remainder_count --;
						remaining -= species.jobs[remainder_array[ii].id].count
					}							
				}
			}
		}
		
		function add_job (z) {
			species.jobs[z].id = species.id + '_' + z;
			if (it.jobs[z].species.indexOf(species)==-1) it.jobs[z].species.push(species);
			if (!species.jobs[z].multiplier) species.jobs[z].multiplier = 1;
			species.jobs[z].count = 0;
			species.jobs[z].ui = H.e('div', species.node, 'job_holder');
			species.jobs[z].name = H.e('div', species.jobs[z].ui, 'job_name', it.jobs[z].name + ': 0');
			H.add_cvar(species.jobs[z], 'efficiency', species.jobs[z].base_efficiency||5);
			var final_efficiency = H.atom(species.jobs[z].id, 'efficiency', 1000, function (x) {return 1 - 1/(x + species.efficiency_mod)});
			it.cvars.efficiency[species.jobs[z].id].add_atom(final_efficiency);
			it.cvars.efficiency[species.jobs[z].id].update.add_result(apply_atoms);
			H.add_cvar(species.jobs[z], 'busy', 0);
			it.cvars.busy[species.jobs[z].id].update.add_result(apply_atoms);
			if (species.default_job==z) {
				species.jobs[z].target = 1;
				species.unlock_job(species.default_job);
			} else {
				species.jobs[z].target = 0;
				species.jobs[z].plus = H.e('div', species.jobs[z].ui, 'job_plus_button', '+');
				it.add_button_animation(species.jobs[z].plus);
				species.jobs[z].minus = H.e('div', species.jobs[z].ui, 'job_minus_button', '-');
				it.add_button_animation(species.jobs[z].minus);
				species.jobs[z].click_plus = function (e) {
					species.jobs[z].plus.animate();
					n = Math.min(species.jobs[species.default_job].count, e.shiftKey ? 5 : 1);
					if (n<=0) return;
					species.jobs[species.default_job].count -= n;
					species.jobs[z].count += n;
					post_assign_change();
				};
				species.jobs[z].click_minus = function (e) {
					species.jobs[z].minus.animate();
					n = Math.min(species.jobs[z].count, e.shiftKey ? 5 : 1);
					if (n<=0) return;
					species.jobs[species.default_job].count += n;
					species.jobs[z].count -= n;
					post_assign_change();
				};
				species.jobs[z].plus.addEventListener('click', species.jobs[z].click_plus);
				species.jobs[z].minus.addEventListener('click', species.jobs[z].click_minus);
			};
			species.atoms.push({
				target: z,
				type: 'count',
				order: 400,
				func: function (x) {
					var c = species.jobs[z].count - species.jobs[z].busy
					return x + c * species.jobs[z].multiplier * Math.pow(species.jobs[z].efficiency, c - 1)}
			})
		}
		
		function add_save_parameter (x) {
			Object.defineProperty(species.save_parameters, x, {
				get: function () {
					return species[x]
				},
				set: function (v) {
					species[x] = v
				},
				enumerable: true
			})
		}
		
		species.unlock_job = function (job_id) {
			if (species.jobs[job_id]) {
				species.jobs[job_id].ui.style.display = 'block';
				species.jobs[job_id].unlocked = 1;
				it.jobs[job_id].unlock();
			}
		}
			
		H.add_cvar(species, 'max', 0);
		H.add_cvar(species, 'food_use', args.food_use);
		H.add_cvar(species, 'efficiency_mod', 0);
				
		it.cvars.max[id].update.add_result(cap_value);
		it.cvars.max[id].update.add_result(draw_max);
		it.cvars.food_use[id].update.add_result(apply_atoms);
		it.cvars.efficiency_mod[id].update.add_result(recompute_efficiency, 600)
		it.cvars.efficiency_mod[id].update.add_result(apply_atoms, 700);
		
		H.add_action(species, 'update_value', args.update_value);
		for (i in args.update_value) species.update_value.add_result(args.update_value[i].f, args.update_value[i].o);
		H.add_action(species, 'update_jobs', args.update_jobs);
		for (j in args.update_jobs) species.update_jobs.add_result(args.update_jobs[j].f, args.update_jobs[j].o);
		
		for (i in species.jobs) add_job(i);
			
		var value = 0;
		
		Object.defineProperties(species, {
			value: {
				get: function () {return value},
				set: function (v) {
					if (value == v) return;
					species.value_display.style.display = 'table-row';
					value = v;
					species.current_div.innerHTML = value;
					cap_value();
					redistribute();
					species.update_value();
					species.update_jobs();
					apply_atoms();
					draw_jobs();
				}
			}
		})
		
		H.add_counter(species, {
			name: 'starvation',
			increment: function (me) {
				var x = ((me.value>0&&it.resources[species.food_type].value<=0&&it.resources[species.food_type].tick<0)? -it.resources[species.food_type].tick : -species.counters.starvation.count);
				return x
				},		
			max: species.food_use/20,
			result: function (args) {
				species.on_starve(species)
			}
		});
		
			
		species.name_div = H.e('td', species.value_display, 'resource_name', species.name);
		species.current_div = H.e('td', species.value_display, 'resource_current', '0');
		species.max_div = H.e('td', species.value_display, 'resource_max');
		species.tick_div = H.e('td', species.value_display, 'resource_tick');
		
		for (i in args.saves) {
			add_save_parameter (args.saves[i])
		}
		add_save_parameter('value');
		
		species.unlock = function () {
			species.unlocked=1;
			it.junction.unlock('cult', species.id)
		}
		
		Object.defineProperties(species.save_parameters, {
			jobs: {
				get: function () {
					var r = {}, i;
					for (i in species.jobs) {
						r[i] = {
							count: species.jobs[i].count,
							target: species.jobs[i].target,
							rank: species.jobs[i].rank
						}
					};
					return r
				},
				set: function (v) {
					var i;
					for (i in v) {
						species.jobs[i].count = v[i].count;
						species.jobs[i].target = v[i].target;
						species.jobs[i].rank = v[i].rank;
					}
					draw_jobs();
					apply_atoms();
				},
				enumerable: true
			},
			unlocked: {
				get: function () {
					return unlocked
				},
				set: function (v) {
					species.unlock();
				}
			}
		})
		
		
		if (args.initialize) args.initialize(species);
		
		H.register_for_save(species);
		it.dosh.register(species);
		return species
	}


};

var plurals = {
	deity: 'deities', 
	species: 'species',
	faux_resource: 'resources'
}
it.warehousing = {};
it.ids = {};

var id, p;
for (id in data.object_data) {
	p = plurals[data.object_data[id].object_type] || data.object_data[id].object_type + 's'
	it.ids[id] = it.constructors[data.object_data[id].object_type](data.object_data[id], id);
	if (!it[p]) it[p]={};
	it[p][id] = it.ids[id];
}
