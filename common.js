// The H object

H = {
	
	atom: function (target, type, order, func) {
		return {
			target: target,
			type: type,
			order: order,
			func: func
		}
	},
	
	c: function (x, y) {
		if (typeof(x)=='function') return x(y);
		return x
	},
	
	d: function(x) {
		var r = {}, i;
		for (i in x) r[i]=x[i];
		return r;
	},
	
	e: function (x, y, z, w) {
		var r = document.createElement(x);
		if (y) {
			if (y.add_node) y.add_node(r)
			else y.appendChild(r);
		}
		if (z) r.className = z;
		if (w) r.innerHTML = w;
		return r;
	},
	
	g: function (m, d) {
		var u = Math.random(), v = Math.random();
	
		return m + d * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
	},
	
	r: function (x) {
		if (x) return Math.floor(Math.random()*x)+1
		return Math.random()
	},
	
	t: function (t) {
		t *= it.clock.time_adjustment;
		var m = Math.max(0, Math.floor(t/60)), s = Math.max(0, Math.floor(t%60));
		s = (s<10 ? '0'+s : s)
		return m + ':' + s
	},
	
	l2: Math.log(2),
	
	log2: function (x) {
		return Math.log(x) / H.l2;
	},
	
	add_class: function (e, c) {
		if (e.className.search(c)!=-1) return;
		e.className = e.className + ' ' + c
	},
	
	remove_class: function (e, c) {
		e.className = e.className.replace(c, '');
		e.className = e.className.replace('  ', ' ');
	},
	
	keyDown: function (e) {
		if (e.keyCode=16) H.shift_key = true;
	},

	keyUp: function (e) {
		if (e.keyCode=16) H.shift_key = true;
	},
	
	add_action: function (obj, name) {
		var results = [], order = [];
		
		function action (x) {
			var i, args = H.d(x);
			args.parent = obj;
			args.cancel_action = false;
			for (i in results) {
				results[i](args);
				if (args.cancel_action) return args;
			}
			return args
		}
		
		function add_result (f, o) {
			if (results.indexOf(f)!=-1) return;
			if (typeof(f)!='function') {
				console.log(f);
				console.log(obj);
				console.log(name);
			}
			if (!o) o=500;
			for (i=0; i<order.length; i++) {
				if (o < order[i]) {
					results.splice(i, 0, f);
					order.splice(i, 0, o);
					return;
				}
			}
			results.push(f);
			order.push(o)
		}
		
		function remove_result (f) {
			var k = results.indexOf(f);
			if (k==-1) return;
			results.splice(k,1);
			order.splice(k,1);
		}
		
		Object.defineProperty(action, 'add_result', {value: add_result})
		Object.defineProperty(action, 'remove_result', {value: remove_result})
		Object.defineProperty(action, 'result_list', {get: function () {return results}})
		obj[name] = action;
	
	},
		
	update_all_cvars: function (args) {
		var i, j;
		for (i in it.cvars) {
			for (j in it.cvars[i]) {
				it.cvars[i][j].update(args);
			}
		}
	},
	
	add_cvar: function (obj, name, initial_value) {
		
		var value, atoms = [], handler = {};
		
		if (!initial_value) initial_value = 0;
		
		H.add_action(handler, 'update');
		
		handler.tag = obj.id + '_' + name;
				
		function compute_value(args) {
			if (!args) args = {};
			if (args.debug) {
				var set_stop_here = 1
			}
			args.old_value = value;
			var i, x = initial_value;
			for (i in atoms) {
				if (typeof(atoms[i].func)!='function') console.log(atoms[i]);
				if (!atoms[i].disabled) x = atoms[i].func(x, obj);
			}
			args.value = x;
			value = x;
		}
		
		handler.update.add_result(compute_value, 500);
		
		function add_atom(a) {
			if (atoms.indexOf(a)!=-1) {
				if (H.time_moving) handler.update();
				return;
			}
			var i;
			for (i=0; i<atoms.length; i++) {
				if (a.order <=atoms[i].order) {
					atoms.splice(i, 0, a);
					if (H.time_moving) handler.update();
					return;
				}
			}
			atoms.push(a);
			if (H.time_moving) handler.update();
		}
		
		function remove_atom(a) {
			var k = atoms.indexOf(a);
			if (k==-1) return;
			atoms.splice(k,1);
			if (H.time_moving) handler.update();
		}
		
		function get_value() {
			return value;
		}
		
		Object.defineProperty(obj, name, {get: get_value});
		Object.defineProperty(handler, 'value', {get: get_value});
		Object.defineProperty(handler, 'add_atom', {value: add_atom});
		Object.defineProperty(handler, 'remove_atom', {value: remove_atom});
		Object.defineProperty(handler, 'compute_value', {value: compute_value});
		Object.defineProperty(handler, 'atom_list', {get: function () {return atoms}}); // for debugging
				
		if (!it.cvars[name]) it.cvars[name] = {};
		it.cvars[name][obj.id] = handler;	

		compute_value();
		
	},
	
	add_counter: function (obj, args) {
	
		var counter = {
			id: obj.id + '_counter_' + args.name,
			random: args.random,
			increment: args.increment,
			base_max: args.max
		}
			
		var saves = {};
		var count = 0;
		var set_max = 0;
		
		H.add_cvar(counter, 'max', args.max);
		
		var max_setter = {
			target: counter.id,
			type: 'max',
			order: 10,
			func: function (x) {return set_max}
		}
		
		function adjust_count (args) {
			if (args.old_value&&!args.clock_start) count *= args.value / args.old_value;
		}
		
		it.cvars.max[counter.id].update.add_result(adjust_count);
		
		if (counter.random) {
			var max_roll = H.g(1, 1/5);
			Object.defineProperty(counter, 'max_roll', {
				get: function () {return max_roll},
				set: function (v) {
					max_roll = v;
					it.cvars.max[counter.id].compute_value()
				}
			});
			function randomize_max (x) {
				return x * max_roll;
			};
			saves[args.name+'_max_roll'] = {
				get: function () {return max_roll},
				set: function (v) {counter.max_roll = v},
				enumerable: true
			};
			var reset_roll = function (args) {
				counter.max_roll = H.g(1, 1/5);
			};
		}
		
		Object.defineProperties(counter, {
			count: {
				get: function () {return count},
				set: function (v) {count = v}	
			},
			set_max: {
				get: function () {return set_max},
				set: function (v) {
					set_max = v;
					it.cvars.max[counter.id].add_atom(max_setter);
				}
			}
			
		})
		
		var saves = {}
		if (counter.random) {
			saves[args.name+'_max_roll'] = {
				get: function () {return max_roll},
				set: function (v) {counter.max_roll = v},
				enumerable: true
			}
		};
		saves[args.name+'_counter'] = {
			get: function () {return count},
			set: function (v) {count = v},
			enumerable: true
		};
		saves[args.name+'_set_max'] = {
			get: function () {return set_max},
			set: function (v) {if (v) counter.set_max = v},
			enumerable: true
		};
								
		H.add_action(counter, 'outcome');
		if (counter.random) counter.outcome.add_result(reset_roll, 100);
		counter.outcome.add_result(args.result, 500);
		
		var tick = function () {
			count += counter.increment(obj);
			if (count >= counter.max) {
				count -= counter.max;
				counter.outcome();
			}
		}
		
		// debugging
		counter.get_tick = function () {return count};
		
		counter.start = function () {
			it.each_tick.add_result(tick);
		}
		counter.stop = function () {
			it.each_tick.remove_result(tick);
		}
		
		if (!obj.counters) obj.counters={}
		obj.counters[args.name] = counter
		
		Object.defineProperties(obj.save_parameters, saves)
				
		if (!args.dont_start) counter.start();
		
	},
	
	apply_atom: function (obj) {
		if (obj.target) {
			if (!it.cvars[obj.type]) console.log('Tried to apply atom to bad type: ' + obj.type);
			if (!it.cvars[obj.type][obj.target]) {
				console.log('Tried to apply atom to bad target: ' + obj.target)
			}
			else it.cvars[obj.type][obj.target].add_atom(obj)
		} else if (obj.targets) {
			var i;
			for (i in obj.targets) {
				if (!it.cvars[obj.type]) console.log('Tried to apply atom to bad type: ' + obj.type);
				if (!it.cvars[obj.type][obj.targets[i]]) console.log('Tried to apply atom to bad target: ' + obj.target[i])
				else it.cvars[obj.type][obj.targets[i]].add_atom(obj)
			}
		}
	},
	
	apply_atoms: function (obj) {
		var i, z;
		for (i in obj.atoms) {
			H.apply_atom(obj.atoms[i]);
		}
	},
	
	remove_atoms: function (obj) {
		var i, z;
		for (i in obj.atoms) {
			z = obj.atoms[i];
			it.cvars[z.type][z.target].remove_atom(z)
		}
	},
	
	compress: function (x) {
		return LZString.compressToBase64(x)
	},
	
	uncompress: function (x) {
		return LZString.decompressFromBase64(x)
	},
	
	saveables: {
	},
	
	save_game: function () {
		var i, j, save_file = {};
		
		for (i in H.saveables) {
			save_file[i] = {};
			for (j in H.saveables[i].save_parameters) {
				save_file[i][j] = H.saveables[i].save_parameters[j];
			}
		}
		
		save_file = JSON.stringify(save_file);
		it.last_save = save_file;
		save_file = H.compress(save_file);
		it.export_text = save_file;
		
		localStorage.humbas_it = save_file
	},
	
	on_load: [],
	
	load_game: function (save_file) {
		
		if (!save_file) save_file = localStorage.humbas_it
		
		H.loading_game = true;
		
		var i, j;
		
		save_file = H.uncompress(save_file);
		if (save_file=='') return;
		save_file = JSON.parse(save_file);
		
		for (i in save_file) {
			for (j in save_file[i]) {
				if (H.saveables[i]) H.saveables[i].save_parameters[j] = save_file[i][j]
			}
		}
		
		for (i in H.on_load) {
			H.on_load[i]();
		}
		
		H.loading_game = false;
	},
	
	replace_save: function (x) {
		
		if (!x) delete localStorage.humbas_it;
		else localStorage.humbas_it = x;
		location.reload();
		
	},
	
	register_for_save: function (obj) {
		
		if (!obj.save_id) console.log(obj)
		H.saveables[obj.save_id] = obj;
		
	}
	
}


// The it object

it = {	
	cvars: {},
	
	version_info: {
		save_id: 'version_info',
		version: '0.0.0',
		save_parameters: {
		}
	}
}

H.add_action(it, 'each_tick');
H.add_action(it, 'each_aut');

// Version saving/loading

Object.defineProperty(it.version_info.save_parameters, 'version', 
	{
		get: function () {
			return it.version_info.version
		},
		set: function () {
			// Do versioning updates here
		},
		enumerable: true
	}
)

H.register_for_save(it.version_info)