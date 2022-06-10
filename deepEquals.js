const deepEquals = (data1, data2) => {
    if (data1 === null || data2 === null) return data1 === data2;
    else if (data1 === data2) return true;
    else if (typeof data1 !== 'object' || typeof data2 !== 'object') {
        const isDataOneNaN = isNaN(data1) && typeof data1 === 'number';
        const isDataTwoNaN = isNaN(data2) && typeof data2 === 'number';
        return isDataOneNaN && isDataTwoNaN;
    }

    if (Array.isArray(data1) && Array.isArray(data2)) {
        if (data1.length !== data2.length) return false;
        for (let index = 0; index < data1.length; index++) {
            if (!deepEquals(data1[index], data2[index])) return false;
        }
    }
    else if (Array.isArray(data1) || Array.isArray(data2)) {
        return false;
    }
    else {
        const keys1 = Object.keys(data1).sort(), keys2 = Object.keys(data2).sort();
        if (!deepEquals(keys1, keys2)) return false;
        for (let key in data1) {
            if (!deepEquals(data1[key], data2[key])) return false;
        }
    }

    return true;
};

const longArray = new Array(1000000).fill(1);

const testcases = [
    {
        data1: {
            a: 1,
            b: [
                { abc: '1' }
            ],
            c: {
                d: ["abc", 5]
            }
        },
        data2: {
            a: 1,
            b: [
                { abc: '1' }
            ],
            c: {
                d: ["abc", 5]
            }
        },
        expectedResult: true,
    },
    {
        data1: { abc: '1' },
        data2: { abc: '1' },
        expectedResult: true,
    },
    {
        data1: {
            a: 1,
            b: [
                { abc: '1' }
            ],
            c: {
                d: ["abc", 5]
            }
        },
        data2: {
            a: 1,
            b: [
                { abc: '1' }
            ],
            c: {
                d: ["abc", 6]
            }
        },
        expectedResult: false
    },
    {
        data1: {
            a: 1,
            b: [
                { abc: '1' }
            ],
            c: {
                d: ["abc", 5]
            }
        },
        data2: {
            a: 1,
            b: [
                { abc: '1' }
            ],
            d: {
                d: ["abc", 5]
            }
        },
        expectedResult: false,
    },
    {
        data1: 1,
        data2: 1,
        expectedResult: true,
    },
    {
        data1: 'a',
        data2: 'a',
        expectedResult: true,
    },
    {
        data1: NaN,
        data2: NaN,
        expectedResult: true,
    },
    {
        data1: [],
        data2: [],
        expectedResult: true,
    },
    {
        data1: [1, 2],
        data2: [1, 3],
        expectedResult: false,
    },
    {
        data1: [1, { a: 2 }],
        data2: [1, { a: 2 }],
        expectedResult: true,
    },
    {
        data1: [1, { a: 2 }],
        data2: [1, { a: 2, b: 5 }],
        expectedResult: false,
    },
    {
        data1: null,
        data2: null,
        expectedResult: true,
    },
    {
        data1: null,
        data2: undefined,
        expectedResult: false,
    },
    {
        data1: undefined,
        data2: undefined,
        expectedResult: true,
    },
    {
        data1: {
            key1: 1,
            key2: 2,
            key3: 3,
        },
        data2: {
            key2: 2,
            key1: 1,
            key3: 3,
        },
        expectedResult: true,
    },
    {
        data1: [],
        data2: {},
        expectedResult: false,
    },
    {
        data1: longArray,
        data2: longArray,
        expectedResult: true,
    },
    {
        data1: true,
        data2: true,
        expectedResult: true,
    },
    {
        data1: true,
        data2: false,
        expectedResult: false,
    },
    {
        data1: 'a',
        data2: 'ab',
        expectedResult: false,
    },
    {
        data1: {
            a: undefined,
            b: 2,
        },
        data2: {
            b: 2,
            c: 3,
        },
        expectedResult: false,
    },
    {
        data1: {
            a: undefined,
            b: 2,
        },
        data2: {
            b: 2,
        },
        expectedResult: false,
    }
];

testcases.forEach((testcase, index) => {
    console.log(`Processing testcase #${index}`);
    if (deepEquals(testcase.data1, testcase.data2) !== testcase.expectedResult) {
        throw new Error(
            `deepEquals(${JSON.stringify(testcase.data1)}, ${JSON.stringify(testcase.data2)}) !== ${testcase.expectedResult}`
        );
    }
});
