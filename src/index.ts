declare var wx: any;

const ConcurrencyRequest = (): void => {
  console.log('hello');
};

// for commonjs es5 require
if (typeof module !== 'undefined' && module.exports && typeof wx === 'undefined') {
  module.exports = ConcurrencyRequest;
}

export default ConcurrencyRequest;
