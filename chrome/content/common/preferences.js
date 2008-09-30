var betterdouban_preferencesService = null;

// Deletes a preference
function betterdouban_deletePreference(preference) {
    // If the preference is set
    if(preference) {
        // If a user preference is set
        if(betterdouban_isPreferenceSet(preference)) {
            betterdouban_getPreferencesService().clearUserPref(preference);
        }
    }
}

// Deletes a preference branch
function betterdouban_deletePreferenceBranch(branch) {
    // If the branch is set
    if(branch) {
        betterdouban_getPreferencesService().deleteBranch(branch);
    }
}

// Gets a boolean preference, returning false if the preference is not set
function betterdouban_getBooleanPreference(preference, userPreference) {
    // If the preference is set
    if(preference) {
        // If not a user preference or a user preference is set
        if(!userPreference || betterdouban_isPreferenceSet(preference)) {
            try {
                return betterdouban_getPreferencesService().getBoolPref(preference);
            } catch(exception) {
                // Do nothing
            }
        }
    }
    
    return false;
}

// Gets an integer preference, returning 0 if the preference is not set
function betterdouban_getIntegerPreference(preference, userPreference) {
    // If the preference is set
    if(preference) {
        // If not a user preference or a user preference is set
        if(!userPreference || betterdouban_isPreferenceSet(preference)) {
            try {
                return betterdouban_getPreferencesService().getIntPref(preference);
            } catch(exception) {
                // Do nothing
            }
        }
    }
    
    return 0;
}

// Gets the preferences service
function betterdouban_getPreferencesService() {
    // If the preferences service is not set
    if(!betterdouban_preferencesService) {
        betterdouban_preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
    }
    
    return betterdouban_preferencesService;
}

// Gets a string preference, returning null if the preference is not set
function betterdouban_getStringPreference(preference, userPreference) {
    // If the preference is set
    if(preference) {
    
        // If not a user preference or a user preference is set
        if(!userPreference || betterdouban_isPreferenceSet(preference)) {
            try {
            
                return betterdouban_getPreferencesService().getComplexValue(preference, Components.interfaces.nsISupportsString).data;
            } catch(exception) {
                // Do nothing
                //alert(exception);
            }
        }
    }
    
    return null;
}

// Is a preference set
function betterdouban_isPreferenceSet(preference) {

    // If the preference is set
    if(preference) {
        return betterdouban_getPreferencesService().prefHasUserValue(preference);
    }
    
    return false;
}

// Sets a boolean preference
function betterdouban_setBooleanPreference(preference, value) {
    // If the preference is set
    if(preference) {
        betterdouban_getPreferencesService().setBoolPref(preference, value);
    }
}

// Sets a boolean preference if it is not already set
function betterdouban_setBooleanPreferenceIfNotSet(preference, value) {
    // If the preference is not set
    if(!betterdouban_isPreferenceSet(preference)) {
        betterdouban_getPreferencesService().setBoolPref(preference, value);
    }
}

// Sets an integer preference
function betterdouban_setIntegerPreference(preference, value) {
    // If the preference is set
    if(preference) {
        betterdouban_getPreferencesService().setIntPref(preference, value);
    }
}

// Sets an integer preference if it is not already set
function betterdouban_setIntegerPreferenceIfNotSet(preference, value) {
    // If the preference is not set
    if(!betterdouban_isPreferenceSet(preference)) {
        betterdouban_setIntegerPreference(preference, value);
    }
}

// Sets a string preference
function betterdouban_setStringPreference(preference, value) {
    // If the preference is set
    if(preference) {
        var supportsStringInterface = Components.interfaces.nsISupportsString;
        var string                  = Components.classes["@mozilla.org/supports-string;1"].createInstance(supportsStringInterface);
        
        string.data = value;
        
        betterdouban_getPreferencesService().setComplexValue(preference, supportsStringInterface, string);
    }
}

// Sets a string preference if it is not already set
function betterdouban_setStringPreferenceIfNotSet(preference, value) {
    // If the preference is not set
    if(!betterdouban_isPreferenceSet(preference)) {
        betterdouban_setStringPreference(preference, value);
    }
}

function betterdouban_setStringPreferenceWithForce(preference, value, force) {
	if (force) {
		betterdouban_setStringPreference(preference, value);
	} else {
		betterdouban_setStringPreferenceIfNotSet(preference, value); 
	}
}

function betterdouban_setIntegerPreferenceWithForce(preference, value, force) {
	if (force) {
		betterdouban_setIntegerPreference(preference, value);
	} else {
		betterdouban_setIntegerPreferenceIfNotSet(preference, value); 
	}
}

function betterdouban_setBooleanPreferenceWithForce(preference, value, force) {
	if (force) {
		betterdouban_setBooleanPreference(preference, value);
	} else {
		betterdouban_setBooleanPreferenceIfNotSet(preference, value); 
	}
}
