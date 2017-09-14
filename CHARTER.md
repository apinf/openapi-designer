# Open API designer project charter

## Objective
The goal is to have an OpenAPI design tool that can be integrated with APInf platform and storage backends.

## Risks
* Misalignment with business or community goals
* Failure to execute or prioritize properly
* Miscommunication of project intent or scope

## Value proposition
User can create and edit OpenAPI documents without knowing the specification or being familiar with JSON or YAML. User is guided by user interface elements such as hints in form fields and mandatory fields as well as the user flow.

## Scope
* Experimental support for OpenAPI specification version 3.0
* Info texts where needed, needs should be determined via testing
* Support editing/loading existing documents from any web-accessible location
* Support better UI integration with other platforms, as a package (npm, bower) or custom element.
* Publish the package in NPM or other such platform
* Try implementing testing with aurelia testing solutions.

## Out of scope
* Dynamic validation of the output with 3rd party solutions
* Uploading to any other servers except Open API space

## Stakeholders
* APInf API management platform and company
* Open source community, particularly people who are focused with API development and design.
