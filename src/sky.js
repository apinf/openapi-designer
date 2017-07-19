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
      }).then(data => designer.notify(
        'Upload complete',
        `${title} v${version} has been uploaded to OpenAPI space`,
        'success'))
      .fail(err => {
        switch (err.status) {
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
          designer.notify('Upload failed', `Unknown error: HTTP ${err.status}`, 'error');
        }
      });
    }
  }
];
