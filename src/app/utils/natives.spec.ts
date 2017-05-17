import V8, { assert, helpers } from './natives';

describe('Natives', () => {
  it('assert throws on unmet condition', () => {
    expect(function () {
      assert(false);
    }).toThrow();
  });

  it('assert proceeds met condition correctly', () => {
    expect(assert(true)).toBeUndefined();
  });

  it('UseSparseVariant works as expected', () => {
    expect(V8.UseSparseVariant([2], 1, true, 1)).toBe(false);
    {
      const arr = new Array(10000);
      for (let i = 0; i < 10000; i += 1) {
        if (!(i % 5)) {
          arr[i] = i;
        }
      }

      expect(V8.UseSparseVariant(arr, arr.length, true, arr.length)).toBe(true);
    }
    {
      const arr = [];
      arr.length = 2 ** 31;
      expect(V8.UseSparseVariant(arr, arr.length, true, arr.length)).toBe(true);
    }
  });

  it('EstimateNumberOfElements works', () => {
    expect(V8.EstimateNumberOfElements([2, 4, 5])).toBe(3);
  });
});

describe('Natives helpers', () => {
  it('should create fast array', () => {
    let arr = [];
    expect(function () {
      arr = helpers.createFastArray(20000);
    }).not.toThrow();
    expect(arr.length).toBe(20000);
  });

  it('should create sparse array', () => {
    let arr = [];
    expect(function () {
      arr = helpers.createSparseArray(20000);
    }).not.toThrow();
    expect(arr.length).toBe(20000);
  });

  it('should create fast object', () => {
    expect(function () {
      helpers.createFastObject();
    }).not.toThrow();
  });

  it('should create slow object', () => {
    expect(function () {
      helpers.createSlowObject();
    }).not.toThrow();
  });

  it('should always return new callbacks', () => {
    expect(helpers.callbacks).not.toBe(helpers.callbacks);
    expect(function () {
      const { noop, expensive } = helpers.callbacks;
      noop();
      expensive('test', 0, ['test']);
      expensive(2, 1, ['test', 2]);
      expensive(function () {}, 1, ['test', function(){}]);
    }).not.toThrow();
  });
});
