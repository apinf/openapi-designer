import {inject, bindable} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {parseJSON} from './resources/jsonparser';
import {Field} from './resources/form/abstract/field';
import {schema, fieldsToShow} from './schemas/index';
import {sky} from './sky';
import {Validation} from './validation';
import YAML from 'yamljs';
import $ from 'jquery';
window.$ = $;
window.jQuery = $;
import SwaggerUIBundle from 'swagger-ui';
import SwaggerUIStandalonePreset from 'swagger-ui/swagger-ui-standalone-preset';

// I have no idea why this works.
// PNotify has a very interesting module system that I couldn't get to work work
// when importing in any other way than by using the monstrosity below.
// Aurelia is probably not completely guilt-free either.
//
// To add a new pnotify module, you must add it to both of the arrays below in
// the same format as the existing extra modules.
require(
  [
    'pnotify',
    'pnotify/pnotify.animate',
    'pnotify/pnotify.confirm'
  ],
  () => require(
    [
      'pnotify',
      'pnotify.animate',
      'pnotify.confirm'
    ],
    pnfTemp => window.PNotify = pnfTemp));

window.stack_bottomright = {
  dir1: 'up',
  dir2: 'left',
  push: 'up'
};

@inject(I18N, EventAggregator)
export class App {
  @bindable
  language = window.localStorage.language || 'en';
  enableBranding = true;
  sky = [];

  constructor(i18n, ea) {
    this.i18n = i18n;
    Field.internationalizer = i18n;
    Field.eventAggregator = ea;
    Field.validationFunctions = new Validation(i18n);
    this.sky = sky;
    // Allow access from browser console
    window.$oai = this;

    try {
      const pointerlessSchema = $.extend(true, {}, schema);
      this.forms = parseJSON('form', pointerlessSchema);
      if (window.localStorage['openapi-v2-design']) {
        const savedData = JSON.parse(window.localStorage['openapi-v2-design']);
        this.forms.setValue(savedData);
      }
    } catch (exception) {
      console.error(exception);
      this.exception = exception;
      return;
    }

    this.activeForm = 'about';

    window.onhashchange = () => {
      const formID = window.location.hash.substr(2) || 'about';
      if (typeof this.activeForm === 'object') {
        this.activeForm.show = false;
      }
      if (formID === 'about') {
        this.activeForm = 'about';
      } else if (this.forms.hasChild(formID)) {
        this.activeForm = this.forms.getChild(formID);
        this.activeForm.show = true;
      } else {
        return;
      }
      $('.nav > .editor-nav > .nav-link.open').removeClass('open');
      $(`#nav-${formID}`).addClass('open');
    };

    this.forms.addChangeListener(() => this.saveFormLocal());
  }

  bind() {
    this.split(window.localStorage.split || 'split');
  }

  languageChanged() {
    window.localStorage.language = this.language;
    location.reload();
  }

  spaceLogin() {
    const SPACE_BASE = 'https://openapi.space/api/v1';
    $.ajax({
      type: 'POST',
      url: `${SPACE_BASE}/auth/login`,
      contentType: 'application/json',
      data: JSON.stringify({
        username: this.spaceUsername.value,
        password: this.spacePassword.value
      })
    }).then(data => {
      window.localStorage.spaceToken = data.token;
      window.localStorage.spaceUser = data.username;
      this.spaceLoginModal.close();
      if (this.pendingSkyUpload) {
        this.pendingSkyUpload();
        this.pendingSkyUpload = undefined;
      }
    }).fail(({status}) => {
      const title = this.i18n.tr('notify.space-login-failed.title');
      let body;
      switch (status) {
      case 404:
        body = this.i18n.tr('notify.space-login-failed.incorrect-username');
        break;
      case 401:
        body = this.i18n.tr('notify.space-login-failed.incorrect-password');
        break;
      default:
        body = this.i18n.tr('notify.space-login-failed.unknown-error', {status});
      }
      this.notify(title, body, 'error');
    });
  }

