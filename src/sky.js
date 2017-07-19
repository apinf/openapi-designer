import $ from 'jquery';

export const sky = [
  {
    'name': 'OpenAPI space',
    'baseURL': 'https://openapi.space/api/v1',
    upload(apiSpec, designer) {
      if (!window.localStorage.spaceToken) {
        designer.spaceLoginModal.open();
        designer.pendingSkyUpload = () => this.upload(apiSpec, designer);
        return;
      }
      const title = apiSpec.info.title;
      const version = apiSpec.info.version;
      const url = `${this.baseURL}/apis/${window.localStorage.spaceUser}/${title}`;
      $.ajax({
        type: 'POST',
        url,
        headers: {
          Authorization: window.localStorage.spaceToken
        },
        contentType: 'application/json',
        data: JSON.stringify(apiSpec)
      }).then((data, _, {status}) => {
        switch (status) {
        case 200:
          designer.notify(
            'Upload complete',
            `${title} v${version} has been updated in OpenAPI space.\n\nClick here to open the uploaded document.`,
            'success',
            data.url);
          break;
        case 201:
          designer.notify(
            'Upload complete',
            `${title} v${version} has been added to OpenAPI space.\n\nClick here to open the uploaded document.`,
            'success',
            data.url);
          break;
        default:
          designer.notify(
            'Upload complete',
            `${title} v${version} has been uploaded to OpenAPI space.\n\nClick here to open the uploaded document.`,
            'warning',
            data.url);
        }
      }).fail(({status}) => {
        switch (status) {
        case 400:
          designer.notify('Upload failed', 'Invalid Swagger document', 'error');
          break;
        case 403:
          designer.notify('Upload failed', 'Access denied.', 'error');
          break;
        case 409:
          designer.notify('Upload failed', "Can't edit published API", 'error');
          break;
        default:
          designer.notify('Upload failed', `Unknown error: HTTP ${status}`, 'error');
        }
      });
    }
  }
];
