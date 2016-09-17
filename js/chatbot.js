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
        //possible = this.insertResources(possible);
        this.previous_response = possible;

        return possible;
    }

    converse (input){
        this.original_input = input;
        var user_input = this.fix_typos (" " + input.toUpperCase () + " ");
       // this.dotted_input = Text.clean (user_input, "(,|\"|\-|_|;|:|\{|\}|!|#|\$|%|\&|\/|\(|\)|\\\\?|\\\\*)");
        console.log(user_input);
        //user_input = Text.clean (user_input, "(\.|,|\"|\-|_|;|:|\{|\}|!|#|\$|%|\&|\/|\(|\)|\\\\?|\\\\*)");

        console.log(user_input);

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

        /*if (this.match != null) {
             var actions_responses = actions (text, this.match);
             if (actions_responses != "") {
                return [actions_responses];
            }
        }*/

        return normal_responses;
    }

    get_responses (text) { 
        var response_list = [];
        var best_match = null;
        var current_match = "";
        var score = -1;
       
        for (var i in this.knowledge.Dialogs) {  
            var temp_match = this.dialog_match (text, this.knowledge.Dialogs[i]);
            if (temp_match.length > 0 && temp_match.length > score) {
                best_match = this.knowledge.Dialogs[i];
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
                return dialog.input[i];
            }
        }
        return "";
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

    

    private string insert_resources(string possible){
        string result = possible;
        var now = new DateTime.now_local ();

        result = Text.replace ("@date", "%d/%d/%d".printf (now.get_month () + 1, now.get_day_of_month (), now.get_year ()), result);
    
        string? recall = memory.recall ();
        if (recall != null) {
            result = Text.replace ("@memory", recall, result);
        }

        result = Text.replace ("@suffix", user.getName (), result);

        if (result.index_of("@suffix") > -1){
            result = result.replace("@suffix", (string) suffix_temp.last());
            suffix_temp.remove((string) suffix_temp.last());
        }        

        result = Text.replace ("@user", user.getName (), result);
        result = Text.replace ("@kirino", assistant.getName (), result);
        
        return result;
    }

    public string actions(string input, string key){

        switch(key){

            case " OPEN ":
                string webpage = "http://" + Text.get_suffix (dotted_input, key);
                open_url(webpage);
                break;

            case " GOOGLE POST ":
            case " POST TO GOOGLE ":
                open_url("https://plus.google.com/share?url=" + "http://kirino.hyuchia.com");
                break;

            case " FACEBOOK POST ":
            case " POST TO FACEBOOK ":
                open_url("https://www.facebook.com/sharer/shardotted_inputer.php?u=" + "http://kirino.hyuchia.com");
                break;

            case " TWEET ":
            case " POST TO TWITTER ":
            case " TWITTER POST ":
                open_url("https://twitter.com/intent/tweet");
                break;

            case " SEARCH ":
            case " SEARCH FOR ":
            case " LOOK UP ":
            case " LOOK UP FOR ":
            case " LOOK FOR ":
                open_url(user.getSearchEngineLink() + Text.get_suffix (input, key).down());
                break;

            case " YOUTUBE ":
            case " VIDEOS OF ":
            case " VIDEO OF ":
                open_url("http://www.youtube.com/results?search_query=" + Text.get_suffix (input, key).down());
                break;

            case " SHOW ME ":
            case " SHOW ME PICTURES OF ":
            case " SHOW ME SOME ":
            case " PICTURES OF ":
            case " PHOTOS OF ":
            case " IMAGES OF ":
                open_url(user.getSearchEngineImageLink() + Text.get_suffix (input, key).down());
                break;

            case " WHO IS ":
            case " WHO WAS ":
                Person? found = find_people (Text.get_suffix (input, key));

                if (found != null) {
                    return found.bio;
                }
                break;
            case " UPDATE SYSTEM ":
            case " UPDATE MY SYSTEM ":
                update();
                break;
            
            case " SCREENSHOT ":
                run_command ("screenshot-tool -s -d 3");
                break;

            case " SCREENSHOT AREA ":
                run_command ("screenshot-tool -r");
                break;
    
            default:
                break;
        }

        return "";

    }

    public Person? find_people (string text) {
        string looking = " " + text.strip() + " ";
        foreach (Person person in knowledge.people) {
            foreach (string name in person.name) {
                if (looking.index_of (name) > -1) {
                    return person;
                }
            }
        }
        return null;
    }

    public void open_url(string url){
        run_command ("xdg-open '" + url + "'");
    }*/
} 
