declare var wx: any;

// 这些 type exprot 的时候，如果导出 umd 会导致 umd 包2层，所以这里不导出
type ConcurrencyRequestCallback = (res: any) => void;
type ConcurrencyRequestResolve = (res: any[]) => void;
interface ConcurrencyRequestTask {
  index: number;
  data: any;
}
interface ConcurrencyRequestOptions {
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
  private restPool: ConcurrencyRequestTask[];
  private workPool: ConcurrencyRequestTask[];

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

  process(inTask: ConcurrencyRequestTask, callback) {
    this.options.request(inTask, (res) => {
      this.result[inTask.index] = res;
      callback();
    });
  }

  listen(inCallback: ConcurrencyRequestCallback) {
    const timerId = setInterval(() => {
      const done = this.result.filter(Boolean).length === this.tasks.length;
      if (done) {
        clearInterval(timerId);
        inCallback(this.result);
      }
    }, 100);
  }

  next = () => {
    const task = this.restPool.shift();
    if (task) this.process(task, this.next);
  };
}

// ---- UMD DELETE ME ----
// for commonjs es5 require
if (typeof module !== 'undefined' && module.exports && typeof wx === 'undefined') {
  module.exports = ConcurrencyRequest;
}

export default ConcurrencyRequest;
