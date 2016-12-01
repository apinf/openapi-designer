const schema = require('./schema/index');
const processJSON = require('./jsonprocessor');
/*
  global $, document, window, JSONEditor
*/

const form = {
  data: {
    info: {},
    schemes: [],
    consumes: [],
    produces: [],
    paths: {},
    security: {},
    tags: [],
    externalDocs: {},
  },
  process () {
    return processJSON(this.data);
  },
  toString () {
    return JSON.stringify(this.process(), null, '  ');
  },
  toEncodedString () {
    return encodeURIComponent(this.toString());
  },
  save () {
    window.localStorage.cachedForm = JSON.stringify(this.data);
  },
  load () {
    if ({}.hasOwnProperty.call(window.localStorage, 'cachedForm')) {
      this.data = JSON.parse(window.localStorage.cachedForm);
    }
  },
};

let editor;

JSONEditor.defaults.options = {
  theme: 'bootstrap3',
  disable_edit_json: true,
  disable_properties: true,
  required_by_default: true,
};

function updateJSONPreview () {
  $('#json-preview').JSONView(form.process());
}

function switchSchema (sectionName) {
  $('#form').empty();
  editor = new JSONEditor(document.getElementById('form'), {
    schema: JSON.parse(JSON.stringify(schema[sectionName])),
  });
  editor.setValue(form.data[sectionName]);
  editor.on('change', () => {
    form.data[sectionName] = editor.getValue();
    form.save();
    updateJSONPreview();
  });
}

$('.btn[data-form]').click(function click () {
  switchSchema(this.getAttribute('data-form'));
});

form.load();
updateJSONPreview();

/**
 * Download the JSON output
 */
function download () {
  const str = `data:text/json;charset=utf-8,${form.toEncodedString()}`;
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', str);
  downloadLink.setAttribute('download', 'swagger.json');
  downloadLink.innerHTML = 'Download Open API specification file';
  downloadLink.hidden = true;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}

$('#download').click(() => download());
