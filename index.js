const { schema } = require('./schema/index');
const { fields } = require('./schema/options');
const processJSON = require('./jsonprocessor');
/*
  global $, document
*/

/**
 * Download the JSON output
 */
function download () {
  const str = `data:text/json;charset=utf-8,${
    encodeURIComponent(JSON.stringify(processJSON(this.getValue()), null, '  '))
  }`;
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', str);
  downloadLink.setAttribute('download', 'swagger.json');
  downloadLink.innerHTML = 'Download Open API specification file';
  downloadLink.hidden = true;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}

// let form;

// function jsonPreview () {
//   $('#json-preview').removeClass('hidden');
//   if (form !== undefined) {
//     $('#json-preview').JSONView(form);
//   }
// }
//
// function richPreview () {
//   $('#rich-preview').removeClass('hidden');
//   if (form !== undefined) {
//     // TODO rich preview
//   }
// }

$('#form').alpaca({
  // Schema from schema/index.js
  // Stringify and parse to remove all pointer-like objects that could break
  // things such as validation error messages.
  schema: JSON.parse(JSON.stringify(schema)),
  options: {
    // Field extra data from schema/options.js
    fields,
    form: {
      buttons: {
        // Download button at the end of the form
        download: {
          click: download,
          type: 'button',
          value: 'Download as JSON',
          styles: 'btn btn-primary',
        },
      },
    },
  },
  postRender: (control) => {
    control.on('change', function onChange () {
      // Update the current preview with the latest changes
      if (!$('#json-preview').hasClass('hidden')) {
        $('#json-preview').JSONView(processJSON(this.getValue()));
      } else if (!$('#rich-preview').hasClass('hidden')) {
        // TODO rich preview
      }
    });
  },
});
