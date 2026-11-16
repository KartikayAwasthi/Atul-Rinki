export const LANG_KEY = "wedding-lang";

/** Runs before first paint: applies the saved (or browser-preferred) language. */
export const langInitScript = `(function(){try{var l=localStorage.getItem("${LANG_KEY}");if(l!=="hi"&&l!=="en"){l=(navigator.language||"").toLowerCase().indexOf("hi")===0?"hi":"en"}document.documentElement.dataset.lang=l;document.documentElement.lang=l}catch(e){}})()`;
