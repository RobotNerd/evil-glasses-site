# Evil Glasses site

The code for the [evilglasses.com](https://evilglasses.com) site. Built with sveltekit.

## Developing

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

```bash
npm run build
```

You can preview the production build with `npm run preview`.

It uses `@sveltejs/adapter-static` to allow it to be served as a static site by github pages.

## Deploying

The gh-pages npm package is used for deployment. It copies all build
artifacts to a gh-pages branch and pushes that branch to github. Run
this command to deploy.

```bash
npm run deploy
```

