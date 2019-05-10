[![npm version](https://badge.fury.io/js/vue-slate-tools.svg)](https://badge.fury.io/js/vue-slate-tools)

# vue-slate-tools

### ⚠️ **DO NOT INSTALL THIS PACKAGE** ⚠️

There is **NO further documentation** for this package besides what is provided below.

## Create the "Backend"

In order for this setup to be of any use, you have to connect to your shop's frontend via a public Shopify App ([I followed this tutorial](https://help.shopify.com/en/api/tutorials/build-a-shopify-app-with-node-and-express)). This will serve as your "backend", a proxy for Shopify's REST API.

The following environment variables (see below) will be injected into your frontend via `vue-slate-tools`'s webpack build.

```
SHOPIFY_APP_HOST=
SHOPIFY_APP_SHOP=
SHOPIFY_THEME_ID=
```

Use them in your frontend like so:

```javascript
import axios from 'axios'

const {
  SHOPIFY_APP_HOST: shopifyAppHost,
  SHOPIFY_APP_SHOP: shopifyAppShop,
  SHOPIFY_THEME_ID: shopifyThemeId,
} = process.env

axios.get(`${shopifyAppHost}/shopify?shop=${shopifyAppShop}.myshopify.com`)

// now, make calls to your Shopify App to get JSON from your store
```

## Create the Frontend

- Install [`vue-cli` v2](https://github.com/vuejs/vue-cli/tree/v2)

```bash
$ yarn global add vue-cli
```

- Init a project

```bash
$ vue init webpack $PROJECT_NAME
```

- Delete the `node_modules` directory. You can also delete the `build` directory and `index.html` in the project root (`vue-slate-tools` will be building your project using a custom template)

- Edit your `package.json`'s `devDependencies` to the following and install

```json
{
  "devDependencies": {
    "@babel/core": "^7.4.4",
    "@babel/plugin-transform-runtime": "^7.4.4",
    "@babel/preset-env": "^7.4.4",
    "@babel/runtime": "^7.4.4",
    "babel-core": "^7.0.0-bridge.0",
    "babel-loader": "^8.0.5"
  },
}

```

```bash
$ yarn install
```

- Install this package, `vue-slate-tools`, as a dev dependency

```bash
$ yarn add --dev vue-slate-tools
```

## Customization

- Edit your `package.json` `scripts` to accommodate for slate

```json
{
  "scripts": {
    "start": "slate-tools start",
    "watch": "slate-tools start --skipFirstDeploy",
    "build": "slate-tools build",
    "upload": "slate-tools deploy",
    "deploy": "slate-tools build && slate-tools deploy",
    "zip": "slate-tools build && slate-tools zip"
  },
}
```

- Download the contents of the [`liquid` directory](https://github.com/ezracelli/slate-tools/tree/master/liquid) to `src/liquid` in your project

- Create an `.env` file in your project's root directory with the normal Slate environment variables

```
SLATE_STORE=
SLATE_PASSWORD=
SLATE_THEME_ID=
SLATE_IGNORE_FILES=
```

> _Note:_ Your project's file structure should now look like this:
> ```
> $PROJECT_NAME
> │     ...
> │     .env
> │
> └─── src
>     │     App.vue
>     │     main.js
>    ...
>     └─── liquid
> 
> ```

- Add to your `.env` your Shopify App URL (see above) shop name (**without** `.myshopify.com`), and theme ID
```
SHOPIFY_APP_HOST=
SHOPIFY_APP_SHOP=
SHOPIFY_THEME_ID=
```

- Create a local SSL cert for local development (instructions at [https://github.com/Shopify/slate/wiki/4.-Create-a-self-signed-SSL-certificate](https://github.com/Shopify/slate/wiki/4.-Create-a-self-signed-SSL-certificate))

- Start it up via the scripts defined earlier in the updated `package.json`!&emsp;🎉
