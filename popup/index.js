const notSelector = `*:not(div,script,style,link,noscript,template,slot,source,datalist,option,optgroup,track)`;

class Soup {
    static get settings() {
        return new Promise(res => {
            chrome.storage.sync.get('soupSettings').then(({ soupSettings = {} }) => res(soupSettings))
        });
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

    static async test(incomingHTML) {
        this.score = 0;
        this.root.innerHTML = incomingHTML;

        const report = [];
        const { rules } = await this.settings;
        console.log(rules);
        for (const { selector, type, message, weight } of rules) {
            const violators = this.root.querySelectorAll(selector);
            
            if (violators.length === 0) continue;
            violators.forEach(_ => this.score += weight);
            // const { type, message } = this.reasons[selector];
            report.push([type, message.replace(/\$/, `<b>${violators.length}</b>`)]);
        }

        if (this.compareDivToNonDiv()) {
            report.push([1, `Used more non-<code>&lt;div></code> elements than <code>&lt;div></code> elements`])
        }
        
        if (this.score > 0) this.score = 0;
        requestAnimationFrame(() => {
            console.log(this.score);
            this.output.textContent = this.score;
            this.output.classList.add(...this.getClass(this.score));

            for (const [type, message] of report) {
                (type > 0 ? this.good : this.report).insertAdjacentHTML('beforeend', `<li>${message}</li>`);
            }
        })
    }
}

window.onload = getCurrentDom;

const formatURL = (str) => {
    const url = new URL(str);
    
    return url.origin + url.pathname;
}

function getCurrentDom() {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([{ url, id }]) => {
        document.getElementById('url').textContent = formatURL(url);

        return chrome.scripting.executeScript({
            target: { tabId: id },
            func: domToString
        })
    }).then(([{ result }]) => {
        Soup.test(result);

    })
}

function domToString() {
    return document.body.outerHTML;
}