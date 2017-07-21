# Integrating OpenAPI designer into an iframe

Create an iframe and put an instance of OpenAPI designer into it.
Example code `<iframe id="iframe" width="1200" height="800" src="https://dev.openapi.design/master"></iframe>`

For integrating authentication, send an username and authtoken from a service supported by OpenAPI space authentication into the OpenAPI designer inside the iframe (currently only the Apinf platform is supported).
They can be sent into an iframe using `window.postMessage()` [docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
Example function that passes the apinf username and apinf authtoken from the document object into the iframe when called, if they are available in the document with the id's used in the function.

`
function sendtoken() {
   const iframe = document.getElementById("iframe").contentWindow
   iframe.postMessage({
     apinfUserID: document.getElementById("userid").value,
     apinfToken: document.getElementById("authtoken").value
   }, "*")
}
`


## Example
https://dev.openapi.design/iframe.html
