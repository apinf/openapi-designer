const schema = require('./schema/index');
const processJSON = require('./jsonprocessor');
const validators = require('./validators');
require('./lib/json-editor/dist/jsoneditor.js');
/*
  global $, document, window, JSONEditor, YAML
*/

/**
 * The main form data store.
 * @type {object}
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
  section: '',
  process () {
    return processJSON(this.data);
  },
  toEncodedJSON () {
    return encodeURIComponent(JSON.stringify(this.process(), null, '  '));
  },
  toEncodedYAML () {
    return encodeURIComponent(YAML.stringify(this.process(), 99, 2));
  },
  /**
   * Save form data to cache (LocalStorage).
   */
  save () {
    window.localStorage.cachedForm = JSON.stringify(this.data);
  },
  /**
   * Load form data from cache (LocalStorage).
   */
  load () {
    if ({}.hasOwnProperty.call(window.localStorage, 'cachedForm')) {
      this.data = JSON.parse(window.localStorage.cachedForm);
    }
  },
};

/**
 * The current JSONEditor instance.
 * @type {JSONEditor}
 */
let editor;

// Default options for JSONEditor
JSONEditor.defaults.options = {
  // Use bootstrap 3 theme.
  theme: 'bootstrap3',
  iconlib: 'bootstrap3',
  // Disable buttons that are not needed.
  disable_edit_json: true,
  disable_properties: true,
  // Make all buttons visible by default.
  required_by_default: true,
  // Disable redundant delete buttons.
  disable_array_delete_all_rows: true,
  disable_array_delete_last_row: true,
  show_errors: 'always',
  custom_validators: [validators.required, validators.type],
};

/**
 * Update the JSON preview panel with the current data.
 */
function updateJSONPreview () {
  $('#json-preview').JSONView(form.process());

  // Highlight the section being edited.
  $('#json-preview > .jsonview > .obj.level0 > li > .prop').each((i, domObj) => {
    const obj = $(domObj);
    // Remove quotes in the name since .text() returns the content in quotes.
    const name = obj.text().replace(/"/g, '');
    if (name === form.section) {
      obj.parent().addClass('highlight');
      return false;
    }
    return true;
  });
}

/**
 * Switch to another section in the schema.
 * @param {string} sectionName The name of the section to switch to.
 */
function switchSchema (sectionName) {
  $('#form').empty();
  editor = new JSONEditor(document.getElementById('form'), {
    schema: JSON.parse(JSON.stringify(schema[sectionName])),
    startval: form.data[sectionName],
  });
  global.editor = editor;
  form.section = sectionName;
  editor.on('change', () => {
    form.data[sectionName] = editor.getValue();
    form.save();
    updateJSONPreview();
  });
}

// Switch between schema sections when clicking on buttons with the data-form attribute.
$('.btn[data-form]').click(function click () {
  switchSchema(this.getAttribute('data-form'));
});

form.load();
updateJSONPreview();

/**
 * Download the JSON output
 */
function download (type) {
  let data;
  if (type === 'json') {
    data = form.toEncodedJSON();
  } else if (type === 'yml') {
    data = form.toEncodedYAML();
  } else {
    return;
  }
  const str = `data:text/json;charset=utf-8,${data}`;
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', str);
  downloadLink.setAttribute('download', `swagger.${type}`);
  downloadLink.innerHTML = 'Download Open API specification file';
  downloadLink.hidden = true;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}
function clear () {
  delete window.localStorage.cachedForm;
  window.location.reload();
}

$('#download-json').click(() => download('json'));
$('#download-yaml').click(() => download('yml'));

$('#clear').click(() => clear());
