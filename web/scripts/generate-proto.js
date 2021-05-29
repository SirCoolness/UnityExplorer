const glob = require('glob')
const path = require('path');
const fs = require('fs');

const pbjsLoader = require('./loaders/pbjs');
const pbtsLoader = require('./loaders/pbts');

const protodir = path.resolve(__dirname, "..", "..", "web_protocol");
const entryFiles = Object.values(glob.sync(protodir+'/**/*.proto').reduce((previousValue, currentValue, currentIndex, array) => {
    return typeof previousValue === 'string' ?
        {
            [path.basename(previousValue, path.extname(previousValue))]: previousValue,
            [path.basename(currentValue, path.extname(currentValue))]: currentValue
        }
        :
        { ...previousValue, [path.basename(currentValue, path.extname(currentValue))]: currentValue }
}));

(async () => {
    const outputDir = path.resolve(__dirname, "..", "src", "generated");
    if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });

    for (const spath of entryFiles) {
        const contents = fs.readFileSync(spath);
        const js = await pbjsLoader(contents);
        const ts = await pbtsLoader(js);

        const baseName = path.basename(spath).split('.').slice(0, -1).join('.')
        const relPath = path.dirname(path.relative(protodir, spath));
        const outputDirRel = path.resolve(outputDir, relPath);
        const outputFile = path.resolve(outputDirRel, baseName)
        if (!fs.existsSync(outputDirRel))
            fs.mkdirSync(outputDirRel, { recursive: true });

        fs.writeFileSync(outputFile + ".js", js);
        fs.writeFileSync(outputFile + ".d.ts", ts);
    }

    process.exit(0);
    return undefined
})().finally(data => {}).catch();
