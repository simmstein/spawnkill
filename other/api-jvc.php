<?php

/**
 * Agrégateur d'appels à l'api JVC.
 * Permet de compiler plusieurs appels à l'API de JVC.
 * Cette page s'appelle en GET avec pour paramètre un tableau (JSON) contenant la seconde parties des url à récupérer.
 * Par exemple ["/profile/spixel_.xml", "/profile/cisla.xml"]
 */

include "config.php";

header('Content-Type: application/xml; charset=utf-8');

/**
 * Permet d'effectuer plusieurs requêtes vers l'API de JVC en parallèle.
 * Récupère les données du cache si elles existent et sont valides
 */
function getApiData($urls) {

	try {
		$options = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'); 
		$dbh = new PDO("mysql:host=" . HOST . ";dbname=" . DATABASE . ";", LOGIN, PASS, $options);
	}
	catch (Exception $e) {
	}

	$now = time();
	$lastValidDataTimestamp = $now - (CACHE_TTL * 3600);

	$curly = array();

	//Url à récupérer depuis l'API
	$urls_from_api = array();
	//Données récupérées depuis le cache
	$data_from_cache = array();
	$data_from_api = array();
	$result = array();
	$url_count = count($urls);

	$username = 'appandr';
	$password = 'e32!cdf';

	$mh = curl_multi_init();

	foreach ($urls as $id => $url) {

		//On récupère les données dans le cache ou via l'API
		$rows = $dbh->query("SELECT *
			FROM api_cache_data
			WHERE url = '$url'
			AND timestamp > $lastValidDataTimestamp
		");

		$cache_data = current($rows->fetchAll(PDO::FETCH_ASSOC));

		//Des données du cache on été récupérées
		$data_from_cache[] = $cache_data;
		if(empty($cache_data)) {
			$urls_from_api[$id] = $url;
			$curly[$id] = curl_init();

			curl_setopt($curly[$id], CURLOPT_URL, $url);
			curl_setopt($curly[$id], CURLOPT_HEADER, 0);
			curl_setopt($curly[$id], CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($curly[$id], CURLOPT_TIMEOUT, 10); //timeout after 10 seconds
			curl_setopt($curly[$id], CURLOPT_HTTPAUTH, CURLAUTH_ANY);
			curl_setopt($curly[$id], CURLOPT_USERPWD, "$username:$password");

			curl_multi_add_handle($mh, $curly[$id]);
		}

	}

	$running = null;
	do {
		curl_multi_exec($mh, $running);
	} while($running > 0);


	foreach($curly as $id => $c) {
		$data = curl_multi_getcontent($c);

		$dbh->query("INSERT INTO api_cache_data(url, data, timestamp)
			VALUES('" . $urls_from_api[$id] . "', " . $dbh->quote($data) . ", $now)
			ON DUPLICATE KEY UPDATE
			    data = " . $dbh->quote($data) . ",
			    timestamp = $now
		");

		$data_from_api[$id] = $data;
		curl_multi_remove_handle($mh, $c);
	}

	//On mixe le résultat du cache et des appels
	for($i = 0; $i < $url_count; $i++) {

		if(empty($data_from_cache[$i])) {
			$result[] = array_shift($data_from_api);
		}
		else {
			$result[] = $data_from_cache[$i]['data'];
		}
	}

	curl_multi_close($mh);
	return $result;
}

//Requêtes sur des pseudos
if(!empty($_GET['pseudos'])) {

	$base_url = 'http://ws.jeuxvideo.com/';
	$pseudos = json_decode($_GET['pseudos']);
	$urls = array();

	foreach($pseudos as $pseudo) {
		$urls[] = $base_url . 'profil/' . $pseudo . '.xml';
	}

	$results = getApiData($urls);
	$pseudosCount = count($pseudos);

	?><api>
	<?php for($i = 0; $i < $pseudosCount; $i++): ?>
		<author pseudo="<?php echo $pseudos[$i]; ?>" >
			<?php echo $results[$i]; ?>
		</author>
	<?php endfor; ?>
	</api><?php
}

//Infos d'un topic
else if(!empty($_GET['topic'])) {
	//http://ws.jeuxvideo.com/forums/1-" + data + "-7-0-1-0-0.xml
}