  showRichPreview() {
    if (!this.richPreviewObj) {
      // The DOM isn't ready yet, but swagger-ui requires it to be ready.
      // Let's try again a bit later.
      setTimeout(() => this.showRichPreview(), 500);
      return;
    }

    setTimeout(() => {
      const url = 'data:application/json;charset=utf-8,' + encodeURIComponent(this.json);
      this.richPreview = new SwaggerUIBundle({
        url,
        dom_id: '#rich-preview',
        // Disable Swagger.io online validation (AKA spyware)
        validatorUrl: null,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: 'StandaloneLayout'
      });
    }, 0);
  }

  hideRichPreview() {
    this.richPreview = undefined;
    $(this.richPreviewObj).empty();
  }

  split(type, force = false) {
    if (type === 'preview') {
      if (!force) {
        let errors = {};
        this.forms.revalidate(errors);
        this.richPreviewErrors = Object.entries(errors);
        if (this.richPreviewErrors.length > 0) {
          this.richPreviewErrorModal.open();
          return;
        }
      } else {
        this.richPreviewErrorModal.close();
      }
    }
    this.previousSplit = window.localStorage.split || 'split';
    this.showEditor = type === 'editor' || type === 'split';
    this.showOutput = type === 'output';
    this.splitView = type === 'split';
    this.showPreview = type === 'preview';
    if (this.showPreview) {
      this.showRichPreview();
    } else if (this.richPreview) {
      this.hideRichPreview();
    }
    window.localStorage.split = type;
  }

  notify(title, text = '', type = 'info', url = '', onclick = undefined) {
    /*eslint no-new: 0*/
    const notif = new PNotify({
      title,
      text,
      type,
      stack: stack_bottomright,
      addclass: 'stack-bottomright',
      animate: {
        animate: true,
        in_class: 'slideInUp',
        out_class: 'slideOutDown'
      }
    });
    notif.get().click(() => {
      notif.remove();
      if (onclick) {
        onclick();
      }
      if (url) {
        window.open(url, '_blank');
      }
    });
  }

  confirm(title, text, type = 'info') {
    return new Promise((resolve, reject) => {
      const notif = new PNotify({
        title,
        text,
        type,
        stack: stack_bottomright,
        addclass: 'stack-bottomright',
        animate: {
          animate: true,
          in_class: 'bounceInUp',
          out_class: 'bounceOutDown'
        },
        confirm: {
          confirm: true
        }
      });
      notif.get()
        .on('pnotify.confirm', resolve)
        .on('pnotify.cancel', reject)
        .click(() => notif.remove());
    });
  }


  attached() {
    if (window.onhashchange) {
      window.onhashchange();
    }
  }

  setLanguage(lang) {
    window.localStorage.language = lang;
    location.reload();
  }

  importOutputEditor() {
    const rawData = $(this.outputEditor).val();
    let data;
    try {
      data = YAML.parse(rawData);
    } catch (_) {
      try {
        data = JSON.parse(rawData);
      } catch (ex) {
        this.notify(
          this.i18n.tr('notify.import-failed.title'),
          this.i18n.tr('notify.import-failed.body', {error: ex}),
          'error');
        return;
      }
    }
    delete(true);
    this.forms.setValue(data);
    this.notify(
      this.i18n.tr('notify.editor-import-complete.title'),
      this.i18n.tr('notify.editor-import-complete.body', {
        title: this.forms.resolveRef('#/header/info/title').getValue(),
        version: this.forms.resolveRef('#/header/info/version').getValue()
      }),
      'success'
    );
  }

