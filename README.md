# concurrency-request
> An efficiently handles asynchronous data requests with customizable concurrency limit.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install @jswork/concurrency-request
```

## usage
```js
import ConcurrencyRequest from '@jswork/concurrency-request';

const urls = [];
for (let i = 1; i <= 10; i++) {
  urls.push(`https://jsonplaceholder.typicode.com/todos/${i}`);
}

ConcurrencyRequest.start(urls, 3).then((res) => {
  console.log("res: ", res);
});
```

## license
Code released under [the MIT license](https://github.com/afeiship/concurrency-request/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/concurrency-request
[version-url]: https://npmjs.org/package/@jswork/concurrency-request

[license-image]: https://img.shields.io/npm/l/@jswork/concurrency-request
[license-url]: https://github.com/afeiship/concurrency-request/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/concurrency-request
[size-url]: https://github.com/afeiship/concurrency-request/blob/master/dist/index.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/concurrency-request
[download-url]: https://www.npmjs.com/package/@jswork/concurrency-request
