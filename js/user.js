/* Copyright 2016 Diego Islas Ocampo
*
* This file is part of Kirino.
*
* Kirino is free software: you can redistribute it
* and/or modify it under the terms of the GNU General License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* Kirino is distributed in the hope that it will be
* useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
* License for more details.
*
* You should have received a copy of the GNU General License along
* with Kirino. If not, see http://www.gnu.org/licenses/.
*/

"use strict";

class User {

    constructor(){
        this.name = "Diego";
        this.language = "en-US";
        this.searchEngine = "Google";
        this.searchEngineLink = "http://www.google.com/#q=";
        this.seachEngineImageLink = "https://www.google.com.mx/search?site=imghp&tbm=isch&source=hp&biw=1366&bih=651&q=";
        this.email = "";
    }

    setName(name){
        this.name = name;
    }

   setSearchEngine(searchEngine){
        this.searchEngine = searchEngine;
    }

    setEmail(email){
        this.email = email;
    }

    setLanguage(language){
        this.language = language;
    }

    getName(){
        return this.name;
    }

    getSearchEngine(){
        return this.searchEngine;
    }

    getSearchEngineLink(){
        return this.searchEngineLink;
    }

    getSearchEngineImageLink(){
        return this.seachEngineImageLink;
    }

    getEmail(){
        return this.email;
    }

}
