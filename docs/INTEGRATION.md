# Integrating OpenAPI designer
All communication to and from the designer when integrating happens through [`postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).
The examples here assume you have OpenAPI designer in an `iframe`, but `postMessage` is can also be used when you open the designer into a new tab/window.

## APInf login
To make the designer automatically log into OpenAPI space with APInf platform credentials, simply send an object with `apinfUserID` and `apinfToken`.

[Demo site](https://dev.openapi.design/iframe.html), example usage:
```js
const iframe = document.getElementById("designer-iframe")
const designer = iframe.contentWindow
...
designer.postMessage({
  apinfUserID: "xxxxxxxxxxxxxxxxx",
  apinfToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
})
```

## Sending Swagger documents
Currently, you can only send raw Swagger data. Sending links will be supported in the future.
To send raw Swagger data, the `postMessage` object needs to contain the field `swagger` with the Swagger data. Optionally, it can also have the field `noDelete` to tell the designer not to delete all existing data when importing the new data.

Example usage:
```js
const iframe = document.getElementById("designer-iframe")
const designer = iframe.contentWindow
...
const swagger = {
  swagger: "2.0",
  info: {
    title: "Petstore API",
    version: "1.0.0"
  },
  basePath: "/api/v1"
}

designer.postMessage({
  swagger,
  noDelete: true
})
```

Display the editor using `iframe`

`<iframe id="iframe" width="1200" height="800" src="https://dev.openapi.design/master"></iframe>`
