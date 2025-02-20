const notSelector = `*:not(div,script,style,link,noscript,template,slot,source,datalist,option,optgroup,track)`;
const nonDiv = `Used more non-<code>&lt;div></code> elements than <code>&lt;div></code> elements`;

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
    static outputClasses = this.output.className;

    static compareDivToNonDiv() {
        const divs = this.root.querySelectorAll('div');
        const non = this.root.querySelectorAll(notSelector)
        return divs.length < non.length;
    }

    static reset() {
        this.report.innerHTML = '';
        this.good.innerHTML = '';
        this.score = 0;
        this.output.className = this.outputClasses;
    }

    static formatMessage(str, count) {
        return str.replaceAll(/</g, '&lt;').replaceAll(/(`)(.*?)(`)/g, '<code>$2</code>').replace(/\$/, `<b>${count}</b>`)
    }

    static async test(incomingHTML, rules) {
        this.reset();

        this.root.innerHTML = incomingHTML;

        const report = [];
        const jsonReport = [];

        let i = 0;
        for (const rule of rules) {
            const { selector, type, weight, message } = rule;
            const violators = this.root.querySelectorAll(selector);
            
            if (violators.length === 0) {
                continue;
            }
            jsonReport.push([rules.indexOf(rule), violators.length]);
            i++;
            violators.forEach(_ => this.score += weight);
            report.push([type, this.formatMessage(message, violators.length)]);
        }

        if (this.compareDivToNonDiv()) {
            jsonReport.push([-1, null])
            report.push([1, nonDiv])
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