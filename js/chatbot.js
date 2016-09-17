/* Copyright 2016 Diego Islas Ocampo
*
* This file is part of Kirino.
*
* Kirino is free software: you can redistribute it
* and/or modify it under the terms of the GNU General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* Kirino is distributed in the hope that it will be
* useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
* Public License for more details.
*
* You should have received a copy of the GNU General Public License along
* with Kirino. If not, see http://www.gnu.org/licenses/.
*/

"use strict";

class ChatBot {

    constructor (user, assistant, knowledge) {
        this.user = user;
        this.assistant = assistant; 
        this.knowledge = knowledge; 
        this.memory = new Memory (knowledge.memory_fix);
        this.repeat = 0;
        this.match = null;
        this.previous_response = null;
        this.previous_input = null;
        this.original_input = null;
        this.dotted_input = null;
        this.context = [];
        this.context_response = [];
        this.suffix_temp = [];
    }   

    greet () {
        this.context = this.knowledge.Greet.context;
        this.context_response = this.knowledge.Greet.context_response;
        return this.select_response (this.knowledge.Greet.greetings);
    }

    select_response (list) {
        var possible = list[Math.floor (list.length * Math.random ())];

        while (possible === this.previous_response) {
            possible = list[Math.floor (list.length * Math.random ())];
        }
        
        possible = this.insert_resources (possible);
        this.previous_response = possible;
        return possible;
    }

    converse (input){
        this.original_input = input;
        var user_input = this.fix_typos (" " + input.toUpperCase () + " ");
        this.dotted_input = user_input.replace(/[,";:{}!#$%&\/\?]/g, "");
        user_input = this.dotted_input.replace (/\./g, "");

        this.memory.add (user_input);

        if (this.previous_input == user_input) {
            this.repeat += 1;
        }
        
        if (this.repeat >= 2) {
            this.repeat = 0;
            return this.select_response (this.knowledge.Repeater);
        } else {
            var list = this.find_match (user_input);
            if (list != null) {
                if(list.length > 0){
                    return this.select_response(list);
                }
            }
        }
        
        return this.select_response(this.knowledge.Lost);
    }

    fix_typos (text) {
        for (let i in this.knowledge.Typos) {
            text = text.replace(this.knowledge.Typos[i][0], this.knowledge.Typos[i][1]);
        }
        return text;
    }

    find_match (text){
        if (this.context.length > 0) {
            
        }            
        
        var normal_responses = this.get_responses (text);

        if (this.match != null) {
             var actions_responses = this.actions (text, this.match);
             if (actions_responses != "") {
                return [actions_responses];
            }
        }

        return normal_responses;
    }

    get_responses (text) { 
        var response_list = [];
        var best_match = null;
        var current_match = "";
        var score = 0;
       
        for (var i in this.knowledge.Dialogs) {  
            var temp_match = this.dialog_match (text, this.knowledge.Dialogs[i]);
            if (temp_match.length > 0 && temp_match.length > score) {
                best_match = this.knowledge.Dialogs[i];
                console.log(current_match);
                current_match = temp_match;
                score = current_match.length;
            }
        }
        
        if (best_match != null) {
            this.context = best_match.context;
            this.context_response = best_match.context_response;
            this.match = current_match;
            return best_match.response;
        }
        
        return this.knowledge.Lost;
    }

    dialog_match (text, dialog) {
         for (var i in dialog.input) {
            if (text.indexOf (dialog.input[i]) > -1) {
                console.log(dialog.input[i]);
                return dialog.input[i];
            }
        }
        return "";
    }

    actions (input, key) {
        switch(key){
			case " OPEN ":
					var webpage = "http://" + Text.getSuffix(this.dotted_input, key).trim();
					window.open(webpage,'','width=600,height=460,menubar=no,location=no,status=no'); 
				break;
			
			case " GOOGLE POST ":
			case " POST TO GOOGLE ":
					window.open('https://plus.google.com/share?ur\l='+encodeURIComponent(location), 
										'Share to Google +' ,'width=600,height=460,menubar=no,location=no,status=no'); 
				break;
			
			case " FACEBOOK POST ":
			case " POST TO FACEBOOK ":
					window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location), 'Share to Facebook   ',
										'width=600,height=460,menubar=no,location=no,status=no'); 
				break;
			
			case " TWEET ":
			case " POST TO TWITTER ":
			case " TWITTER POST ":
					window.open('https://twitter.com/intent/tweet', 
				  						'Share to Twitter    ','width=600,height=460,menubar=no,location=no,status=no'); 
				break;
				
			/*case " WEATHER IN ":
			case " CLIMATE IN ":
					return this.getWeather($_.text.getSuffix(input,key));
				break;
			
			
			case " WEATHER ":
			case " CLIMATE ":
					return this.getWeather();
				break;*/
			
			case " SEARCH ":
			case " SEARCH FOR ":
			case " LOOK UP ":
			case " LOOK UP FOR ":
			case " LOOK FOR ":
					window.open(this.user.getSearchEngineLink() + Text.getSuffix (input, key).toLowerCase ());  
				break;	
			
			case " YOUTUBE ":
			case " VIDEOS OF ":
			case " VIDEO OF ":
					window.open("http://www.youtube.com/results?search_query=" + Text.getSuffix (input, key).toLowerCase ());
				break;
				
			case " SEND MAIL TO ":
			case " MAIL TO ":
			case " MAILTO ":
					var subject = prompt ("Write the Subject");
					var body = prompt ("Write the Body");
					var mail = Text.getSuffix (this.dotted_input, key).toLowerCase ();
					window.open ('mailto:' + mail + '?subject=' + subject + '&body=' + body);
				break;
				
			case " DEFINE ":
					window.open (("https://www.google.com/search?q=define+"+ Text.getSuffix (input, key).toLowerCase ())); 
				break;
			
			case " OPEN NEW DOC ":
			case " OPEN A NEW DOC ":
			case " OPEN A NEW DOCUMENT ":
			case " NEW DOCUMENT ":
					window.open ("https://docs.google.com/document/create?usp=chrome_app&authuser=0");
				break;
			
			case " SHOW ME ":
			case " SHOW ME PICTURES OF ":
			case " SHOW ME SOME ":
			case " PICTURES OF ":
			case " PHOTOS OF ":
			case " IMAGES OF ":
					var img = Text.getSuffix (input, key).toLowerCase ();
					window.open(this.user.getSearchEngineImageLink() + img);
				break;
			
			case " GRAPH ":
					window.open("http://graph.tk#" + Text.getSuffix(this.dotted_input, key).toLowerCase(),
								'Graph','width=600,height=460,menubar=no,location=no,status=no');
				break;

            case " CHEAT CODES FOR ":
			case " CHEATS FOR ":
					window.open(("http://www.gamesradar.com/search/?content=cheats&platform=all-platforms&q="
								+Text.getSuffix(input, key).toLowerCase())); 
					break;

			case " MAPS ":
				window.open(("https://www.google.com/maps/search/" + Text.getSuffix (input, key).toLowerCase ())); 
				break;

            case " CALL ":
				window.open (("tel:" + Text.getSuffix (input, key).toLowerCase ())); 
				break;
    
            case " WHO IS ":
			case " WHO WAS ":
                    var found = this.find_people (Text.getSuffix (input, key));

                    if (found != null) {
                        return found.bio;
                    }
				break;

            case " WHEN DID ":
                var found = this.find_event (Text.getSuffix (input, key));

                if (found != null) {
                    return found.date;
                }
                break;

            case " WHAT HAPPENED IN ":
				var found = this.find_event (Text.getSuffix (input, key));

                if (found != null) {
                    return found.description;
                }
				break;
			
			/*case " REMEMBER ME ":
			case " REMEMBER ME TO ":
			case " REMIND ME ":
			case " REMIND ME TO ":
					var task= $_.text.getSuffix(input,key).toLowerCase().charAt(0).toUpperCase() 
							+ $_.text.getSuffix(input,key).toLowerCase().slice(1);
					$_.storage.set("Task",task);
					setTimeout("alert(k.getData('Task'))",300000);

				break;
					
					return eval(this.transOps($_.text.getSuffix(input,key))).toString();
					break;
					
			*/
			default:
				break;
		}
		return "";
    }

