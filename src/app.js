import {parseJSON} from './resources/jsonparser';
import {schema, fieldsToShow} from './schemas/index';
import YAML from 'yamljs';
import $ from 'jquery';

export class App {
  constructor() {
    // Allow access from browser console
    window.$oai = this;

    this.forms = parseJSON('swagger', schema);
    if (window.localStorage.cachedForm) {
      this.forms.setValue(JSON.parse(window.localStorage.cachedForm));
    }

    this.activeForm = this.forms.getChild('header');
    this.activeForm.show = true;

    window.onhashchange = () => {
      const formID = window.location.hash.substr(2) || 'header';
      if (this.forms.hasChild(formID)) {
        this.activeForm.show = false;
        this.activeForm = this.forms.getChild(formID);
        this.activeForm.show = true;
        $('.nav > .nav-link.open').removeClass('open');
        $(`#nav-${formID}`).addClass('open');
      }
    };

    this.forms.addChangeListener(() => this.saveFormLocal());
  }

  attached() {
    window.onhashchange();
  }

  download(type) {
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

  delete() {
    let userInput = confirm('Do you want to delete locally cached form data? \nThis action can not be undone.');
    if (userInput === true) {
      delete localStorage.cachedForm;
      location.reload();
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
    window.localStorage.cachedForm = JSON.stringify(this.getFormData());
  }

  get currentFormJSON() {
    if (fieldsToShow.hasOwnProperty(this.activeForm.id)) {
      const rawData = this.getFormData();
      let output = '';
      for (const field of fieldsToShow[this.activeForm.id]) {
        output += `"${field}": ${JSON.stringify(rawData[field], '', '  ')}\n`;
      }
      return output;
    }
    const data = JSON.stringify(this.activeForm.getValue(), '', '  ');
    return `"${this.activeForm.id}": ${data}`;
  }
}
