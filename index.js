const { schema } = require('./schema/index');
const { fields } = require('./schema/options');

/*
  global $, document
*/

/**
 * Download the JSON output
 */
function download () {
  const str = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.getValue(), null, '  '))}`;
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
  schema,
  options: {
    fields,
    form: {
      buttons: {
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
      if (!$('#json-preview').hasClass('hidden')) {
        $('#json-preview').JSONView(this.getValue());
      } else if (!$('#rich-preview').hasClass('hidden')) {
        // TODO rich preview
      }
    });
  },
});
