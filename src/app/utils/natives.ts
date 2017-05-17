let isV8 = false;
try {
  eval('%HasFastSmiElements([])');
  isV8 = true;
} catch (ex) {}

interface FastObjectShape {
  [key: string]: number;
}

interface SlowObjectShape {
  [key: string]: number;
}

type ExpensiveFunction = (elem: any, i: number, arr: any[]) => void;


interface Callbacks {
  noop: Function;
  expensive: ExpensiveFunction;
}

const V8 = {
  HasFastSmiElements(arr: Array<any>): boolean {
    return !isV8 || eval('%HasFastSmiElements(arr)');
  },

  _IsSmi(n: number): boolean {
    return !isV8 || eval('%_IsSmi(n)');
  },

  HasComplexElements(arr: Array<any>): boolean {
    return !isV8 || eval('%HasComplexElements(arr)');
  },

  EstimateNumberOfElements(arr: Array<any>): number {
    return !isV8 || eval('%EstimateNumberOfElements(arr)');
  },

  HasFastProperties(obj: Object): boolean {
    return !isV8 || eval('%HasFastProperties(obj)');
  },

  // taken from V8 code
  UseSparseVariant(array: Array<any>, length: number, is_array: boolean , touched: number): boolean {
    // Only use the sparse variant on arrays that are likely to be sparse and the
    // number of elements touched in the operation is relatively small compared to
    // the overall size of the array.
    if (!is_array || length < 1000 || V8.HasComplexElements(array)) {
      return false;
    }
    if (!V8._IsSmi(length)) {
      return true;
    }
    const elements_threshold: number = length >> 2;  // No more than 75% holes
    const estimated_elements: number = eval('%EstimateNumberOfElements(array)');
    return (estimated_elements < elements_threshold) && (touched > estimated_elements * 4);
  }
};

export function assert(exp: boolean) {
  if (exp === false) {
    throw new Error('Lel man. V8 ist besser als du. Make sth funny.');
  }
}

export default V8;

export const helpers = {
  get callbacks(): Callbacks {
    return {
      noop() {
      },
      expensive(elem, i, arr) {
        return elem + i + arr + true + 'd' + 2.2 + {};
      },
    };
  },

  createFastArray(n = 10000): number[] {
    const arr = new Array(n);
    for (let i = 0; i < n; i += 1) {
      arr[i] = n;
    }

    assert(V8.HasFastSmiElements(arr));
    return arr;
  },

  createSparseArray(n = 10000): Array<number | undefined> {
    const arr = new Array(n);
    for (let i = 0; i < n; i += 1) {
      if (!(i % 5)) {
        arr[i] = i;
      }
    }

    assert(V8.UseSparseVariant(arr, arr.length, true, arr.length));
    return arr;
  },

  createFastObject(): FastObjectShape {
    const obj = {};

    for (let i = 0; i < 100; i += 1) {
      obj[i] = i;
    }

    assert(V8.HasFastProperties(obj));
    return obj;
  },

  createSlowObject() {
    const obj = { a: true };

    for (let i = 0; i < 100; i += 1) {
     obj[Math.random().toString(36)] = i;
    }

    delete obj.a;

    assert(!V8.HasFastProperties(obj));
    return obj;
  },
};
