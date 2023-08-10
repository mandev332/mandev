import fs from "fs";
import path from "path";
import { fetch, fetchAll } from "../database/connect.js";
import { articleModel } from "../MODELS/articleModel.js";

const {
    GET,
    GETUSER,
    GETUser,
    GETALL,
    POST,
    ADMINPOST,
    PUT,
    LIKE,
    VIEW,
    ADMINGET,
    ADMINPUT,
    DELETE,
} = articleModel;

const ArticleConter = {
    GET: async (req, res, next) => {
        try {
            const { id } = req?.params;
            if (id) {
                let findart = await fetch(GET, id);
                if (!findart)
                    throw new Error(
                        `Not found article = ${id}!, ${id} - maqola topilmadi!`
                    );
                res.send({
                    status: 200,
                    data: findart,
                    message: "Article",
                });
            } else {
                let arts = await fetchAll(GETALL);
                if (arts.length)
                    res.send({
                        status: 200,
                        data: arts,
                        message: "Articles",
                    });
                else throw new Error("Articles not found");
            }
        } catch (err) {
            res.status(400).json({
                status: 404,
                data: null,
                message: err.message,
            });
        }
    },
    GETUSER: async (req, res, next) => {
        try {
            const { id } = req?.user;
            if (id) {
                let artId = req?.params.id;
                if (artId) {
                    let findart = await fetch(GETUser, id, artId);
                    if (!findart)
                        throw new Error(
                            `Not found art = ${artId}! ${artId} - maqola topilmadi!`
                        );
                    if (findart.user_id != id)
                        throw new Error(
                            `This article in not yours! Bu maqola sizniki emas!`
                        );
                    res.send({
                        status: 200,
                        data: findart,
                        message: "Article",
                    });
                } else {
                    let arts = await fetchAll(GETUSER, id);
                    if (arts.length)
                        res.send({
                            status: 200,
                            data: arts,
                            message: "Articles",
                        });
                    else
                        throw new Error(
                            "Articles not found! Sizda maqola yo'q!"
                        );
                }
            } else
                throw new Error(
                    "You are not allowed to access information from this section! Bu bo'limdan ma'lumot olish uchun sizga ruxsat yo'q! "
                );
        } catch (err) {
            res.status(400).json({
                status: 404,
                data: null,
                message: err.message,
            });
        }
    },
    UPLOAD: async (req, res, next) => {
        try {
            if (!req?.files?.file && req.method == "PUT") return next();
            const file = req?.files?.file;
            if (!file) return next();

            let cod = (Math.random() * 900000 + 100000).toFixed(0);
            let art;

            if (req.method == "PUT") {
                const { id } = req?.user;
                art = await fetch(GET, req.params.id);
                if (!art)
                    throw new Error(
                        "This article not found! Bu maqola topilmadi!"
                    );
                if (art.user_id != id)
                    throw new Error(
                        `This article in not yours! Bu maqola sizniki emas!`
                    );
                if (art?.image) {
                    fs.unlinkSync(path.join(process.cwd(), art.image));
                }
            }

            let filePath = path.join(process.cwd(), "avatarka", "article", cod);
            let type = file.mimetype.split("/")[1];
            req.body.image = "/avatarka/artilcle/" + cod + "." + type;
            await file.mv(filePath + "." + type);
            return next();
        } catch (err) {
            res.status(400).json({
                status: 504,
                data: "upload",
                message: err.message,
            });
        }
    },
    POST: async (req, res, next) => {
        try {
            const { id } = req?.user;
            const { title, description, image, hashtag } = req.body;
            if (!title || !description || !hashtag)
                throw new Error(
                    "You must send title and description! Siz surat, mavzu, maqola va hashtag yuborishingiz zarur!"
                );
            let post;
            if (req.user.role == "admin") {
                post = await fetch(
                    ADMINPOST,
                    id,
                    title,
                    description,
                    image || "/avatarka/article/demo.jpg",
                    hashtag,
                    true
                );
            } else {
                post = await fetch(
                    POST,
                    id,
                    title,
                    description,
                    image,
                    hashtag
                );
            }

            res.send({
                status: 200,
                data: post,
                message: "Article added! Maqola qo'shildi!",
            });
        } catch (err) {
            res.status(400).json({
                status: 404,
                data: null,
                message: err.message,
            });
        }
    },
    PUT: async (req, res, next) => {
        try {
            const { id } = req?.user;
            let art = await fetch(GET, req.params.id);
            if (!art)
                throw new Error("This article not found! Bu maqola topilmadi!");
            if (art.user_id != id)
                throw new Error(
                    `This article in not yours! Bu maqola sizniki emas!`
                );
            const { title, description, image, hashtag } = req.body;
            if (!title && !description && !image && !hashtag)
                throw new Error(
                    "You need send sameone date for change! O'zgarish uchun bironta ma'lumot yuborishingiz zarur!"
                );

            if (title?.length > 255)
                throw new Error("Title very longer! Sarlavha uzun berilgan!");

            let update = await fetch(
                PUT,
                art.id,
                title || art.title,
                description || art.description,
                image || art.image,
                hashtag || art.hashtag
            );
            res.send({
                status: 200,
                data: update,
                message: `Article ${art.id} updated! ${art.id} Maqola o'zgartirildi!`,
            });
        } catch (err) {
            res.status(400).json({
                status: 404,
                data: null,
                message: err.message,
            });
        }
    },

    ADMINPUT: async (req, res, next) => {
        try {
            const { role } = req?.user;
            if (role != "admin")
                throw new Error(
                    "You are not allowed! Sizga ruxsat berilmagan!"
                );
            let art = await fetch(ADMINGET, req.params.id);
            if (!art)
                throw new Error("This article not found! Bu maqola topilmadi!");
            const { permission } = req.body;
            if (!permission)
                throw new Error(
                    "You need send sameone date for change! O'zgarish uchun bironta ma'lumot yuborishingiz zarur!"
                );

            let update = await fetch(
                ADMINPUT,
                art.id,
                permission || art.permission,
                new Date().toDateString()
            );
            res.send({
                status: 200,
                data: update,
                message: `Article ${art.id} updated! ${art.id} Maqola o'zgartirildi!`,
            });
        } catch (err) {
            res.status(400).json({
                status: 404,
                data: null,
                message: err.message,
            });
        }
    },

    DELETE: async (req, res, next) => {
        try {
            const userId = req?.user.id;
            const { id } = req?.params;
            if (!id)
                throw new Error(
                    "You need send article's id for delete! O'chirish uchun maqolaning raqamini jo'nating"
                );
            let art = await fetch(GET, id);
            if (!art)
                throw new Error(
                    `Not found article = ${id}! ${id} - maqola topilmadi`
                );
            if (art.user_id != userId && req.user.role != "admin")
                throw new Error(
                    `This article in not yours! Bu maqola sizniki emas!`
                );
            if (art.image != "avatarka/sites/demo.jpg")
                fs.unlinkSync(path.join(process.cwd(), art.image));
            let deleteart = await fetch(DELETE, id);
            res.send({
                status: 200,
                data: deleteart,
                message: `Article ${id} deleted! ${id} Maqola o'chirildi!`,
            });
        } catch (err) {
            res.status(400).json({
                status: 404,
                data: null,
                message: err.message,
            });
        }
    },
    LIKE: async (req, res) => {
        try {
            let { id } = req.params;
            if (isNaN(+id))
                throw new Error(
                    "Send number for id! id uchun raqam yuboring! "
                );
            await fetch(LIKE, id);
            res.send({
                status: 200,
                data: null,
                message: "ok",
            });
        } catch (err) {
            res.status(400).json({
                status: 400,
                data: null,
                message: err.message,
            });
        }
    },
    VIEW: async (req, res) => {
        try {
            let { id } = req.params;
            if (isNaN(+id))
                throw new Error(
                    "Send number for id! id uchun raqam yuboring! "
                );
            await fetch(VIEW, id);
            res.send({
                status: 200,
                data: null,
                message: "ok",
            });
        } catch (err) {
            res.status(400).json({
                status: 400,
                data: null,
                message: err.message,
            });
        }
    },
};

export default ArticleConter;
