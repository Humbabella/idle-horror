data = {
	
	tabs: [
		{
			id: 'temple',
			name: '???',
			show: true,
			sections: [
				{
					id: 'expand',
					name: 'Expansion',
					show: true
				},
				{
					id: 'acts',
					name: 'Acts',
				},
				{
					id: 'schemes',
					name: 'Schemes'
				},
				{
					id: 'visions',
					name: 'Visions',
				},
				{
					id: 'completed',
					name: 'Completed'
				}
			]
		},
		{
			id: 'cult',
			name: 'Followers',
			sections: [
				{
					id: 'humans',
					name: 'Followers',
					show: true
				},
				{
					id: 'ghouls',
					name: 'Ghouls',
				},
				{
					id: 'beasts',
					name: 'Beasts'
				}
			]
		},
		{
			id: 'social',
			name: 'Culture',
			sections: [
				{
					id: 'professions',
					name: 'Professions'
				},
				{
					id: 'governance',
					name: 'Governance'
				}
			]
		},
		{
			id: 'research',
			name: 'Research',
			sections: [
				{
					id: 'researching',
					name: 'Researching',
					show: true
				},
				{
					id: 'technology',
					name: 'Technology'
				},
				{
					id: 'society',
					name: 'Society'
				},
				{
					id: 'religion',
					name: 'Religion'
				},
				{
					id: 'science',
					name: 'Science'
				},
				{
					id: 'improvements',
					name: 'Improvements',
				},
				{
					id: 'completed',
					name: 'Completed'
				}
			]
		},
		{
			id: 'works',
			name: 'Works',
			sections: [
				{
					id: 'buildings',
					name: 'Enclave'
				},
				{
					id: 'monuments',
					name: 'Monuments'
				},
				{
					id: 'completed',
					name: 'Completed'
				}
			]
		},
		{
			id: 'exploration',
			name: 'Exploration',
			sections: [
				{
					id: 'maps',
					name: 'Maps'
				},
				{
					id: 'expeditions',
					name: 'Expeditions',
					show: true
				},
				{
					id: 'interests',
					name: 'Point of Interest'
				}
			]
		},
		{
			id: 'heavens',
			name: 'The Heavens',
			sections: [
				{
					id: 'starchart',
					name: 'Starchart',
					show: true
				},
				{
					id: 'deities',
					name: 'Signs',
					show: true
				}
			]
		}
	],
	
	object_data: {
		log_all: {
			object_type: 'sub_log',
			name: 'All'
		},
		log_advancement: {
			object_type: 'sub_log',
			name: 'Advancement',
			condition: function (b) {return b=='tech'}
		},
		log_death: {
			object_type: 'sub_log',
			name: 'Catastrophe',
			condition: function (b) {return b=='big_death'}
		},
		worshipper: {
			object_type: 'job',
			name: 'Worshipper',
			tooltip: function (me) {
				return 'Generates ' + me.influence_effect * 30 + ' infuence per Epoch.'
			},
			cvars: {influence_effect: 15},
			unlocked: true,
			atoms: [
				{
					type: 'gather',
					target: 'influence',
					order: 400,
					func: function (x, me) {
						return x + me.count * me.influence_effect
					}
				}
			]
		},
		hunter: {
			object_type: 'job',
			name: 'Hunter',
			tooltip: function (me) {
				return 'Generates ' + me.food_effect + ' sustenance per Epoch.'
			},
			guild: true,
			generates: {food: 200}
		},
		farmer: {
			object_type: 'job',
			name: 'Farmer',
			tooltip: function (me) {
				return 'Produces ' + me.farmer_production + ' per epoch if you have sufficient farms to hold all production.'
			},
			guild: true,
			cvars: {farmer_production: 400},
			atoms: [
				{
					type: 'production',
					target: 'farm',
					order: 400,
					func: function (x, me) {
						return x + me.count * me.farmer_production
					}
				}
			]
		},
		labourer: {
			object_type: 'job',
			name: 'Labourer',
			generates: {labour: 50, ore: 0, rarities: 0, food: 0},
			tooltip: function (me) {
				var t = 'Generates '+me.labour_effect+' labour per Epoch, and increases the maximum amount of labour that can be stored by the same amount.<br><br>If labourers are unassigned, existing labour will not be lost, but total labour will not increase as long as it is above the maximum.';
				if (me.fragment_effect)  t+='<br><br>Each labourer will also find '+me.fragment_effect+' per Epoch.'
				return t;
			},
			guild: true,
			atoms: [
				{
					type: 'max',
					target: 'labour',
					order: 400,
					func: function (x, me) {
						return x + me.count * me.labour_effect
					}
				}
			]
		},
		manufacturer: {
			object_type: 'job',
			name: 'Manufacturer',
			generates: {fabrications: 50},
			tooltip: function (me) {
				return 'Generates '+me.fabrications_effect+' fabrications per Epoch.'
			},
			guild: true,
		},
		contemplative: {
			object_type: 'job',
			name: 'Contemplative',
			generates: {knowledge: 25},
			tooltip: function (me) {
				return 'Generates '+me.knowledge_effect+' ingenuity per Epoch.'
			},
			guild: true,
		},
		researcher: {
			object_type: 'job',
			name: 'Researcher',
			cvars: {research_effect: 1},
			tooltip: function (me) {
				return 'Researchers allow technology to be discovered sooner. Assign researchers to technologies by clicking those technologies under the Research tab.'
			},
			atoms: [
				{
					type: 'effect',
					target: 'research',
					order: 400,
					func: function (x, me) {
						return x + me.count * me.research_effect;
					}
				}
			],
			guild: true,
		},
		humans: {
			object_type: 'species',
			name: 'Followers',
			default_job: 'worshipper',
			unlocked: true,
			jobs: {
				worshipper: {priority: true, base_efficiency: 5},
				hunter: {priority: true, base_efficiency: 12},
				farmer: {priority: true, base_efficiency: 5},
				labourer: {base_efficiency: 5},
				manufacturer: {base_efficiency: 5},
				contemplative: {base_efficiency: 5},
				researcher: {base_efficiency: 5}
			},
			food_use: 100,
			food_type: 'food',
			on_starve: function (me) {
				me.value -= 1;
				it.resources.corpses.value += 1;
				it.log.add('A follower starved to death.');
			},
			initialize: function (me) {
				H.add_counter(me, { 
					name: 'influence', 
					increment: function () {
						return (it.resources.influence.value / 10 > me.value ? it.clock.tick_amount : 0)
						},
					max: 1/30,
					result: function (args) {
						var me = it.species.humans;
						me.human_bits += me.influence_gain;
						var d = Math.floor(me.human_bits);
						if (d<=0) return;
						me.human_bits -= d;
						it.species.humans.value += d;
						var l = (d==1 ? 'A follower arrives and begins worshipping.' : (d + ' followers arrive and begin worshipping.'))
						it.log.add(l);
						it.visions.assign_jobs.unlock();
						},
					random: true,
					dont_start: true
				})
				H.add_counter(me, {
					name: 'abandon',
					increment: function () {
						return (it.resources.influence.value / 10 <= me.value - 1 ? it.clock.tick_amount : 0)
						},
					max: 1/30,
					result: function (args) {
						it.species.humans.value -= 1;
						it.log.add('A follower abandons their work and leaves.')
						},
					random: true
				});
				H.add_counter(me, {
					name: 'exposure',
					increment: function (me) {
						return (me.value > me.max ? it.clock.tick_amount : -me.counters.exposure.count)
						},
					max: 1/30,
					result: function (args) {
						it.species.humans.value -= 1;
						it.resources.corpses.value += 1;
						it.log.add('A follower died of exposure');
					}
				});
				H.add_counter(me, {
					name: 'disease',
					increment: function (me) {
						return (me.disease + Math.max(0, it.resources.corpses.value-it.resources.corpses.max)/3) * it.clock.tick_amount
						},
					max: 1,
					result: function (args) {
						v = Math.round(Math.min(it.species.humans.counters.disease.max, it.species.humans.value * it.species.humans.disease_cap));
						if (v) {
							it.species.humans.value -= v;
							it.resources.corpses.value += v;
							it.log.add('A disease ravages your followers, killing ' + v + '.', 'big_death');
						}
						it.species.humans.counters.disease.set_max = Math.max(1, it.species.humans.disease) * (H.r() * .6 + .4);
						},
					random: false
				});
				H.add_counter(me, {
					name: 'exhaustion',
					increment: function (me) {
						return me.exhaustion * it.clock.tick_amount;
					},
					max: 1,
					result: function (args) {
						it.species.humans.value -=1;
						it.resources.corpses.value +=1;
						it.log.add('A follower dies of exhaustion.')
					}
				});
				H.add_cvar(me, 'housing_decay', .25);
				H.add_cvar(me, 'disease', 0);
				H.add_cvar(me, 'disease_cap', .9);
				H.add_cvar(me, 'death_xp', 0);
				H.add_cvar(me, 'influence_gain', 1);
				H.add_cvar(me, 'exhaustion', 0);
				function adjust_disease (args) {
					if (args.old_value&&!args.clock_start) it.species.humans.counters.disease.set_max *= args.value / args.old_value;
				}
				it.cvars.disease.humans.update.add_result(adjust_disease);
				function add_job_level_effect (z) {
					var level_efficiency = H.atom(me.jobs[z].id, 'efficiency', 400, function (x) {return x + it.jobs[z].experience_level});
					it.cvars.efficiency[me.jobs[z].id].add_atom(level_efficiency);
				};
				for (i in me.jobs) {
					add_job_level_effect(i);
				}
				me.human_bits = 0;
			},
			update_value: [
				{
					f: function (args) {
						var me = args.parent, v = Math.max(2, me.value - me.max);
						v = Math.log((v-1)/v) / Math.log(1 - me.housing_decay) / 30;
						me.counters.exposure.set_max = v
						H.apply_atoms(me);
					},
					o: 501
				},
				{
					f: function (args) {
						var me = args.parent;
						for (i in me.jobs) {
							if (me.jobs[i].old_count > me.jobs[i].count) it.jobs[i].experience += me.death_xp;
						}
					},
					o: 601
				}
			],
			update_jobs: [
				{
					f: function (args) {
						var me = args.parent, b = [], n = 1, i, ii;
						for (i in me.jobs) {
							if (!b[me.jobs[i].count]) b[me.jobs[i].count]=[];
							b[me.jobs[i].count].push(me.jobs[i])
						}
						i = b.length-1;
						while (i>=0) {
							if (i==0) n=10;
							if (b[i]) {
								n += b[i].length - 1;
								for (ii in b[i]) b[i][ii].rank = n;
								n++;
							}
							i--
						}
					},
					o: 501
				}
			],
			saves: ['humans_bits'],
			tooltip: function (me) {
				return 'Those who have entered your service. If there is insufficient shelter or food they may die. Without enough influence they may leave.'
			}
		},
		beasts: {
			object_type: 'species',
			name: 'Beasts',
			default_job: 'labourer',
			jobs: {
				labourer: {multiplier: 1, base_efficiency: 5},
				farmer: {multiplier: 1, base_efficiency: 2, priority: true}
			},
			food_use: 100,
			food_type: 'food',
			on_starve: function (me) {
				it.log.add('Pressed for food, your followers slaughter a beast and gain 25 sustenance.');
				me.value-=1;
				it.resources.food.value+=25;
			},
			overflow: function (me, x) {
				it.resources.food.value += x*25;
				it.log.add('There is no space to house ' + x + ' beast' + (x>1 ? 's' :'') + ' so your followers slaughter ' + (x>1 ? 'them' : 'it') + ' for ' + (x*25) + ' sustenance');
				me.value -= x;
			},
			initialize: function (me) {
				H.add_cvar(me, 'capture', 0);
				H.add_counter(me, { 
					name: 'domesticate', 
					increment: function () {
						return (it.clock.tick_amount * me.capture)
						},
					max: 1,
					result: function (args) {
						it.species.beasts.value += 1;
						it.log.add('Your followers have captured a beast.');
					},
					random: true
				})
			}
		},
		ghouls: {
			object_type: 'species',
			name: 'Ghouls',
			default_job: 'labourer',
			jobs: {
				labourer: {base_efficiency: 10, multiplier: .65}
			},
			food_use: 3,
			food_type: 'corpses',
			on_starve: function (me) {
				if (it.species.humans.value>=1) {
					it.log.add('Your starving ghouls murder a follower to acquire something to eat.');
					it.species.humans.value-=1;
					it.resources.corpses.value+1
				} else {
					it.log.add('Your ghouls go mad with hunger and turn on each other')
					it.species.ghouls-=it.species.ghouuld;
				}
			},
			overflow: function (me, x) {
				var d = H.g(1, 1/3) * x * 2;
				d = Math.max(Math.min(Math.round(d), Math.round(it.species.humans.value)),1);
				if (x==1) it.log.add('A ghoul becomes uncontrolled and kills ' + d + ' followers before it is destroyed.');
				else {
					if (d<it.species.humans.value) it.log.add(x + ' ghouls become uncontrolled and kill ' + d + ' followers before they are destroyed.');
					else it.log.add(x + ' ghouls become uncontrolled and kill ' + d + ' before disappearing into the wilderness.');
				}
				it.species.humans.value -=d;
				it.resources.corpses.value += d;
				me.value -= x;
			}
		},
		influence: {
			object_type: 'resource',
			name: 'Influence',
			no_max: true,
			whole_values: true,
			table: 1,
			construct: function (me) {
				H.add_cvar(me, 'decay', .5);
				H.add_cvar(me, 'gather');
				function on_update () {
					it.resources.influence.on_update_value();
				}
				it.cvars.decay.influence.update.add_result(on_update);
				it.cvars.gather.influence.update.add_result(on_update);
				me.next_update = 1/30;
				me.counter = 0;
				me.trend = 0;
				me.accumulated = 0;
			},
			saves: ['next_update', 'counter', 'trend', 'accumulated'],
			on_tick: [
				{
					f: function (args) {
						var me = args.parent;
						if (me.value != me.trend) {
							me.counter += it.clock.tick_amount;
							if (me.counter>=me.next_update) {
								if (me.value<me.trend) { 
									me.value += 1;
									me.accumulated -= 1;
								}
								else me.value -=1;
								me.counter = 0;
							}
						}
					},
					o: 501
				},
				{
					f: function (args) {
						var me = args.parent;
						me.accumulated += me.gather * it.clock.tick_amount * 30
					},
					o: 502
				}
			],
			on_update_value: [
				{
					f: function (args) {
						var me = args.parent;
						me.trend = Math.round(me.gather / me.decay);
						if (me.gather != me.value * me.decay) me.next_update = 1 / 30 / Math.abs(me.gather - me.value*me.decay)
					},
					o: 501
				},
				{
					f: function (args) {
						if (args.value > args.old_value&&!H.loading_game) {
							args.parent.accumulated += args.value - args.old_value
						}
					},
					o: 999
				}
			],
			tooltip: function () {
				return 'Your power over the world. Influence attracts followers to your cause, but decreases over time.'
			}
		},
		corpses: {
			object_type: 'resource',
			name: 'Corpses',
			whole_values: true,
			no_max: true,
			table: 1,
			construct: function (me) {
				me.counter = 0;
			},
			saves: ['counter', 'next_decay'],
			on_tick: [
				{
					f: function (args) {
						var me = args.parent;
						if (me.value-me.max>0) {
							me.counter += it.clock.tick_amount;
							if (me.counter >= me.next_decay) {
								me.value-=1;
								me.counter=0
								it.log.add ('A corpse rotted away.');
							}
						} else {
							me.tick_div.innerHTML = '';
						}
					},
					o: 501,
				}
			],
			on_update_value: [
				{
					f: function (args) {
						var me = args.parent;
						var v = Math.max(2,args.value - me.max);
						me.next_decay = Math.log((v-1)/v) / Math.log(.5) * .1;
					},
					o: 601
				}
			],
			tooltip: function () {
				return 'A useful resource. Decays over time.'
			}
		},
		foreboding: {
			object_type: 'resource',
			name: '<span class=\'horrific\'>Foreboding</span>',
			no_max: true,table: 1,
			tooltip: function () {
				return 'A terrible sense of the coming works.'
			}			
		},
		lost_epochs: {
			object_type: 'resource',
			name: '<span class=\'horrific\'>Dreams</span>',
			no_max: true,
			table: 1,
			horrific: true,
			construct: function (me) {
				Object.defineProperty(me.save_parameters, 'time', {
					get: function () {return new Date().getTime()},
					set: function (v) {
						var d = (new Date().getTime() - v)/1800000;
						if (d<0) return;
						me.value+=d;
						if (me.value>=1) me.unlock()
						if (me.value>=10) it.visions.sleep.unlock();
					},
					enumerable: true
				})
			},
			tooltip: function () {
				return 'While away you have dreamed.'
			}
		},
		esoterica: {
			object_type: 'resource',
			name: '<span class=\'horrific\'>Esoterica</span>',
			table: 1,
			no_max: true,
			tooltip: function () {
				return 'Knowledge of strange the unknown things.'
			},
			saves: ['collcted', 'maximum'],
			initialize: function (me) {
				me.capped = function () {
					return me.collected>=me.maximum
				};
				me.maximum = 0;
				me.collected = 0;
			},
			on_update_value: [
				{
					f: function (args) {
						if (H.loading_game) return;
						var d = args.value - args.old_value;
						var m = args.parent.maximum - args.parent.collected;
						if (d>m) {
							args.value += m - d;
							args.parent.collected += m;
						} else if (d>0) {
							args.parent.collected += d;
						}
						
					},
					o: 900
				},
				{
					f: function (args) {
						if (args.value>0) it.schemes.ancient_knowledge.unlock();
					},
					o: 999
				}
			]
		},
		food: {
			object_type: 'resource',
			name: 'Sustenance',
			base_max: 20,
			table: 2,
			warehousing: {
				name: 'Granary',
				cost: {labour: 10, fabrications: 5, food: 5},
				sell: {labour: 20},
				effect: 20,
			},
			commerce_value: 1,
			for_sale: true
		},
		labour: {
			object_type: 'resource',
			name: 'Labour',
			base_max: 0,
			table: 2
		},
		ore: {
			object_type: 'resource',
			name: 'Rudiments',
			base_max: 20,
			table: 2,
			warehousing: {
				name: 'Cellar',
				cost: {labour: 25, fabrications: 25},
				sell: {labour: 20},
				effect: 20
			},
			commerce_value: 10
		},
		fabrications: {
			object_type: 'resource',
			name: 'Fabrications',
			base_max: 50,
			table: 2,
			warehousing: {
				name: 'Warehousing',
				cost: {labour: 10, fabrications: 10},
				sell: {labour: 20},
				effect: 50
			},
			commerce_value: 1,
			for_sale: true
		},
		rarities: {
			object_type: 'resource',
			name: 'Rarities',
			base_max: 10,
			table: 2,
			warehousing: {
				name: 'Display Case',
				cost: {labour: 25, fabrications: 10, rarities: 5},
				sell: {labour: 20},
				effect: 10
			},
			commerce_value: 25
		},
		currency: {
			object_type: 'resource',
			name: 'Currency',
			base_max: 500,
			table: 2,
			warehousing: {
				name: 'Vault',
				cost: {labour: 25, fabrications: 50, currency: 1000},
				sell: {labour: 20},
				effect: 500
			},
			commerce_value: 1
		},
		knowledge: {
			object_type: 'resource',
			name: 'Ingenuity',
			base_max: 50,
			table: 2,
			warehousing: {
				name: 'Archives',
				cost: {labour: 10, knowledge: 10},
				sell: {labour: 20},
				effect: 50
			}
		},
		culture: {
			object_type: 'resource',
			name: 'Urbanity',
			base_max: 20,
			table: 2
		},
		assign_jobs: {
			object_type: 'vision',
			name: 'Greater Purpose',
			description: 'Your followers can be directed towards various tasks.',
			show_in: {tab: 'temple', section: 'visions'},
			cost: {influence: 20},
			apply: function () {
				it.junction.unlock('cult');
				it.visions.hunger.unlock();
				it.visions.tap_labour.unlock();
				it.species.humans.unlock();
			}
		},
		hunger: {
			object_type: 'vision',
			name: 'The Hunt',
			description: 'Your followers appear to perish without sustenance. Send them to gather food so that they can live to serve longer.',
			show_in: {tab: 'temple', section: 'visions'},
			cost: {influence: 30},
			apply: function () {
				it.species.humans.unlock_job('hunter');
				it.resources.food.unlock();
			}
		},
		tap_labour: {
			object_type: 'vision',
			name: 'Labour',
			description: 'Instruct your followers to labour for the great works of the future.',
			show_in: {tab: 'temple', section: 'visions'},
			cost: {influence: 30},
			apply: function () {
				it.species.humans.unlock_job('labourer');
				it.resources.labour.unlock();
			}
		},
		enlightenment: {
			object_type: 'vision',
			name: 'Enlightenment',
			description: 'Your wisdom moves the world out of the darkness. Your followers can research new ideas and technologies.',
			show_in: {tab: 'temple', section: 'visions'},
			cost: {influence: 30},
			apply: function () {
				it.research.unlock();
				it.techs.tools.unlock({by: 'enlightenment'});
				it.species.humans.unlock_job(
				'researcher');
				it.deities.tsatha.awake=1;
			}
		},
		the_stars: {
			object_type: 'vision',
			name: 'The Stars',
			description: 'Your followers learn the meaning of the stars.',
			show_in: {tab: 'temple', section: 'visions'},
			cost: {influence: 30},
			apply: function () {
				it.junction.unlock('heavens');
				it.techs.agriculture.unlock({by: 'the_stars'});
				it.unlock('calendar');
				it.deities.mim_ktokh.awake = 1;
			}
		},
		grim_feast: {
			object_type: 'vision',
			name: 'Grim Feast',
			description: 'Your followers are prepared to take advantage of your Mausoleum in times of hunger.',
			show_in: {tab: 'temple', section: 'visions'},
			cost: {influence: 50, graves: 3, foreboding: 1},
			apply: function () {
				function eat_corpse (args) {
					if (it.resources.corpses.value>=1) {
						args.cancel_action = 1;
						it.resources.corpses.value -= 1;
						it.resources.food.value += 5;
						it.log.add('Rather than starving, your followers consume a corpse.');
					}
				}
				it.species.humans.counters.starvation.outcome.add_result(eat_corpse, 100);
			}
		},
		babbling: {
			object_type: 'vision',
			name: 'Susurration',
			description: 'The constant drone of your voice will motivate your followers.',
			show_in: {tab: 'temple', section: 'visions'},
			cost:  {influence: 140},
			atoms: [
				{
					target: 'influence',
					type: 'gather',
					order: 400,
					func: function (x) {return x + 15}
				}
			],
			apply: function () {
				it.acts.whisper.node.style.display = 'none';
			}
		},
		sleep: {
			object_type: 'vision',
			name: 'Sleep',
			description: 'A chance to dream away from the world.',
			show_in: {tab: 'temple', section: 'visions'},
			cost: {influence: 50, lost_epochs: 5},
			apply: function () {
				it.acts.time_slip.unlock();
			}
		},
		the_world: {
			object_type: 'vision',
			name: 'The World',
			description: 'See beyond the minds of your followers into a world of distance and extension.',
			show_in: {tab: 'temple', section: 'visions'},
			cost: {influence: 30},
			apply: function () {
				it.acts.expedite.unlock();
				it.junction.unlock('exploration', 'maps');
				it.junction.unlock('exploration', 'interests');
			}
		},
		coming_darkness: {
			object_type: 'vision',
			name: 'Coming Darkness',
			description: 'You sense the darkness encroaching, seeking to undo what has been done.',
			show_in: {tab: 'temple', section: 'visions'},
			cost: {influence: 1000, foreboding: 20},
			apply: function () {
				it.schemes.dark_age.unlock();
			}
		},
		dark_age: {
			object_type: 'scheme',
			name: 'Dark Age',
			description: 'Plunge the world into an age of darkness. You will lose all of your followers and most types of resources. Your work will be forgotten, as will technologies. Whatever civilization rises from the ashes of the current one will be able to learn from their predecessors.',
			show_in: {tab: 'temple', section: 'schemes'},
			construct: function (me) {
				
				me.button = H.e('div', 0, 'node_line node_button node_button_full', 'Bring on the Darkness');
				
				me.confirm_box = H.e('div', document.body, 'import_box');
				me.confirm_box_text = H.e('div', me.confirm_box, '', 'Are you sure? This action overwrites your save file and cannot be undone.');
				me.confirm_box_close = H.e('div', me.confirm_box, 'import_close', 'X');
				me.confirm_box_button = H.e('div', me.confirm_box, 'import_button', 'Yes, destroy everything!');
				
				me.ui.add(me.button);
				
				function first_click () {
					me.confirm_box.style.display = 'block';
				}
				
				function cancel () {
					me.confirm_box.style.display = 'none';
				}
				
				function burn_it_down () {
					var new_save = {
						esoterica: {
							maximum: it.resources.esoterica.maximum + 1
						},
						lost_epochs: {
							value: it.resources.lost_epochs.value
						},
						coming_darkness: {
							bought: 1
						},
						temple: {
							level: it.temple.level
						},
						calendar: {
							level: it.works.calendar.level
						}
					}
					
					new_save = JSON.stringify(new_save);
					new_save = H.compress(new_save);
					
					H.replace_save(new_save);		
				}
				
				me.button.addEventListener('click', first_click);
				me.confirm_box_close.addEventListener('click', cancel);
				me.confirm_box_button.addEventListener('click', burn_it_down);
				
			}
		},
		ancient_knowledge: {
			object_type: 'scheme',
			name: 'Ancient Knowledge',
			description: 'Followers can use ancient knowledge to uncover without spending resources or time.<br><br>',
			show_in: {tab: 'temple', section: 'schemes'},
			saves: ['tech', 'tech_list'],
			construct: function (me) {
				
				me.tech_list = [];
				
				function fill_tech_list () {
					var i, a=[], r;
					me.tech_list=[];
					for (i in it.techs) {
						if (it.techs[i].unlocked&&!it.techs[i].bought&&!it.techs.no_knowledge) a.push(i);
					}
					while (me.tech_list.length<3&&a.length>0) {
						r = H.r(a.length) - 1;
						me.tech_list.push(a[r]);
						a.splice(r,1);
					}
				}
								
				me.discovered = 0;
				
				me.discover_tech = function (tech_id) {
					if (!me.tech||!it.resources.esoterica.value) return;
					it.techs[tech_id].ancient_discovery();
					me.dropdowns.tech.selected = false;
					fill_tech_list();
					it.resources.esoterica.value-=1;
				}
								
				me.dropdown_line = H.e('div', 0, 'node_line');
				me.dropdown_line.update = function () {
					if (!it.resources.esoterica.value) me.dropdown_line.style.display = 'none';
					else me.dropdown_line.style.display = 'block';
				}
				me.learn_button = H.e('div', 0, 'node_line node_button node_button_full', 'Learn Ancient Technology');
				me.learn_button.update = function () {
					if (!it.resources.esoterica.value) me.learn_button.style.display = 'none';
					else me.learn_button.style.display = 'block';
				}
				
				me.ui.add(me.dropdown_line);
				me.ui.add(me.learn_button);
				
				it.add_dropdown(me, 'tech', {
					name: 'Tech to Learn',
					show_in: me.dropdown_line
				})
								
				function add_ancient_tech (tech_id) {
					me.dropdowns.tech.add_option(tech_id, it.techs[tech_id].name, function () {return me.tech_list.indexOf(tech_id)!=-1})
				};
				
				function tech_scrape () {
					var i;
										
					it.research.update_tech_costs.add_result(fill_tech_list, 900);
					
					for (i in it.techs) {
						add_ancient_tech(i)
					}
				}
				
				function click_learn () {
					me.discover_tech(me.tech);
				}
				
				me.learn_button.addEventListener('click', click_learn)				
				
				it.clock.start_time.add_result(tech_scrape);
			},
			atoms: [
				{
					type: 'discovered',
					target: 'research',
					order: 400,
					func: function (x) {return x + it.schemes.ancient_knowledge.discovered}
				}
			]
		},
		scheme_mining: {
			object_type: 'scheme',
			name: 'Mining',
			description: 'In addition to producing ore, labour dedicated to mining has a chance to produce rarities.',
			show_in: {tab: 'temple', section: 'schemes'},
			saves: ['accumulated_rarities'],
			construct: function (me) {
				H.add_cvar(me, 'rarity_tick', 0);
				me.accumulated_rarities = 0;
				it.clock.register_tick('scheme_mining', 'accumulated_rarities', 'rarity');
				H.add_counter(me, { 
					name: 'gather', 
					increment: function () {
						return (me.rarity_tick>0 ? it.clock.tick_amount : 0);
					},
					max: 1/10,
					result: function (args) {
						it.unlock('rarities');
						var r = 0;
						while (H.r() < (1 - 1/me.accumulated_rarities)) {
							r++;
							me.accumulated_rarities--
						};
						if (r) {
							it.resources.rarities.value+=r;
							it.log.add(r==1 ? 'Your mining operation uncovered a rarity.' : 'Your mining operation uncovered ' + r + ' rarities', 'fortune')
						};
					}
				})
			}
		},
		scheme_idolatry: {
			object_type: 'scheme',
			name: 'Idolatry',
			description: 'By worshipping idols, your worshippers will contribute influence directly to the cost of that idol.',
			show_in: {tab: 'temple', section: 'schemes'},
			construct: function (me) {
				H.add_cvar(me, 'max_worshippers', 0);
				it.species.humans.atoms.push(H.atom('scheme_idolatry', 'max_worshippers', 400, function (x) {return x + it.species.humans.jobs.worshipper.count}));
				function cap_worshippers () {
					me.spinners.worshippers.max = me.max_worshippers;
				}
				it.cvars.max_worshippers.scheme_idolatry.update.add_result(cap_worshippers, 999);
				
				var worshippers=0, idol;
				Object.defineProperties(me, {
					worshippers: {
						get: function () {return worshippers},
						set: function (v) {
							worshippers = v;
							H.apply_atoms(me);
						}
					},
					idol: {
						get: function () {return idol},
						set: function (v) {
							idol = v;
						}
					}
				})
				
				me.dropdown_line = H.e('div', 0, 'node_line');
				me.spinner_line = H.e('div', 0, 'node_line');
				
				me.ui.add(me.dropdown_line);
				me.ui.add(me.spinner_line);
				
				it.add_dropdown(me, 'idol', {
					name: 'Idol',
					show_in: me.dropdown_line
				})
				
				it.add_spinner(me, 'worshippers', {
					name: 'Worshippers',
					show_in: me.spinner_line,
					min: 0,
					max: 0,
				})
				
				me.idols = {};
				
				function add_idol (obj) {
					if (me.idols[obj.id]) return;
					me.idols[obj.id] = obj;
					me.dropdowns.idol.add_option(obj.id, obj.name, function () {return obj.unlocked&&!obj.bought})
				};
				
				function idolatry_scrape () {
					add_idol(it.temple);
					var i;
					for (i in it.visions) {
						if (it.visions[i].cost.cost.influence) add_idol(it.visions[i])
					}
					for (i in it.works) {
						if (it.works[i].cost.cost.influence) add_idol(it.works[i])
					}
				}
				
				it.clock.start_time.add_result(idolatry_scrape);
												
				me.tick = function idol_tick () {
					if (!me.worshippers||!me.idol) return;
					var c = me.idols[me.idol].cost;
					if (!c.paid) c.paid={influence: 0};
					else if (!c.paid.influence) c.paid.influence = 0;
					var m = Math.pow(2, 1 / (1 - c.paid.influence/c.cost.influence) - 1);
					var p = me.worshippers * it.jobs.worshipper.influence_effect * 4 / m;
					c.paid.influence += p * it.clock.tick_amount;
				}	
			},
			atoms: [
				{
					target: 'humans_worshipper',
					type: 'busy',
					order: 400,
					func: function (x) {return x + it.schemes.scheme_idolatry.worshippers}
				}
			],
			apply: function (me) {
				it.each_tick.add_result(me.tick)
			},
			saves: ['worshippers', 'idol']
		},
		tools: {
			object_type: 'tech',
			name: 'Tools',
			locks: 1,
			description: 'Use of simple tools.',
			announce: 'You can assign your followers to be manufacturers who create fabrications.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: .5,
			fixed_cost: {labour: 5},
			no_knowledge: 1,
			apply: function () {
				it.species.humans.unlock_job('manufacturer');
				it.resources.fabrications.unlock();
			},
			unlocks: ['fire', 'construction', 'wheel', 'bronze_working', 'mining']
		},
		oral_history: {
			object_type: 'tech',
			name: 'Oral History',
			locks: 1,
			description: 'Traditions that outlive indiviudals.',
			announce: 'Your followers can now improve their tasks over time. The top two tasks you assign your followers to will develop traditions.',
			show_in: {tab: 'research', section: 'society'},
			time_factor: 1,
			fixed_cost: {influence: 15},
			no_knowledge: .75,
			apply: function () {
				it.visions.the_stars.unlock();
				it.visions.the_world.unlock();
			},
			atoms: [
				{
					target: 'humans',
					type: 'death_xp',
					order: 400,
					func: function (x, me) {
						return x+1;
					}
				}
			],
			unlocks: ['cave_painting', 'superstition', 'folk_medicine']
		},
		construction: {
			object_type: 'tech',
			name: 'Construction',
			locks: 1,
			description: 'The creation of structures.',
			announce: 'Your followers can create hovels and sheds.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			fixed_cost: {labour: 5, fabrications: 5},
			no_knowledge: .8,
			apply: function () {
				it.works.hovel.unlock();
				it.works.shed.unlock();
				it.warehousing.warehouse_fabrications.unlock();
				it.improvements.cranes.unlock();
			},
			unlocks: ['preservation', 'hieroglyphics', 'masonry',  'archery']
		},
		preservation: {
			object_type: 'tech',
			name: 'Preservation',
			locks: 1,
			description: 'Various techniques to preserve food for future use.',
			announce: 'Your followers can use storage buildings as granaries to store additional food.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: .8,
			fixed_cost: {labour: 5, food: 10},
			no_knowledge: 1,
			apply: function () {
				it.warehousing.warehouse_food.unlock();
			},
			unlocks: ['glass']
		},
		cave_painting: {
			object_type: 'tech',
			name: 'Cave Painting',
			locks: 1,
			description: 'The recording of events and ideas with simple pigments.',
			announce: 'You can assign your followers to be contemplatives who generate ingenuity',
			show_in: {tab: 'research', section: 'society'},
			time_factor: .8,
			fixed_cost: {influence: 20},
			no_knowledge: 1,
			apply: function () {
				it.species.humans.unlock_job('contemplative');
				it.deities.hisessifsiths.awake = 1;
				it.improvements.cranes.unlock();
				it.resources.knowledge.unlock();
			},
			unlocks: ['hieroglyphics']
		},
		hieroglyphics: {
			object_type: 'tech',
			name: 'Pictograms',
			locks: 2,
			description: 'Pictograms codify the recording of information, allowing it to be better stored.',
			announce: 'Your followers can create archives to increase storage of knowledge.',
			time_factor: 1.5,
			show_in: {tab: 'research', section: 'society'},
			fixed_cost: {influence: 20, knowledge: 5},
			no_knowledge: 1,
			apply: function () {
				it.warehousing.warehouse_knowledge.unlock();
			},
			unlocks: ['alphabet']
		},
		superstition: {
			object_type: 'tech',
			name: 'Superstition',
			age: 0, 
			locks: 1,
			description: 'A flawed beginning of an understanding of the world.',
			announce: 'Your worshippers can construct idols to gather influence more quickly.',
			show_in: {tab: 'research', section: 'religion'},
			time_factor: 1,
			cost_factor: {influence: 100},
			apply: function () {
				it.works.idol.unlock();
				it.resources.corpses.unlock();
				it.works.calendar.unlock_upgrade('time_corpse_rot')
			},
			unlocks: ['burial', 'astrology']
		},
		idolatry: {
			object_type: 'tech',
			name: 'Idolatry',
			age: 1,
			locks: 1,
			description: 'Worshipping of objects in place of abstract concepts.',
			announce: 'Your worshippers can be directed towards works and visions.',
			show_in: {tab: 'research', section: 'religion'},
			time_factor: 1,
			cost_factor: {influence: 100},
			apply: function () {
				it.schemes.scheme_idolatry.unlock();
			}
		},
		wheel: {
			object_type: 'tech',
			name: 'The Wheel',
			age: 3,
			locks: 1,
			description: 'A device with virtually unlimited uses.',
			announce: 'Your labourers are far more efficient.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			cost_factor: {labour: 50, fabrications: 50},
			atoms: [
				{
					type: 'labour_effect',
					target: 'labourer',
					order: 400,
					func: function (z, me) {
						return z + 50
					}
				}
			],
			apply: function () {
				it.deities.ukreyhu.awake = 1;
			}
		},
		fire: {
			object_type: 'tech',
			name: 'Fire',
			age: 0,
			locks: 1,
			description: 'The knowledge of how to create and control fire.',
			announce: 'Your followers can create fires to keep warm.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: .75,
			fixed_cost: {labour: 5, fabrications: 5},
			no_knowledge: 1,
			apply: function () {
				it.unlock('bonfire');
			},
			unlocks: ['oral_history']
		},
		cooking: {
			object_type: 'tech',
			name: 'Cooking',
			age: 0,
			locks: 1,
			description: 'Preparation of food using fire.',
			announce: 'Your followers can make food go further and require less to survive.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			cost_factor: {labour: 100},
			fixed_cost: {fabrications: 5, food: 5},
			atoms: [
				{
					type: 'food_use',
					target: 'humans',
					order: 700,
					func: function (x, me) {
						return x * .8
					}
				}
			]
		},
		archery: {
			object_type: 'tech',
			name: 'Archery',
			tradition: 'hunter',
			age: 1,
			locks: 1,
			description: 'An improved method of killing.',
			announce: 'Your followers can build an armory which increases the sustenance produced by hunters.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			cost_factor: {labour: 150},
			fixed_cost: {fabrications: 10},
			apply: function () {
				it.works.armory.unlock();
				it.works.armory.description += ' Increases the sustenance produced by hunters.';
			},
			atoms: [
				{
					type: 'hunter_effect',
					target: 'armory',
					order: 400,
					func: function (x, me) {return x + 10}
				}
			]
		},
		trapping: {
			object_type: 'tech',
			name: 'Trapping',
			age: 2,
			locks: 1,
			cvars: {food_effect: 100},
			description: 'Trapping allows your followers to catch beasts to use for sustenance.',
			announce: 'Your followers can set traps for herds of beasts, converting labour into sustenance.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			cost_factor: {labour: 100},
			fixed_cost: {fabrications: 20, food: 10},
			apply: function () {
				it.interests.herd.new_flag({
					name: 'Trapping',
					icon: 'X',
					on: 0,
					toggle: ['Begin Trapping', 'Stop Trapping'],
					toggle_cost: [{fabrications: 10}, {}],
					description: 'Lay traps around th grazing territory of the beasts. Use labour to collect sustenance from them.',
					shut_off: function () {
						return it.resources.labour.value<=0
					},
					atoms: [
						{
							type: 'tick',
							target: 'labour',
							order: 400,
							seed_func: function (x) {return x - 25}
						},
						{
							type: 'tick',
							target: 'food',
							order: 400,
							seed_func: function (x, me) {return x + me.parent.trapping_effect}
						},
						{
							type: 'capture',
							target: 'beasts',
							order: 400,
							seed_func: function (x) {return x + 1/3}
						}
					]
				});
			},
			unlocks: ['domestication']
		},
		astrology: {
			object_type: 'tech',
			name: 'Astrology',
			age: 2,
			locks: 1,
			description: 'An understanding of the meaning of the various star signs and moons.',
			announce: 'You can now read descriptions of the deities by clicking on their starsigns on the starchart. Your followers can build an oracle that allows them to see further into the future.',
			show_in: {tab: 'research', section: 'religion'},
			time_factor: 1,
			type: 'civilization',
			cost_factor: {influence: 100},
			apply: function () {
				it.works.oracle.unlock();
			},
			atoms: [
				{
					type: 'learnedness',
					target: 'heavens',
					order: 10,
					func: function (x) {return 1}
				},
				{
					type: 'ominousness',
					target: 'heavens',
					order: 400,
					func: function (x) {return x+1}
				}
			],
			unlocks: ['theology']
		},
		burial: {
			object_type: 'tech',
			name: 'Burial',
			age: 2,
			locks: 1,
			description: 'Traditions for burying the dead.',
			announce: 'Your followers can build graves to store corpses.',
			show_in: {tab: 'research', section: 'religion'},
			time_factor: 1,
			cost_factor: {labour: 100, fabrications: 100},
			fixed_cost: {corpses: 2},
			apply: function () {
				it.works.mausoleum.unlock();
			}
		},
		agriculture: {
			object_type: 'tech',
			name: 'Agriculture',
			age: 2,
			locks: 1,
			description: 'The growth of crops for a more stable food supply.',
			announce: 'Your followers can now create farms and become farmers to produce sustenance at regular intervals.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			cost_factor: {labour: 100},
			fixed_cost: {food: 10},
			apply: function () {
				it.works.farm.unlock();
				it.species.humans.unlock_job('farmer');
				it.species.beasts.unlock_job('farmer');
			},
			unlocks: ['plow']
		},
		folk_medicine: {
			object_type: 'tech',
			name: 'Folk Medicine',
			age: 2,
			locks: 1,
			description: 'Trial and error that produces cures for some ailments.',
			announce: 'Your followers can now build an apothecary\'s to reduce the impact of disease.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 0.8,
			cost_factor: {labour: 30, knowledge: 15},
			apply: function () {
				it.works.apothecarys.unlock();
			}
		},
		irrigation: {
			object_type: 'tech',
			name: 'Irrigation',
			locks: 2,
			description: 'System for delivering water to crops.',
			announce: 'Engineering now improves the maximum food for each farm.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			cost_factor: {labour: 100},
			fixed_cost: {fabrications: 50},
			apply: function () {
				it.improvements.cranes.atoms.push({
					type: 'max',
					target: 'farm',
					order: 700,
					func: function (x) {
						return x * (1 + .1 * it.improvements.cranes.level)
					}
				});
				H.apply_atoms(it.improvements.cranes);
			}
		},
		compass: {
			object_type: 'tech',
			name: 'Compass',
			locks: 1,
			description: 'A device that makes exploration much easier.',
			announce: 'Time between launching expeditions is greatly reduced.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 0.7,
			cost_factor: {labour: 100},
			atoms: [
				{
					type: 'cooldown',
					target: 'expedite',
					order: 700,
					func: function (x) {return x/2}
				}
			]
		},
		sailing: {
			object_type: 'tech',
			name: 'Sailing',
			age: 3,
			locks: 1,
			description: 'Sailing enables further exploration.',
			announce: 'Your followers can build boats that are required for advanced expeditions.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1/2,
			cost_factor: {labour: 75, knowledge: 15},
			apply: function () {
				it.works.boats.unlock();
			}
		},
		alphabet: {
			object_type: 'tech',
			name: 'Alphabet',
			age: 3,
			locks: 1,
			description: 'An improved system for storing information.',
			announce: 'Your followers can develop a number of new sciences.',
			show_in: {tab: 'research', section: 'society'},
			time_factor: 1,
			fixed_cost: {knowledge: 100},
			no_knowledge: 1,
			apply: function () {
				it.improvements.encyclopedia.unlock();
				it.improvements.drama.unlock();
			},
			unlocks: ['guilds']
		},
		masonry: {
			object_type: 'tech',
			name: 'Masonry',
			age: 4,
			locks: 2,
			description: 'Techniques for contructing better structures.',
			announce: 'Your followers can build warehouses which hold even more goods.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1.5,
			cost_factor: {labour: 100, fabrications: 100},
			fixed_cost: {fabrications: 50},
			apply: function () {
				it.works.storage.unlock();
				it.works.house.unlock();
			}
		},
		bronze_working: {
			object_type: 'tech',
			name: 'Bronze Working',
			age: 4,
			locks: 2,
			description: 'Smelting and working with metals to make better tools.',
			announce: 'Your followers can create a smelter which allow more fabrications to be stored.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			cost_factor: {labour: 50, fabrications: 100, knowledge: 5},
			fixed_cost: {ore: 5},
			apply: function () {
				it.works.smelter.unlock();
				it.warehousing.warehouse_ore.unlock();
			},
			unlocks: ['iron_working']
		},
		mining: { 
			object_type: 'tech',
			name: 'Mining',
			age: 4,
			locks: 2,
			description: 'Drawing materials from the earth.',
			announce: 'Your followers can become miners, who very quickly gather resources from explored regions.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			cost_factor: {labour: 100},
			fixed_cost: {ore: 1},
			apply: function () {
				it.warehousing.warehouse_ore.unlock();
				it.interests.quarry.new_effort({
					name: 'Dig Mine',
					icon: 'M',
					cost: {labour: 50},
					description: 'Create a mine at this site to extract more materials.',
					length: function () {return 0.5},
					apply: function (me, my_interest) {
						my_interest.map.new_interest({type: 'mine', nonant: my_interest.nonant, })
					}
				});
			},
			unlocks: ['trade']
		},
		theology: {
			object_type: 'tech',
			name: 'Theology',
			age: 4,
			locks: 2,
			description: 'A theory of gods.',
			announce: 'You followers theorize about the existence of other gods connected with the stars.',
			show_in: {tab: 'research', section: 'religion'},
			time_factor: 1,
			cost_factor: {influence: 50, knowledge: 35},
			apply: function () {
				it.consoles.theology_console.unlock();
				it.acts.expedite.unlock();
				deity_effect_line = H.e('div', 0, 'node_line');
				deity_love_line = H.e('div', 0, 'node_line');
				it.deity_chooser.ui.add(deity_effect_line);
				it.deity_chooser.ui.add(deity_love_line);
				function make_effect_and_love (args) {
					if (args.sign) {
						deity_effect_line.innerHTML = '<br>' + args.sign.deity.effect_text;
						if (args.sign.deity.love_text[args.sign.deity.hatred])deity_love_line.innerHTML = '<br>' + args.sign.deity.love_text[args.sign.deity.hatred];
						else deity_love_line.innerHTML = '';
					}
				}
				it.deity_chooser.draw_sign.add_result(make_effect_and_love);
			},
			atoms: [
				{
					type: 'learnedness',
					target: 'heavens',
					order: 20,
					func: function (x, me) {return 2}
				}
			]
		},
		domestication: {
			object_type: 'tech',
			name: 'Domestication',
			age: 5,
			locks: 1,
			description: 'Domestication of animals to serve your followers.',
			announce: 'Your followers can now build animal pens which allow the capture of Beasts that generate and store labour but utilize food.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			cost_factor: {labour: 100, food: 20},
			apply: function () {
				it.works.animal_pen.unlock();
				it.species.beasts.unlock();
				it.junction.unlock('cult', 'beasts');
			},
			unlocks: ['riding', 'plow']
		},
		riding: {
			object_type: 'tech',
			name: 'Riding',
			age: 5,
			locks: 1,
			description: 'Riding beasts to explore more quickly.',
			announce: 'Your followers can now create mounts to bring on expeditions. If an expedition is launched and a mount is available then the time the expedition takes will be reduced.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 0.5,
			cost_factor: {labour: 60, food: 20, knowledge: 5},
			apply: function () {
				it.works.mounts.unlock();
				var check_mount = function (args) {
					if (it.works.mounts.level>0) {
						var c = it.dosh.consider({cost: {mounts: 1}});
						c.pay();
						it.acts.expedite.quickened = .9;
					}
				}
				it.acts.expedite.cast.add_result(check_mount, 600);
			}
		},
		plow: {
			object_type: 'tech',
			name: 'Plow',
			age: 5,
			locks: 2,
			description: 'A device to help till soil. Especially effective with beasts.',
			announce: 'You can now assign multiple beasts to assist with farming.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 0.5,
			cost_factor: {labour: 80},
			atoms: [
				{
					type: 'efficiency',
					target: 'beasts_farmer',
					order: 400,
					func: function (x, me) {return x + 4}
				}
			]
			
		},
		iron_working: {
			object_type: 'tech',
			name: 'Iron Working',
			age: 5,
			locks: 1,
			description: 'The ability to forge iron, a more durable material than bronze.',
			announce: 'Your followers can construct an ironworks which allow manufacturers to create fabrications faster.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 1,
			cost_factor: {labour: 75, fabrications: 75},
			apply: function () {
				it.works.ironworks.unlock();
			}
		},
		trade: {
			object_type: 'tech',
			name: 'Trade',
			age: 5,
			locks: 2,
			description: 'Exchanging goods and ideas with others.',
			announce: 'You can build a trade post that improves relationships with other settlements.',
			show_in: {tab: 'research', section: 'society'},
			time_factor: 1,
			cost_factor: {culture: 5},
			apply: function () {
				it.improvements.drama.unlock();
				it.works.trade_post.unlock();
			},
			unlocks: ['tech_currency']
		},
		civil_service: {
			object_type: 'tech',
			name: 'Civil Service',
			age: 5,
			locks: 1,
			description: 'Organization of people to assist in governance.',
			announce: 'Your followers can now infiltrate settlements to manipulate and exploit them.',
			show_in: {tab: 'research', section: 'society'},
			time_factor: 1,
			cost_factor: {knowledge: 5, influence: 80},
			apply: function () {
				it.resources.culture.unlock();
				var village_influence_atom = {
					type: 'gather',
					target: 'influence',
					order: 400,
					seed_func: function (x, me) {
						return x - (it.interests.village.control_cost + it.governances[me.governance].control) * me.population;
					},
					disabled: 1,
					id: 'civil_service'
				}
				var village_culture_atom = {
					type: 'tick',
					target: 'culture',
					order: 400,
					seed_func: function (x, me) {
						return x + it.governances[me.governance].culture * me.population
					},
					disabled: 1,
					id: 'civil_service'
				}
				var village_culture_max_atom = {
					type: 'max',
					target: 'culture',
					order: 700,
					seed_func: function (x, me) {
						return x * (Math.pow(1.5, it.governances[me.governance].culture * me.population))
					},
					disabled: 1,
					id: 'civil_service'
				}
				var village_population_atom = {
					type: 'max',
					target: 'population',
					order: 400,
					seed_func: function (x, me) {
						return x + me.population
					},
					disabled: 1,
					id: 'civil_service'
				}
				it.interests.village.new_atom(village_influence_atom);
				it.interests.village.new_atom(village_culture_atom);
				it.interests.village.new_atom(village_culture_max_atom);
				it.interests.village.new_atom(village_population_atom);
				it.interests.village.new_flag({
					name: 'Influence',
					icon: '&#128065;',
					on: 0,
					toggle: ['Infiltrate', 'Remove Infiltrator'],
					toggle_cost: [{humans: 1, influence: 50}, {}],
					description: 'Send a follower to manipulate this settlement.',
					shut_off: function () {
						return it.resources.influence.value<=0
					},
					apply: function (me, my_interest, on) {
						var i;
						for (i in my_interest.atoms) {
							if (my_interest.atoms[i].id == 'civil_service') my_interest.atoms[i].disabled = !on
						}
						H.apply_atoms(my_interest);
						if (on) {
							my_interest.consoles.add('governance');
							my_interest.governance='non_governance';
						}
						else my_interest.consoles.remove('governance');
					}
				});
				it.consoles.governance_console.unlock();
			},
			unlocks: ['trade', 'guilds']
		},
		archaeology: {
			object_type: 'tech',
			name: '<span class=\'horrific\'>Archaeology</span>',
			age: 2,
			locks: 1,
			description: 'Searching for ancient truths.',
			announce: 'You may now send archaeological expeditions to sites of interest.',
			show_in: {tab: 'research', section: 'society'},
			time_factor: 1,
			cost_factor: {labour: 50, knowledge: 10},
			fixed_cost: {foreboding: 5},
			apply: function () {
				it.consoles.archaeology_console.unlock();
			}
		},
		tech_currency: {
			object_type: 'tech',
			name: 'Currency',
			age: 5,
			locks: 2,
			description: 'A universal symbol of value.',
			announce: 'Your merchants can now trade resources for currency which can be spent in place of other common resources for works.',
			show_in: {tab: 'research', section: 'society'},
			time_factor: 1,
			cost_factor: {knowledge: 25, culture: 5},
			fixed_cost: {rarities: 1},
			apply: function () {
				it.resources.currency.unlock();
				it.interests.village.new_flag({
					name: 'Trade',
					icon: '$',
					on: 0,
					toggle: function (parent) {
						console.log(parent);
						return ['Start Selling ' + it.resources[parent.buy_type].name, 'Stop Selling ' + it.resources[parent.buy_type].name]
					},
					toggle_cost: [],
					description: function (parent) {
						return 'You will lose some ' + it.resources[parent.buy_type].name + ' each epoch but gain some currency.'
					},
					shut_off: function (parent) {
						return it.resources[parent.buy_type].value<=0
					},
					atoms: [
						{
							type: 'tick',
							target: function (parent) {
								return parent.buy_type
							},
							order: 900,
							seed_func: function (x, me) {return x - 100 * me.population}
						},
						{
							type: 'tick',
							target: 'currency',
							order: 400,
							seed_func: function (x, me) {return x + 20 * it.governances[me.governance].trade * me.population}
						}
					]
				});				
			},
			unlocks: ['civil_service']
		},
		lenses: {
			object_type: 'tech',
			name: 'Corrective Lenses',
			age: 5,
			locks: 1,
			description: 'Lenses to assist those who have difficulty seeing.',
			announce: 'You are able to efficiently assign more followers to tasks.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 0.5,
			cost_factor: {labour: 50},
			fixed_cost: {rarities: 5},
			atoms: [
				{
					type: 'efficiency_mod',
					target: 'humans',
					order: 400,
					func: function (x) {return x+2}
				}
			]
		},
		glass: {
			object_type: 'tech',
			name: 'Glass',
			age: 5,
			locks: 1,
			description: 'A transparent material useful in construction and storage.',
			announce: 'Homes your followers build are less inadequate.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 0.5,
			cost_factor: {labour: 40, fabrications: 15, ore: 1},
			atoms: [
				{
					type: 'inadequacy',
					targets: ['hovel', 'house'],
					order: 700,
					func: function (x, me) {return x * .9}
				}
			],
			apply: function () {
				it.improvements.optics.unlock();
			}
		},
		guilds: {
			object_type: 'tech',
			name: 'Guilds',
			age: 5,
			locks: 2,
			description: 'Guilds systematize professions to better pass on professional knowledge to new generations.',
			announce: 'You can now build an academy that will increase the rate at which your occupations improve.',
			show_in: {tab: 'research', section: 'society'},
			time_factor: 0.8,
			cost_factor: {culture: 5},
			apply: function () {
				it.junction.unlock('social', 'professions');
			}
		},
		husbandry: {
			object_type: 'tech',
			name: 'Husbandry',
			locks: 1,
			description: 'The study of animals including their structure, classification and reproduction.',
			announce: 'If your followers have two or more beasts at the end of an epoch, they will breed another.',
			show_in: {tab: 'research', section: 'technology'},
			time_factor: 0.8,
			cost_factor: {knowledge: 10, labour: 50},
			fixed_cost: {beasts: 1},
			construct: function (me) {
				me.epoch = function () {
					if (it.allies.beasts.value>=2) {
						it.allies.beasts.value += 1
						it.log.add('Your followers breed a new beast.');
					}
				}
			},
			apply: function () {
				it.each_aut.add_result(it.techs.husbandry.epoch)
			}
		},
		calendar: {
			object_type: 'work',
			name: 'Stone Calendar',
			description: 'Allows accurate tracking of the passage of time.',
			show_in: {tab: 'works', section: 'monuments'},
			cost_function: function () {return {labour: 20, fabrications: 20}},
			max_level: 1,
			construct: function (me) {
				me.show_time = function (args) {
					it.clock.format_time = H.t(args.time)
					it.clock.node.text.innerHTML = 'Epoch ' + it.clock.aut + '<br>Next Epoch: ' + it.clock.format_time;
				}
				me.increasing = function (args) {
					var me = args.parent;
					if (me.value==me.trend) me.tick_div.innerHTML = '(Holding steady)';
					else me.tick_div.innerHTML = '(' + (me.value<me.trend ? 'Rising' : 'Falling') + ' to ' + me.trend + ')'
				}
				me.corpse_decay = function (args) {
					var me = args.parent;
					if (me.value-me.max<=0) me.tick_div.innerHTML = '';
					else me.tick_div.innerHTML = '(Decay in ' + H.t(me.next_decay - me.counter) + ')'
				}
			},
			apply: function (me) {
				it.clock.check_time.add_result(me.show_time, 201)
			},
			upgrades: {
				track_influence: {
					name: 'Track Influence',
					description: 'Determine what your influence is trending towards.',
					cost: {knowledge: 5, influence: 10},
					apply: function (me) {it.resources.influence.on_tick.add_result(me.increasing, 701)},
					unlocked: 1
				},
				time_corpse_rot: {
					name: 'Time Corpse Rot',
					description: 'Show a timer indicating when the next corpse will rot.',
					cost: {knowledge: 5, corpses: 1},
					apply: function (me) {it.resources.corpses.on_tick.add_result(me.corpse_decay, 701)},
				},
				study_efficiency: {
					name: 'Study Worker Efficiency',
					description: 'Show the efficiency of workers as they are assigned.',
					cost: {labour: 10, knowledge: 5},
					apply: function (me) {
						var i;
						for (i in it.species) {
							it.species[i].show_efficiency=true;
						}
					},
					unlocked: 1
				}
			}
		},
		bonfire: {
			object_type: 'work',
			name: 'Bonfire',
			description: 'Provides warmth so your followers live longer when exposed to the elements',
			show_in: {tab: 'works', section: 'monuments'},
			cost_function: function () {return {labour: 10, fabrications: 10}},
			max_level: 1,
			atoms: [
				{
					type: 'housing_decay',
					target: 'humans',
					order: 10,
					func: function (x, me) {
						return 1 / 6
					}
				}
			],
			apply: function () {
				it.techs.cooking.unlock({by: 'bonfire'});
			}
		},
		pyramid: {
			object_type: 'work',
			name: 'Pyramid',
			description: 'A huge burial structure associated with unknown rituals.',
			show_in: {tab: 'works', section: 'monuments'},
			cost_function: function () {return {labour: 900, fabrications: 300, graves: 15}},
			max_level: 1,
			installments: 3,
			upgrades: {
				necromancy: {
					name: 'Necromancy',
					description: 'Animating the dead.',
					cost: {influence: 250, foreboding: 5},
					apply: function () {
						it.junction.unlock('cult', 'ghouls');
						it.acts.animate_dead.unlock();
						it.species.ghouls.unlock();
						it.works.mausoleum.atoms.push({
							type: 'max',
							target: 'ghouls',
							order: 400,
							func: function (x) {return x + Math.floor(it.works.mausoleum.level/5)}
						})
					},
					level: 1
				},
			}
		},
		hovel: {
			object_type: 'work',
			name: 'Hovel',
			description: 'Provides living space for one of your followers, though such wretched conditions can have ill effects on health.',
			show_in: {tab: 'works', section: 'buildings'},
			cvars: {inadequacy: 1},
			cost_function: function (me) {
				var l = me.level + (it.works.house ? it.works.house.level : 0);
				return {
					labour: Math.min(l+1,5) * 10,
					fabrications: 10 * (l + 1) * Math.pow(1.15, l)
				}
			},
			atoms: [
				{
					type: 'max',
					target: 'humans',
					order: 400,
					func: function hovel_housing (x, me) {
						return x + me.level
					}
				},
				{
					type: 'disease',
					target: 'humans',
					order: 400,
					func: function hovel_disease (x, me) {
						return x + me.level * me.inadequacy
					}
				}
			],
			dosh: {
				id: 'hovels',
				name: 'Hovels'
			}
		},
		house: {
			object_type: 'work',
			name: 'House',
			description: 'A significant improvement on the hovel that houses two followers with reduced disease exposure.',
			show_in: {tab: 'works', section: 'buildings'},
			cvars: {inadequacy: 1.8},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1,5) * 100,
					fabrications: 200 * (me.level/2 + 1) * Math.pow(1.15, me.level),
					hovels: 1
				}
			},
			substitutions: {hovels: {labour: .001}},
			atoms: [
				{
					type: 'max',
					target: 'humans',
					order: 400,
					func: function house_housing (x) {
						return x + it.works.house.level * 2
					}
				},
				{
					type: 'disease',
					target: 'humans',
					order: 400,
					func: function house_disease (x) {
						return x + it.works.house.level * it.works.house.inadequacy
					}
				}
			],
			apply: function () {
				it.cvars.cost.hovel.update();
			}
		},
		farm: {
			object_type: 'work',
			name: 'Farm',
			description: function () {
				me = it.works.farm;
				return 'Farms will be harvested an average of 20 times per epoch.' + (me.level ? ' Holds up to ' + Math.round(me.max * me.level) + ' sustenance from Farmer production. <br><br>Farm is at ' + Math.round(me.production * it.clock.aut_length / (me.max * me.level * .2)) + '% capacity.<br>Next harvest in: ' + H.t(0.05 - me.counter) : '');
			},
			cvars: {inadequacy: 0.5, production: 0, max: 10},
			show_in: {tab: 'works', section: 'buildings'},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1,5) * 10,
					food: 8 * (me.level/4 + 1) * Math.pow(1.14, me.level),
					beasts: (me.level > 5 ? Math.floor((me.level-2)/4) : 0)
				}
			},
			construct: function (me) {
				var adjust_for_aut = {
					type: 'production',
					target: 'farm',
					order: 700,
					func: function (x) {
						return x / it.clock.aut_length
					}
				}
				it.cvars.production.farm.add_atom(adjust_for_aut)
				me.counter = 0;
				me.food = 0;
				me.farm_tick = function () {
					me.food = Math.min(me.food + me.production, me.max * me.level);
					me.counter += it.clock.tick_amount;
					if (me.counter > 0.05) {
						me.counter-=0.05;
						it.resources.food.value += me.food;
						if (me.food>1) {
							it.log.add('Your farms produce '+Math.round(me.food)+' sustenance.');
						}
						me.food = 0;
					}
				}
			},
			saves: ['counter', 'food'],
			atoms: [
				{
					type: 'disease',
					target: 'humans',
					order: 400,
					func: function hovel_disease (x) {
						return x + it.works.farm.level * it.works.farm.inadequacy
					}
				}
			],
			apply: function (me) {
				it.each_tick.add_result(me.farm_tick, 701);
				//it.techs.irrigation.unlock({by: 'farm'});
				it.deities.yithira.awake = 1;
			}
		},
		animal_pen: {
			object_type: 'work',
			name: 'Animal Pen',
			description: 'A home for one domesticated beast.',
			show_in: {tab: 'works', section: 'buildings'},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1,5) * 40,
					fabrications: 40 * (me.level * 2 + 1) * Math.pow(1.2, me.level)
				}
			},
			atoms: [
				{
					type: 'max',
					target: 'beasts',
					order: 400,
					func: function (x) {
						return x + it.works.animal_pen.level
					}
				}
			],
			apply: function () {
				//it.allies.beasts.unlock();
				if (it.works.animal_pen.level>=3) it.techs.husbandry.unlock();
			}
		},
		apothecarys: {
			object_type: 'work',
			name: 'Apothecary\'s',
			description: 'A workshop to produce medicines.',
			cvars: {disease_reduction: 0.1, red_death_reduction: 0.1},
			show_in: {tab: 'works', section: 'buildings'},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1, 5) * 10,
					fabrications: 20 * (me.level/2 + 1) * Math.pow(1.15, me.level)
				}
			},
			atoms: [
				{
					type: 'disease',
					target: 'humans',
					order: 700,
					func: function (x) {
						return x / (1 + it.works.apothecarys.level * it.works.apothecarys.disease_reduction)
					}
				},
				{
					type: 'village_killing',
					target: 'red_death',
					order: 700,
					func: function (x) {
						return x / (1 + it.works.apothecarys.level * it.works.apothecarys.red_death_reduction)
					}
				}
			]
		},
		armory: {
			object_type: 'work',
			name: 'Armory',
			cvars: {hunter_effect: 0, labourer_effect: 0},
			description: 'A workshop for producing weapons.',
			show_in: {tab: 'works', section: 'buildings'},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1,5) * 10,
					fabrications: 5 * (1 + me.level/2) * Math.pow(1.2, me.level-1)
				}
			},
			atoms: [
				{
					type: 'food_effect',
					target: 'hunter',
					order: 400,
					func: function (x) {
						return x + it.works.armory.level * it.works.armory.hunter_effect
					}
				},
				{
					type: 'food_effect',
					target: 'labourer',
					order: 400,
					func: function (x) {
						return x + it.works.armory.level * it.works.armory.labourer_effect
					}
					
				}
			]
		},
