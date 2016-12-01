const schema = require('./schema/index');
const options = require('./schema/options');
const processJSON = require('./jsonprocessor');
/*
  global $, document, window
*/

const form = {
  data: {
    info: {},
    schemes: {},
    consumes: {},
    produces: {},
    paths: {},
    security: {},
    tags: {},
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

function updateJSONPreview () {
  $('#json-preview').JSONView(form.process());
}

function switchSchema (sectionName) {
  $('#form').empty();
  $('#form').alpaca({
    data: form.data[sectionName],
    schema: JSON.parse(JSON.stringify(schema[sectionName])),
    options: options[sectionName] || {},
    postRender: (control) => {
      control.on('change', function onChange () {
        form.data[sectionName] = this.getValue();
        form.save();
        updateJSONPreview();
      });
    },
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
