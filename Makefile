scss=./node_modules/.bin/node-sass

scss:
	$(scss) --source-map-embed --output-style expanded --indent-type tab index.scss > index.css
