const notSelector = `*not(div,script,style,link,noscript,template,slot,source,datalist,option,optgroup,track)`;

class Soup {
    static rules = {
        'div': 0,
        'div > div:not(:has( > div))': -0.5,
        '[ping]': -0.1,
        'div > div > div:not(:has( > div))': -1,
        'div > div > div > div:not(:has( > div))': -10,
        'div > div > div > div > div': -100,
        '[href^="javascript:"]': -1000,
        '[onclick]:not(button,a,input)': -1000,
        [notSelector]: 1,
    }

    static reasons = {
        'div': {
            type: -1,
            message: 'Used <code>&lt;div></code> $ times'
        },
        'div > div:not(:has( > div))': {
            type: -1,
            message: 'Used single level nested <code>&lt;div></code> elements $ times'
        },
        '[ping]': {
            type: -1,
            message: 'Used outdated tracking methods $ times'
        },
        'div > div > div:not(:has( > div))': {
            type: -1,
            message: 'Used double level nested <code>&lt;div></code> elements $ times'
        },
        'div > div > div > div:not(:has( > div))': {
            type: -1,
            message: 'Used triple level nested <code>&lt;div></code> elements $ times'
        },
        'div > div > div > div > div': {
            type: -1,
            message: 'Used quadruple level nested <code>&lt;div></code> elements $ times'
        },
        '[href^="javascript:"]': {
            type: -1,
            message: 'Used <code>&lt;a></code> tag instead of a button $ times'
        },
        '[onclick]:not(button,a,input)': {
            type: -1,
            message: 'Used <code>onclick</code> event handler on non-control elements $ times'
        },
        [notSelector]: {
            type: 1,
            message: 'Used elements that were not a <code>&lt;div></code> $ times'
        },
    }

    static getClass(score) {
        const className = [];
        if (score < -100) {
            className.push('less-than-100')
        }
        if (score < -250) {
            className.push(`less-than-250`);
        }
        if (score < -500) {
            className.push('less-than-500')
        }
        if (score < -1000) {
            className.push('less-than-1000');
        }
        if (score < -5000) {
            className.push('less-than-5000');
        }
        if (score < -10000) {
            className.push('less-than-10000');
        }

        return className;
    }

    static score = 0

    static output = document.getElementById('score')
    static root = document.getElementById('test')
    static report = document.getElementById('reasons')
    static good = document.getElementById('good')

    static compareDivToNonDiv() {
        const divs = this.root.querySelectorAll('div');
        const non = this.root.querySelectorAll(notSelector)
        return divs.length < non.length;
    }

    static test(incomingHTML) {
        this.score = 0;
        this.root.innerHTML = incomingHTML;

        const report = [];

        for (const [selector, score] of Object.entries(this.rules)) {
            const violators = this.root.querySelectorAll(selector);
            if (violators.length === 0) continue;
            violators.forEach(_ => this.score += score);
            const { type, message } = this.reasons[selector];
            report.push([type, message.replace(/\$/, `<b>${violators.length}</b>`)]);
        }

        if (this.compareDivToNonDiv()) {
            report.push([1, `Used more non-<code>&lt;div></code> elements than <code>&lt;div></code> elements`])
        }

        if (this.score > 0) this.score = 0;
        requestAnimationFrame(() => {
            this.output.textContent = this.score;
            this.output.classList.add(...this.getClass(this.score));
            for (const [type, message] of report) {
                (type > 0 ? this.good : this.report).insertAdjacentHTML('beforeend', `<li>${message}</li>`);
            }
        })
    }
}

window.onload = getCurrentDom;

function getCurrentDom() {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([{ id }]) => {
        return chrome.scripting.executeScript({
            target: { tabId: id },
            func: domToString
        })
    }).then(([{ result }]) => {
        Soup.test(result);
        console.log('test');
    })
}

function domToString() {
    return document.body.outerHTML;
}