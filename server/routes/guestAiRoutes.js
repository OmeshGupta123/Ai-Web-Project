import express from "express";
import {
    generateArticle,
    generateBlogTitle,
    generateImage,
    removeImageBackground,
    removeImageObject,
    resumeReview
} from "../controllers/aiController.js";
import { guestAuth } from "../middlewares/guestAuth.js";
import { upload } from "../configs/multer.js";

const guestAiRouter = express.Router();

// All routes here are accessible WITHOUT login
// guestAuth middleware marks req.plan = 'guest' — controllers can limit usage based on this

guestAiRouter.post('/generate-article', guestAuth, generateArticle);
guestAiRouter.post('/generate-blog-title', guestAuth, generateBlogTitle);
guestAiRouter.post('/generate-image', guestAuth, generateImage);
guestAiRouter.post('/remove-image-background', upload.single('image'), guestAuth, removeImageBackground);
guestAiRouter.post('/remove-image-object', upload.single('image'), guestAuth, removeImageObject);
guestAiRouter.post('/resume-review', upload.single('resume'), guestAuth, resumeReview);

export default guestAiRouter;
