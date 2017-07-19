import $ from 'jquery';

// To add a cloud to the sky, simply add an element to this array that contains
// the field "name" and the function "upload".
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
      if (!apiSpec || !apiSpec.info || !apiSpec.info.title) {
        const title = designer.i18n.tr('sky.space.upload-failed.title');
        const body = designer.i18n.tr('sky.space.upload-failed.missing-title');
        designer.notify(title, body, 'error');
        return;
      }
      const apiTitle = apiSpec.info.title;
      const version = apiSpec.info.version;
      const url = `${this.baseURL}/apis/${window.localStorage.spaceUser}/${apiTitle}`;
      $.ajax({
        type: 'POST',
        url,
        headers: {
          Authorization: window.localStorage.spaceToken
        },
        contentType: 'application/json',
        data: JSON.stringify(apiSpec)
      }).then((data, _, {status}) => {
        const title = designer.i18n.tr('sky.space.upload-complete.title');
        let body;
        switch (status) {
        case 200:
          body = designer.i18n.tr('sky.space.upload-complete.updated', {title: apiTitle, version});
          break;
        case 201:
          body = designer.i18n.tr('sky.space.upload-complete.created', {title: apiTitle, version});
          break;
        default:
          body = designer.i18n.tr('sky.space.upload-complete.unknown', {title: apiTitle, version});
          break;
        }
        designer.notify(title, body, 'success', data.url);
      }).fail(({status}) => {
        const title = designer.i18n.tr('sky.space.upload-failed.title');
        let body;
        switch (status) {
        case 400:
          body = designer.i18n.tr('sky.space.upload-failed.invalid-document');
          break;
        case 403:
          body = designer.i18n.tr('sky.space.upload-failed.access-denied');
          break;
        case 409:
          body = designer.i18n.tr('sky.space.upload-failed.version-published');
          break;
        default:
          body = designer.i18n.tr('sky.space.upload-failed.unknown', {status});
        }
        designer.notify(title, body, 'error');
      });
    }
  }
];
