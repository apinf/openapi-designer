import 'babel-polyfill';
import environment from './environment';
import Backend from 'i18next-xhr-backend';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-i18n', (instance) => {
      TCustomAttribute.configureAliases(['t']);

      instance.i18next.use(Backend.with(aurelia.loader));

      return instance.setup({
        backend: {
          loadPath: './lang/{{lng}}.json'
        },
        attributes: aliases,
        lng: 'fi',
        fallbackLng: 'en',
        debug: environment.debug
      });
    });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
