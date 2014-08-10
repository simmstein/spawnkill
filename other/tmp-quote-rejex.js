
"use strict";
$(".post").each(function() {
	//On retire les <br> pour le parsing, on les ajoutera par la suite
	var postText = $(this).html().replace(/\n/g, "").replace(/[ ]*<br>/g, "\n");
	
	var beatriceRegex = /# (.*)\n^# Posté le (?:(\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2}))|(?:undefined)\n((?:.|[\n\r])*?)\n^# <a(?:.*?)href="(http[^"]*)".*/gm;
	
	/*
	$1 : pseudo
	$2 : jour
	$3 : mois
	$4 : année
	$5 : heure
	$6 : message
	$7 : permalien
	*/
	var replaceBeatrice = function(match, pseudo, jour, mois, annee, heure, message, permalien) {

		return getFormattedQuote(pseudo, jour, mois, annee, heure, permalien, message);

	};

	var spawnkillRegex = /╭(?:┄┄┄)* ([^,]*), le (\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2})\n^┊ <a(?:.*?)href="(http[^"]*)".*\n┊┄┄┄\n((?:.|[\n\r])*?)\n^╰┄┄┄/gm;

	/*
	$1 : pseudo
	$2 : jour
	$3 : mois
	$4 : année
	$5 : heure
	$6 : permalien
	$7 : message (à épurer en retirant le cadre)
	*/
	var replaceSpawnkill = function(match, pseudo, jour, mois, annee, heure, permalien, message) {

		return getFormattedQuote(pseudo, jour, mois, annee, heure, permalien, message);
	};

	var jvcmasterRegex = /(?:(?:\| <a(?:.*?)href="(http[^"]*)".*\n))*\| Ecrit par « ([^\s]*) »(?:[^\d]*)(\d{1,2}) ([^\s]*) (\d{4}) à (\d{2}:\d{2}:\d{2})\n\| « ((?:.|[\n\r])*?) »(?:(?:[\s]*)&gt; )*/gm;

	/*
	$1 : permalien (peut être vide)
	$2 : pseudo
	$3 : jour
	$4 : mois
	$5 : année
	$6 : heure
	$7 : message (à épurer en retirant le cadre)
	*/
	var replaceJvcmaster = function(match, permalien, pseudo, jour, mois, annee, heure, message) {

		return getFormattedQuote(pseudo, jour, mois, annee, heure, permalien, message);
	};

	var turboforumRegex = /^\| ([^\s]*)(?:(?:&nbsp;)|[\s])*-(?:(?:&nbsp;)|[\s])*le (\d{1,2}) ([^\s]*) (\d{4}) (?:\n\| <a(?:.*?)href="(http[^"]*)".*)*\n((?:(?:\n*^\|.*)*)*)(?:(?:[\s]*)&gt; )*/gm;

	/*
	$1 : pseudo
	$2 : jour
	$3 : mois
	$4 : année
	$5 : permalien (peut être vide)
	$6 : message (à épurer en retirant le cadre)
	pas d'heure
	*/
	var replaceTurboforum = function(match, pseudo, jour, mois, annee, permalien, message) {

		return getFormattedQuote(pseudo, jour, mois, annee, "", permalien, message);
	};

	var getFormattedQuote = function(pseudo, jour, mois, annee, heure, permalien, message) {
		var quote = "<div class='quote' >" +
				"<div class='quote-pseudo' >" + pseudo + "</div>" +
				"<div class='quote-date' >" + jour + " " + mois + " " + annee + "</div>" +
				"<div class='quote-hour' >" + heure + "</div>" +
				"<div class='quote-link' >" + permalien + "</div>" +
				"<div class='quote-message' >" +
					message + 
				"</div>" +
			"</div>";

		return quote;
	};

	//On converti les citations en html
	postText = postText.replace(beatriceRegex, replaceBeatrice);
	postText = postText.replace(spawnkillRegex, replaceSpawnkill);
	postText = postText.replace(jvcmasterRegex, replaceJvcmaster);
	postText = postText.replace(turboforumRegex, replaceTurboforum);


	
	//On remet les <br>
	$(this).html(postText.replace(/\n/g, "<br>"));
});