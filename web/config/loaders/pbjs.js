const pbjs = require('protobufjs/cli/pbjs');

module.exports = function (source) {
    var callback = this.async();

    const srcListenData = [...process.stdin.listeners("data")]
    const srcListenEnd = [...process.stdin.listeners("end")]

    pbjs.main(['-t', 'static-module', '-w', 'commonjs', '-'],(err, output) => {
        if (err)
            callback(err);
        callback(null, output)
    });

    const curListenData = [...process.stdin.listeners("data")].filter(i => srcListenData.indexOf(i) === -1);
    const curListenEnd = [...process.stdin.listeners("end")].filter(i => srcListenEnd.indexOf(i) === -1);

    if (curListenData.length !== 1 || curListenEnd.length !== 1)
        throw new Error("Unexpected listeners");

    const dataCB = curListenData[0];
    const endCB = curListenEnd[0];

    dataCB(Buffer.alloc(source.length, source));
    endCB();
}
