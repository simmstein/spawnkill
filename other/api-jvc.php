<?php

/**
 * Agrégateur d'appels à l'api JVC.
 * Permet de compiler plusieurs appels à l'API de JVC.
 * Cette page s'appelle en GET avec pour paramètre un tableau (JSON) cotnenant la seconde parties des url à récupérer.
 * Par exemple ["/profile/spixel_.xml", "/profile/cisla.xml"]
 */


header('Content-Type: application/xml; charset=utf-8');
if(!empty($_GET['pages'])) {

	$username = 'appandr';
	$password = 'e32!cdf';
	$base_url = 'http://ws.jeuxvideo.com/';
	$url_suffixes = json_decode($_GET['pages']);

	$result = "<cdvs>";

	foreach($url_suffixes as $url_suffix) {

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $base_url . $url_suffix);
		curl_setopt($ch, CURLOPT_TIMEOUT, 30); //timeout after 30 seconds
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
		curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
		$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);   //get status code
		$result .= curl_exec($ch);
		curl_close ($ch);
	}

	$result .= "</cdvs>";

	echo $result;
}
else {
	echo json_encode(array("profil/spixel_.xml", "profil/cisla.xml"));
}
