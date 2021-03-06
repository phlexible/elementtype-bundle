Ext.provide('Phlexible.elementtypes.field.LinkField');

Ext.require('Ext.ux.TwinComboBox');
Ext.require('Phlexible.elements.LinkWindow');

Phlexible.elementtypes.field.LinkField = Ext.extend(Ext.ux.TwinComboBox, {
    minChars: 2,
    //hideTrigger: true,
    trigger2Class: 'p-form-link-trigger',
    displayField: 'title',
    valueField: 'id',
    typeAhead: false,
    listWidth: 300,
    queryDelay: 1000,
    hiddenValue: '',

    allowed: {
        tid: true,
        intrasiteroot: false,
        url: true,
        mailto: true
    },
    elementTypeIds: '',
    language: '',
    siteroot_id: '',
    hideNoLink: false,
    hideNewWindow: false,
    hideLanguage: false,

    initComponent: function () {
        if (this.element) {
            this.siteroot_id = this.element.siteroot_id;
            this.language = this.element.language;
        }

        this.store = new Ext.data.JsonStore({
            url: Phlexible.Router.generate('elements_links_search'),
            baseParams: {
                language: this.language,
                siteroot_id: this.siteroot_id,
                allow_tid: this.allowed.tid ? 1 : 0,
                allow_intrasiteroot: this.allowed.intrasiteroot ? 1 : 0,
                element_type_ids: this.elementTypeIds || ''
            },
            root: 'results',
            totalProperty: 'totalCount',
            id: 'id',
            fields: ['id', 'type', 'eid', 'tid', 'title']
        });

        this.addListener({
            beforequery: function (e) {
                if (!this.allowed.tid && !this.allowed.intrasiteroot) {
                    return false;
                }
                if (e.query.match(/^http[s]{0,1}:/)) {
                    // http://www.phlexible.net
                    this.setHiddenValue({
                        type: 'external',
                        url: e.combo.getRawValue()
                    });
                    e.combo.setValue(e.combo.getRawValue());
                    return false;
                }
                if (e.query.match(/^mailto:/)) {
                    // mailto:info@phlexible.net
                    this.setHiddenValue({
                        type: 'mailto',
                        recipient: e.combo.getRawValue().substr(7)
                    });
                    e.combo.setValue(e.combo.getRawValue());
                    return false;
                }
            },
            scope: this
        });

        if (this.readonly) {
            this.editable = false;
            this.readOnly = true;
            this.hideTrigger = true;
            this.ctCls = 'x-item-disabled';
        }

        Phlexible.elementtypes.field.LinkField.superclass.initComponent.call(this);
    },

    setElementTypeIds: function (elementTypeIds) {
        this.elementTypeIds = elementTypeIds;
        this.store.baseParams.element_type_ids = elementTypeIds;
    },

    initValue: function() {
        Phlexible.elementtypes.field.LinkField.superclass.initValue.call(this);

        this.setHiddenFieldValue(this.hiddenValue);
    },

    setHiddenValue: function(value) {
        this.hiddenValue = value;
        this.setHiddenFieldValue(value);
    },

    setHiddenFieldValue: function(value) {
        if (this.hiddenField) {
            if (value) {
                this.hiddenField.value = Ext.encode(value);
            } else {
                this.hiddenField.value = '';
            }
        }
    },

    setValue: function(value) {
        Phlexible.elementtypes.field.LinkField.superclass.setValue.call(this, value);

        this.setHiddenFieldValue(this.hiddenValue);
    },

    getValue: function() {
        var value = Phlexible.elementtypes.field.LinkField.superclass.getValue.call(this);
        return value;
    },

    validateValue: function (value) {
        var hiddenValue = this.hiddenValue;

        if (!hiddenValue && (value.match(/^http[s]{0,1}:/) || value.match(/^mailto:(.*)$/))) {
            hiddenValue = value;
        }

        //Phlexible.console.log('value: ' + value);
        //Phlexible.console.log('hiddenValue: ' + hiddenValue);

        if (value && !hiddenValue) {
            //Phlexible.console.warn('value + !hiddenValue');
            this.markInvalid(this.invalidText);
            return false;
        }

        if (hiddenValue === undefined || hiddenValue === null || hiddenValue.length < 1 || hiddenValue === this.emptyText) { // if it's blank
            if (this.allowBlank) {
                this.clearInvalid();
                return true;
            } else {
                //Phlexible.console.warn('whatever');
                this.markInvalid(this.blankText);
                return false;
            }
        }

        if (hiddenValue.type === 'internal') {
            if (!this.allowed.tid) {
                this.markInvalid('Internal link not allowed.');
                return false;
            }
            return true;
        }
        else if (hiddenValue.type === 'intrasiteroot') {
            if (!this.allowed.intrasiteroot) {
                this.markInvalid('Intrasiteroot link not allowed.');
                return false;
            }
            return true;
        }
        else if (hiddenValue.type === 'external') {
            if (!this.allowed.url) {
                this.markInvalid('External link not allowed.');
                return false;
            } else if (!Ext.form.VTypes.url(hiddenValue.url)) {
                this.markInvalid(this.invalidText);
                return false;
            }
            return true;
        }
        else if (hiddenValue.type === 'mailto') {
            if (!this.allowed.mailto) {
                this.markInvalid('Mailto link not allowed.');
                return false;
            } else if (!Ext.form.VTypes.email(hiddenValue.recipient)) {
                this.markInvalid(this.invalidText);
                return false;
            }
            return true;
        }

        return false;
    },

    onSelect: function (record, index) {
        Phlexible.elementtypes.field.LinkField.superclass.onSelect.call(this, record, index);

        this.setHiddenValue({
            type: record.data.type,
            tid: record.data.tid,
            eid: record.data.eid
        });
        this.setValue(this.getValue());
    },

    onClear: function () {
        Phlexible.elementtypes.field.LinkField.superclass.onClear.call(this);

        this.hiddenValue = this.getValue();
        this.validate();
    },

    onTriggerClick: function (e, el) {
        if (this.disabled || this.readonly) {
            return;
        }

        var w = new Phlexible.elements.LinkWindow({
            siteroot_id: typeof this.siteroot_id == 'object' ? this.siteroot_id.join(',') : this.siteroot_id,
            value: this.hiddenValue,
            allowed: this.allowed,
            elementTypeIds: this.elementTypeIds || '',
            hideNoLink: this.hideNoLink,
            hideNewWindow: this.hideNewWindow,
            hideLanguage: this.hideLanguage,
            language: this.language,
            listeners: {
                set: function (value, display) {
                    if (!value && !display) {
                        this.onTrigger1Click();
                        return;
                    }

                    this.setHiddenValue(value);
                    this.setValue(value);
                    this.setRawValue(display);

                    this.fireEvent('set', value, display);
                },
                scope: this
            }
        });
        w.show(el);
    }
});

Ext.reg('linkfield', Phlexible.elementtypes.field.LinkField);