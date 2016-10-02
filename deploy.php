<?php

	include_once("lib/aegis.php");
	$session = new Session();

	$receiver = new DataReceiver();

	if($data = $receiver -> receive("name,mail,nickname,pass,passr")){
		if(!$db -> exists("Citizens", "Mail", $data["mail"])){

			if($data["pass"] == $data["passr"]){
				$pass = new Password($data["pass"]);
				$db -> insert ("Citizens", [
											"Name" => $data["name"], 
											"Nickname" => $data["nickname"], 
											"Mail" => $data["mail"], 
											"ADN"=> $pass-> getHash()
										   ]);
			}else{
				echo "Passwords doesn't match"
			}
			
		}else{
			echo "User already exists";
		}
	}
	
	if($receiver -> receive("pass,email")){
		if($db -> exists("Citizens", "Mail", $data["email"]){
			$user = $db -> selectAllWhere("Citizens", "Mail", $data["email"]);
			$pass = new Password($data["pass"]);
			if(){

			}
		}
	}

?>
