declare var wx: any;

export type ConcurrencyRequestCallback = (res: any) => void;
export type ConcurrencyRequestResolve = (res: any[]) => void;
export interface ConcurrencyRequestOptions {
  max?: number;
  request: (options, callback: ConcurrencyRequestCallback) => void;
}

const defaults: Omit<ConcurrencyRequestOptions, 'request'> = {
  max: 10,
};

class ConcurrencyRequest {
  /* --- config --- */
  private dataList: any[];
  private options: ConcurrencyRequestOptions;

  /* --- core data --- */
  private result: any[];
  private restPool: any[];
  private workPool: any[];

  get tasks() {
    return this.dataList.map((data, index) => {
      return {
        index,
        data,
      };
    });
  }

  static start(inDataList: any[], inOptions: ConcurrencyRequestOptions) {
    const inst = new ConcurrencyRequest(inDataList, inOptions);
    if (!inDataList.length) return Promise.resolve([]);
    return new Promise((resolve: ConcurrencyRequestResolve) => {
      inst.init();
      inst.listen(resolve);
    });
  }

  constructor(inDataList: any[], inOptions: ConcurrencyRequestOptions) {
    this.dataList = inDataList || [];
    this.options = Object.assign({}, defaults, inOptions);
    this.result = [];
    this.restPool = this.tasks.slice(this.options.max);
    this.workPool = this.tasks.slice(0, this.options.max);
  }

  init() {
    this.workPool.forEach((task) => this.process(task, this.next));
  }

  process(task, callback) {
    this.options.request(task, (res) => {
      this.result[task.index] = res;
      callback();
    });
  }

  listen(callback) {
    const timerId = setInterval(() => {
      const done = this.result.filter(Boolean).length === this.tasks.length;
      if (done) {
        clearInterval(timerId);
        callback(this.result);
      }
    }, 100);
  }

  next = () => {
    const task = this.restPool.shift();
    if (task) this.process(task, this.next);
  };
}

// for commonjs es5 require
if (typeof module !== 'undefined' && module.exports && typeof wx === 'undefined') {
  module.exports = ConcurrencyRequest;
}

export default ConcurrencyRequest;
