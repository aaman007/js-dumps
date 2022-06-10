import fetch from 'node-fetch';

const promiseAll = (promises) => {
    const results = [];
    let count = 0;
    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
            promise
                .then(result => {
                    results[index] = result;
                    count += 1;
                    if (count === promises.length) {
                        resolve(results);
                    }
                })
                .catch(reject)
        });
    });
};

const run = async () => {
    // const results = await promiseAll([
    //     fetch('https://jsonplaceholder.typicode.com/posts/1'),
    //     fetch('https://jsonplaceholder.typicode.com/posts/2'),
    //     fetch('https://jsonplaceholder.typicode.com/posts/3'),
    //     fetch('https://jsonplaceholder.typicode.com/posts/4'),
    //     new Promise((resolve) => setTimeout(resolve, 5000)),
    //     new Promise((resolve) => setTimeout(resolve, 5000))
    // ]);

    try {
        const results = await promiseAll([
            Promise.resolve(2),
            Promise.reject('Error with something'),
            Promise.resolve(3),
        ]);
        console.log(results);
    }
    catch (err) {
        console.log(err);
    }

};

run();
