var objCard = 
{
	id: "",
	title: "",
	subTitle: "",
	details: [],
	race: "",
	gender: "",
	sexualOrientation: "",
	baseAttack: 0,
	baseDefence: 0,
	newAttack: 0,
	newDefence: 0,
	wokeRating: 0,
	turnsToLive: 0,
	onDestroy: function(placeholder) 
	{
		var card = this;
		//obtain placeholder
		var cardContents = placeholder.split(" ");
		cardContents = cardContents[0] + " .card";

		if (game.winner == null)
		{
			var index;
			var temp = placeholder.split(" ");
			temp = temp[0];
			temp = temp.split("_");
			index = parseInt(temp[1]);

			if (placeholder.indexOf("botHand") == -1)
			{
				playerHand.handGlow("playerHand_" + index, -1);
			}
			else
			{
				botHand.handGlow("botHand_" + index, -1);
			}	

			$(cardContents).animate
			(
				{
	    			opacity: 0,
	  			}, 
	  			1000, 
	  			function() 
	  			{	
	  				card.destroy(placeholder);
	  			}
	  		);

	  		card.destroySpecial(index);
		}
	},
	onAttack: function(index) 
	{
		if (game.winner == null)
		{
			this.attackSpecial(index);
			this.attack(index, this.wokeRating);

			game.renderAttackSequence();

			var attacker = game.turnAttacker;

			game.nextTurn();

			$("#attackSlot_" + index + " span").animate
			(
				{
	    			marginTop: (attacker == "player" ? "0" : "50") + "%",
	  			}, 
	  			2000, 
	  			function() 
	  			{	
	  				$("#attackSlot_" + index).html("");

					if (game.turnIndex == -1) 
					{
						game.endRound();
					}
					else
					{
						game.startTurn();
					}
	  			}
	  		);
		}
		else
		{
			game.endRound();
		}
	},
	onEditAttack: function(pts, placeholder) 
	{
		var card = this;

		if (game.winner == null)
		{
			card.editAttack(pts);
			$(placeholder).html(card.newAttack);	

			$(placeholder).animate
			(
				{
	    			color: config.getContextColor(pts),
	  			}, 
	  			100, 
	  			function() 
	  			{	
					$(placeholder).animate
					(
						{
			    			color: "#FFFFFF",
			  			}, 
			  			1000, 
			  			function() 
			  			{
			  				card.editAttack(-pts);
			  				$(placeholder).html(card.newAttack);
			  			}
			  		);
	  			}
	  		);
		}
	},
	onEditDefence: function(pts, placeholder) 
	{
		var card = this; 

		if (game.winner == null)
		{
			card.editDefence(pts);

			if (card.newDefence <= 0)
			{
				card.onDestroy(placeholder);
			}

			$(placeholder).animate
			(
				{
	    			color: config.getContextColor(pts),
	  			}, 
	  			100, 
	  			function() 
	  			{
					$(placeholder).animate
					(
						{
			    			color: "#FFFFFF",
			  			}, 
			  			1000, 
			  			function() 
			  			{
			  				$(placeholder).html(card.newDefence < 0 ? 0 : card.newDefence);

							if (card.newDefence <= 0)
							{
								card.newDefence = card.baseDefence;
							}
			  			}
			  		);
	  			}
	  		);
		}
	},
	onEditTurnsToLive: function(pts) 
	{
		if (game.winner == null)
		{
			this.editTurnsToLive(pts);	
			//animate
		}
	},
	editAttack: function(pts) 
	{
		this.newAttack = this.newAttack + pts;	
	},
	editDefence: function(pts) 
	{
		this.newDefence	= this.newDefence + pts;	
	},
	editTurnsToLive: function(pts) 
	{
		this.turnsToLive = this.turnsToLive + pts;

		if (this.turnsToLive < 0) this.turnsToLive = 0;
	},
	attack: function(index, wokeRating) 
	{
		var card = this;
		var damage = config.generateRandomNo(1, this.newAttack);

		if (game.turnAttacker == "player")
		{
			if (index < botHand.cards.length)
			{
				if (card.id == "moderate")
				{
					if (damage == 1)
					{
						player.onEditWokePoints(config.medium);
						player.showSpecial("moderate", 0, index);
					}
				}

				if (card.id == "extremist")
				{
					if (damage == card.baseAttack)
					{
						player.onEditWokePoints(config.medium);
						player.showSpecial("extremist", 0, index);
					}
				}

				if (botHand.findCardById("moderate").length != 0)
				{
					if (card.id == "feminazi" || card.id == "misogynist" || card.id == "homophobe" || card.id == "xenophobe")
					{
						if (config.generateRandomNo(1, 100) <= (config.minor * 10))
						{
							damage = 1;
							bot.showSpecial("moderate", 1, botHand.findSlotById("moderate"));
						}
					}
				}

				if (playerHand.findCardById("extremist").length != 0)
				{
					if (card.id == "feminazi" || card.id == "misogynist" || card.id == "homophobe" || card.id == "xenophobe")
					{
						if (config.generateRandomNo(1, 100) <= (config.minor * 10))
						{
							damage = card.baseAttack;
							player.showSpecial("extremist", 1, playerHand.findSlotById("extremist"));
						}
					}
				}

				if (botHand.findCardById("tonepolice").length != 0)
				{
					if (config.generateRandomNo(1, 100) <= (config.minor * 10))
					{
						damage = 1;
						bot.showSpecial("tonepolice", 0, botHand.findSlotById("tonepolice"));
					}
				}

				if (botHand.cards[index] == null)
				{
					bot.onEditLikes(-damage);
				}
				else
				{
					if (card.id == "wsupremacy" && botHand.cards[index].race == "Minority")
					{
						if (config.generateRandomNo(1, 100) <= (config.minor * 10))
						{
							player.onEditWokePoints(config.minor);
							player.showSpecial("wsupremacy", 2, index);
						}
					}

					if (card.id == "feminazi" && botHand.cards[index].gender == "Male")
					{
						if (config.generateRandomNo(1, 100) <= (config.minor * 10))
						{
							player.onEditWokePoints(config.minor);
							player.showSpecial("feminazi", 2, index);
						}
					}

					if (card.id == "mansplaining" && botHand.cards[index].gender == "Female")
					{
						if (config.generateRandomNo(1, 100) <= (config.minor * 10))
						{
							player.onEditWokePoints(config.minor);
							player.showSpecial("mansplaining", 2, index);
						}
					}

					if (card.wokeRating > botHand.cards[index].wokeRating && botHand.findCardById("pcbrigade").length != 0)
					{
						player.onEditWokePoints(-config.minor);
						bot.showSpecial("pcbrigade", 0, botHand.findSlotById("pcbrigade"));
					}

					if (botHand.findCardById("wknight").length != 0 && botHand.cards[index].gender == "Female" && playerHand.cards[index].gender == "Male")
					{
						if (config.generateRandomNo(1, 100) <= (config.medium * 10))
						{
							damage = 1;
							bot.showSpecial("wknight", 0, botHand.findSlotById("wknight"));
						}
					}

					if (botHand.findCardById("wguilt").length != 0 && botHand.cards[index].race == "Minority" && playerHand.cards[index].race == "White")
					{
						if (config.generateRandomNo(1, 100) <= (config.medium * 10))
						{
							damage = 1;
							bot.showSpecial("wguilt", 0, botHand.findSlotById("wguilt"));
						}
					}

					if (card.gender == "Female" && botHand.cards[index].id == "maternity")
					{
						player.onEditWokePoints(-config.medium);
						bot.showSpecial("maternity", 1, botHand.findSlotById("maternity"));
					}

					if (botHand.cards[index].id == "victim")
					{
						bot.onEditWokePoints(config.medium);
						bot.showSpecial("victim", 1, index);
					}

					if (damage >= botHand.cards[index].newDefence)
					{
						if (botHand.cards[index].id == "kbwar")
						{
							var ttl = card.wokeRating - config.medium;
							ttl = (ttl < 0 ? 0 : ttl);
							botHand.cards[index].onEditTurnsToLive(ttl);
						}
						else
						{
							botHand.cards[index].onEditTurnsToLive(card.wokeRating);	
						}
						
						if (card.wokeRating == botHand.cards[index].wokeRating)
						{
							if (config.generateRandomNo(1, 100) <= (config.minor * 10))
							{
								player.onEditWokePoints(config.medium);
							}
						}

						if (card.wokeRating < botHand.cards[index].wokeRating)
						{
							player.onEditWokePoints(config.major);
						}

						if (card.wokeRating > botHand.cards[index].wokeRating)
						{
							player.onEditWokePoints(config.minor);
						}

						if (card.id == "adhominem")
						{
							bot.onEditWokePoints(-config.minor);
							player.showSpecial("adhominem", 0, index);
						}

						if (card.id == "vsignal")
						{
							card.onEditDefence(config.minor, "#playerHand_" + index + " .def_" + card.id);
							player.showSpecial("vsignal", 1, index);									
						}
					}
					else
					{
						if (card.id == "vsignal")
						{
							if (config.generateRandomNo(1, 100) <= (config.minor * 10))
							{
								player.onEditWokePoints(damage);
								player.showSpecial("vsignal", 0, index);									
							}
						}	
					}

					botHand.showEditDefence(index, -damage);
					botHand.cards[index].onEditDefence(-damage, "#botHand_" + index + " .def_" + botHand.cards[index].id);
				}
			}
			else
			{
				bot.onEditLikes(-damage);
			}
		}

		if (game.turnAttacker == "bot")
		{
			if (index < playerHand.cards.length)
			{
				if (card.id == "moderate")
				{
					if (damage == 1)
					{
						bot.onEditWokePoints(config.medium);
						bot.showSpecial("moderate", 0, index);
					}
				}

				if (card.id == "extremist")
				{
					if (damage == card.baseAttack)
					{
						bot.onEditWokePoints(config.medium);
						bot.showSpecial("extremist", 0, index);
					}
				}

				if (playerHand.findCardById("moderate").length != 0)
				{
					if (card.id == "feminazi" || card.id == "misogynist" || card.id == "homophobe" || card.id == "xenophobe")
					{
						if (config.generateRandomNo(1, 100) <= (config.minor * 10))
						{
							damage = 1;
							player.showSpecial("moderate", 1, playerHand.findSlotById("moderate"));
						}
					}
				}

				if (botHand.findCardById("extremist").length != 0)
				{
					if (card.id == "feminazi" || card.id == "misogynist" || card.id == "homophobe" || card.id == "xenophobe")
					{
						if (config.generateRandomNo(1, 100) <= (config.minor * 10))
						{
							damage = card.baseAttack;
							bot.showSpecial("extremist", 1, botHand.findSlotById("extremist"));
						}
					}
				}

				if (playerHand.findCardById("tonepolice").length != 0)
				{
					if (config.generateRandomNo(1, 100) <= (config.minor * 10))
					{
						damage = 1;
						player.showSpecial("tonepolice", 0, playerHand.findSlotById("tonepolice"));
					}
				}

				if (playerHand.cards[index] == null)
				{
					player.onEditLikes(-damage);
				}
				else
				{
					if (card.id == "wsupremacy" && playerHand.cards[index].race == "Minority")
					{	
						if (config.generateRandomNo(1, 100) <= (config.minor * 10))
						{
							bot.onEditWokePoints(config.minor);
							bot.showSpecial("wsupremacy", 2, index);
						}	
					}

					if (card.id == "feminazi" && playerHand.cards[index].gender == "Male")
					{	
						if (config.generateRandomNo(1, 100) <= (config.minor * 10))
						{
							bot.onEditWokePoints(config.minor);
							bot.showSpecial("feminazi", 2, index);
						}	
					}

					if (card.id == "mansplaining" && playerHand.cards[index].gender == "Female")
					{	
						if (config.generateRandomNo(1, 100) <= (config.minor * 10))
						{
							bot.onEditWokePoints(config.minor);
							bot.showSpecial("mansplaining", 2, index);
						}	
					}

					if (card.wokeRating > playerHand.cards[index].wokeRating && playerHand.findCardById("pcbrigade").length != 0)
					{
						bot.onEditWokePoints(-config.minor);
						player.showSpecial("pcbrigade", 0, playerHand.findSlotById("pcbrigade"));
					}

					if (playerHand.findCardById("wknight").length != 0 && playerHand.cards[index].gender == "Female" && botHand.cards[index].gender == "Male")
					{
						if (config.generateRandomNo(1, 100) <= (config.medium * 10))
						{
							damage = 1;
							player.showSpecial("wknight", 0, playerHand.findSlotById("wknight"));
						}
					}

					if (playerHand.findCardById("wguilt").length != 0 && playerHand.cards[index].race == "Minority" && botHand.cards[index].race == "White")
					{
						if (config.generateRandomNo(1, 100) <= (config.medium * 10))
						{
							damage = 1;
							player.showSpecial("wguilt", 0, playerHand.findSlotById("wguilt"));
						}
					}

					if (card.gender == "Female" && playerHand.cards[index].id == "maternity")
					{
						bot.onEditWokePoints(-config.medium);
						player.showSpecial("maternity", 1, playerHand.findSlotById("maternity"));
					}

					if (playerHand.cards[index].id == "victim")
					{
						player.onEditWokePoints(config.medium);
						player.showSpecial("victim", 1, index);
					}

					if (damage >= playerHand.cards[index].newDefence)
					{
						if (playerHand.cards[index].id == "kbwar")
						{
							var ttl = card.wokeRating - config.medium;
							ttl = (ttl < 0 ? 0 : ttl);
							playerHand.cards[index].onEditTurnsToLive(ttl);
						}
						else
						{
							playerHand.cards[index].onEditTurnsToLive(card.wokeRating);
						}

						if (card.wokeRating == playerHand.cards[index].wokeRating)
						{
							bot.onEditWokePoints(config.medium);
						}

						if (card.wokeRating < playerHand.cards[index].wokeRating)
						{
							bot.onEditWokePoints(config.major);
						}

						if (card.wokeRating > playerHand.cards[index].wokeRating)
						{
							bot.onEditWokePoints(config.minor);
						}

						if (card.id == "adhominem")
						{
							player.onEditWokePoints(-config.minor);
							bot.showSpecial("adhominem", 0, index);
						}

						if (card.id == "vsignal")
						{
							card.onEditDefence(config.minor, "#botHand_" + index + " .def_" + card.id);
							bot.showSpecial("vsignal", 1, index);									
						}
					}
					else
					{
						if (card.id == "vsignal")
						{
							if (config.generateRandomNo(1, 100) <= (config.minor * 10))
							{
								bot.onEditWokePoints(damage);
								bot.showSpecial("vsignal", 0, index);									
							}
						}
					}

					playerHand.showEditDefence(index, -damage);
					playerHand.cards[index].onEditDefence(-damage, "#playerHand_" + index + " .def_" + playerHand.cards[index].id);
				}
			}
			else
			{
				player.onEditLikes(-damage);
			}
		}	
	},
	destroy: function(placeholder) 
	{
		//derive index from placeholder
		var index;
		var temp = placeholder.split(" ");
		temp = temp[0];
		temp = temp.split("_");
		index = parseInt(temp[1]);

		if (placeholder.indexOf("botHand") == -1)
		{
			playerHand.cards[index] = null;
		}
		else
		{
			botHand.cards[index] = null;
		}		
	},
	destroySpecial: function(index) {},
	attackSpecial: function(index) {},
	playSpecial: function(index, attacker) {},
	roundSpecial: function(index, attacker) {},
	init: function()
	{
		this.newDefence = this.baseDefence;
		this.newAttack = this.baseAttack;
	},
	show: function(size) 
	{
		var html = this.renderCard(size);
		$("#" + this.placeholderId + "_" + this.placeholderSlot).html(html);
	},
	render: function(size)
	{
		if (size == "xs")
		{
			var container = $("<div></div>");
			container.addClass("card_xs_container");

			var card = $("<div></div>");
			card.addClass("card").addClass("card_xs");
			card.attr("style","background: #999999 url(img/" + this.id + ".jpg) center center no-repeat; background-size: cover;");

			var overlay = $("<div></div>");
			overlay.addClass("card_overlay");
			card.append(overlay);

			var title = $("<div></div>");
			title.addClass("title");
			title.html(this.title);

			var wokeRating = $("<div></div>");
			wokeRating.addClass("wokeRating");
			wokeRating.html(this.wokeRating);

			var ttl = $("<div></div>");
			ttl.addClass("ttl");
			ttl.html(this.turnsToLive);

			var attdef = $("<div></div>");
			attdef.addClass("attdef");
			attdef.html
			(
				"<div class=\"card_statLabel\">&#9876;</div> <div class=\"card_stat att_" + this.id + "\">" + this.baseAttack + "</div>"
				+ "<div class=\"card_statLabel\">&#9960;</div> <div class=\"card_stat def_" + this.id + "\">" + this.newDefence + "</div>"
			);

			overlay.append(wokeRating);
			overlay.append(ttl);

			container.append(card);
			container.append(title);
			container.append(attdef);
			return container;
		}
		else
		{
			var container = $("<div></div>");
			container.addClass("card").addClass("card_" + size);
			container.attr("style","background: #999999 url(img/" + this.id + ".jpg) center center no-repeat; background-size: cover;");

			var overlay = $("<div></div>");
			overlay.addClass("card_overlay");
			container.append(overlay);

			var title = $("<div></div>");
			title.addClass("title");
			title.html(this.title);

			var subTitle = $("<div></div>");
			subTitle.addClass("subTitle");
			subTitle.html(this.subTitle);

			var details = $("<div></div>");
			details.addClass("details");
			var content = "";
			var card = this;
			$(card.details).each
			(
				function (index)
				{
					content += "<b>" + card.details[index].title + "</b><br />";
					content += "<small>" + card.details[index].description + "</small>";
					content += "<br /><br />";
				}
			);
			details.html(content);

			var wokeRating = $("<div></div>");
			wokeRating.addClass("wokeRating");
			wokeRating.html(this.wokeRating);

			var attdef = $("<div></div>");
			attdef.addClass("attdef");
			attdef.html
			(
				"<div class=\"card_statLabel\">&#9876;</div><div class=\"card_stat att_" + this.id + "\">" + this.baseAttack + "</div>"
				+ "<br /><div class=\"card_statLabel\">&#9960;</div> <div class=\"card_stat def_" + this.id + "\">" + this.newDefence + "</div>"
			);

			var otherDetails = $("<div></div>");
			otherDetails.addClass("otherDetails");
			otherDetails.html
			(
				"Race <b>" + this.race + "</b><br />"
				+ "Gender <b>" + this.gender + "</b><br />"
				+ "Sexual Orientation <b>" + this.sexualOrientation + "</b>"
			);

			var gameStats = $("<div></div>");
			gameStats.addClass("gameStats");
			gameStats.append(wokeRating).append(attdef);

			overlay.append(title);
			overlay.append(subTitle);
			overlay.append(otherDetails);
			overlay.append(details);			
			overlay.append(gameStats);

			return container;			
		}
	}
}

