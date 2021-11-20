# gdocs-site: CONTRIBUTE

= [ [README](./README.md) ] . [ [INSTALL](./INSTALL.md) ]  . [ [RUN](./RUN.md) ] . [ **[CONTRIBUTE](./CONTRIBUTE.md)** ] =

Nice that you'd like to contribute to this project!

If you've any questions, please share these in the [Issues](https://github.com/bartwr/gdocs-site/issues), on Discord or via [mail@bartroorda.nl](mailto:mail@bartroorda.nl?subject=gdocs-site).

## Code structure

In the `client` folder, you find the main HTML file and CSS file for the web app.

- [main.html](https://github.com/bartwr/gdocs-site/blob/main/client/main.html)
- [main.css](https://github.com/bartwr/gdocs-site/blob/main/client/main.css)

In `lib/router.jsx` you find the router.

- [router.jsx](https://github.com/bartwr/gdocs-site/blob/main/lib/router.jsx)

In `imports/ui` you'll find all client side UI.

- [imports/ui](https://github.com/bartwr/gdocs-site/blob/main/imports/ui)

In `imports/ui/styling/stylesheets/App.css` you'll find the global app styles

- [imports/ui/styling/stylesheets/App.css](https://github.com/bartwr/gdocs-site/blob/main/imports/ui/styling/stylesheets/App.css)

At this moment the app exists of two components: **Navigation** and **Doc**.

- [Update Navigation.jsx HTML](https://github.com/bartwr/gdocs-site/blob/main/imports/ui/components/Navigation/Navigation.jsx#L29)
- [Update Navigation.jsx CSS](https://github.com/bartwr/gdocs-site/blob/main/imports/ui/components/Navigation/Navigation.css)

- [Update Doc.jsx HTML](https://github.com/bartwr/gdocs-site/blob/main/imports/ui/components/Doc/Doc.jsx#L76)

## Styling

The global app styles can be configured in `/imports/ui/styling/stylesheets`. 

The project uses `gulp` to compile SCSS-styling to CSS.

## Closing words

Feel free to improve / change anything you'd like. Make it your project.
