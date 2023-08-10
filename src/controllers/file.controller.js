import fs from "fs";
import path from "path";

const file = {
    POST: async (req, res, next) => {
        try {
            const file = req?.files?.file;
            if (!file)
                throw new Error(
                    "Send file( image or video)! File ( rasm yoki video ) yuboring!"
                );
            let cod = (Math.random() * 900000 + 100000).toFixed(0);

            let filePath = path.join(
                process.cwd(),
                "src",
                "avatarka",
                "files",
                cod
            );
            let type = file.mimetype.split("/")[1];
            let image = "/avatarka/files/" + cod + "." + type;
            await file.mv(filePath + "." + type);
            res.send({
                status: 200,
                data: image,
                message: "ready",
            });
        } catch (error) {
            res.status(400).json({
                status: 504,
                data: "upload",
                message: error.message,
            });
        }
    },
    DELETE: async (req, res, next) => {
        try {
            const { filelink } = req.body;
            if (!filelink) throw new Error("Send filelink! Filelink yuboring!");
            fs.unlinkSync(path.join(process.cwd(filelink)));

            res.send({
                status: 200,
                data: null,
                message: "Deleted file! File o'chirildi!",
            });
        } catch (error) {
            res.status(400).json({
                status: 504,
                data: "deleted",
                message: error.message,
            });
        }
    },
};

export default file;
