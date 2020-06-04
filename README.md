[![Coverage Status](https://coveralls.io/repos/github/mako-tos/gatsby-transformer-for-microcms/badge.svg?branch=master)](https://coveralls.io/github/mako-tos/gatsby-transformer-for-microcms?branch=master)

# gatsby-transformer-for-microcms

## Install

```sh
```

## How to use

### gatsby-config.js

You need setting options in `gatsby-config.js`.

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-transformer-for-microcms',
      options: {
        mediaType: 'MicrocmsBlog', // string
        field: 'body', // string
        useHljs: true, // boolean
      },
    },
  ],
};
```

### gatsby-node.js

You can query like the following. .

```js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(
    `
      {
        allMicrocmsBlog(sort: { fields: [createdAt], order: DESC }) {
          edges {
            node {
              id
              createdAt
              childConvertHtml {
                html
                plainText
                convertedHtml
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }

  result.data.allMicrocmsBlog.edges.forEach((post, index) => {
    createPage({
      path: post.node.id,
      component: path.resolve('./src/templates/blog-post.js'),
      context: {
        slug: post.node.id,
        body: post.node.childConvertHtml.convertedHtml,
        digest: post.node.childConvertHtml.plainText,
      },
    });
  });
};
```

### Options

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-transformer-for-microcms',
      options: {
        /**
         * Target GraphQL Table Name (Required)
         *
         * Type: string.
         * default: undefined,
         **/
        mediaType: 'MicrocmsBlog',

        /**
         * Table's html field Name (Required)
         *
         * Type: string.
         * default: undefined,
         **/
        field: 'body',

        /**
         * If you want to use Highlight.js set true (Optional)
         *
         * Type: boolean.
         * default: false.
         **/
        useHljs: true,

        /**
         * If you want to update img tags set up (Optional)
         *
         * Type: object.
         **/
        image: {
          /**
           * If you want to set img tag's sizes set true (Optional)
           *
           * Type: string.
           * default: '(max-width: 800px) 80vw, 800px'.
           **/
          sizes: '80vw',

          /**
           * If you want to set img tag's loading set true (Optional)
           *
           * Type: string.
           * default: 'lazy'.
           **/
          loading: 'auto',
        },
      },
    },
  ],
};
```