    find_people (text) {
        var looking = " " + text.trim() + " ";
        for (var i in this.knowledge.People) {
            for (var j in this.knowledge.People[i].name) {
                if (looking.indexOf (this.knowledge.People[i].name[j]) > -1) {
                    return this.knowledge.People[i];
                }
            }
        }
        return null;
    }

    find_event (text) {
        var looking = " " + text.trim() + " ";
        for (var i in this.knowledge.Events) {
            for (var j in this.knowledge.Events[i].name) {
                if (looking.indexOf (this.knowledge.Events[i].name[j]) > -1) {
                    return this.knowledge.Events[i];
                }
            }
        }
        return null;
    }
    
    insert_resources (possible) {
        var now = new Date ();

        possible = Text.replace ("@date", (now.getMonth () + 1) + '/' + now.getDate () + '/' + now.getFullYear (), possible);
    
        var recall = this.memory.recall ();
        if (recall != null) {
            possible = Text.replace ("@memory", recall, possible);
        }

        if (this.suffix_temp.length > 0) {
            possible = Text.replace ("@suffix", recall, this.suffix_temp.pop ());
        }        

        possible = Text.replace ("@user", this.user.getName (), possible);
        possible = Text.replace ("@kirino", this.assistant.getName (), possible);
        
        return possible;
    }

/*    
    private bool match_context(string text){
	    bool flag = false;
	    foreach (string[] context_inputs in context){
		    foreach (string input in context_inputs){
		        if(text.contains (input)){
			        flag = true;
		        }
	        }
	    }
	    return flag;
    }

    

    

    

    public void open_url(string url){
        run_command ("xdg-open '" + url + "'");
    }*/
} 
