OpenAPI Designer
* Javascript webapp
  * [Aurelia](http://aurelia.io/) handles all UI-related things
    * Aurelia I18n / I18next used for internationalization.
  * Rich preview provided by [Swagger UI](https://swagger.io/swagger-ui/)
  * In-page popups/notifications/dialogs provided by [PNotify](https://sciactive.github.io/pnotify/)
  * Currently we're also using jQuery for some things, though we could probably replace it with [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and VanillaJS DOM manipulation.
* Integrates into [OpenAPI space](https://github.com/apinf/openapi-space) using its [REST API](https://openapi.space)
* APInf platform integration is handled through OpenAPI space.
