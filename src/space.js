import $ from 'jquery';

export const BASE_URL = 'https://openapi.space/api/v1';
let pendingUpload = undefined;

export function login(username, password, mode = 'normal') {
  let url = `${BASE_URL}/auth/login`;
  let payload = JSON.stringify({ username, password });
  if (mode !== 'normal') {
    url = `${url}/${mode}`;
  }
  if (mode === 'apinf_token') {
    payload = JSON.stringify({ user_id: username, auth_token: password });
  }
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    data: payload,
    url
  }).then(data => {
    window.localStorage.spaceToken = data.token;
    window.localStorage.spaceUser = data.username;
    this.spaceLoginModal.close();
    if (pendingUpload) {
      pendingUpload();
      pendingUpload = undefined;
    }
  }).fail(({status}) => {
    pendingUpload = undefined;
    const title = this.i18n.tr('notify.space-login-failed.title');
    let body;
    switch (status) {
    case 404:
      body = this.i18n.tr('notify.space-login-failed.incorrect-username');
      break;
    case 401:
      body = this.i18n.tr('notify.space-login-failed.incorrect-password');
      break;
    default:
      body = this.i18n.tr('notify.space-login-failed.unknown-error', {status});
    }
    this.notify(title, body, 'error');
  });
}

window.addEventListener('message', ({data}) => {
  if (data.apinfToken && data.apinfUserID) {
    window.localStorage.apinfToken = data.apinfToken;
    window.localStorage.apinfUserID = data.apinfUserID;
  }
}, false);

function tryApinfTokenLogin(designer, callback) {
  if (window.localStorage.apinfToken && window.localStorage.apinfUserID) {
    login(window.localStorage.apinfUserID, window.localStorage.apinfToken, 'apinf_token');
    pendingUpload = callback;
    return true;
  }
  return false;
}

function checkAuth(designer, callback) {
  if (!window.localStorage.spaceToken) {
    if (tryApinfTokenLogin(designer, callback)) {
      // Token was found, but login is not yet complete: don't open login modal
      // but don't return successfully.
      return false;
    }
    designer.spaceLoginModal.open();
    pendingUpload = callback;
    return false;
  }
  return true;
}

function titleExists(apiSpec, designer) {
  if (!apiSpec || !apiSpec.info || !apiSpec.info.title) {
    const title = designer.i18n.tr('sky.space.upload-failed.title');
    const body = designer.i18n.tr('sky.space.upload-failed.missing-title');
    designer.notify(title, body, 'error');
    return false;
  }
  return true;
}

export function upload(apiSpec, designer) {
  if (!checkAuth(designer, () => upload(apiSpec, designer))) {
    return;
  } else if (!titleExists(apiSpec, designer)) {
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
