# HTTP Request Generator

This is deployed at https://requestgenerator.com/

Use this to generate a lot of requests with different payload formats and bodies, for use in either network monitoring or for HAR exports.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

There is a catch all API route implemented in `pages/api/[...path].ts`. You can add new response formats or handle the path/payload there.