var cardTemplates = [];
var newCard;

newCard = Object.assign({}, objCard);
newCard.id = "wman";
newCard.title = "White Man";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "If there is a <b>Male</b> or <b>White</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "White";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "White"
			},
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (game.turnAttacker == "bot")
		{
			placeholder = "#botHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "player")
		{
			placeholder = "#playerHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wwoman";
newCard.title = "White Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "If there is a <b>Female</b> or <b>White</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Defence</b> on play."
	}
];
newCard.race = "White";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "White"
			},
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.medium, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "hman";
newCard.title = "Hispanic Man";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "If there is a <b>Male</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (game.turnAttacker == "bot")
		{
			placeholder = "#botHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "player")
		{
			placeholder = "#playerHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "hwoman";
newCard.title = "Hispanic Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "If there is a <b>Female</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Defence</b> on play."
	}
];
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.medium, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "bman";
newCard.title = "Black Man";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "If there is a <b>Male</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (game.turnAttacker == "bot")
		{
			placeholder = "#botHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "player")
		{
			placeholder = "#playerHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "bwoman";
newCard.title = "Black Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "If there is a <b>Female</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Defence</b> on play."
	}
];
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.medium, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "aman";
newCard.title = "Asian Man";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "If there is a <b>Male</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (game.turnAttacker == "bot")
		{
			placeholder = "#botHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "player")
		{
			placeholder = "#playerHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "awoman";
newCard.title = "Asian Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "If there is a <b>Female</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Defence</b> on play."
	}
];
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.medium, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "naman";
newCard.title = "Native American Man";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "If there is a <b>Male</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (game.turnAttacker == "bot")
		{
			placeholder = "#botHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "player")
		{
			placeholder = "#playerHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "nawoman";
newCard.title = "Native American Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "If there is a <b>Female</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Defence</b> on play."
	}
];
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.medium, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "transgender";
newCard.title = "Transgender";
newCard.subTitle = "Gender is merely a social construct.";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "If there is a <b>Female</b> or <b>LGBT</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Defence</b> on play."
	},
	{
		"title" : "Solidarity Attack",
		"description": "If there is a <b>Male</b> or <b>LGBT</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.minor, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (game.turnAttacker == "bot")
		{
			placeholder = "#botHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "player")
		{
			placeholder = "#playerHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 1, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 1, index); }

		this.onEditAttack(config.minor, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "gay";
newCard.title = "Gay";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "If there is a <b>Male</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Attack</b> when attacking."
	},
	{
		"title" : "LGBT Unity",
		"description": "There is a <b>" + config.minor + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>LGBT</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (game.turnAttacker == "bot")
		{
			placeholder = "#botHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "player")
		{
			placeholder = "#playerHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.minor, placeholder);
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.minor * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "sexualOrientation",
					"val": "LGBT"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}		
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "lesbian";
newCard.title = "Lesbian";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "If there is a <b>Female</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Defence</b> on play."
	},
	{
		"title" : "LGBT Unity",
		"description": "There is a <b>" + config.minor + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>LGBT</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.minor, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.minor * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "sexualOrientation",
					"val": "LGBT"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}			
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "biman";
newCard.title = "Bisexual Man";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "If there is a <b>Male</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Attack</b> when attacking."
	},
	{
		"title" : "LGBT Unity",
		"description": "There is a <b>" + config.minor + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>LGBT</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (game.turnAttacker == "bot")
		{
			placeholder = "#botHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "player")
		{
			placeholder = "#playerHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.minor, placeholder);
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.minor * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "sexualOrientation",
					"val": "LGBT"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}			
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "biwoman";
newCard.title = "Bisexual Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "If there is a <b>Female</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Attack</b> when attacking."
	},
	{
		"title" : "LGBT Unity",
		"description": "There is a <b>" + config.minor + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>LGBT</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.minor, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.minor * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "sexualOrientation",
					"val": "LGBT"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}			
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "adhominem";
newCard.title = "Ad Hominem";
newCard.subTitle = "Cheap shots are the best shots.";
newCard.details = 
[
	{
		"title" : "Massive Burn", //in main class
		"description": "Upon successfully <b>Triggering</b> any card, your opponent loses <b>" + config.minor + "</b> <b>Woke Points</b>.",
	},
	{
		"title" : "Having the Last Word",
		"description": "When this card is <b>Triggered</b>, your opponent loses <b>" + config.medium + "</b> <b>Likes</b>.",
	},
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function(index)
{
	if (game.turnAttacker == "bot") 
	{
		player.showSpecial(this.id, 1, index); 
		bot.onEditLikes(-config.medium);
	}

	if (game.turnAttacker == "player") 
	{ 
		bot.showSpecial(this.id, 1, index); 
		player.onEditLikes(-config.medium);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "snowflake";
newCard.title = "Snowflake";
newCard.subTitle = "I'm offended!";
newCard.details = 
[
	{
		"title" : "Safe Space Healing", //in game class
		"description": "For every round this card spends in the <b>Safe Space</b>, gain <b>" + config.minor + "</b> <b>Defence</b>.",
	},
	{
		"title" : "Oppression Olympics",
		"description": "If there is a <b>Victim Card</b> in hand, gain a <b>x" + config.minor + "</b> bonus to <b>Attack</b>.",
	},
	{
		"title" : "Martyr Complex",
		"description": "When this card is <b>Triggered</b>, there is a <b>" + config.minor + "0%</b> to add the attacking card's <b>Woke Rating</b> to <b>Woke Points</b>.",
	},
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (botHand.findCardById("victim").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
			bot.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player")
	{
		if (playerHand.findCardById("victim").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
			player.showSpecial(this.id, 1, index);
		}
	}
};
newCard.destroySpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (config.generateRandomNo(1, 100) <= (config.minor * 10))
		{
			player.onEditWokePoints(botHand.cards[index].wokeRating);
			player.showSpecial(this.id, 2, index);									
		}
	}

	if (game.turnAttacker == "player")
	{
		if (config.generateRandomNo(1, 100) <= (config.minor * 10))
		{
			bot.onEditWokePoints(playerHand.cards[index].wokeRating);
			bot.showSpecial(this.id, 2, index);									
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "vsignal";
newCard.title = "Virtue Signalling";
newCard.subTitle = "It's great to be woke!";
newCard.details =
[
	{
		"title" : "Humblebrag", //in main class
		"description": "There is a <b>" + config.minor + "0%</b> chance to gain <b>Woke Points</b> for every point of damage done, when attacking.",
	},
	{
		"title" : "Moral Posturing", //in main class
		"description": "Upon successfully <b>Triggering</b> any card, gain <b>" + config.minor + "</b> <b>Defence</b>.",
	},
	{
		"title" : "Holier Than Thou", 
		"description": "Every round, there is a <b>" + config.minor + "0%</b> chance for your opponent to lose <b>Likes</b> for every <b>Woke Point</b> more you have than your opponent.",
	},
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.roundSpecial = function(index, attacker)
{
	var diff = 0;
	
	if (config.generateRandomNo(1, 100) <= (config.minor * 10))
	{
		if (attacker == "bot") 
		{
			diff = bot.wokePoints - player.wokePoints;
			if (diff > 0)
			{
				player.onEditLikes(-diff * config.minor);
				bot.showSpecial(this.id, 2, index);
			}
		}

		if (attacker == "player") 
		{
			diff = player.wokePoints - bot.wokePoints;
			if (diff > 0)
			{
				bot.onEditLikes(-diff * config.minor);
				player.showSpecial(this.id, 2, index);
			}
		}		
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "homophobe";
newCard.title = "Homophobe";
newCard.subTitle = "";
newCard.details =
[
	{
		"title" : "Homophobia", 
		"description": "Gain a <b>x" + config.minor + "</b> bonus to <b>Attack</b> if target is a <b>LGBT</b> card.",
	},
	{
		"title" : "Hetero Unity",
		"description": "There is a <b>" + config.medium + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>Hetero</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (playerHand.cards[index] != null)
		{
			if (playerHand.cards[index].sexualOrientation == "LGBT")
			{
				this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
				bot.showSpecial(this.id, 0, index);
			}
		}
	}

	if (game.turnAttacker == "player")
	{
		if (botHand.cards[index] != null)
		{
			if (botHand.cards[index].sexualOrientation == "LGBT")
			{
				this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
				player.showSpecial(this.id, 0, index);
			}
		}
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "sexualOrientation",
					"val": "Hetero"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "xenophobe";
newCard.title = "Xenophobe";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Xenophobia", 
		"description": "Attack with a <b>x" + config.minor + "</b> bonus to <b>Attack</b> if target is a <b>Minority</b> card.",
	},
	{
		"title" : "White Unity",
		"description": "There is a <b>" + config.medium + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>White</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (playerHand.cards[index] != null)
		{
			if (playerHand.cards[index].race == "Minority")
			{
				this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
				bot.showSpecial(this.id, 0, index);
			}
		}
	}

	if (game.turnAttacker == "player")
	{
		if (botHand.cards[index] != null)
		{
			if (botHand.cards[index].race == "Minority")
			{
				this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
				player.showSpecial(this.id, 0, index);
			}
		}
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "race",
					"val": "White"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "misogynist";
newCard.title = "Misogynist";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Misogyny", 
		"description": "Attack with a <b>x" + config.minor + "</b> bonus to <b>Attack</b> if target is a <b>Female</b> card.",
	},
	{
		"title" : "Gender Unity",
		"description": "There is a <b>" + config.medium + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>Male</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (playerHand.cards[index] != null)
		{
			if (playerHand.cards[index].gender == "Female")
			{
				this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
				bot.showSpecial(this.id, 0, index);
			}
		}
	}

	if (game.turnAttacker == "player")
	{
		if (botHand.cards[index] != null)
		{
			if (botHand.cards[index].gender == "Female")
			{
				this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
				player.showSpecial(this.id, 0, index);
			}
		}
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "gender",
					"val": "Male"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "tbmedia";
newCard.title = "Trial By Media";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Jumping the Gun", 
		"description": "On play, there is a <b>" + config.medium + "0%</b> chance for your opponent to lose <b>Likes</b> equal to the number of your <b>Woke Points</b>.",
	},
	{
		"title" : "Doxxing",
		"description": "Your opponent loses <b>" + config.minor + "</b> <b>Likes</b> with every attack by this card."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot") 
		{
			player.onEditLikes(-bot.wokePoints);
			bot.showSpecial(this.id, 0, index);
		}

		if (attacker == "player") 
		{
			bot.onEditLikes(-player.wokePoints);
			player.showSpecial(this.id, 0, index);
		}		
	}
};
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot") 
	{
		player.onEditLikes(config.minor);
		bot.showSpecial(this.id, 1, index);
	}

	if (game.turnAttacker == "player") 
	{
		bot.onEditLikes(config.minor);
		player.showSpecial(this.id, 1, index);
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "antivaxxers";
newCard.title = "Anti-vaxxers";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Mother Knows Best", 
		"description": "If there is a <b>Maternity Card</b> in hand, gain a <b>x" + config.minor + "</b> bonus to <b>Attack</b>.",
	},
	{
		"title" : "Mutually Assured Destruction",
		"description": "Upon being <b>Triggered</b>, deal <b>" + config.medium + "</b> damage to opposing card."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (botHand.findCardById("maternity").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
			bot.showSpecial(this.id, 0, index);
		}
	}

	if (game.turnAttacker == "player")
	{
		if (playerHand.findCardById("maternity").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
			player.showSpecial(this.id, 0, index);
		}
	}
};
newCard.destroySpecial = function(index)
{
	if (game.turnAttacker == "bot") 
	{
		if (botHand.cards[index] != null)
		{
			botHand.cards[index].onEditDefence(-config.medium, "#botHand_" + index + " .def_" + botHand.cards[index].id);
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		if (playerHand.cards[index] != null)
		{
			playerHand.cards[index].onEditDefence(-config.medium, "#playerHand_" + index + " .def_" + playerHand.cards[index].id);
			bot.showSpecial(this.id, 1, index);
		}
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "imisogyny";
newCard.title = "Internalized Misogyny";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "The woman in the mirror", 
		"description": "Attack with a <b>+" + config.medium + "</b> bonus to <b>Attack</b> if target is a <b>Female</b> card.",
	},
	{
		"title" : "Self-loathing",
		"description": "When <b>Triggered</b> by a <b>Male</b> card, gain <b>" + config.minor + " Woke Points</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function(index)
{
	if (game.turnAttacker == "bot") 
	{
		if (botHand.cards[index].gender == "Male")
		{
			player.onEditWokePoints(config.minor);
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		if (playerHand.cards[index].gender == "Male")
		{
			bot.onEditWokePoints(config.minor);
			bot.showSpecial(this.id, 1, index);
		}
	}
};
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (playerHand.cards[index] != null)
		{
			if (playerHand.cards[index].gender == "Female")
			{
				this.onEditAttack(config.medium, "#botHand_" + index + " .att_" + this.id);
				bot.showSpecial(this.id, 0, index);
			}
		}
	}

	if (game.turnAttacker == "player")
	{
		if (botHand.cards[index] != null)
		{
			if (botHand.cards[index].gender == "Female")
			{
				this.onEditAttack(config.medium, "#playerHand_" + index + " .att_" + this.id);
				player.showSpecial(this.id, 0, index);
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "ptrophy";
newCard.title = "Participation Trophy";
newCard.subTitle = "Everyone gets a prize!";
newCard.details = 
[
	{
		"title" : "Participation Bonus", 
		"description": "On play, gain <b>" + config.medium + " Likes</b> for every other card in hand.",
	},
	{
		"title" : "Something For Everyone",
		"description": "Every round, all other cards in hand gain <b>" + config.minor + " Defence</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.playSpecial = function(index, attacker)
{
	if (attacker == "bot")
	{
		var cards = botHand.cards.filter(function (x) {return x != null;});
		if (cards.length - 1 > 0)
		{
			bot.onEditLikes((cards.length - 1) * config.medium);
			bot.showSpecial(this.id, 0, index);			
		}
	}

	if (attacker == "player")
	{
		var cards = playerHand.cards.filter(function (x) {return x != null;});
		if (cards.length - 1 > 0) 
		{
			player.onEditLikes((cards.length - 1) * config.medium);
			player.showSpecial(this.id, 0, index);			
		}
	}	
};
newCard.roundSpecial = function(index, attacker)
{
	if (attacker == "bot")
	{
		for (var i = 0; i < botHand.cards.length; i++)
		{
			if (botHand.cards[i] != null)
			{
				if (botHand.cards[i].id != "ptrophy")
				{
					botHand.cards[i].onEditDefence(config.minor, "#botHand_" + i + " .def_" + botHand.cards[i].id);
				}
			}
		}

		bot.showSpecial(this.id, 1, index);
	}

	if (attacker == "player")
	{
		for (var i = 0; i < playerHand.cards.length; i++)
		{
			if (playerHand.cards[i] != null)
			{
				if (playerHand.cards[i].id != "ptrophy")
				{
					playerHand.cards[i].onEditDefence(config.minor, "#playerHand_" + i + " .def_" + playerHand.cards[i].id);
				}
			}
		}

		player.showSpecial(this.id, 1, index);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "cultapp";
newCard.title = "Cultural Appropriation";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Violation of Intellectual Property", 
		"description": "On play, there is a <b>" + config.medium + "%</b> chance to add opponent's <b>Woke Points</b> to your <b>Likes</b>.",
	},
	{
		"title" : "Identity Theft",
		"description": "When attacking, there is a <b>" + config.minor + "0%</b> chance to add the target card's <b>Woke Rating</b> to <b>Attack</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 50))
	{
		if (attacker == "bot")
		{
			bot.onEditLikes(player.wokePoints);
			bot.showSpecial(this.id, 0, index);
		}

		if (attacker == "player")
		{
			player.onEditLikes(bot.wokePoints);
			player.showSpecial(this.id, 0, index);
		}
	}
};
newCard.attackSpecial = function(index)
{
	if (config.generateRandomNo(1, 100) <= (config.medium * 20))
	{
		if (game.turnAttacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				this.onEditAttack(playerHand.cards[index].wokeRating, "#botHand_" + index + " .att_" + this.id);
				bot.showSpecial(this.id, 1, index);
			}
		}

		if (game.turnAttacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				this.onEditAttack(botHand.cards[index].wokeRating, "#playerHand_" + index + " .att_" + this.id);
				player.showSpecial(this.id, 1, index);
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "kbwar";
newCard.title = "Keyboard Warrior";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Internet Brigade", 
		"description": "If there is a <b>Trial By Media</b> card in hand, gain a <b>x" + config.minor + "</b> bonus to <b>Attack</b>.",
	},
	{
		"title" : "Going viral", //in attack
		"description": "When <b>Triggered</b>, take less <b>" + config.medium + "</b> rounds in the <b>Safe Space</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (botHand.findCardById("tbmedia").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
			bot.showSpecial(this.id, 0, index);
		}
	}

	if (game.turnAttacker == "player")
	{
		if (playerHand.findCardById("tbmedia").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
			player.showSpecial(this.id, 0, index);
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wknight";
newCard.title = "White Knight";
newCard.subTitle = "Women are to be respected and adored.";
newCard.details = 
[
	{
		"title" : "Chivalry", //in attack
		"description": "When this card is in play, any opposing <b>Male</b> cards attacking a <b>Female</b> card has a <b>" + config.medium + "0%</b> chance of doing minimum damage.",
	},
	{
		"title" : "Self-hatred",
		"description": "When <b>Triggered</b> by a <b>Female</b> card, gain <b>" + config.minor + " Woke Points</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function(index)
{
	if (game.turnAttacker == "bot") 
	{
		if (botHand.cards[index].gender == "Female")
		{
			player.onEditWokePoints(config.minor);
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		if (playerHand.cards[index].gender == "Female")
		{
			bot.onEditWokePoints(config.minor);
			bot.showSpecial(this.id, 1, index);
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "feminazi";
newCard.title = "Feminazi";
newCard.subTitle = "Down with the Patriarchy!";
newCard.details = 
[
	{
		"title" : "Androgyny", 
		"description": "Attack with a <b>x" + config.minor + "</b> bonus to <b>Attack</b> if target is a <b>Male</b> card.",
	},
	{
		"title" : "Female Protection",
		"description": "On play, gain <b>" + config.minor + " Defence</b> for every other <b>Female</b> card in hand."
	},
	{
		"title" : "Emasculation", //in game
		"description": "Upon <b>Triggering</b> a <b>Male</b> card, <b>" + config.minor + "0%</b> chance to add the card's <b>Woke Rating</b> to <b>Woke Points</b>."
	},
];
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (playerHand.cards[index] != null)
		{
			if (playerHand.cards[index].gender == "Male")
			{
				this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
				bot.showSpecial(this.id, 0, index);
			}
		}
	}

	if (game.turnAttacker == "player")
	{
		if (botHand.cards[index] != null)
		{
			if (botHand.cards[index].gender == "Male")
			{
				this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
				player.showSpecial(this.id, 0, index);
			}
		}
	}
};
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsInHand
	(
		index, 
		attacker, 
		[
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (attacker == "bot")
		{
			placeholder = "#botHand_" + index + " .def_" + this.id;
		}

		if (attacker == "player")
		{
			placeholder = "#playerHand_" + index + " .def_" + this.id;
		}

		if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 1, index); }

		this.onEditDefence(config.minor * activated, placeholder);
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wsupremacy";
newCard.title = "White Supremacy";
newCard.subTitle = "Blood and soil.";
newCard.details = 
[
	{
		"title" : "White Power",
		"description": "For every other <b>White</b> card in hand, add <b>" + config.minor + "</b> to <b>Attack</b> when attacking."
	},
	{
		"title" : "White Protection",
		"description": "On play, gain <b>" + config.minor + " Defence</b> for every other <b>White</b> card in hand."
	},
	{
		"title" : "Lynch Mob", //in game
		"description": "Upon <b>Triggering</b> a <b>Minority</b> card, <b>" + config.minor + "0%</b> chance to add the card's <b>Woke Rating</b> to <b>Woke Points</b>."
	},
];
newCard.race = "White";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsInHand
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "White"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (game.turnAttacker == "bot")
		{
			placeholder = "#botHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "player")
		{
			placeholder = "#playerHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.minor * activated, placeholder);
	}
};
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsInHand
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "White"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (attacker == "bot")
		{
			placeholder = "#botHand_" + index + " .def_" + this.id;
		}

		if (attacker == "player")
		{
			placeholder = "#playerHand_" + index + " .def_" + this.id;
		}

		if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 1, index); }

		this.onEditDefence(config.minor * activated, placeholder);
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wwashing";
newCard.title = "Whitewashing";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Superiority in Numbers",
		"description": "On play, if <b>White</b> cards outnumber <b>Minority</b> cards in hand, gain <b>" + config.minor + " Woke Points</b> for every extra <b>White</b> card."
	},
	{
		"title" : "White Defence",
		"description": "Every round, if <b>White</b> cards outnumber <b>Minority</b> cards in hand, gain <b>" + config.minor + " Defence</b> for every extra <b>White</b> card."
	},
	{
		"title" : "White Attack",
		"description": "If <b>White</b> cards outnumber <b>Minority</b> cards in hand, gain <b>+" + config.minor + "</b> bonus to <b>Attack</b> when attacking."
	}
];
newCard.race = "White";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.playSpecial = function(index, attacker)
{	
	var white = config.cardConditionsInHand
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "White"
			}
		]
	);

	var minority = config.cardConditionsInHand
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			}
		]
	);

	var activated = white - minority;

	if (activated > 0)
	{
		if (attacker == "bot") 
		{ 
			bot.showSpecial(this.id, 0, index); 
			bot.onEditWokePoints(activated * config.minor);
		} 

		if (attacker == "player") 
		{ 
			player.showSpecial(this.id, 0, index);
			player.onEditWokePoints(activated * config.minor);
		}	
	}
};
newCard.roundSpecial = function(index, attacker)
{
	var white = config.cardConditionsInHand
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "White"
			}
		]
	);

	var minority = config.cardConditionsInHand
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			}
		]
	);

	var activated = white - minority;

	if (activated > 0)
	{
		if (config.generateRandomNo(1, 100) <= (config.medium * 10))
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated * config.minor, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}		
	}
};
newCard.attackSpecial = function(index)
{
	var white = config.cardConditionsInHand
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "White"
			}
		]
	);

	var minority = config.cardConditionsInHand
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			}
		]
	);

	var activated = white - minority;

	if (activated > 0)
	{
		if (config.generateRandomNo(1, 100) <= (config.medium * 10))
		{
			if (game.turnAttacker == "bot")
			{
				this.onEditAttack(config.minor, "#botHand_" + index + " .att_" + this.id);
				bot.showSpecial(this.id, 2, index);
			}

			if (game.turnAttacker == "player")
			{
				this.onEditAttack(config.minor, "#playerHand_" + index + " .att_" + this.id);
				player.showSpecial(this.id, 2, index);
			}
		}		
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "maggression";
newCard.title = "Micro-aggression";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Toxic Presence",
		"description": "On play, remove <b>" + config.medium + " Woke Points</b> from your opponent."
	},
	{
		"title" : "War of Attrition",
		"description": "Every round, remove <b>" + config.minor + " Likes</b> from your opponent."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.playSpecial = function(index, attacker)
{
	if (attacker == "bot")
	{
		player.onEditWokePoints(-config.medium);
		bot.showSpecial(this.id, 0, index);			
	}

	if (attacker == "player")
	{
		bot.onEditWokePoints(-config.medium);
		player.showSpecial(this.id, 0, index);			
	}	
};
newCard.roundSpecial = function(index, attacker)
{
	if (attacker == "bot")
	{
		player.onEditLikes(-config.minor);
		bot.showSpecial(this.id, 1, index);			
	}

	if (attacker == "player")
	{
		bot.onEditLikes(-config.minor);
		player.showSpecial(this.id, 1, index);			
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "mansplaining";
newCard.title = "Mansplaining";
newCard.subTitle = "What you women don't realize is...";
newCard.details = 
[
	{
		"title" : "Male Protection",
		"description": "On play, gain <b>" + config.minor + " Defence</b> for every other <b>Male</b> card in hand."
	},
	{
		"title" : "Vocal Oppression", 
		"description": "If there is a <b>Micro-aggression</b> card in hand, gain a <b>x" + config.minor + "</b> bonus to <b>Attack</b>.",
	},
	{
		"title" : "Nobody asked!", //in game
		"description": "Upon <b>Triggering</b> a <b>Female</b> card, <b>" + config.minor + "0%</b> chance to add the card's <b>Woke Rating</b> to <b>Woke Points</b>."
	},
];
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (botHand.findCardById("maggression").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
			bot.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player")
	{
		if (playerHand.findCardById("maggression").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
			player.showSpecial(this.id, 1, index);
		}
	}
};
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsInHand
	(
		index, 
		attacker, 
		[
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
	{
		var placeholder;

		if (attacker == "bot")
		{
			placeholder = "#botHand_" + index + " .def_" + this.id;
		}

		if (attacker == "player")
		{
			placeholder = "#playerHand_" + index + " .def_" + this.id;
		}

		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.minor * activated, placeholder);
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wguilt";
newCard.title = "White Guilt";
newCard.subTitle = "On behalf of my privilege, I apologize.";
newCard.details = 
[
	{
		"title" : "Check your privelege", //in attack
		"description": "When this card is in play, any opposing <b>White</b> cards attacking a <b>Minority</b> card has a <b>" + config.medium + "0%</b> chance of doing minimum damage.",
	},
	{
		"title" : "Atonement",
		"description": "When <b>Triggered</b> by a <b>Minority</b> card, gain <b>" + config.minor + " Woke Points</b>."
	}
];
newCard.race = "White";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function(index)
{
	if (game.turnAttacker == "bot") 
	{
		if (botHand.cards[index].race == "Minority")
		{
			player.onEditWokePoints(config.minor);
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		if (playerHand.cards[index].race == "Minority")
		{
			bot.onEditWokePoints(config.minor);
			bot.showSpecial(this.id, 1, index);
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "pcbrigade";
newCard.title = "PC Brigade";
newCard.subTitle = "You're not x, you're y-challenged.";
newCard.details =
[
	{
		"title" : "No Punching Down", //in attack
		"description": "When this card is in play, any opposing cards attacking a card with a lower <b>Woke Rating</b> causes the opponent to lose <b>" + config.minor + " Woke Points</b>.",
	},
	{
		"title" : "Troll Termination",
		"description": "On play, if played opposite a <b>Troll</b> card, that card has a <b>" + config.medium + "0%</b> chance of being <b>Triggered</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				if (playerHand.cards[index].id == "troll")
				{
					playerHand.cards[index].editDefence(-playerHand.cards[index].newDefence);
					playerHand.cards[index].onDestroy("#playerHand_" + index + " .def_" + playerHand.cards[index].id);
					bot.showSpecial(this.id, 1, index);
				}
			}
		}

		if (attacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				if (botHand.cards[index].id == "troll")
				{
					botHand.cards[index].editDefence(-botHand.cards[index].newDefence);
					botHand.cards[index].onDestroy("#botHand_" + index + " .def_" + botHand.cards[index].id);	
					player.showSpecial(this.id, 1, index);
				}				
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "tonepolice";
newCard.title = "Tone Police";
newCard.subTitle = "Calm down, be polite.";
newCard.details = 
[
	{
		"title" : "Chill Order", //in attack
		"description": "When this card is in play, any opposing cards attacking has a <b>" + config.minor + "0%</b> chance of doing minimum damage.",
	},
	{
		"title" : "Extremist Elimination",
		"description": "On play, if played opposite a <b>Extremist</b> card, that card has a <b>" + config.medium + "0%</b> chance of being <b>Triggered</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				if (playerHand.cards[index].id == "extremist")
				{
					playerHand.cards[index].editDefence(-playerHand.cards[index].newDefence);
					playerHand.cards[index].onDestroy("#playerHand_" + index + " .def_" + playerHand.cards[index].id);
					bot.showSpecial(this.id, 1, index);
				}
			}
		}

		if (attacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				if (botHand.cards[index].id == "extremist")
				{
					botHand.cards[index].editDefence(-botHand.cards[index].newDefence);
					botHand.cards[index].onDestroy("#botHand_" + index + " .def_" + botHand.cards[index].id);	
					player.showSpecial(this.id, 1, index);
				}				
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "antifa";
newCard.title = "ANTIFA";
newCard.subTitle = "Everytime you punch a Nazi, an angel gets its wings.";
newCard.details = 
[
	{
		"title" : "Reductio ad Hitlerum", 
		"description": "If there is a <b>Nazi Card</b> in hand, gain a <b>x" + config.minor + "</b> bonus to <b>Attack</b>.",
	},
	{
		"title" : "White Supremacy Wipeout",
		"description": "On play, if played opposite a <b>White Supremacy</b> card, that card has a <b>" + config.medium + "0%</b> chance of being <b>Triggered</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (botHand.findCardById("nazi").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
			bot.showSpecial(this.id, 0, index);
		}
	}

	if (game.turnAttacker == "player")
	{
		if (playerHand.findCardById("nazi").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
			player.showSpecial(this.id, 0, index);
		}
	}
};
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				if (playerHand.cards[index].id == "wsupremacy")
				{
					playerHand.cards[index].editDefence(-playerHand.cards[index].newDefence);
					playerHand.cards[index].onDestroy("#playerHand_" + index + " .def_" + playerHand.cards[index].id);
					bot.showSpecial(this.id, 1, index);
				}
			}
		}

		if (attacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				if (botHand.cards[index].id == "wsupremacy")
				{
					botHand.cards[index].editDefence(-botHand.cards[index].newDefence);
					botHand.cards[index].onDestroy("#botHand_" + index + " .def_" + botHand.cards[index].id);	
					player.showSpecial(this.id, 1, index);
				}				
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "extremist";
newCard.title = "Extremist";
newCard.subTitle = "There are no neutrals. Pick a side!";
newCard.details = 
[
	{
		"title" : "No Kill Like Overkill", 
		"description": "Every time this card does maximum damage on an <b>Attack</b>, gain <b>" + config.medium + "</b> <b>Woke Points</b>.",
	},
	{
		"title" : "Extremism Encouragement",
		"description": "If this card is in your <b>Hand</b>, <b>Xenophobe</b>, <b>Feminazi</b>, <b>Homophobe</b> and <b>Misogynist</b> cards have a <b>" + config.minor + "0%</b> chance of doing maximum damage."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "moderate";
newCard.title = "Moderate";
newCard.subTitle = "There are two sides to a coin.";
newCard.details = 
[
	{
		"title" : "Light Touch", 
		"description": "Every time this card does minimum damage on an <b>Attack</b>, gain <b>" + config.medium + "</b> <b>Woke Points</b>.",
	},
	{
		"title" : "Everything in Moderation",
		"description": "If this card is in your <b>Hand</b>, <b>Xenophobe</b>, <b>Feminazi</b>, <b>Homophobe</b> and <b>Misogynist</b> cards in your opponent's <b>Hand</b> have a <b>" + config.minor + "0%</b> chance of doing minimum damage."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "troll";
newCard.title = "Troll";
newCard.subTitle = "Get a reaction; <i>any</i> reaction";
newCard.details = 
[
	{
		"title" : "Targetted Insult", 
		"description": "If there is a <b>Ad Hominem</b> card in hand, gain a <b>x" + config.minor + "</b> bonus to <b>Attack</b>.",
	},
	{
		"title" : "Snowflake Slaughter",
		"description": "On play, if played opposite a <b>Snowflake</b> card, that card has a <b>" + config.medium + "0%</b> chance of being <b>Triggered</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (botHand.findCardById("adhominem").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
			bot.showSpecial(this.id, 0, index);
		}
	}

	if (game.turnAttacker == "player")
	{
		if (playerHand.findCardById("adhominem").length != 0)
		{
			this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
			player.showSpecial(this.id, 0, index);
		}
	}
};
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				if (playerHand.cards[index].id == "snowflake")
				{
					playerHand.cards[index].editDefence(-playerHand.cards[index].newDefence);
					playerHand.cards[index].onDestroy("#playerHand_" + index + " .def_" + playerHand.cards[index].id);
					bot.showSpecial(this.id, 1, index);
				}
			}
		}

		if (attacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				if (botHand.cards[index].id == "snowflake")
				{
					botHand.cards[index].editDefence(-botHand.cards[index].newDefence);
					botHand.cards[index].onDestroy("#botHand_" + index + " .def_" + botHand.cards[index].id);	
					player.showSpecial(this.id, 1, index);
				}				
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "race";
newCard.title = "Race Card";
newCard.subTitle = "Black lives matter!";
newCard.details = 
[
	{
		"title" : "Enhanced Recovery", //in game
		"description": "Every round, all <b>Minority</b> cards in the <b>Safe Space</b> recover an additional <b>" + config.minor + "</b> rounds faster."
	},
	{
		"title" : "Sacrificial Solidarity", 
		"description": "Upon being <b>Triggered</b>, all <b>Minority</b> cards gain <b>" + config.medium + "</b> to Defence."
	},
	{
		"title" : "Xenophobe X-tinction",
		"description": "On play, if played opposite a <b>Xenophobe</b> card, that card has a <b>" + config.medium + "0%</b> chance of being <b>Triggered</b>."
	}
];
newCard.race = "Minority";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function(index)
{
	var activated = 0;

	if (game.turnAttacker == "bot") 
	{
		$(playerHand.cards).each
		(
			function (playerIndex)
			{
				if (playerHand.cards[playerIndex] != null)
				{
					if (playerHand.cards[playerIndex].race == "Minority")
					{
						playerHand.cards[playerIndex].onEditDefence(config.medium, "#playerHand_" + playerIndex + " .def_" + playerHand.cards[playerIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		$(botHand.cards).each
		(
			function (botIndex)
			{
				if (botHand.cards[botIndex] != null)
				{
					if (botHand.cards[botIndex].race == "Minority")
					{
						botHand.cards[botIndex].onEditDefence(config.medium, "#botHand_" + botIndex + " .def_" + botHand.cards[botIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			bot.showSpecial(this.id, 1, index);
		}
	}
};
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				if (playerHand.cards[index].id == "xenophobe")
				{
					playerHand.cards[index].editDefence(-playerHand.cards[index].newDefence);
					playerHand.cards[index].onDestroy("#playerHand_" + index + " .def_" + playerHand.cards[index].id);
					bot.showSpecial(this.id, 2, index);
				}
			}
		}

		if (attacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				if (botHand.cards[index].id == "xenophobe")
				{
					botHand.cards[index].editDefence(-botHand.cards[index].newDefence);
					botHand.cards[index].onDestroy("#botHand_" + index + " .def_" + botHand.cards[index].id);	
					player.showSpecial(this.id, 2, index);
				}				
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "gender";
newCard.title = "Gender Card";
newCard.subTitle = "Down with the Patriarchy!";
newCard.details = 
[
	{
		"title" : "Enhanced Recovery", //in game
		"description": "Every round, all <b>Female</b> cards in the <b>Safe Space</b> recover an additional <b>" + config.minor + "</b> rounds faster."
	},
	{
		"title" : "Sacrificial Solidarity", 
		"description": "Upon being <b>Triggered</b>, all <b>Female</b> cards gain <b>" + config.medium + "</b> to Defence."
	},
	{
		"title" : "Misogynist Massacre",
		"description": "On play, if played opposite a <b>Misogynist</b> card, that card has a <b>" + config.medium + "0%</b> chance of being <b>Triggered</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function(index)
{
	var activated = 0;

	if (game.turnAttacker == "bot") 
	{
		$(playerHand.cards).each
		(
			function (playerIndex)
			{
				if (playerHand.cards[playerIndex] != null)
				{
					if (playerHand.cards[playerIndex].gender == "Female")
					{
						playerHand.cards[playerIndex].onEditDefence(config.medium, "#playerHand_" + playerIndex + " .def_" + playerHand.cards[playerIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		$(botHand.cards).each
		(
			function (botIndex)
			{
				if (botHand.cards[botIndex] != null)
				{
					if (botHand.cards[botIndex].gender == "Female")
					{
						botHand.cards[botIndex].onEditDefence(config.medium, "#botHand_" + botIndex + " .def_" + botHand.cards[botIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			bot.showSpecial(this.id, 1, index);
		}
	}
};
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				if (playerHand.cards[index].id == "misogynist")
				{
					playerHand.cards[index].editDefence(-playerHand.cards[index].newDefence);
					playerHand.cards[index].onDestroy("#playerHand_" + index + " .def_" + playerHand.cards[index].id);
					bot.showSpecial(this.id, 2, index);
				}				
			}
		}

		if (attacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				if (botHand.cards[index].id == "misogynist")
				{
					botHand.cards[index].editDefence(-botHand.cards[index].newDefence);
					botHand.cards[index].onDestroy("#botHand_" + index + " .def_" + botHand.cards[index].id);	
					player.showSpecial(this.id, 2, index);
				}				
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "maternity";
newCard.title = "Maternity Card";
newCard.subTitle = "I'm a mother, I can do no wrong.";
newCard.details = 
[
	{
		"title" : "Enhanced Recovery", //in game
		"description": "Every round, all cards that are <b>Female</b> and <b>Hetero</b> in the <b>Safe Space</b> recover an additional <b>" + config.minor + "</b> rounds faster."
	},	
	{
		"title" : "Maternal Complex", //in attack
		"description": "Every time a <b>Female</b> card attacks this card, opponent loses <b>" + config.medium + " Woke Points.</b>"
	},			
	{
		"title" : "Sacrificial Solidarity", 
		"description": "Upon being <b>Triggered</b>, all cards that are <b>Female</b> and <b>Hetero</b> gain <b>" + config.medium + "</b> to Defence."
	}
];
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function(index)
{
	var activated = 0;

	if (game.turnAttacker == "bot") 
	{
		$(playerHand.cards).each
		(
			function (playerIndex)
			{
				if (playerHand.cards[playerIndex] != null)
				{
					if (playerHand.cards[playerIndex].sexualOrientation == "Hetero" && playerHand.cards[playerIndex].gender == "Female")
					{
						playerHand.cards[playerIndex].onEditDefence(config.medium, "#playerHand_" + playerIndex + " .def_" + playerHand.cards[playerIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			player.showSpecial(this.id, 2, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		$(botHand.cards).each
		(
			function (botIndex)
			{
				if (botHand.cards[botIndex] != null)
				{
					if (botHand.cards[botIndex].sexualOrientation == "Hetero" && botHand.cards[botIndex].gender == "Female")
					{
						botHand.cards[botIndex].onEditDefence(config.medium, "#botHand_" + botIndex + " .def_" + botHand.cards[botIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			bot.showSpecial(this.id, 2, index);
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "lgbt";
newCard.title = "LGBT Card";
newCard.subTitle = "Straight people oppress us!";
newCard.details = 
[
	{
		"title" : "Enhanced Recovery", //in game
		"description": "Every round, all <b>LGBT</b> cards in the <b>Safe Space</b> recover an additional <b>" + config.minor + "</b> rounds faster."
	},
	{
		"title" : "Sacrificial Solidarity", 
		"description": "Upon being <b>Triggered</b>, all <b>LGBT</b> cards gain <b>" + config.medium + "</b> to Defence."
	},
	{
		"title" : "Homophobe Holocaust",
		"description": "On play, if played opposite a <b>Homophobe</b> card, that card has a <b>" + config.medium + "0%</b> chance of being <b>Triggered</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function(index)
{
	var activated = 0;

	if (game.turnAttacker == "bot") 
	{
		$(playerHand.cards).each
		(
			function (playerIndex)
			{
				if (playerHand.cards[playerIndex] != null)
				{
					if (playerHand.cards[playerIndex].sexualOrientation == "LGBT")
					{
						playerHand.cards[playerIndex].onEditDefence(config.medium, "#playerHand_" + playerIndex + " .def_" + playerHand.cards[playerIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		$(botHand.cards).each
		(
			function (botIndex)
			{
				if (botHand.cards[botIndex] != null)
				{
					if (botHand.cards[botIndex].sexualOrientation == "LGBT")
					{
						botHand.cards[botIndex].onEditDefence(config.medium, "#botHand_" + botIndex + " .def_" + botHand.cards[botIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			bot.showSpecial(this.id, 1, index);
		}
	}
};
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				if (playerHand.cards[index].id == "homophobe")
				{
					playerHand.cards[index].editDefence(-playerHand.cards[index].newDefence);
					playerHand.cards[index].onDestroy("#playerHand_" + index + " .def_" + playerHand.cards[index].id);
					bot.showSpecial(this.id, 2, index);
				}				
			}
		}

		if (attacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				if (botHand.cards[index].id == "homophobe")
				{
					botHand.cards[index].editDefence(-botHand.cards[index].newDefence);
					botHand.cards[index].onDestroy("#botHand_" + index + " .def_" + botHand.cards[index].id);	
					player.showSpecial(this.id, 2, index);
				}				
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "victim";
newCard.title = "Victim Card";
newCard.subTitle = "It's not my fault!";
newCard.details = 
[
	{
		"title" : "Enhanced Recovery", //in game
		"description": "Every round, all cards in the <b>Safe Space</b> that are <b>Female</b> and <b>Minority</b> or, <b>Female</b> and <b>LGBT</b>; recover an additional <b>" + config.minor + "</b> rounds faster."
	},	
	{
		"title" : "Victim Complex", //in attack
		"description": "Each time this card takes damage, gain <b>" + config.medium + " Woke Points.</b>"
	},		
	{
		"title" : "Sacrificial Solidarity", 
		"description": "Upon being <b>Triggered</b>, all cards that are <b>Female</b> and <b>Minority</b> or, <b>Female</b> and <b>LGBT</b>; gain <b>" + config.medium + "</b> to Defence."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function(index)
{
	var activated = 0;

	if (game.turnAttacker == "bot") 
	{
		$(playerHand.cards).each
		(
			function (playerIndex)
			{
				if (playerHand.cards[playerIndex] != null)
				{
					if (playerHand.cards[playerIndex].gender == "Female" && (playerHand.cards[playerIndex].sexualOrientation == "LGBT" || playerHand.cards[playerIndex].race == "Minority"))
					{
						playerHand.cards[playerIndex].onEditDefence(config.medium, "#playerHand_" + playerIndex + " .def_" + playerHand.cards[playerIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			player.showSpecial(this.id, 2, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		$(botHand.cards).each
		(
			function (botIndex)
			{
				if (botHand.cards[botIndex] != null)
				{
					if (botHand.cards[botIndex].gender == "Female" && (botHand.cards[botIndex].sexualOrientation == "LGBT" || botHand.cards[botIndex].race == "Minority"))
					{
						botHand.cards[botIndex].onEditDefence(config.medium, "#botHand_" + botIndex + " .def_" + botHand.cards[botIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			bot.showSpecial(this.id, 2, index);
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "nazi";
newCard.title = "Nazi Card";
newCard.subTitle = "If you don't agree with me, you're a Nazi!";
newCard.details = 
[
	{
		"title" : "Enhanced Recovery", //in game
		"description": "Every round, all cards in the <b>Safe Space</b> that are <b>Hetero</b> and <b>White</b> or, <b>Hetero</b> and <b>Male</b>; recover an additional <b>" + config.minor + "</b> rounds faster."
	},
	{
		"title" : "Oppressor Complex", //in attack
		"description": "On every attack, gain <b>" + config.medium + " Woke Points.</b>"
	},		
	{
		"title" : "Sacrificial Solidarity", 
		"description": "Upon being <b>Triggered</b>, all cards in the <b>Safe Space</b> that are <b>Hetero</b> and <b>White</b> or, <b>Hetero</b> and <b>Male</b>; gain <b>" + config.medium + "</b> to Defence."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function(index)
{
	var activated = 0;

	if (game.turnAttacker == "bot") 
	{
		$(playerHand.cards).each
		(
			function (playerIndex)
			{
				if (playerHand.cards[playerIndex] != null)
				{
					if (playerHand.cards[playerIndex].sexualOrientation == "Hetero" && (playerHand.cards[playerIndex].race == "White" || playerHand.cards[playerIndex].gender == "Male"))
					{
						playerHand.cards[playerIndex].onEditDefence(config.medium, "#playerHand_" + playerIndex + " .def_" + playerHand.cards[playerIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			player.showSpecial(this.id, 2, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		$(botHand.cards).each
		(
			function (botIndex)
			{
				if (botHand.cards[botIndex] != null)
				{
					if (botHand.cards[botIndex].sexualOrientation == "Hetero" && (botHand.cards[botIndex].race == "White" || botHand.cards[botIndex].gender == "Male"))
					{
						botHand.cards[botIndex].onEditDefence(config.medium, "#botHand_" + botIndex + " .def_" + botHand.cards[botIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			bot.showSpecial(this.id, 2, index);
		}
	}
};
cardTemplates.push(newCard);




