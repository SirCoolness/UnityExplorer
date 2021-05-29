const pbts = require('protobufjs/cli/pbts');
const indentString = require('indent-string');

module.exports = function (source)
{
    var callback = this.async();

    const srcListenData = [...process.stdin.listeners("data")]
    const srcListenEnd = [...process.stdin.listeners("end")]

    pbts.main(['-'],(err, output) => {
        console.log(indentString(output, 4))
        callback(null, indentString(output, 4));
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
