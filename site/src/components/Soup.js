const notSelector = `*:not(div,script,style,link,noscript,template,slot,source,datalist,option,optgroup,track)`;

export class Soup {
    /*static get settings() {
        return new Promise(res => {
            fetch('../data/rules.json').then(res => res.json()).then(v => res(v));
        });
    }*/

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

    static async test(incomingHTML, rules) {
        this.score = 0;
        this.root.innerHTML = incomingHTML;

        const report = [];
        // const { rules } = await this.settings;
        
        for (const { selector, type, message, weight } of rules) {
            const violators = this.root.querySelectorAll(selector);
            
            if (violators.length === 0) continue;
            violators.forEach(_ => this.score += weight);
            // const { type, message } = this.reasons[selector];
            report.push([type, message.replaceAll(/</g, '&lt;').replaceAll(/(`)(.*?)(`)/g, '<code>$2</code>').replace(/\$/, `<b>${violators.length}</b>`)]);
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