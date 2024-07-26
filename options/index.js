const newRule = document.getElementById('newRule');

class SettingsOperator {
    static get settings() {
        return new Promise(res => chrome.storage.sync.get('soupSettings').then(({ soupSettings }) => res(soupSettings)));
    }

    static rulesList = document.getElementById('existingRules');

    static async saveSettings(settingsObject) {
        await chrome.storage.sync.set({
            soupSettings: settingsObject,
        });
    }

    static async toggleRule(index) {
        const { rules } = await this.settings;

        for (let i = 0;i<rules.length;i++) {
            if (index === i) rules[i].enabled = !rules[i].enabled;
        }
        
        await this.saveSettings({ rules });
        this.renderList();
    }

    static listItemTemplate = ({ fromSource, editing, enabled, message, selector, type, weight }, index) => {
        return `<li data-index="${index}" class="rule ${enabled ? 'enabled' : 'disabled'} ${editing ? 'editing' : ''}">${editing ? `
            <div class="selector"><strong>Selector</strong>: <input value="${selector}" name="selector" /></div>
            <div class="message"><strong>Reason</strong>: <textarea name="message" rows="${Math.floor(message.length / 20)}">${message}</textarea></div>
            <div class="weight"><strong>Weight</strong>: <input value="${weight}" name="weight" /></div>
            <div class="type"><strong>Type <small>Enter either a 1 or -1</small></strong>: <input value="${type}" name="type" /></div>
            <div class="controls">
                <button type="button" class="save-rule">Save</button>
            </div>
        ` : `
            <div class="selector"><strong>Selector</strong>: <code>${selector}</code></div>
            <div class="message"><strong>Reason</strong>: ${message.replaceAll(/</g, '&lt;').replaceAll(/(`)(.*?)(`)/g, '<code>$2</code>')}</div>
            <div class="weight"><strong>Weight</strong>: ${weight}</div>
            <div class="type"><strong>${type > 0 ? 'Positive' : 'Negative'}</strong> Rule.</div>
            <div class="controls">
                <button type="button" class="${enabled ? 'disable-rule' : 'enable-rule'}">${enabled ? 'Disable Rule' : 'Enable Rule'}</button>
                <button type="button" class="edit-rule">Edit Rule</button>
                ${!fromSource ? `<button type="button" class="delete-rule">Delete</button>` : ''}
            </div>`}
        </li>`
    }
    static async renderList() {
        const { rules } = await this.settings;
        
        this.rulesList.innerHTML = rules.map(this.listItemTemplate).join('');
    }

    static async editRule(index) {
        const { rules } = await this.settings;
        
        rules[index].editing = true;

        await this.saveSettings({ rules });
        this.renderList();
    }

    static async saveRule(index) {
        const { rules } = await this.settings;

        const ruleInEdit = this.rulesList.querySelector('.editing');

        let ruleToEdit = rules[index];

        for (const key of Object.keys(ruleToEdit)) {
            const control = ruleInEdit.querySelector(`[name="${key}"]`);
            if (!control) continue;
            switch(control.localName) {
                case 'textarea':
                    
                    
                    break;
                default:
                    rules[index][key] = control.value;
            }
        }

        rules[index].editing = false;
        
        await this.saveSettings({ rules });
        this.renderList();
    }

    static async saveNewRule(newRuleFieldset) {
        const { rules } = await this.settings;
        
        const [exampleRule] = rules;

        const newRule = {};

        for (const key of Object.keys(exampleRule)) {
            const control = newRuleFieldset.querySelector(`[name="${key}"]`);
            
            switch(key) {
                case 'type':
                    const v = parseInt(control.value);
                    console.log(v);
                    if (key === 'type' && ![1,-1].includes(v)) {
                        throw new Error('The rule type must be either a 1 or -1');
                    }
                    newRule[key] = v;
                    break;
                case 'message':
                    control.value = control.value.trim();
                    console.log(control.value, control.textContent);
                    if (control.value.length === 0) {
                        throw new Error('There must be a message to explain the rule');
                    }
                    newRule[key] = control.value;
                    break;
                case 'selector':
                    newRule[key] = control.value.trim();
                    break;
                case 'weight':
                    control.value = control.value.trim();
                    if (!control.value.match(/\d+/)) {
                        throw new Error('Weight must be a number');
                    }
                    newRule[key] = +control.value;
                    break;
                default:
                    console.log(key, control.value);
                    control.value = ['true','false'].includes(control.value) ? control.value === 'true' : control.value;
                    newRule[key] = control.value;
            }

            rules.push(newRule);
            
            await this.saveSettings({ rules });
            this.renderList();
        }
    }

    static init() {
        this.rulesList.addEventListener('click', async ({ target }) => {
            const listItem = target.closest('[data-index]')
            if (!listItem) {
                console.error('Could not find index for target', target);
            }
            const index = +listItem.dataset.index;
            if (target.closest('.disable-rule, .enable-rule')) {

                this.toggleRule(index);
                return;
            }
            if (target.closest('.edit-rule') && !this.isEditing) {
                this.isEditing = true;
                this.editRule(index);
            }
            if (target.closest('.save-rule')) {
                await this.saveRule(index);
                this.isEditing = false;
            }
            if (target.closest('.delete-rule')) {
                await this.deleteRule(index);
            }
        });
        refreshList.addEventListener('click', () => {
            this.renderList();
        })
        this.renderList();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    SettingsOperator.init();
})

saveRule.addEventListener('click', () => {
    SettingsOperator.saveNewRule(newRule);
})

function saveOptions(e) {
    e.preventDefault();

    SettingsOperator.saveNewRule(newRule);
}

