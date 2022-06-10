const setAsyncTimeout = async (callback, timeout) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            callback();
            resolve();
        }, timeout);
    });
};

const asyncFunc = async () => {
    console.log('async func');
};

const anotherAsyncFunc = async () => {
    console.log('another async func');
};

const realAsyncFunc = async () => {
    // await would make it synchronous
    console.log('real async func');
    await setAsyncTimeout(
        () => console.log('inside real async func setTimeout'),
        0,
    );
    queueMicrotask(() => {
        console.log('inside real async func queueMicrotask');
    });
};

const messyAsyncFunc = async () => {
    // await would not make it synchronous
    console.log('messy async func');
    setTimeout(() => {
        console.log('inside messy async func setTimeout');
    }, 0);
    queueMicrotask(() => {
        console.log('inside messy async func queueMicrotask');
    });
};

const run1 = async () => {
    console.log('run');
    asyncFunc();
    await realAsyncFunc();
    await messyAsyncFunc();
    anotherAsyncFunc();
    console.log('run done');
};

const run2 = async () => {
    console.log('run');
    asyncFunc();
    realAsyncFunc();
    messyAsyncFunc();
    anotherAsyncFunc();
    console.log('run done');
};

const run = async () => {
    // await run1();
    // console.log('-----------');
    await run2();
};

run();