/*		academy: {
			object_type: 'work',
			name: 'Academy',
			description: 'A place to learn specialized skills. Increases the rate of experience gain for professions.',
			show_in: {tab: 'works', section: 'buildings'},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1, 5) * 20,
					fabrications: 40 * (1 + me.level/2) * Math.pow(1.1, me.level-1),
					knowledge: 25 * (1 + me.level/2) * Math.pow(1.2, me.level-1)
				}
			},
			atoms: [
				{
					type: 'xp_values',
					target: 'humans',
					order: 500,
					func: function (x) {
						var me = it.works.academy;
						(x[1]+=me.level)||(x[1]=me.level);
						(x[2]+=me.level/2)||(x[2]=me.level/2);
						(x[3]+=me.level/4)||(x[3]=me.level/4);
						(x[4]+=me.level/4)||(x[4]=me.level/4);						
					}
				}
			]
		},*/
		idol: {
			object_type: 'work',
			name: 'Icon',
			description: 'Icons increase the amount of influence your worshippers produce.',
			show_in: {tab: 'works', section: 'buildings'},
			cost_function : function (me) {
				return {
					influence: 25 * (me.level + 0.5) * Math.pow(1.3, me.level),
					labour: Math.min(me.level+1, 5) * 20,
					fabrications: 5 * (me.level + 1) * Math.pow(1.05, me.level)
				}
			},
			atoms: [
				{
					type: 'gather',
					target: 'influence',
					order: 400,
					func: function (x) {
						return x + it.works.idol.level * 5;
					}
				},
				{
					type: 'efficiency',
					target: 'humans_worshipper',
					order: 700,
					func: function (x) {
						return x + 5 * it.works.idol.level;
					}
				}
			],
			dosh: {
				id: 'idols',
				name: 'Icons'
			},
			apply: function (me) {
				if (me.level>=1) {
					it.visions.babbling.unlock();
				}
				if (me.level>=2) {
					it.techs.idolatry.unlock({by: 'icon'});
				}
				it.deities.princess.awake=1;
			},
			saves: ['worshippers']
		},
		shed: {
			object_type: 'work',
			name: 'Shed',
			description: 'Shoddily constructed storage space to keep goods safe.',
			show_in: {tab: 'works', section: 'buildings'},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1,5) * 10,
					fabrications: 8 * (me.level/2 + 1) * Math.pow(1.22, me.level)
				}
			},
			atoms: [
				{
					type: 'max',
					target: 'warehouse',
					order: 400,
					func: function warehouse_storage (x) {
						return x + it.works.shed.level
					}
				}
			],
			apply: function () {
				it.warehouse.unlock();
			}
		},
		storage: {
			object_type: 'work',
			name: 'Warehouse',
			description: 'Storage space to hold more resources.',
			show_in: {tab: 'works', section: 'buildings'},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1,5) * 100,
					fabrications: 200 * (me.level/2 + 1) * Math.pow(1.3, me.level)
				}
			},
			atoms: [
				{
					type: 'max',
					target: 'warehouse',
					order: 400,
					func: function warehouse_storage (x) {
						return x + it.works.storage.level * 2
					}
				}
			],
			apply: function () {
				it.warehouse.unlock();
			}
		},
		smelter: {
			object_type: 'work',
			name: 'Smelter',
			description: 'Lighter, stronger fabrications can be stored more efficiently in warehousing.',
			show_in: {tab: 'works', section: 'buildings'},
			cvars: {fabrication_storage_effect: 10},
			saves: ['processed_ore', 'fabrications'],
			installments: 2,
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1,5) * 40,
					fabrications: 35 * (me.level+1) * Math.pow(1.1, me.level),
					ore: 8 * (me.level/2+1) * Math.pow(1.15, me.level)
				}
			},
			atoms: [
				{
					type: 'effect',
					target: 'warehouse_fabrications',
					order: 400,
					func: function (x) {
						return x + it.works.smelter.level * it.works.smelter.fabrication_storage_effect;
					}
				}
			]
		},
		ironworks: {
			object_type: 'work',
			name: 'Ironworks',
			description: 'Increases the rate of production of fabrications.',
			cvars: {fabrication_production_effect: .15},
			show_in: {tab: 'works', section: 'buildings'},
			installments: 3,
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1 , 5) * 60,
					fabrications: 40 * (me.level*3/4+1) * Math.pow(1.15, me.level),
					ore: 10 * (me.level/2+1) * Math.pow(1.15, me.level)
				}
			},
			atoms: [
				{
					type: 'tick',
					target: 'fabrications',
					order: 700,
					func: function ironworks_effect (x) {
						return x<=0 ? x : x * (1 + it.works.ironworks.fabrication_production_effect * it.works.ironworks.level);
					}
				}
			]
		},
		oracle: {
			object_type: 'work',
			name: 'Oracle',
			description: 'Strange vapours from the ground assist in predictions. This monument increases the number of epochs ahead that star signs can be seen in the heavens.',
			show_in: {tab: 'works', section: 'monuments'},
			cost_function: function (me) {
				return {
					influence: 25 * (me.level + 1) * Math.pow(1.25, me.level),
					labour: Math.min(me.level+1, 5) * 40,
					fabrications: 10 * (me.level + 1) * Math.pow(1.15, me.level)
				}
			},
			atoms: [
				{
					type: 'foresight',
					target: 'heavens',
					order: 400,
					func: function (x) {
						return x + it.works.oracle.level
					}
				}
			]
		},
		mausoleum: {
			object_type: 'work',
			name: 'Mausoleum',
			description: 'A building that holds many graves for easy access.',
			show_in: {tab: 'works', section: 'buildings'},
			cost_function: function (me) {
				return {
					corpses: me.level+1,
					labour: Math.min(me.level+1,5) * 8, 
					fabrications: 5 * (me.level + 1) * Math.pow(1.05, me.level)
				}
			},
			atoms: [
				{
					type: 'max',
					target: 'corpses',
					order: 400,
					func: function mausoleum_corpses (x) {
						return x + it.works.mausoleum.level
					}
				}
			],
			dosh: {
				id: 'graves',
				name: 'Graves'
			},
			apply: function () {
				if (it.works.mausoleum.level>=3) {
					it.visions.grim_feast.unlock();
				}
				if (it.works.mausoleum.level>=5) {
					it.unlock('pyramid');
				}
			}
		},
		trade_post: {
			object_type: 'work',
			name: 'Trade Post',
			description: 'A place to facilitate trade.',
			cvars: {research_boost: .1},
			show_in: {tab: 'works', section: 'buildings'},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1, 5) * 30,
					fabrications: 100 * (me.level/4+1) * Math.pow(1.15, me.level),
					rarities: 1 * (me.level + 1) * Math.pow(1.15, me.level)
				}
			},
			atoms: [
				{
					type: 'science_bonus',
					target: 'village',
					order: 400,
					func: function trade_post_research (x) {
						return x + it.works.trade_post.research_boost * it.works.trade_post.level;
					}
				}
			],
		},
		boats: {
			object_type: 'work',
			name: 'Boats',
			description: 'Small vessels used to reach other lands.',
			show_in: {tab: 'exploration', section: 'expeditions'},
			cost_function: function (me) {
				return {
					labour: 600,
					fabrications: 300
				}
			},
			dosh: {
				id: 'boats',
				name: 'Boats'
			}
		},
		mounts: {
			object_type: 'work',
			name: 'Mounts',
			description: 'Beasts outfitted for riding.',
			show_in: {tab: 'exploration', section: 'expeditions'},
			build_word: 'Outfit',
			cost_function: function (me) {
				return {
					beasts: 1,
					food: 10
				}
			},
			dosh: {
				id: 'mounts',
				name: 'Mounts'
			}
		},
		maps: {
			object_type: 'improvement',
			name: 'Cartography',
			description: 'Allows additional lands to be explored.',
			show_in: {tab: 'research', section: 'science'},
			locks: 1,
			time_function: function (me) {
				return (me.level+1) * Math.pow(1.1, me.level);
			},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1, 5) * 10,
					fabrications: 10,
					knowledge: 20 * (1 + me.level/2) * Math.pow(1.2, me.level)
				}
			},
			atoms: [
				{
					type: 'max_maps',
					target: 'world_map',
					order: 400,
					func: function (x, me) {
						return x + me.level;
					}
				}
			],
			apply: function () {
				it.techs.compass.unlock({by: 'maps'});
			}
		},
		drama: {
			object_type: 'improvement',
			name: 'Drama and Poetry',
			description: 'Works that influence thoughts and feelings.<br>Increases the rate at which new followers arrive.',
			show_in: {tab: 'research', section: 'society'},
			locks: 1,
			time_function: function (me) {
				return 5 * (me.level + 1) * Math.pow(1.3, me.level)
			},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1, 5) * 10,
					fabrications: 10,
					knowledge: 100 * (me.level * 1/2 + 1) * Math.pow(1.2, me.level),
					culture: 5 * (me.level * 1/2 + 1) * Math.pow(1.2, me.level)
				}
			},
			atoms: [
				{
					type: 'influence_gain',
					target: 'humans',
					order: 400,
					func: function (x, me) {
						return x + me.level * .2
					}
				}
			]
		},
		encyclopedia: {
			object_type: 'improvement',
			name: 'Encyclopedia',
			locks: 1,
			description: 'Compendia of all-around knowledge.<br>These can be spent in place of ingenuity to reasearch new technologies.',
			show_in: {tab: 'research', section: 'science'},
			time_function: function (me) {
				return (me.level * 2 + 1);
			},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1, 5) * 10,
					fabrications: 10,
					knowledge: 100 + (10 * me.level * Math.pow(1.1, me.level))
				}
			},
			dosh: {
				id: 'encyclopedia',
				name: 'Encyclopedia'
			}
		},
		cranes: {
			object_type: 'improvement',
			name: 'Engineering',
			locks: 2,
			description: 'Producing physical solutions to real world problems.<br>The use of cranes allows easier construction of housing and storage buildings.',
			show_in: {tab: 'research', section: 'science'},
			time_function: function (me) {
				return Math.max(1, 3 * me.level) * Math.pow(1.3, me.level)
			},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1, 5) * 10,
					fabrications: 10,
					knowledge: 10 * (me.level * 2 + 1) * Math.pow(1.2, me.level)
				}
			},
			apply: function () {
				//it.techs.irrigation.unlock({by: 'cranes'});
				it.techs.masonry.unlock({by: 'cranes'});
			},
			atoms: [
				{
					type: 'installments',
					targets: ['hovel', 'shed'],
					order: 400,
					func: function (x, me) {
						return x + me.level
					}
				}
			]
		},
		optics: {
			object_type: 'improvement',
			name: 'Optics',
			locks: 1,
			description: 'The study of light and lensmaking. Applications include better scouting when exploring.',
			show_in: {tab: 'research', section: 'science'},
			time_function: function (me) {
				return 2 * (me.level + 1) * Math.pow(1.3, me.level)
			},
			cost_function: function (me) {
				return {
					labour: Math.min(me.level+1, 5) * 10,
					fabrications: 10,
					ore: 25 * (me.level / 2 + 1) * Math.pow(1.2, me.level),
					knowledge: 100 * (me.level / 2 + 1) * Math.pow(1.2, me.level)
				}
			},
			atoms: [
				{
					type: 'interest_quality',
					target: 'world_map',
					order: 400,
					func: function (x, me) {return x + .3 * me.level}
				}
			],
			apply: function () {
				it.techs.lenses.unlock({by: 'optics'});
			}
		},
		animate_dead: {
			object_type: 'act',
			name: 'Animate Dead',
			cooldown: 1/2,
			cvars: {cost: {cost: {corpses: 1, foreboding: 1, influence: 30}}},
			show_in: {tab: 'temple', section: 'acts'},
			tooltip: function () {
				var c = it.dosh.consider(it.acts.animate_dead.cost)
				return c.format + '<br>Animate a corpse into a ghoul to serve you.'
			},
			active: function () {
				var c = it.dosh.consider(it.acts.animate_dead.cost);
				return !c.cant_pay;
			},
			result: function (args) {
				var c = it.dosh.consider({cost: {corpses: 1, foreboding: 1, influence: 30}});
				c.pay();
				it.species.ghouls.value+=1;
			}
		},
		time_slip: {
			object_type: 'act',
			name: 'Sleep',
			cooldown: 1/2,
			show_in: {tab: 'temple', section: 'acts'},
			tooltip: function () {
				var cost = Math.max(5, Math.floor(it.resources.lost_epochs.value/3));
				return 'Use ' + cost + ' dreams to sleep, causing time to pass quickly.'
			},
			construct: function (me) {
				me.haze = H.e('div', document.body, 'sleep_haze');
				me.atoms = {
					sleep_time: {
						type: 'dilation',
						target: 'clock',
						order: 700,
						func: function (x) {
							return x / 25
						},
						disabled: true
					}
				};
				me.end_sleep = function () {
					me.atoms.sleep_time.disabled = true;
					H.apply_atoms(me);
					me.haze.style.display = 'none';
				}
			},
			active: function () {
				return it.resources.lost_epochs.value>=5;
			},
			result: function (args) {
				var c = it.dosh.consider({cost: {lost_epochs: Math.max(5, Math.floor(it.resources.lost_epochs.value/3))}});
				c.pay();
				args.parent.haze.style.display = 'block';
				args.parent.atoms.sleep_time.disabled = false;
				H.apply_atoms(args.parent);
				args.parent.timeout = setTimeout(args.parent.end_sleep, 36000)
			}
		},
		whisper: {
			object_type: 'act',
			name: 'Whisper into the Darkness',
			cooldown: 1/180,
			result: function () {
				it.resources.influence.unlock();
				it.resources.influence.value += 10;
			},
			show_in: {
				tab: 'temple', 
				section: 'acts'
			},
			autocast_if: function () {return true},
			unlocked: 1
		},
		expedite: {
			object_type: 'act',
			name: 'Explore',
			cooldown: 2,
			tooltip: function () {
				return 'Discover a new land';
			},
			result: function () {
				var c = it.dosh.consider(it.expeditions.cost);
				if (c.cant_pay) return;
				c.pay();
				it.expeditions.cost.paid={};
				it.expeditions.selected.explore();
				it.improvements.maps.unlock();
			},
			show_in: {
				tab: 'exploration',
				section: 'expeditions'
			},
			active: function () {
				var c = it.dosh.consider(it.expeditions.cost);
				return !c.cant_pay&&it.expeditions.selected
			}
		},
		subdue_beast: {
			object_type: 'act',
			name: 'Subdue Beast',
			cooldown: 1,
			tooltip: function () {
				return 'Send a hunting party to capture a beast. Requires 10 sustenance, 100 labour and at least 2 followers willing to risk their lives.';
			},
			result: function () {
				var c = it.dosh.consider(it.acts.subdue_beast.cost);
				if (c.cant_pay) return;
				c.pay();
				it.species.beasts.value+=1;
			},
			show_in: {
				type: 'works',
				id: 'animal_pen'
			},
			active: function () {
				var c = it.dosh.consider(it.acts.subdue_beast.cost);
				return !c.cant_pay
			},
			construct: function (me) {
				me.cost = {
					cost: {
						humans: 2,
						food: 10, 
						labour: 100
					}
				}
			}
		},
		you: {
			object_type: 'deity',
			name: 'Vacant Sky',
			hatred: 0,
			stature: 0,
			power: 1,
			tribute_cost_function: function () {},
			atoms: [
				{
					type: 'gather',
					target: 'influence',
					order: 700,
					func: function (x, me) {return x + 50}
				}
			],
			sign: {
				name: 'Vacant Sky',
				icon: '<span class=\'override_color\'>&#9679;<span>',
				tooltip: '???',
				description: [
					'There is an empty space in the sky. The meaning of this is unclear.'
				]
			}
		},
		yithira: {
			object_type: 'deity',
			name: 'Yithira',
			hatred: 3,
			stature: 1,
			power: 1,
			tribute_cost_function: function (x) {
				var z = Math.pow(x+1, 2) * (1 + x * .5);
				return {
					labour: 100 * z,
					fabrications: 100 * z,
					food: 40 * z
				}
			},
			description: [
				'A cluster of stars resembling a hunched figure.',
				'The Sign of Yithira is associated with bad luck for farmers.',
				'Yithira is the lord of drought and vermin.'
			],
			effect_text: 'Under the sign of Yithira crops do not flourish and the maximum food that can be held by farms is greatly decreased.',
			love_text: [
				'Yithira recognizes your devotion. Rather than causing your followers\' crops to fail, he dramatically improves their yeild.',
				'Yithia recognizes your loyalty. He spares your followers from the effects of his sign.',
				'Yithira recognizes you. He limits the effects of his sign on your followers.',
				false,
				'Yithira is angered. Your farms are useless under his sign.',
				'Yithira seethes with rage. He not only ruins your farms, but causes the sustenance of your followers to rot before their eyes.'
			],
			atoms: [
				{
					hatred: [0,2,3,4,5],
					type: 'max',
					target: 'farm',
					order: 700,
					func: function (x, me) {
						return x * [2, 1, .65, .35, 0, 0][me.hatred];	
					}
				},
				{
					hatred: [0],
					type: 'farmer_production',
					target: 'farmer',
					order: 700,
					func: function (x, me) {return x * 2}
				},
				{
					hatred: [5],
					type: 'tick',
					target: 'food',
					order: 990,
					func: function (x, me) {return x * .75 - 200}
				}
			],
			sign_name: 'Sign of Yithira',
			sign_icon: '&#9793;',
			sign_tooltip: 'Fields lie barren before him.'
		},
		red_death: {
			object_type: 'deity',
			name: 'The Red Death',
			cvars: {village_killing: 2},
			awake: 1,
			hatred: 3,
			stature: 0.5,
			power: 2,
			tribute_cost_function: function (x) {
				var z = Math.pow(x+1, 2) * (1 + x * .5);
				return {
					labour: 100 * z,
					fabrications: 100 * z,
					humans: 4 * z
				}
			},
			description: [
				'A moon with a reddish tinge.',
				'The Scarlet Moon is associated with death and disease.',
				'The Red Death is a name given to the cause of the death and illness under the Scarlet Moon. Some think of it as a deity, others as a force or nature, and others as a lie to make sense of something senseless.'
			],
			effect_text: 'Under the Scarlet Moon diseases occur more frequently and are more severe.',
			love_text: [
				'Perhaps you pleased the Red Death or perhaps that makes no sense. Your followers do not seem nearly as affected by the Scarlet Moon as the other beings that surround them.',
				false,
				false,
				false,
				false,
				'Perhaps you angered the Red Death or perhaps that makes no sense. Whatever the cause, under the Scarlet Moon your followers are doomed.'
			],
			sign_name: 'The Scarlet Moon',
			sign_icon: '&#9790',
			sign_tooltip: 'All things must end.',
			atoms: [
				{
					hatred: [0,1,2,3,4,5],
					type: 'disease',
					target: 'humans',
					order: 700,
					func: function (x, me) {return x * [1.3, 1.8, 2.2, 3, 5, 15][me.hatred]}
				},
				{
					hatred: [0,1,2,3,4,5],
					type: 'max',
					target: 'humans_counter_disease',
					order: 700,
					func: function (x, me) {return x * [1, 1.3, 1.5, 1.8, 2, 2.5][me.hatred]}
				},
				{
					hatred: [0,1,2,3,4,5],
					type: 'prosperity',
					target: 'village',
					order: 400,
					func: function (x, me) {return x - it.deities.red_death.village_killing}
				}
			]
		},
		mim_ktokh: {
			object_type: 'deity',
			name: 'Mim\'Ktokh',
			hatred: 3,
			stature: 1/3,
			power: 3,
			tribute_cost_function: function (x) {
				var z = Math.pow(x+1, 2) * (1 + x * .5);
				return {
					labour: 100 * z,
					fabrications: 100 * z,
					lost_epochs: 10 * z
				}
			},
			description: [
				'A ring of bright starts outlining a strange darkness.',
				'The sign of Mim\'Ktokh is an enigma. Your followers are unaware of its effects.',
				'The enigmatic Mim\'Ktokh is mostly unknown to mortals and he sign is seen as a relief from the viciousness of the other deities. To those sensitive to time, however, her power is known.'
			],
			effect_text: 'Under the Sign of Mim\'Ktokh time moves much more slowly.',
			love_text: [
				'Mim\'Kotkh has forgotten you. Time still passes slower under her sign, but not maddenningly so.',
				'Mim\'Ktokh hardly notices you. Time still passes slower under her sign, but less so than before.',
				'Mim\'Ktokh is less aware of you. Time still passes slower under her sign, but less so than before.',
				false,
				'Mim\'Ktokh thinks of you often. The Epochs under her sign stretch out even further.',
				'Mim\'Ktokh is watching. The Epochs under her sign are maddening.'
			],
			sign_name: 'Sign of Mim\'Ktokh',
			sign_icon: '&#9728;',
			sign_tooltip: 'Time stretches out before her.',
			atoms: [
				{
					hatred: [0,1,2,3,4,5],
					type: 'dilation',
					target: 'clock',
					order: 700,
					func: function (x, me) {return x * [1.2, 2, 3, 4, 6, 12][me.hatred]}
				}
			]
		},
		princess: {
			object_type: 'deity',
			name: 'Princess in Yellow',
			hatred: 3,
			stature: 1/2,
			power: 2,
			tribute_cost_function: function (x) {
				var z = Math.pow(x+1, 2) * (1 + x * .5);
				return {
					labour: 100 * z,
					fabrications: 100 * z,
					influence: 100 * z
				}
			},
			description: [
				'Strangely your followers have never seen this sickly yellow moon.',
				'The pallid moon appears on astrological charts, but is never observed.',
				'The Princess in Yellow demands fealty from all beings. While her Pallid Moon is in the sky all turn from their tasks and follow her command, awakening afterwards in a haze.'
			],
			effect_text: 'Under the Pallid Moon you cannot recruit new followers.',
			love_text: [
				'The Princess in Yellow adores you and rewards your devotion by sending followers your way.',
				'The Princess in Yellow is flattered by you and allows followers to find you under her moon.',
				'The Princess in Yellow appreciates you and allows some followers to find their way to you under her moon.',
				false,
				'The Princess in Yellow dislikes you and steals influence from you under her moon.',
				'The Princess in Yellow despises you, and uses all her effort to reduce your influence under her moon.'
			],
			sign_name: 'Pallid Moon',
			sign_icon: '&#9789;',
			sign_tooltip: 'All bow to her.',
			atoms: [
				{
					hatred: [0,1,2,3,4,5],
					type: 'influence_gain',
					target: 'humans',
					order: 700,
					func: function (x, me) {return x * [2, 1, .5, 0, 0, 0][me.hatred]}
				},
				{
					hatred: [4, 5],
					type: 'decay',
					target: 'influence',
					order: 700,
					func: function (x, me) {
						var f = (me.hatred == 4 ? 1 : 3)
						return (x + f)/(f+1)
					}
				}
			]
		},
		tsatha: {
			object_type: 'deity',
			name: 'Tsatha',
			hatred: 3,
			stature: 2,
			power: 0.5,
			tribute_cost_function: function (x) {
				var z = Math.pow(x+1, 2) * (1 + x * .5);
				return {
					labour: 100 * z,
					fabrications: 100 * z,
					research: 2 * z
				}
			},
			description: [
				'A group of stars resembling tall, slender figure.',
				'Scholars associate the Sign of Tsatha with frustration and setbacks.',
				'Tsatha is the deity of purpose and meaning, but it is jealous and voracious.'
			],
			effect_text: 'Tsatha consumes the meaning of your researchers\' work and greatly reduces progress towards new technologies.',
			love_text: [
				'Tsatha appreciates your contributions and shares some of it\'s infinite knowledge with your researchers, dramatically speeding resarch.',
				'Tsatha appreciates your gifts and shares secrets with your researchers, increasing the speed of research.',
				'Tsatha regards you as an ally. It no longer eats the knowledge of your researchers.',
				false,
				'Tsatha focuses it\'s hunger on your followers. Your researchers can discover nothing under the Sign of Tsatha.',
				'Tsatha seeks revenge. Not only can you complete no new research under the Sign of Tsatha, but Tsatha consumes some of the research you have already done.'
			],
			sign_name: 'Sign of Tsatha',
			sign_icon: '&#9799;',
			sign_tooltip: 'Only madness in its sight.',
			apply: function (me, s) {
				if (s&&me.hatred==5) {
					it.dosh.research.value -= 10;
					if (it.dosh.research.value<0) it.dosh.research.value = 0;
				}
			},
			atoms: [
				{
					hatred: [0,1,2,3,4,5],
					type: 'effect',
					target: 'research',
					order: 700,
					func: function (x, me) {return x * [3, 1.5, 1, .2, 0, 0][me.hatred]}
				}
			]
		},
		ukreyhu: {
			object_type: 'deity',
			name: 'Ukreyhu',
			hatred: 3,
			stature: 2,
			power: 0.5,
			tribute_cost_function: function (x) {
				var z = Math.pow(x+1, 2) * (1 + x * .5);
				return {
					labour: 100 * z,
					fabrications: 100 * z,
				}
			},
			description: [
				'Stars in the shape of a dancing figure.',
				'The Sign of Ukreyhu is associated with revels, and, consequently, not with work.',
				'Ukreyhu is the deity of revels. Many find themselves compelled to abandon their work to dance or sign under his sign.'
			],
			effect_text: 'The physical outputs of your followers such as labour and fabrications are greatly reduced.',
			love_text: [
				'Ukreyhu recognizes you devotion. He makes work towards your end part of the revels, and the output of your labourers and manufacturers is greatly increased.',
				'Ukreyhu recognizes you loyalty. He allows your followers to continue with their important work under his sign.',
				'Ukreyhu recognizes you. He demands less of your followers, leaving them more time to their regular tasks under his sign.',
				false,
				'Ukreyhu is angered. He demands even more from your followers, leaving them with no time for their regular tasks.',
				'Ukreyhu seethes with rage. He causes your followers to celebrate all day and night, leaving no time for work and causing exhaustion.'
			],
			sign_name: 'Sign of Ukreyhu',
			sign_icon: '&#9809;',
			sign_tooltip: 'The revels are endless before him.',
			atoms: [
				{
					hatred: [0,1,2,3,4,5],
					type: 'labour_effect',
					target: 'labourer',
					order: 700,
					func: function (x, me) {return x * [2, 1, .75, .15, 0, 0][me.hatred]}
				},
				{
					hatred: [0,1,2,3,4,5],
					type: 'fabrications_effect',
					target: 'manufacturer',
					order: 700,
					func: function (x, me) {return x * [2, 1, .75, .15, 0, 0][me.hatred]}
				},
				{
					hatred: [5],
					type: 'exhaustion',
					target: 'humans',
					order: 400,
					func: function (x, me) {return x + Math.max(10, it.species.humans.value)}
				}
			]
		},
		hisessifsiths: {
			object_type: 'deity',
			name: 'Hisessifsiths',
			hatred: 3,
			stature: 2,
			power: 0.5,
			tribute_cost_function: function (x) {
				var z = Math.pow(x+1, 2) * (1 + x * .5);
				return {
					labour: 100 * z,
					fabrications: 100 * z,
				}
			},
			description: [
				'A group of stars resembling a sleeping figure.',
				'The Sign of Hisessifsiths is associated sleep and dullness of the senses.',
				'Hisessifsiths is the deity of slumber. She dulls the minds of mortals, leaving them unable to focus.'
			],
			effect_text: 'Your followers have trouble developing new ideas and generate far less ingenuity.',
			love_text: [
				'Hisessifsiths recognizes your devotion. She makes your followers sleep well to be well rested and alert, allowing your contemplatives to generate more ingenuity.',
				'Hisessifsiths recognizes your loyalty. She allows your followers to think normally under her sign.',
				'Hisessifsiths recognizes you. She limits the effect of her sign on your followers.',
				false,
				'Hisessifsiths is angered. She ensures your followers have no spare thoughts to generate ingenuity.',
				'Hisessifsiths seethes with rage. She con.'
			],
			sign_name: 'Sign of Hisessifsiths',
			sign_icon: '&#9796;',
			sign_tooltip: 'The mind dulls before her.',
			atoms: [
				{
					hatred: [0,1,2,3,4,5],
					type: 'knowledge_effect',
					target: 'contemplative',
					order: 700,
					func: function (x, me) {return x * [2, 1, .75, .15, 0, 0][me.hatred]}
				},
				{
					hatred: [0,1,2,3,4,5],
					type: 'tick',
					target: 'culture',
					order: 700,
					func: function (x, me) {return x * [2, 1, .75, .15, 0, 0][me.hatred]}
				}
			]
		},
		ruins: {
			object_type: 'interest',
			name: 'Ancient Ruins',
			unique: true,
			types: {land: function () {return (it.schemes.ancient_knowledge.max_techs - it.schemes.ancient_knowledge.discovered)/2 + 0.3}},
			icon: '&#9963;',
			description: 'Anything might lurk in these mysterious ruins.',
			description_expired: 'Any secrets that remain will stay buried with this place.',
			unlocked: true,
			saves: ['explore_time', 'explored', 'explore_cost', 'rewards', 'event_list', 'exploring', 'goods', 'starve'],
			consoles: ['archaeology'],
			construct_parent: function (me) {
				me.arch_events = [
					{
						event: function (x) {},
						description: 'Your followers find nothing of interest in the ruins.',
						chance: 1
					},
					{
						event: function (x) {x.goods.food-=3},
						description: 'Your followers lose supplies fleeing from an unknown thing.',
						chance: 0.3
					},
					{
						event: function (x) {x.goods.labour-=5},
						description: 'The ruins present significant physical challenges.',
						chance: 0.3
					},
					{
						event: function (x) {if (!x.goods.esoterica) x.goods.esoterica = 1; else x.goods.esoterica += 1},
						description: 'Your followers find ancient knowledge in the ruins.',
						chance: 0.3,
						condition: function (x) {return !it.resources.esoterica.capped();}
					},
					{
						event: function (x) {x.goods.humans-=1},
						description: 'A follower is killed.',
						chance: 0.1
					}
				];
				me.total_chance = 0;
				var i;
				for (i in me.arch_events) {
					me.total_chance += me.arch_events[i].chance;
				}
			},
			construct: function (me, my_parent) {
				it.consoles.archaeology_console.create_archaeology(me);
			},
			discover: ['archaeology']
		},
		herd: {
			object_type: 'interest',
			name: 'Beasts',
			types: {land: 1},
			cvars: {trapping_effect: 100},
			icon: '&#9800;&#65038;',
			description: 'A feeding ground for wild beasts. Increases the effectiveness of hunters.',
			description_expired: 'A herd of beasts used to graze here. There is no sign of them.',
			unlocked: true,
			atoms: [	
				{
					type: 'food_effect',
					target: 'hunter',
					order: 400,
					seed_func: function (x) {return x + 20}
				}
			],
			discover: ['trapping']
		},
		quarry: {
			object_type: 'interest',
			name: 'Mineral Deposit',
			types: {land: 1},
			icon: '&#9968;',
			cvars: {max_labour: 10},
			consoles: ['mining'],
			saves: ['quality', 'labour_usage'],
			unlocked: true,
			description: 'A place where useful substances can be found close to the surface.',
			description_expired: 'All useful materials have been harvested from this site.',
			construct: function (me, my_parent, args) {
				me.quality = (args&&args.quality) || 0.5 + H.r()/2;
				var labour_usage = 0;
				Object.defineProperties(me, {
					labour_usage: {
						get: function () {return labour_usage},
						set: function (v) {
							labour_usage = v;
							me.apply_atoms();
						}
					},
					max_labour: {
						get: function () {
							return it.interests.quarry.max_labour;
						}
					}
				})
			},
			flags: [
				{
					name: 'Gather',
					icon: 'G',
					on: 0,
					toggle: ['Start Gathering', 'Stop Gathering'],
					toggle_cost: [],
					description: 'Some labour will be redirected to gathering rudiments.',
					expiry: function () {
						return 0.025
					},
					shut_off: function () {
						return it.resources.labour.value<=0
					},
					atoms: [
						{
							type: 'tick',
							target: 'labour',
							order: 400,
							seed_func: function (x, me) {
								return x - me.labour_usage
							}
						},
						{
							type: 'tick',
							target: 'ore',
							order: 400,
							seed_func: function (x, me) {
								return x + me.labour_usage/20
							}
						}
					]
				}
			],
			discover: ['ore', 'mining', 'bronze_working']
		},
		mine: {
			object_type: 'interest',
			name: 'Mine',
			types: {},
			icon: '&#9935;',
			description: 'A shaft into the earth that grants access to the treasures and secrets within.',
			consoles: ['mining'],
			saves: ['quality', 'labour_usage'],
			description_expired: 'All useful materials have been excavated.',
			construct: function (me, my_parent, args) {
				me.quality = (args&&args.quality) || 0.5 + H.r()/2;
				me.max_labour = 100;
				var labour_usage = 0;
				Object.defineProperties(me, {
					labour_usage: {
						get: function () {return labour_usage},
						set: function (v) {
							labour_usage = v;
							me.apply_atoms();
						}
					},
					max_labour: {
						get: function () {
							return it.interests.mine.max_labour;
						}
					}
				})
			},
			flags: [
				{
					name: 'Mine',
					icon: 'M',
					toggle: ['Start Mining', 'Stop Mining'],
					toggle_cost: [],
					description: function (me) {
						return 'Use labour to gather ' + me.return_type + ' from the mine.';
					},
					expiry: function () {
						return 0.2
					},
					shut_off: function () {
						return it.resources.labour.value<=0
					},
					atoms: [
						{
							type: 'tick',
							target: 'labour',
							order: 400,
							seed_func: function (x, me) {
								return x - me.labour_usage;
							}
						},
						{
							type: 'tick',
							target: 'ore',
							order: 400,
							seed_func: function (x, me) {
								return x + me.labour_usage/20;
							}
						},
						{
							type: 'rarity_tick',
							target: 'scheme_mining',
							order: 400,
							seed_func: function (x, me) {
								return x + me.labour_usage/100 * me.quality;
							}
						}
					]
					
				}
			]
		},
		village: {
			object_type: 'interest',
			name: 'Hamlet',
			types: {land:1},
			icon: '&#9978;&#65038;',
			unlocked: true,
			cvars: {progress: 0, science_bonus: .3, prosperity: 0.05, control_cost: 5, currency_return: 0},
			saves: ['governance', 'population_bits', 'population'],
			description: 'Exchanging goods and ideas with villagers increases the effectiveness of research.',
			description_expired: 'Structures here suggest that people lived here not too long ago, but no one can be found.',
			construct: function (me, my_parent) {
				me.buy_type = (H.r()<.5 ? 'food' : 'fabrications');
				me.population_bits = 0;
				var population = 1;
				var governance = 'non_governance';
				Object.defineProperties(me, {
					governance: {
						get: function () {return governance},
						set: function (v) {
							governance = v;
							H.apply_atoms(me);
						}
					},
					population: {
						get: function () {return population},
						set: function (v) {
							if (v>4) v=4;
							population = v;
							if (population<=0) me.expire();
							else me.name = ['Abandoned Hamlet', 'Hamlet', 'Village', 'Town', 'City'][v];
						}
					}
				});
			},
			tick_handler: function (me, my_parent) {
				if (me.expired) return;
				me.population_bits += (my_parent.prosperity + it.governances[me.governance].prosperity) * it.clock.tick_amount / Math.pow(2,me.population-1);
				if (me.population_bits>1) {
					me.population++;
					me.population_bits--;
				}
				if (me.population_bits<-1) {
					me.population--;
					me.population_bits++;
				}
			},
			atoms: [	
				{
					type: 'effect',
					target: 'research',
					order: 400,
					seed_func: function (x, me) {
						return x + (it.interests.village.science_bonus + it.governances[me.governance].science) * me.population;
					}
				},
				{
					type: 'tick',
					target: 'currency',
					order: 400,
					seed_func: function (x, me) {
						return x + (it.interests.village.currency_return + it.governances[me.governance].currency) * me.population;
					}
				}
			],
			discover: ['civil_service']
		},
		shrine: {
			object_type: 'interest',
			name: 'Shrine',
			types: {land: 0.3},
			icon: 'I',
			unlocked: true,
			consoles: ['theology'],
			saves: ['deity'],
			description: 'A strange shrine is built here.',
			description_expired: 'There was a shrine here, but it has been desecrated and destroyed.',
			efforts: [
				{
					name: 'Destroy Shrine',
					icon: 'X',
					cost: {labour: 100},
					description: 'Have your followers smash the shrine.',
					length: function () {return 0.05},
					apply: function (me, my_interest) {
						var deity = it.deities[my_interest.deity];
						deity.hatred *= 1.2;
						deity.power *= 0.9;
						deity.stature *= 0.95;
						my_interest.expire();
					}
				}
			],
			construct: function (me, my_parent) {
				var i, a=[], r;
				for (i in it.deities) {
					if (i!='you'&&it.deities[i].awake) a.push(i);
				}
				r = H.r(a.length) - 1;
				me.deity = a[r];
			},
			discover: ['theology']
		},
		non_governance: {
			object_type: 'governance',
			name: 'No Interference',
			prosperity: 0,
			science: 0,
			currency: 0,
			control: 0,
			trade: 1,
			culture: 1
		},
		hedonism: {
			object_type: 'governance',
			name: 'Hedonism',
			prosperity: 0.15,
			science: 0,
			currency: 0,
			control: 0,
			trade: 1,
			culture: 0.3
		},
		doom: {
			object_type: 'omen',
			name: 'Omen of Doom',
			description: 'The people of the world are fearful and desperate for answers. People find their way to your fold much more quickly.',
			icon: '!',
			atoms: [
				{
					type: 'max',
					target: 'humans_counter_influence',
					order: 700,
					func: function (x) {return x/(1 + it.heavens.ominousness)}
				}
			],
			apply: function () {
				var d = Math.min(H.r(3), it.species.humans.value);
				var t = 'Omen of Doom!' + (d ? ' ' + d + ' of your followers perish.': '');
				it.log.add(t, 'big_death');
				it.species.humans.value -= d;
				it.resources.corpses.value += d;
			},
			duration: 1/6,
		},
		eternity: {
			object_type: 'omen',
			name: 'Omen of Eternity',
			description: 'Time rushes past without notice.',
			icon: '!',
			atoms: [
				{
					type: 'dilation',
					target: 'clock',
					order: 700,
					func: function (x) {return x/(1 + 2 * it.heavens.ominousness)}
				}
			],
			duration: 1/6
		},
		reverie: {
			object_type: 'omen',
			name: 'Reverie',
			description: 'Your followers lose themselves, working day and night.',
			icon: '!',
			atoms: [
				{
					type: 'exhaustion',
					target: 'humans',
					order: 400,
					func: function (x) {
						var d = Math.max(6, it.species.humans.value*.6);
						return x+d
					}
				},
				{
					type: 'count',
					targets: ['hunter', 'farmer', 'labourer', 'manufacturer', 'researcher'],
					order: 700,
					func: function (x) {
						return x*(1 + .5 * it.heavens.ominousness);
					}
				}
			],
			duration: 1/6
		},
		discovery: {
			object_type: 'omen',
			name: 'Omen of Discovery',
			chance: 0.5,
			description: 'Guided by the stars, your followers find a secret location',
			icon: '!',
			duration: 1/60,
			apply: function () {
				var a = []
				for (i in it.world_map.map_list) {
					if (!it.world_map.map_list[i].discoveries) a.push(it.world_map.map_list[i])
				}
				if (!a.length) return;
				var r = H.r(a.length) - 1;
				a[r].new_interest({});
				a[r].discoveries+=1;
			},
			condition: function () {
				var i;
				for (i in it.world_map.map_list) {
					if (it.world_map.map_list[i].discoveries<1) return true;
				}
				return false;
			}
		},
		description_console: {
			object_type: 'console',
			name: 'Description',
			unlocked: 1,
			select: function (me, value) {
				me.ui.clear('body');
				me.ui_lines.name.innerHTML = '<b>' + value.name + '</b>' + (value.expired ? ' (Expired)' : '');
				var i;
				for (i in value.desc_lines) {
					me.ui.add(value.desc_lines[i])
				}
			},
			unselect: function (me, value) {
			}
		},
		governance_console: {
			object_type: 'console',
			name: 'Governance',
			construct: function (me) {
				me.ui_lines.desc = H.e('div', 0, 'node_line', 'Governance models affect the prosperity of the settlement as well as the benefits you can extract from it.<br><br>');
				me.ui.add(me.ui_lines.desc);
				me.ui_lines.dropdown = H.e('div', 0, 'node_line');
				it.add_dropdown(me, 'type', {
					name: 'Zeitgeist',
					show_in: me.ui_lines.dropdown
				});
				me.ui.add(me.ui_lines.dropdown);
				function zeitgeist_tooltip (e) {
					it.tooltip.show(e, 'Select a philosophy to influence the people of this place.', 'Zeitgeist');
				}
				me.ui_lines.dropdown.addEventListener('mouseover', zeitgeist_tooltip);
				me.ui_lines.dropdown.addEventListener('mouseout', it.tooltip.hide);
				var i;
				function add_option (x) {
					me.dropdowns.type.add_option(x, it.governances[x].name, function () {return it.governances[x].unlocked});
				};
				for (i in it.governances) {
					add_option(i);
				};
				Object.defineProperty(me, 'type', {
					get: function () {if (it.world_map.selected_interest)return it.world_map.selected_interest.governance; else return false},
					set: function (v) {
						if (v&&it.world_map.selected_interest) {
							it.world_map.selected_interest.governance = v;
						}
					}
				})
			},
			select: function (me, value) {
				me.dropdowns.type.selected = value.governance;
			},
			unselect: function (me, value) {}
		},
		mining_console: {
			object_type: 'console',
			name: 'Mining',
			unlocked: 1,
			construct: function (me) {
				me.ui_lines.desc = H.e('div', 0, 'node_line', 'Use labour to extract materials from this location.');
				me.ui.add(me.ui_lines.desc);
				me.ui_lines.spinner = H.e('div', 0, 'node_line');
				it.add_spinner(me, 'labour_usage', {
					name: 'Labour',
					show_in: me.ui_lines.spinner,
					min: 0,
					max: 50,
					click_value: 50,
					shift_click_value: 10
				});
				Object.defineProperty(me, 'labour_usage', {
					get: function () {return it.world_map.selected_interest&&it.world_map.selected_interest.labour_usage},
					set: function (v) {
						if (!it.world_map.selected_interest) return;
						it.world_map.selected_interest.labour_usage = v;
						if(it.world_map.selected_interest.apply_atoms) it.world_map.selected_interest.apply_atoms();
					}
				});
				me.ui.add(me.ui_lines.spinner);
			},
			select: function (me, value) {
				me.spinners.labour_usage.value = value.labour_usage;
				me.spinners.labour_usage.max = value.max_labour;
			},
			unselect: function (me, value) {}
		},
		archaeology_console: {
			object_type: 'console',
			name: 'Archaeology',
			construct: function (me) {
				me.ui_lines.button = H.e('div', 0, 'node_inline_button');
				me.ui_lines.button_fill = H.e('div', me.ui_lines.button, 'node_button_fill');
				me.ui_lines.button_text = H.e('div', me.ui_lines.button, 'node_button_text', 'Begin exploring');
				
				me.ui_lines.button.update = function () {
					if (!it.world_map.selected_interest) return;
					if (it.world_map.selected_interest.exploring) {
						var p = it.world_map.selected_interest.explored / it.world_map.selected_interest.explore_time * 100;
						me.ui_lines.button_fill.style.left = p + '%';
						me.ui_lines.button_text.innerHTML = 'Stop Exploring';
						me.ui_lines.remains.style.display = 'block';
						me.ui_lines.events.style.display = 'block';
					} else {
						me.ui_lines.button_text.innerHTML = 'Start Exploring';
						me.ui_lines.button_fill.style.left = 0;
						me.ui_lines.remains.style.display = 'none';
						me.ui_lines.events.style.display = 'none';
					}
				}
				
				me.ui_lines.remains = H.e('div', 0, 'node_line');
				
				me.ui_lines.remains.update = function () {
					if (!it.world_map.selected_interest) return;
					me.ui_lines.remains.innerHTML = 'Remaining Supplies: ' + it.dosh.format(it.world_map.selected_interest.goods);
				}
				me.ui_lines.remains.style.display = 'none';
				
				me.ui_lines.events = H.e('div', 0, 'node_line');
				me.ui_lines.events.update = function () {
					if (!it.world_map.selected_interest) return;
					if (it.world_map.selected_interest.exploring&&it.world_map.selected_interest.last_event) me.ui_lines.events.innerHTML = it.world_map.selected_interest.last_event.description;
					else me.ui_lines.events.innerHTML = '';
				}
				me.ui_lines.events.style.display = 'none';
				
				me.ui.add(me.ui_lines.button);
				me.ui.add(me.ui_lines.remains);
				me.ui.add(me.ui_lines.events);
				
				function tooltip () {
					var c = it.dosh.consider({cost: it.world_map.selected_interest.explore_cost});
					var r = 'Cost: ' + c.format + '<br>Send an expedition to see what can be uncovered.'
					return r;
				}
				function show_tooltip(e) {
					it.tooltip.show(e, tooltip, 'Exploration');
				}
				
				function click_me (e) {
					e.stopPropagation();
					if (it.world_map.selected_interest.expired) return;
					if (!it.world_map.selected_interest.exploring) {
						var c = it.dosh.consider({cost: it.world_map.selected_interest.explore_cost});
						if (c.cant_pay) return;
						c.pay();
						it.world_map.selected_interest.goods = H.d(it.world_map.selected_interest.explore_cost);
						it.world_map.selected_interest.exploring = true;
					} else {
						it.world_map.selected_interest.exploring = false;
					}	
				}

				me.ui_lines.button.addEventListener('click', click_me);
				me.ui_lines.button.addEventListener('mouseover', show_tooltip);
				me.ui_lines.button.addEventListener('mouseout', it.tooltip.hide);
				
				function add_event (obj) {
					r = H.r()*obj.parent.total_chance;
					var j=-1;
					while (r>0) {
						j++;
						r-=obj.parent.arch_events[j].chance
					}
					obj.event_list.push(j)
				}
				
				me.create_archaeology = function (target) {
					target.explore_time = H.g(0.025, 0.005);
					target.explored = 0;
					target.explore_cost = {humans: 3, labour: 30, food: 15};
					target.rewards = {};
					target.event_list = [];
					
					var arch = {
						parent: target,
						explore_tick: function () {
							target.explored += it.clock.tick_amount;
							if (target.explored>=target.explore_time) {
								target.explore_time = H.g(0.025, 0.005);
								target.explored = 0;
															
								target.goods.food -= target.goods.humans / 6;
								if (target.goods.food<=0) {
									target.goods.food = 0;
									if (!target.starve) target.starve = 1; else target.starve += 1;
								}
								if (target.starve>=3) {
									target.starve = 0;
									target.last_event = {
										event: function () {target.goods.humans -= 1},
										description: 'One explorer starves to death.'
									}
								} else {
									var found_one = false;
									while (!found_one) {
										add_event(target);
										target.last_event = target.parent.arch_events[target.event_list.shift()];
										if (!target.last_event.condition||target.last_event.condition()) found_one=true;
									}
								}
								
								target.last_event.event(target);
								
								if (target.goods.humans<=0||target.goods.labour<=0) {
									target.exploring = false;
									return
								}
							}
						},
						get_rewards: function () {
							if (target.goods&&target.goods.humans) {
								var r = 'Your archaeological expedition returns with: ' + it.dosh.format(target.goods);
								var i;
								for (i in target.goods) {
									it.dosh[i].value += target.goods[i];
								}
								target.goods = {}
								it.log.add(r);
							} else {
								it.log.add('Your archaeological expedition has failed. All your followers died.', 'big_death');
							}
						}
					}
					
					var exploring
					Object.defineProperty(target, 'exploring', {
						get: function () {return exploring},
						set: function (v) {
							if (v&&!exploring) {
								exploring = true;
								it.each_tick.add_result(arch.explore_tick)
							} else if (!v&&exploring) {
								exploring = false;
								target.explored = 0;
								it.each_tick.remove_result(arch.explore_tick);
								arch.get_rewards();
								console.log(arch.parent);
								arch.parent.expire();
							}
							exploring = v;
						}
					});
					var i;
					
					for (i = 0; i<5; i++) {
						add_event(target);
					}
					target.archaeology = arch;
				}
			},
			select: function (me, value) {},
			unselect: function (me, value) {}
		},
		theology_console: {
			object_type: 'console',
			name: 'Theology',
			construct: function (me) {
				me.ui_lines.name_line = H.e('div', 0, 'node_line');
				me.ui_lines.tribute_cost = H.e('div', 0, 'node_line');
				me.ui_lines.pay_tribute = H.e('div', 0, 'node_inline_button', 'Offer Tribute');
				
				it.add_button_animation(me.ui_lines.pay_tribute);
				
				me.ui_lines.tribute_cost.update = function (target_deity) {
					if (!it.world_map.selected_interest||!it.world_map.selected_interest.deity) return;
					var d = it.deities[it.world_map.selected_interest.deity];
					me.ui_lines.name_line.innerHTML = 'Shrine to ' + d.name;
					var c = it.dosh.consider(d.tribute_cost);
					me.ui_lines.tribute_cost.innerHTML = 'Tribute cost: ' + c.format;
					if (c.cant_pay||it.world_map.selected_interest.expired) H.add_class(me.ui_lines.pay_tribute, 'node_button_no_press');
					else H.remove_class(me.ui_lines.pay_tribute, 'node_button_no_press');
				}
				
				me.ui.add(me.ui_lines.name_line);
				me.ui.add(me.ui_lines.tribute_cost);
				me.ui.add(me.ui_lines.pay_tribute);
				
				function tribute () {
					var d = it.deities[it.world_map.selected_interest.deity];
					var c = it.dosh.consider(d.tribute_cost);
					if (c.cant_pay||it.world_map.selected_interest.expired) return;
					me.ui_lines.pay_tribute.animate();
					c.pay();
					if (c.is_paid) {
						it.log.add('<span class=\'horrific\'>Your followers paid tribute to ' + d.name + '. Something changes in the heavens.</span>');
						d.tributes+=1;
						d.tribute_cost.installments.made = 0;
						d.tribute_cost.paid = {};
					} else {
						it.log.add('Your followers paid tribute to ' + d.name + '. There is no immediate effect, perhaps more is required.');
					}
				}
				
				me.ui_lines.pay_tribute.addEventListener('click', tribute);
			},
			select: function (me, value) {
			},
			unselect: function () {}
		}
	}
	
}