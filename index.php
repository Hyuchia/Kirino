<?php

	/**
	 * ==============================
	 * Aegis Framework | MIT License
	 * http://www.aegisframework.com/
	 * ==============================
	 */

 	// Uncomment on Production
    //error_reporting(0);

	include("lib/aegis.php");
	$session = new Session();


	$router = new Router("localhost/Kirino");

	$meta = [
		"title" => "Kirino - Virtual Assistant Chatbot",
		"description" => "Kirino, is an artificial intelligence chatbot, who will help you as a personal assistant and friend.",
		"keywords" => "assistant,intelligence,virtual,bot,chat,tak,converse,discuss,ai,ia,kirino,hyuchia,friend",
		"author" => "Diego Islas Ocampo",
		"twitter" => "@HyuchiaDiego",
		"google" => "+HyuchiaDiego",
		"domain" => $router -> getBaseUrl(),
		"route" => 	$router -> getFullUrl(),
		"year" => date("Y"),
		"shareimage" => "share.png"
	];
	
	if(!$session -> get("logged")){
		$router -> registerRoute("/", new View("main", ["main"  => ["year" => $meta["year"]]], $meta));
	}else{
		$router -> registerRoute("/", new View("loggin", ["loggin"  => ["year" => $meta["year"]]], $meta));
	}

	$router -> listen();
?>
