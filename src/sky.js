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
      const url = `${this.baseURL}/apis/${window.localStorage.spaceUser}/${apiSpec.info.title}`;
      $.ajax({
        type: 'POST',
        url,
        headers: {
          Authorization: window.localStorage.spaceToken
        },
        contentType: 'application/json',
        data: JSON.stringify(apiSpec)
      }).then(console.log).fail(console.error);
    }
  }
];
