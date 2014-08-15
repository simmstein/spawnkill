<?php

/**
 * Agrégateur d'appels à l'api JVC.
 * Permet de compiler plusieurs appels à l'API de JVC.
 * Cette page s'appelle en GET avec pour paramètre un tableau (JSON) cotnenant la seconde parties des url à récupérer.
 * Par exemple ["/profile/spixel_.xml", "/profile/cisla.xml"]
 */

header('Content-Type: application/xml; charset=utf-8');

/**
 * Permet d'effectuer plusieurs requêtes vers l'API de JVC en parallèle
 */
function callApi($urls) {
	// array of curl handles
	$curly = array();
	// data to be returned
	$result = array();

	$username = 'appandr';
	$password = 'e32!cdf';

	// multi handle
	$mh = curl_multi_init();

	// loop through $urls and create curl handles
	// then add them to the multi-handle
	foreach ($urls as $id => $d) {

		$curly[$id] = curl_init();

		$url = (is_array($d) && !empty($d['url'])) ? $d['url'] : $d;
		curl_setopt($curly[$id], CURLOPT_URL, $url);
		curl_setopt($curly[$id], CURLOPT_HEADER, 0);
		curl_setopt($curly[$id], CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curly[$id], CURLOPT_TIMEOUT, 10); //timeout after 10 seconds
		curl_setopt($curly[$id], CURLOPT_HTTPAUTH, CURLAUTH_ANY);
		curl_setopt($curly[$id], CURLOPT_USERPWD, "$username:$password");

		curl_multi_add_handle($mh, $curly[$id]);
	}

	// execute the handles
	$running = null;
	do {
		curl_multi_exec($mh, $running);
	} while($running > 0);


	// get content and remove handles
	foreach($curly as $id => $c) {
		$result[$id] = curl_multi_getcontent($c);
		curl_multi_remove_handle($mh, $c);
	}

	// all done
	curl_multi_close($mh);

	return $result;
}

//Requêtes sur des pseudos
if(!empty($_GET['pseudos'])) {

	$base_url = 'http://ws.jeuxvideo.com/';
	$pseudos = json_decode($_GET['pseudos']);
	$urls = array();

	foreach($pseudos as $pseudo) {
		$urls[] = $base_url . '/profil/' . $pseudo . '.xml';
	}

	//On effectue les requêtes HTTP
	$results = callApi($urls);
	$pseudosCount = count($pseudos);

	?>


	<api>
	<?php for($i = 0; $i < $pseudosCount; $i++): ?>
		<author pseudo="<?php echo $pseudos[$i]; ?>" >
			<?php echo $results[$i]; ?>
		</author>
	<?php endfor; ?>
	</api>


	<?php
}

//Infos d'un topic
else if(!empty($_GET['topic'])) {
	//http://ws.jeuxvideo.com/forums/1-" + data + "-7-0-1-0-0.xml
}