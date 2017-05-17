(function (exports) {
'use strict';

let isV8 = false;
try {
    eval('%HasFastSmiElements([])');
    isV8 = true;
}
catch (ex) { }
const V8 = {
    HasFastSmiElements(arr) {
        return !isV8 || eval('%HasFastSmiElements(arr)');
    },
    _IsSmi(n) {
        return !isV8 || eval('%_IsSmi(n)');
    },
    HasComplexElements(arr) {
        return !isV8 || eval('%HasComplexElements(arr)');
    },
    EstimateNumberOfElements(arr) {
        return !isV8 || eval('%EstimateNumberOfElements(arr)');
    },
    HasFastProperties(obj) {
        return !isV8 || eval('%HasFastProperties(obj)');
    },
    // taken from V8 code
    UseSparseVariant(array, length, is_array, touched) {
        // Only use the sparse variant on arrays that are likely to be sparse and the
        // number of elements touched in the operation is relatively small compared to
        // the overall size of the array.
        if (!is_array || length < 1000 || V8.HasComplexElements(array)) {
            return false;
        }
        if (!V8._IsSmi(length)) {
            return true;
        }
        const elements_threshold = length >> 2; // No more than 75% holes
        const estimated_elements = eval('%EstimateNumberOfElements(array)');
        return (estimated_elements < elements_threshold) && (touched > estimated_elements * 4);
    }
};
function assert(exp) {
    if (exp === false) {
        throw new Error('Lel man. V8 ist besser als du. Make sth funny.');
    }
}
const helpers = {
    get callbacks() {
        return {
            noop() {
            },
            expensive(elem, i, arr) {
                return elem + i + arr + true + 'd' + 2.2 + {};
            },
        };
    },
    createFastArray(n = 10000) {
        const arr = new Array(n);
        for (let i = 0; i < n; i += 1) {
            arr[i] = n;
        }
        assert(V8.HasFastSmiElements(arr));
        return arr;
    },
    createSparseArray(n = 10000) {
        const arr = new Array(n);
        for (let i = 0; i < n; i += 1) {
            if (!(i % 5)) {
                arr[i] = i;
            }
        }
        assert(V8.UseSparseVariant(arr, arr.length, true, arr.length));
        return arr;
    },
    createFastObject() {
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

exports.assert = assert;
exports['default'] = V8;
exports.helpers = helpers;

}((this.natives = this.natives || {})));
