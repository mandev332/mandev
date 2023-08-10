import fs from "fs";
import path from "path";
import http from "http";
import https from "https";

import STREAM from "stream";
const Stream = STREAM.Transform;

let downloadImage = (url, filename, callback) => {
    let client = http;
    if (url.toString().indexOf("https") === 0) {
        client = https;
    }
    client
        .request(url, function (response) {
            let data = new Stream();

            response.on("data", function (chunk) {
                data.push(chunk);
            });

            response.on("end", function () {
                fs.writeFileSync(
                    path.join(process.cwd(), "src", "avatarka", filename),
                    data.read()
                );
            });
        })
        .end();
};

export default downloadImage;
