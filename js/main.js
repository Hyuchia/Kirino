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

});
