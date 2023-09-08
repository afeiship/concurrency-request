import ConcurrencyRequest from '../src';
import fetch from 'node-fetch';

const urls: string[] = [];
for (let i = 1; i <= 5; i++) {
  urls.push(`https://jsonplaceholder.typicode.com/todos/${i}`);
}

function request(opts, callback) {
  fetch(opts.data)
    .then((r) => r.json())
    .then((data) => {
      callback({ success: true, data });
    })
    .catch((data) => {
      callback({ success: false, data });
    });
}

describe('api.basic', () => {
  test('01/tasks lenght > max, results should be ok', () => {
    return ConcurrencyRequest.start(urls, { request, max: 3 }).then((result) => {
      expect(result.length).toBe(urls.length);
      expect(result[0].success).toBe(true);
      expect(result[0].data.id).toBe(1);
    });
  });

  test('02/tasks lenght < max, results should be ok', () => {
    return ConcurrencyRequest.start(urls.slice(0, 2), { request, max: 3 }).then((result) => {
      expect(result.length).toBe(urls.slice(0, 2).length);
      expect(result[0].success).toBe(true);
      expect(result[0].data.id).toBe(1);
    });
  });

  test('03/no tasks, results should be ok', () => {
    return ConcurrencyRequest.start([], { request, max: 3 }).then((result) => {
      expect(result.length).toBe(0);
    });
  });
});
