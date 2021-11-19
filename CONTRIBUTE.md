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

In `imports/ui/App.css` you'll find the global app styles

- [imports/ui/App.css](https://github.com/bartwr/gdocs-site/blob/main/imports/ui/App.css)

At this moment the app exists of two components: **Navigation** and **Doc**.

- [Update Navigation.jsx HTML](https://github.com/bartwr/gdocs-site/blob/main/imports/ui/components/Navigation/Navigation.jsx#L29)
- [Update Navigation.jsx CSS](https://github.com/bartwr/gdocs-site/blob/main/imports/ui/components/Navigation/Navigation.css)

- [Update Doc.jsx HTML](https://github.com/bartwr/gdocs-site/blob/main/imports/ui/components/Doc/Doc.jsx#L76)

## Styling

The global app styles can be configured in `/imports/ui/App.css`.

Styles for a specific components like the Navigation component can be edited in the same folder as the component, in example `/imports/ui/imports/Navigation/Navigation.css`.

As you can see [in index.html](https://github.com/bartwr/gdocs-site/blob/main/client/main.html#L9) we link [Tailwind](https://tailwindcss.com/), which is a nice CSS library. You can for example add the class 'text-white' to give text a white color. 

NOTE: When using HTML in React, you need to use `className=""`, not `class=""`. Example:
- Correct: `<a className="inline-block underline bg-aqua px-2" />`
- Incorrect: `<a class="inline-block underline bg-aqua px-2" />`

## Closing words

Feel free to improve / change anything you'd like. Make it your project.
