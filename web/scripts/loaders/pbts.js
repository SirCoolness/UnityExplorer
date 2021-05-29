const pbts = require('protobufjs/cli/pbts');

module.exports = function (source) {
    return new Promise((resolve, reject) => {
        const srcListenData = [...process.stdin.listeners("data")]
        const srcListenEnd = [...process.stdin.listeners("end")]

        pbts.main(['-'],(err, output) => {
            if (err)
                reject(err);
            resolve(output, 4);
        });

        const curListenData = [...process.stdin.listeners("data")].filter(i => srcListenData.indexOf(i) === -1);
        const curListenEnd = [...process.stdin.listeners("end")].filter(i => srcListenEnd.indexOf(i) === -1);

        if (curListenData.length !== 1 || curListenEnd.length !== 1)
            throw new Error("Unexpected listeners");

        const dataCB = curListenData[0];
        const endCB = curListenEnd[0];

        dataCB(Buffer.alloc(source.length, source));
        endCB();
    })
}
