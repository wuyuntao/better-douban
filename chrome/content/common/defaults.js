var betterdouban_bundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
var betterdouban_usLabels = betterdouban_bundle.createBundle("chrome://betterdouban/locale/userscript.properties");

var betterdouban_tabs = {
    GENERAL: 0, SUBJECT: 1, GROUP: 2, CONTACT: 3, SKINS:4
}


function betterdouban_userScript(id, enabled, full_name, author, homepage, filename, description, enabled_by_default, tab, conflicts ) {
    this.id = id;
    this.enabled = enabled;
    this.full_name = full_name;
    this.author = author;
    this.homepage = homepage;
    this.filename = filename;
    this.description = description;
    this.enabled_by_default = enabled_by_default;
    this.tab = tab;
    this.conflicts = conflicts;
}


function betterdouban_makeNewUserScript(id, author, homepage, enabled_by_default, tab ) {
    // alert("making " + id);
    return new betterdouban_userScript(id,
        betterdouban_getOrElseSet(id, enabled_by_default),
        betterdouban_usLabels.GetStringFromName(id+"_title"),
        author,
        homepage,
        id+".user.js",
        betterdouban_usLabels.GetStringFromName(id+"_desc"),
        enabled_by_default,
        tab,
        null,
        null);
}

function betterdouban_makeNewUserScriptWithConflicts(id, author, homepage, enabled_by_default, tab, conflicts) {
    return new betterdouban_userScript(id,
        betterdouban_getOrElseSet(id, enabled_by_default),
        betterdouban_usLabels.GetStringFromName(id+"_title"),
        author,
        homepage,
        id+".user.js",
        betterdouban_usLabels.GetStringFromName(id+"_desc"),
        enabled_by_default,
        tab,
        conflicts,
        null);
}

function betterdouban_makeNewSkin(id, author, homepage ) {
    return new betterdouban_userScript(id,
        betterdouban_getOrElseSet(id, false),
        betterdouban_usLabels.GetStringFromName(id+"_title"),
        author,
        homepage,
        id+".user.js",
        betterdouban_usLabels.GetStringFromName(id+"_desc"),
        false,
        betterdouban_tabs.SKINS,
        null,
        null);
}


function betterdouban_getOrElseSet(script, defaultValue) {
    var k = "betterdouban.enabled." + script ;

    if ( ! betterdouban_isPreferenceSet(k) ) {
         betterdouban_setBooleanPreference(k,  defaultValue);
    }
    return betterdouban_getBooleanPreference(k);

}

var betterdouban_scripts = new Array(
    new betterdouban_makeNewUserScript('example',
        'Wu Yuntao',
        'http://blog.luliban.com/',
        true,
        betterdouban_tabs.GENERAL),

    new betterdouban_userScript('none',
        betterdouban_getOrElseSet('none', true),
        betterdouban_usLabels.GetStringFromName("none_title"),
        '',
        '',
        '',
        '',
        true,
        betterdouban_tabs.SKINS)
);


var betterdouban_enabledScripts = null;

function betterdouban_getEnabledScripts( betterdouban_scripts) {
     betterdouban_enabledScripts = new Array();
    for (var i = 0; i < betterdouban_scripts.length; i++) {
        if ( betterdouban_getBooleanPreference("betterdouban.enabled."+ betterdouban_scripts[i].id) ) {
             betterdouban_enabledScripts.push( betterdouban_scripts[i]);
            //alert( betterdouban_scripts[i].id + "enabled");
        }
    }

     betterdouban_setBooleanPreference("betterdouban.loaded",  true);
}

betterdouban_getEnabledScripts(betterdouban_scripts);

function betterdouban_isScriptApplicable(script, href) {
    var result = false;
    switch (script) {
            case 'example':  result = ( /http:\/\/www\.douban\.com\/.*/.test(href) ) && true; break;
        }
    return result;
}
