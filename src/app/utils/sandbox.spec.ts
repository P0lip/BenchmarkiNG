import sandbox from './sandbox';

describe('Sandbox', () => {
  it('evaluates function', () => {
    expect(sandbox('return [2,3]')).toEqual([2, 3]);
  });

  it('strips correctly', () => {
    expect(sandbox(';;;;; return 2')).toBe(2);
    expect(sandbox('\n\rreturn 2')).toBe(2);
    expect(sandbox('\nreturn 2')).toBe(2);
    expect(sandbox('\nreturn 2\n')).toBe(2);
  });

  it('has access to known window props', () => {
    expect(sandbox('return console.log')).toBeDefined();
  });

  it('has sandboxed env', () => {
    let test = 2;
    expect(() => sandbox('test')).toThrow();
  });

  it('accepts custom context', () => {
    expect(() => sandbox('test', { test: 2 })).not.toThrow();
  });

  it('handles new lines', () => {
    expect(() => sandbox('[];\nx')).toThrow();
  });
});
