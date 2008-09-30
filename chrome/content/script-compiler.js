


var betterdouban_gmCompiler={

// getUrlContents adapted from Greasemonkey Compiler
// http://www.letitblog.com/code/python/greasemonkey.py.txt
// used under GPL permission
//
// most everything else below based heavily off of Greasemonkey
// http://greasemonkey.mozdev.org/
// used under GPL permission

getUrlContents: function(aUrl){
	var	ioService=Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService);
	var	scriptableStream=Components
		.classes["@mozilla.org/scriptableinputstream;1"]
		.getService(Components.interfaces.nsIScriptableInputStream);

	var	channel=ioService.newChannel(aUrl, null, null);
	//alert("opening " + aUrl);
	var	input=channel.open();
	scriptableStream.init(input);
	var	str=scriptableStream.read(input.available());
	scriptableStream.close();
	input.close();

	return str;
},

isGreasemonkeyable: function(url) {
	var scheme=Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService)
		.extractScheme(url);
	return (
		(scheme == "http" || scheme == "https" || scheme == "file") &&
		!/hiddenWindow\.html$/.test(url)
	);
},

contentLoad: function(e) {
	var unsafeWin=e.target.defaultView;
	if (unsafeWin.wrappedJSObject) unsafeWin=unsafeWin.wrappedJSObject;

	var unsafeLoc=new XPCNativeWrapper(unsafeWin, "location").location;
	var href=new XPCNativeWrapper(unsafeLoc, "href").href;


		if ( !betterdouban_getBooleanPreference("betterdouban.loaded") ) {
			betterdouban_getEnabledScripts(betterdouban_scripts);
		}
		//we're inside the app, iterate through script array
		if ( betterdouban_gmCompiler.isGreasemonkeyable(href) ) {
			var scriptSrc = null;

			for (var i = 0; i < betterdouban_enabledScripts.length; i++) {

				if (  betterdouban_isScriptApplicable(betterdouban_enabledScripts[i].id, href) )  {
				    // alert("getting "+'chrome://betterdouban/content/user_scripts/' + betterdouban_enabledScripts[i].filename);
					scriptSrc = betterdouban_gmCompiler.getUrlContents('chrome://betterdouban/content/user_scripts/' + betterdouban_enabledScripts[i].filename);
					betterdouban_gmCompiler.injectScript(scriptSrc, href, unsafeWin);
				}
			}
		}
},

injectScript: function(script, url, unsafeContentWin) {
	var sandbox, logger, storage, xmlhttpRequester;
	var safeWin=new XPCNativeWrapper(unsafeContentWin);

	sandbox=new Components.utils.Sandbox(safeWin);

	var storage=new betterdouban_ScriptStorage();
	xmlhttpRequester=new betterdouban_xmlhttpRequester(
		unsafeContentWin, window//appSvc.hiddenDOMWindow
	);

	sandbox.window=safeWin;
	sandbox.document=sandbox.window.document;
	sandbox.unsafeWindow=unsafeContentWin;

	// patch missing properties on xpcnw
	sandbox.XPathResult=Components.interfaces.nsIDOMXPathResult;

	// add our own APIs
	sandbox.GM_addStyle=function(css) { betterdouban_gmCompiler.addStyle(sandbox.document, css) };
	sandbox.GM_setValue=betterdouban_gmCompiler.hitch(storage, "setValue");
	sandbox.GM_getValue=betterdouban_gmCompiler.hitch(storage, "getValue");
	sandbox.GM_openInTab=betterdouban_gmCompiler.hitch(this, "openInTab", unsafeContentWin);
	sandbox.GM_xmlhttpRequest=betterdouban_gmCompiler.hitch(
		xmlhttpRequester, "contentStartRequest"
	);
	//unsupported
	sandbox.GM_registerMenuCommand=function(){};
	sandbox.GM_log=function(){};

	sandbox.__proto__=sandbox.window;
	try {
		this.evalInSandbox(
			"(function(){"+script+"})()",
			url,
			sandbox);
	} catch (e) {
		var e2=new Error(typeof e=="string" ? e : e.message);
		e2.fileName=script.filename;
		e2.lineNumber=0;
		//GM_logError(e2);
		//alert(e2);
	}
},

evalInSandbox: function(code, codebase, sandbox) {
	if (Components.utils && Components.utils.Sandbox) {
		// DP beta+
		Components.utils.evalInSandbox(code, sandbox);
	} else if (Components.utils && Components.utils.evalInSandbox) {
		// DP alphas
		Components.utils.evalInSandbox(code, codebase, sandbox);
	} else if (Sandbox) {
		// 1.0.x
		evalInSandbox(code, sandbox, codebase);
	} else {
		throw new Error("Could not create sandbox.");
	}
},

/* New Greasemonkey code 
GM_BrowserUI.openInTab = function(domWindow, url) {
  if (this.isMyWindow(domWindow)) {
    document.getElementById("content").addTab(url);
  }
}

Old Compiler code
openInTab: function(unsafeContentWin, url) {
	var unsafeTop = new XPCNativeWrapper(unsafeContentWin, "top").top;

	for (var i = 0; i < this.browserWindows.length; i++) {
		this.browserWindows[i].openInTab(unsafeTop, url);
	}
},
*/
openInTab: function(domWindow, url) {
    document.getElementById("content").addTab(url);
},

hitch: function(obj, meth) {
	if (!obj[meth]) {
		throw "method '" + meth + "' does not exist on object '" + obj + "'";
	}

	var staticArgs = Array.prototype.splice.call(arguments, 2, arguments.length);

	return function() {
		// make a copy of staticArgs (don't modify it because it gets reused for
		// every invocation).
		var args = staticArgs.concat();

		// add all the new arguments
		for (var i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}

		// invoke the original function with the correct this obj and the combined
		// list of static and dynamic arguments.
		return obj[meth].apply(obj, args);
	};
},

addStyle:function(doc, css) {
	var head, style;
	head = doc.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = doc.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
},

onLoad: function() {
	//betterdouban_DefaultPreferences(false);
	var	appcontent=window.document.getElementById("appcontent");
	if (appcontent && !appcontent.greased_betterdouban_gmCompiler) {
		appcontent.greased_betterdouban_gmCompiler=true;
		appcontent.addEventListener("DOMContentLoaded", betterdouban_gmCompiler.contentLoad, false);
	}
},

onUnLoad: function() {
	//remove now unnecessary listeners
	window.removeEventListener('load', betterdouban_gmCompiler.onLoad, false);
	window.removeEventListener('unload', betterdouban_gmCompiler.onUnLoad, false);
	if (window.document.getElementById("appcontent")) {
		window.document.getElementById("appcontent").removeEventListener("DOMContentLoaded", betterdouban_gmCompiler.contentLoad, false);
	}
	betterdouban_scripts = null;
},

configure: function() {
	window.openDialog("chrome://betterdouban/content/options.xul", "betterdouban-options-dialog", "centerscreen,chrome,modal,resizable");
}
                  

}; //object betterdouban_gmCompiler


function betterdouban_ScriptStorage() {
	this.prefMan=new betterdouban_PrefManager();
}
betterdouban_ScriptStorage.prototype.setValue = function(name, val) {
	this.prefMan.setValue(name, val);
}
betterdouban_ScriptStorage.prototype.getValue = function(name, defVal) {
	return this.prefMan.getValue(name, defVal);
}


window.addEventListener('load', betterdouban_gmCompiler.onLoad, false);
window.addEventListener('unload', betterdouban_gmCompiler.onUnLoad, false);
