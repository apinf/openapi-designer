export class App {
  constructor() {
    // Allow access from browser console
    window.$oai = this;
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Open API designer';
    config.map([
      { route: '', redirect: 'header'},
      { route: 'header', name: 'header', moduleId: 'forms/header', nav: true },
      { route: 'mime', name: 'mime', moduleId: 'forms/mime', nav: true },
      { route: 'security', name: 'security', moduleId: 'forms/security', nav: true },
      { route: 'tags', name: 'tags', moduleId: 'forms/tags', nav: true },
      { route: 'paths', name: 'paths', moduleId: 'forms/paths', nav: true },
      { route: 'types', name: 'types', moduleId: 'forms/types', nav: true }
    ]);
  }
}
