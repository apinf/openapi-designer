import {inject, bindable} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {parseJSON} from './resources/jsonparser';
import {Field} from './resources/elements/abstract/field';
import {schema, fieldsToShow} from './schemas/index';
import {Validation} from './validation';
import YAML from 'yamljs';
import SwaggerUIBundle from 'swagger-ui';
import SwaggerUIStandalonePreset from 'swagger-ui/swagger-ui-standalone-preset';
import $ from 'jquery';

@inject(I18N, EventAggregator)
export class App {
  @bindable
  language = window.localStorage.language || 'en';
  enableBranding = true;

  constructor(i18n, ea) {
    Field.internationalizer = i18n;
    Field.eventAggregator = ea;
    Field.validationFunctions = new Validation(i18n);
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
      console.log(exception);
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

  showRichPreview() {
    if (!this.richPreviewObj) {
      // The DOM isn't ready yet, but swagger-ui requires it to be ready.
      // Let's try again a bit later.
      console.log('DOM not ready. Retrying rich preview in 0.5s...');
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

  split(type) {
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
        console.error(ex);
        return;
        // Oh noes!
      }
    }
    delete(true);
    this.forms.setValue(data);
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
          console.error(ex);
          return;
          // Oh noes!
        }
        this.forms.setValue(data);
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

  delete(force) {
    if (!force) {
      const userInput = confirm('Do you want to delete locally cached form data? \nThis action can not be undone.');
      if (!userInput) {
        return;
      }
    }
    const pointerlessSchema = $.extend(true, {}, schema);
    this.forms = parseJSON('form', pointerlessSchema);
    delete localStorage['openapi-v2-design'];
    window.onhashchange();
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
