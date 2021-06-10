const glob = require('glob')
const path = require('path');
const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');

const protobuf = require("protobufjs");
const pbjs = require("protobufjs/cli/pbjs");
const pbts = require("protobufjs/cli/pbts");
const asyncCli = require("./loaders/async_cli");

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

const generateTypes = (path, contents) => {
    const jsData = jsdoc2md.getJsdocDataSync({
        "no-cache": true,
        source: contents
    });


    const ProtoInterfaces = jsData.filter(item => item.kind === "interface");

    const ProtoKlasses = jsData.filter(item => {
        if (item.kind !== "class")
            return false;

        for (const el of item.implements)
            if (ProtoInterfaces.indexOf(el) !== 0) return true;

        return false;
    });

    return {
        filename: path,
        imports: [
            ...ProtoInterfaces.map(item => item.name),
            ...ProtoKlasses.map(item => item.name)
        ],
        protoInterfaces: ProtoInterfaces,
        protoKlasses: ProtoKlasses
    };
};

const writeGeneratedTypes = (outputDir, generatedTypes) => {
    const outFilename = path.resolve(outputDir, "ProtobufCommon.tsx");

    let out = "";

    const mergedTypes = [];

    for (const genType of generatedTypes) {
        if (genType.imports.length === 0)
            continue;

        const protoInter = genType.protoInterfaces.map(item => item.name);

        const relFile = path.relative(outFilename, genType.filename).replace(".", "", 1);
        out += `import { ${genType.imports.join(", ")} } from "${relFile.split(path.sep).join(path.posix.sep)}";\n`

        mergedTypes.push(...protoInter);
    }

    if (mergedTypes.length !== 0)
    {
        out += "\n";
        out += "export type AnyProto = ";
        for (const mType of mergedTypes) {
            out += `\n\t| ${mType}`;
        }
        out += ";\n";
    }

    if (mergedTypes.length !== 0)
    {
        const mappedIds = [];

        for (const genType of generatedTypes) {
            if (genType.protoKlasses.length === 0)
                continue;

            for (const mType of genType.protoKlasses)
            {
                if (!genType.schema.nested.hasOwnProperty(mType.name))
                    continue;

                if (!genType.schema.nested[mType.name].hasOwnProperty("options"))
                    continue;

                mappedIds.push({
                    type: mType,
                    schema: genType.schema.nested[mType.name]
                })
            }
        }

        out += "" +
`
export interface ProtocolAttribute {
    HasData: boolean;
    DataId: number;
    Klass: Function;
}

export class Protomap {
    public static Forward: Record<number, Function> = {
        ${mappedIds.map(item => `${item.schema.options["(data_id)"]}: ${item.type.name}.prototype.constructor`).join(",\n\t\t")}
    };
    
    public static Reverse: Map<Function, number> = new Map([
        ${mappedIds.map(item => `[${item.type.name}.prototype.constructor, ${item.schema.options["(data_id)"]}]`).join(",\n\t\t")}
    ]);
    
    public static ProtocolAttributes: Map<Function, ProtocolAttribute> = new Map([
        ${mappedIds.map(item => `[${item.type.name}.prototype.constructor, { HasData: ${Object.keys(item.schema.fields).length > 0}, DataId: ${item.schema.options["(data_id)"]}, Klass: ${item.type.name} }]`).join(",\n\t\t")}
    ]);
}
`;


    }

    fs.writeFileSync(outFilename, out);
}

(async () => {
    const outputDir = path.resolve(__dirname, "..", "src", "generated");
    if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });

    const requestSchema = [];

    const generatedTypes = [];

    // for (const spath of entryFiles) {
    //     const contents = fs.readFileSync(spath);
    //     const js = await pbjsLoader(contents, ['-t', 'static-module', '-w', 'commonjs', '-']);
    //
    //     const reqScheme = JSON.parse(await pbjsLoader(contents, ['-t', 'json', '-']));
    //     requestSchema.push(reqScheme);
    //
    //     const ts = await pbtsLoader(js);
    //
    //     const baseName = path.basename(spath).split('.').slice(0, -1).join('.')
    //     const relPath = path.dirname(path.relative(protodir, spath));
    //     const outputDirRel = path.resolve(outputDir, relPath);
    //     const outputFile = path.resolve(outputDirRel, baseName)
    //     if (!fs.existsSync(outputDirRel))
    //         fs.mkdirSync(outputDirRel, { recursive: true });
    //
    //     const genTypes = {
    //         ...generateTypes(outputFile, js),
    //         schema: reqScheme
    //     };
    //     generatedTypes.push(genTypes);
    //
    //     fs.writeFileSync(outputFile + ".js", js);
    //     fs.writeFileSync(outputFile + ".d.ts", ts);
    // }
    //
    // fs.writeFileSync(path.resolve(outputDir, "RequestSchema.tsx"), `export const RequestSchema = ${JSON.stringify(
    //     requestSchema.reduce((add, item) => ({
    //         ...add,
    //         ...item.nested
    //     }), {}),
    //     undefined,
    //     "\t"
    // )};`);
    //
    // writeGeneratedTypes(outputDir, generatedTypes);

    const outputFile = path.resolve(outputDir, "Buffs");
    const outputFileTs = path.resolve(outputDir, "Reflection");

    await asyncCli(pbjs.main, ['-t', 'static-module', '-w', 'commonjs', '-o', outputFile + ".js", ...entryFiles]);
    await asyncCli(pbts.main, ['-o', outputFile + ".d.ts", outputFile + ".js"]);
    // const ts = await pbtsLoader(js);

    const js_json = await asyncCli(pbjs.main, ['-m', '-t', 'json-module', '-w', 'commonjs', ...entryFiles]);
    const ts_json = await pbtsLoader(js_json);

    // fs.writeFileSync(outputFile + ".js", js);
    // fs.writeFileSync(outputFile + ".d.ts", ts);

    fs.writeFileSync(outputFileTs + ".js", js_json);
    fs.writeFileSync(outputFileTs + ".d.ts", ts_json);

    process.exit(0);
    return undefined
})().finally(data => {}).catch();
