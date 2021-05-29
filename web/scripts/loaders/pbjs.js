const pbjs = require('protobufjs/cli/pbjs');

module.exports = function (source) {
    return new Promise((resolve, reject) => {
        const srcListenData = [...process.stdin.listeners("data")]
        const srcListenEnd = [...process.stdin.listeners("end")]

        pbjs.main(['-t', 'json', '-w', 'commonjs', '-'],(err, output) => {
            console.log(output)
            if (err)
                reject(err);
            resolve(output);
        });

        const curListenData = [...process.stdin.listeners("data")].filter(i => srcListenData.indexOf(i) === -1);
        const curListenEnd = [...process.stdin.listeners("end")].filter(i => srcListenEnd.indexOf(i) === -1);

        if (curListenData.length !== 1 || curListenEnd.length !== 1)
            throw new Error("Unexpected listeners");

        const dataCB = curListenData[0];
        const endCB = curListenEnd[0];

        dataCB(source);
        endCB();
    })
}
