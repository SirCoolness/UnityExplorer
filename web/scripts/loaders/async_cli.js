module.exports = function (main, args) {
    return new Promise((resolve, reject) => {
        main(args,(err, output) => {
            if (err)
                reject(err);
            resolve(output);
        });
    })
}