  importFile() {
    delete(true);
    const fileInput = $('<input/>', { type: 'file' });
    fileInput.css({display: 'none'});
    fileInput.appendTo('body');
    fileInput.trigger('click');

    // IE/Edge don't want to trigger change events, so I have to do it for them...
    //
    // Check that the browser is IE/Edge
    if (!!window.StyleMedia) {
      // Check if there is a file every 0.5 seconds
      const interval = setInterval(() => {
        if (fileInput[0].files[0]) {
          // The file was found, so trigger a change event and stop the interval.
          fileInput.trigger('change');
          clearInterval(interval);
        }
      }, 500);
    }

    fileInput.change(() => {
      const file = fileInput[0].files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        let data;
        try {
          if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
            data = YAML.parse(reader.result);
          } else {
            data = JSON.parse(reader.result);
          }
        } catch (ex) {
          this.notify(
            this.i18n.tr('notify.import-failed.title'),
            this.i18n.tr('notify.import-failed.body', {error: ex}),
            'error');
          return;
        }
        this.forms.setValue(data);
        this.notify(
          this.i18n.tr('notify.import-complete.title'),
          this.i18n.tr('notify.import-complete.body', {
            title: this.forms.resolveRef('#/header/info/title').getValue(),
            version: this.forms.resolveRef('#/header/info/version').getValue()
          }),
          'success'
        );
      }, false);
      reader.readAsText(file);
    });
  }

  download(type, force) {
    if (!force) {
      let errors = {};
      this.forms.revalidate(errors);
      this.downloadErrors = Object.entries(errors);
      if (this.downloadErrors.length > 0) {
        $(this.downloadErrorBox).attr('data-dl-type', type);
        this.downloadErrorModal.open();
        return;
      }
    } else {
      this.downloadErrorModal.close();
    }
    this.downloadErrors = [];
    if (!type) {
      type = $(this.downloadErrorBox).attr('data-dl-type');
    }
    let data;
    if (type === 'json') {
      data = this.json;
    } else if (type === 'yaml') {
      data = this.yaml;
    } else {
      return;
    }

    // Add an anchor element that has the data as the href attribute, then click
    // the element to download the data.
    const blob = new Blob([data], {type: 'text/json'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, `swagger.${type}`);
    } else {
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = `swagger.${type}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }

  upload(theCloud) {
    theCloud.upload.call(theCloud, this.getFormData(), this);
  }

  delete(force = false, notify = false) {
    if (!force) {
      this.confirm(
        this.i18n.tr('confirm.delete.title'),
        this.i18n.tr('confirm.delete.body')
      ).then(() => this.delete(true, notify))
      .catch(() => void (0));
      return;
    }
    let oldData;
    if (notify) {
      oldData = this.forms.getValue();
    }
    const pointerlessSchema = $.extend(true, {}, schema);
    this.forms = parseJSON('form', pointerlessSchema);
    delete localStorage['openapi-v2-design'];
    window.onhashchange();
    if (notify) {
      this.notify(
        this.i18n.tr('notify.delete.title'),
        this.i18n.tr('notify.delete.body'),
        'info',
        '',
        () => {
          this.delete(true, false);
          this.forms.setValue(oldData);
        });
    }
  }

  getFormData() {
    const data = this.forms.getValue();
    data.swagger = '2.0';
    return data;
  }

  get yaml() {
    return YAML.stringify(this.getFormData(), 10, 2);
  }

  get json() {
    const data = JSON.stringify(this.getFormData(), '', '  ');
    return data;
  }

  saveFormLocal() {
    window.localStorage['openapi-v2-design'] = JSON.stringify(this.getFormData());
  }

  get currentFormJSON() {
    if (fieldsToShow.hasOwnProperty(this.activeForm.id)) {
      const rawData = this.getFormData();
      let output = '';
      for (const field of fieldsToShow[this.activeForm.id]) {
        if (rawData[field]) {
          output += `"${field}": ${JSON.stringify(rawData[field], '', '  ')}\n`;
        }
      }
      return output;
    }
    const data = this.activeForm.getValue();
    if (!data || (typeof data === 'object' && Object.entries(data).length === 0)) {
      return '';
    }
    const stringData = JSON.stringify(data, '', '  ');
    return `"${this.activeForm.id}": ${stringData}`;
  }
}
