	
// Initializes the options
function betterdouban_initializeOptions() {
    var pageDocument     = document;
    
            var generalGbox       = pageDocument.getElementById("betterdouban-gbox-general");
    	        var messagesGbox       = pageDocument.getElementById("betterdouban-gbox-messages");
    	    	var skinsRgroup       = pageDocument.getElementById("betterdouban-gbox-skins-radiogroup");
		        var composeGbox       = pageDocument.getElementById("betterdouban-gbox-compose");
    	        var sidebarGbox       = pageDocument.getElementById("betterdouban-gbox-sidebar");
    	
    var cbItem;
    var radioItem;
    
    var textItem;
    
   	var script;
   	var enabled = false;

	var dependents = '';
    	
    var totalScripts = betterdouban_scripts.length;
    for (var i = 0; i < totalScripts; i++) {
		   	script = betterdouban_scripts[i].id;
		   	enabled = betterdouban_getBooleanPreference('betterdouban.enabled.'+script, true);
		   	cbItem = pageDocument.createElement("checkbox");
			cbItem.setAttribute("id", script);
			cbItem.setAttribute("label", betterdouban_scripts[i].full_name );
			cbItem.setAttribute("checked", enabled);
			if (betterdouban_scripts[i].conflicts ) {
				dependents = 'new Array(';
				for(var j = 0; j < betterdouban_scripts[i].conflicts.length; j++) {
					dependents += "'"+betterdouban_scripts[i].conflicts[j]+"'";
					if ( j < (betterdouban_scripts[i].conflicts.length-1) ) {
						dependents += ", ";
					} else {
						dependents += ")";
					}
				}
				cbItem.setAttribute("oncommand", "uncheckDependents(this.checked, "+dependents+" );");
			}
			
        
        
	   if (betterdouban_scripts[i].tab == betterdouban_tabs.GENERAL ) 
			generalGbox.appendChild(cbItem);
		    
        
	 else if (betterdouban_scripts[i].tab == betterdouban_tabs.MESSAGES ) 
			messagesGbox.appendChild(cbItem);
		    
    			else if ( betterdouban_scripts[i].tab == betterdouban_tabs.SKINS ) {
				radioItem = pageDocument.createElement("radio");	   								
				radioItem.setAttribute("id", script);
				(betterdouban_scripts[i].description == "")? (textItem = "") : (textItem = ": " + betterdouban_scripts[i].description)
				radioItem.setAttribute("label", betterdouban_scripts[i].full_name + textItem );
				radioItem.setAttribute("selected", enabled);
				skinsRgroup.appendChild(radioItem);
			}
		    
        
	 else if (betterdouban_scripts[i].tab == betterdouban_tabs.COMPOSE ) 
			composeGbox.appendChild(cbItem);
		    
        
	 else if (betterdouban_scripts[i].tab == betterdouban_tabs.SIDEBAR ) 
			sidebarGbox.appendChild(cbItem);
					

	}

	betterdouban_describescripts();

}


function betterdouban_saveOptions() {

           	betterdouban_savePrefs( document.getElementById("betterdouban-gbox-general").childNodes, "checked");
   		       	betterdouban_savePrefs( document.getElementById("betterdouban-gbox-messages").childNodes, "checked");
   		       	betterdouban_savePrefs( document.getElementById("betterdouban-gbox-skins-radiogroup").childNodes, "selected");
   		       	betterdouban_savePrefs( document.getElementById("betterdouban-gbox-compose").childNodes, "checked");
   		       	betterdouban_savePrefs( document.getElementById("betterdouban-gbox-sidebar").childNodes, "checked");
   		
	betterdouban_setBooleanPreference("betterdouban.loaded", false); 
}


function betterdouban_savePrefs(cbArray, trueAttrib) {
    for(var i = 0; i < cbArray.length; i++) {
    	if (cbArray[i]) {
    		if (cbArray[i].getAttribute("id")) {
    			if (cbArray[i].getAttribute(trueAttrib) == 'true') {
					betterdouban_setBooleanPreference("betterdouban.enabled."+cbArray[i].getAttribute("id"), true);
	    		} else {
	    			betterdouban_setBooleanPreference("betterdouban.enabled."+cbArray[i].getAttribute("id"), false);
	    		}
    		}
    	}
    }
}

function betterdouban_describescripts() {
	document.getElementById("script-listing").contentDocument.write('<html><head><style type="text/css">body { font-family:arial; font-size:9pt; background-color:white; } ul { margin:0; padding:0 } li { margin:0 0 10px 0} a { color:blue; border-bottom:solid blue 1px; } </style></head><body id="script-listing-body"><ul>');
	var totalScripts = betterdouban_scripts.length;
    for (var i = 0; i < totalScripts; i++) {
    	if ( betterdouban_scripts[i].homepage != '') {
			document.getElementById("script-listing").contentDocument.write('<li><b><a href="'+ betterdouban_scripts[i].homepage+'" onclick="javascript:window.open(\''+ betterdouban_scripts[i].homepage+'\');return false;">'+ betterdouban_scripts[i].full_name +'</a></b><br />'+betterdouban_scripts[i].description+'<br />'+betterdouban_usLabels.GetStringFromName("script_by")+' '+betterdouban_scripts[i].author+'</li>');
		}
	}
	document.getElementById("script-listing").contentDocument.write("</ul></body></html>");
	document.getElementById("script-listing").contentDocument.close();
	return true;
}


function uncheckDependents(checked, dep) {
    for(var i = 0; i < dep.length; i++) {
		if (checked) {
			document.getElementById(dep[i]).checked=false;
		}
	}
}

function betterdouban_initAdvancedPrefs() {
	//document.getElementById("pref-your_domain").value = betterdouban_getStringPreference("betterdouban.pref.your_domain");
	//document.getElementById("pref-attach_trigger").value = betterdouban_getStringPreference("betterdouban.pref.attach_trigger");
}

function betterdouban_saveAdvancedPrefs() {
	//betterdouban_setStringPreference("betterdouban.pref.your_domain", document.getElementById("pref-your_domain").value);
	//betterdouban_setStringPreference("betterdouban.pref.attach_trigger", document.getElementById("pref-attach_trigger").value);
}
