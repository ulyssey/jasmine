getJasmineRequireObj().SpyStrategy = function() {

  function SpyStrategy(options) {
    options = options || {};

    var identity = options.name || 'unknown',
        originalFn = options.fn || function() {},
        getSpy = options.getSpy || function() {},
        test = false,
        plan = function() {},
        strategy = '';

    this.identity = function() {
      return identity;
    };

    this.exec = function() {
      var result;
      if (test){
        switch(strategy){
          case 'returnValue':
          case 'returnValues':
          case 'callFake':
            result = plan.apply(this, arguments);
            expect(originalFn.apply(this, arguments))
              .toEqual(result);
            break;

          case 'throwError':
            expect(function () {
              originalFn.apply(this, arguments);
            }).toThrowError();
            result = plan.apply(this, arguments);
            break;

          case 'stub':
          case 'callThrough':
            result = plan.apply(this, arguments);
        }
      }else{
        result = plan.apply(this, arguments);
      }
      return result;
    };

    this.callThrough = function() {
      plan = originalFn;
      strategy = 'callThrough';
      test = false;
      return getSpy();
    };

    this.returnValue = function(value) {
      plan = function() {
        return value;
      };
      strategy = 'returnValue';
      return getSpy();
    };

    this.returnValues = function() {
      var values = Array.prototype.slice.call(arguments);
      plan = function () {
        return values.shift();
      };
      strategy = 'returnValues';
      return getSpy();
    };

    this.throwError = function(something) {
      var error = (something instanceof Error) ? something : new Error(something);
      plan = function() {
        throw error;
      };
      strategy = 'throwError';
      return getSpy();
    };

    this.callFake = function(fn) {
      plan = fn;
      strategy = 'callFake';
      return getSpy();
    };

    this.stub = function(fn) {
      plan = function() {};
      strategy = 'stub';
      return getSpy();
    };

    this.compareToOriginalFn = function(value){
      test = !value ? true : value;
    };
  }

  return SpyStrategy;
};
