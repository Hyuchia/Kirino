$_ready(function(){

    $_(".nav .menu-icon").click(function(){
		$_(this).parent().find("ul").toggleClass("active");
		$_(this).toggleClass('fa-bars fa-times');
	});

	$_(".nav li").click(function(){
	    if($_(".menu-icon").isVisible()){
	      $_(".menu-icon").toggleClass('fa-bars fa-times');
	      $_(this).parent().parent().find("ul").toggleClass("active");
	    }
	});

	$_("[data-show]").click(function() {
		$_("section").removeClass("active");
		$_("section[data-content='" + $_(this).data("show") + "']").addClass("active");
	});

	$_("[data-action='logout']").click(function(){
		
	});

	var user = new User();
	var kirino = new Assistant();
	var chatbot = new ChatBot(user, kirino, Knowledge);

	$_("#output").append ("<p class='kirino'><span>" + chatbot.greet () + "</span></p>");

	$_("section[data-content='main'] form").submit(function(event){
		event.preventDefault();
		var input = $_("section[data-content='main'] form input").value().trim();
		if(input != ""){
			$_("#output").append ("<p class='user'><span>" + input + "</span></p>");
			$_("section[data-content='main'] form input").value ("");
			$_("#output").append ("<p class='kirino'><span>" + chatbot.converse(input) + "</span></p>");
			$_('#output').animate({scrollTop: $_('#output').property("scrollHeight")}, 500);
		}
	});
});
