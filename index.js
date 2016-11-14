const { schema } = require('./schema/index');
const validators = require('./validators');
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
    fields: {
      info: {
        fields: {
          host: { validator: validators.hostname },
          basePath: { validator: validators.basePath },
        },
      },
      consumes: {
        items: {
          validator: validators.mimeType,
        },
        toolbarSticky: true,
      },
      produces: {
        items: {
          validator: validators.mimeType,
        },
        toolbarSticky: true,
      },
      paths: {
        type: 'map',
        toolbarSticky: true,
        items: {
          methods: {
            // This isn't working, `methods` isn't a map in the JSON output
            type: 'map',
            toolbarSticky: true,
          },
        },
      },
    },
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
    control.on('change', () => {
      const formData = this.getValue();
      if (!$('#json-preview').hasClass('hidden')) {
        $('#json-preview').JSONView(formData);
      } else if (!$('#rich-preview').hasClass('hidden')) {
        // TODO rich preview
      }
    });
  },
});
