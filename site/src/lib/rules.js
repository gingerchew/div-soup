export const rules = [
    {
        "editing": false,
        "enabled": true,
        "fromSource": true,
        "selector": "[ping]",
        "type": -1,
        "weight": -0.1,
        "message": "Used outdated tracking methods $ times"
    },
    {
        "editing": false,
        "enabled": true,
        "fromSource": true,
        "selector": "div",
        "weight": 0,
        "type": -1,
        "message": "Used `<div>` $ times"
    },
    {
        "editing": false,
        "enabled": true,
        "fromSource": true,
        "selector": "div > div:not(:has( > div))",
        "weight": -1,
        "type": -1,
        "message": "Used single level nested `<div>` elements $ times"
    },
    {
        "editing": false,
        "enabled": true,
        "fromSource": true,
        "selector": "div > div > div:not(:has( > div))",
        "weight": -5,
        "type": -1,
        "message": "Used double level nested `<div>` elements $ times"
    },
    {
        "editing": false,
        "enabled": true,
        "fromSource": true,
        "selector": "div > div > div > div:not(:has( > div))",
        "weight": -10,
        "type": -1,
        "message": "Used triple level nested `<div>` elements $ times"
    },
    {
        "editing": false,
        "enabled": true,
        "fromSource": true,
        "selector": "div > div > div > div > div",
        "weight": -25,
        "type": -1,
        "message": "Used quadruple level nested `<div>` elements $ times"
    },
    {
        "editing": false,
        "enabled": true,
        "fromSource": true,
        "selector": "[href^='javascript:']",
        "weight": -1000,
        "type": -1,
        "message": "Used `<a>` tag instead of a `<button>` $ times"
    },
    {
        "editing": false,
        "enabled": true,
        "fromSource": true,
        "selector": "[onclick]:not(button,a,input)",
        "weight": -1000,
        "type": -1,
        "message": "Used `onclick` event handler on non-control elements $ times"
    },
    {
        "editing": false,
        "enabled": true,
        "fromSource": true,
        "selector": "*:not(div,script,style,link,noscript,template,slot,source,datalist,option,optgroup,track)",
        "weight": 1,
        "type": 1,
        "message": "Used elements that were not a `<div>` $ times"
    }
]