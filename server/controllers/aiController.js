import { GoogleGenAI } from "@google/genai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import 'dotenv/config'
import { removeBackground } from "@cloudinary/url-gen/actions/effect";


const AI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const handleError = (error, res) => {
    console.error(error);

    let errorString = error?.message || String(error);
    let errorMessage = "An unexpected error occurred.";

    // Try to parse Gemini API stringified JSON errors
    if (errorString.startsWith('{') && errorString.includes('"error"')) {
        try {
            const parsed = JSON.parse(errorString);
            if (parsed.error && parsed.error.message) {
                errorString = parsed.error.message;
            }
        } catch (e) { }
    }

    if (error?.status === 429 || errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('quota exceeded')) {
        errorMessage = "Gemini API limit is over. Please try again later.";
    } else if (error?.status === 400 || errorString.includes('API Key not found') || errorString.includes('API_KEY_INVALID') || errorString.includes('valid API key')) {
        errorMessage = "API key is invalid or missing. Please check the backend configuration.";
    } else if (errorString.includes('database') || errorString.includes('relation') || errorString.includes('sql') || errorString.includes('neon')) {
        errorMessage = "Database fetching problem. Please try again later.";
    } else {
        errorMessage = errorString; // Fallback to original message
    }

    res.json({ success: false, message: errorMessage });
};

// generate article
export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { promt, length } = req.body;
        // const plan = req.plan;
        // const free_usage = req.free_usage;

        // if (plan != 'premium' && free_usage >= 10) {
        //     return res.json({ success: false, message: "Limit reached. upgrade to continue." })
        // }

        const response = await AI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promt,
            config: {
                temperature: 0.7,
                maxOutputTokens: length*2,
            }
        });

        const content = response.text;
        await sql`INSERT INTO creations (user_id, promt, content, type) VALUES (${userId},${promt},${content},'article')`

        // if (plan !== 'premium' && userId) {
        //     await clerkClient.users.updateUserMetadata(userId, {
        //         privateMetadata: {
        //             free_usage: free_usage + 1,
        //         }
        //     })
        // }

        res.json({ success: true, content })

    } catch (error) {
        return handleError(error, res);
    }
}


//generate blog-title

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { promt } = req.body;
        // const plan = req.plan;
        // const free_usage = req.free_usage;

        // if (plan != 'premium' && free_usage >= 10) {
        //     return res.json({ success: false, message: "Limit reached. upgrade to continue." })
        // }

        const response = await AI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 5000,
            }
        });

        const content = response.text;
        await sql`INSERT INTO creations (user_id, promt, content, type) VALUES (${userId},${promt},${content},'blog-title')`

        // if (plan !== 'premium' && userId) {
        //     await clerkClient.users.updateUserMetadata(userId, {
        //         privateMetadata: {
        //             free_usage: free_usage + 1,
        //         }
        //     })
        // }

        res.json({ success: true, content })

    } catch (error) {
        return handleError(error, res);
    }
}


// Generate image
export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { promt, publish } = req.body;
        // const plan = req.plan;

        // if (plan != 'premium') {
        //     return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        // }

        const formData = new FormData()
        formData.append('prompt', promt)

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: "arraybuffer",
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const { secure_url } = await cloudinary.uploader.upload(base64Image)

        await sql`INSERT INTO creations (user_id, promt, content, type,publish) VALUES (${userId},${promt},${secure_url},'image', ${publish ?? false})`;

        res.json({ success: true, content: secure_url })

    } catch (error) {
        return handleError(error, res);
    }
}


// remove background
export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth;
        const image = req.file;
        // const plan = req.plan;

        // if (plan != 'premium') {
        //     return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        // }

        const uploadResponse = await cloudinary.uploader.upload(image.path);
        // Use the public ID from the upload response to create a URL with background removal
        const imageUrlWithBackgroundRemoval = cloudinary.url(uploadResponse.public_id, {
            transformation: [
                { effect: "background_removal" }
            ]
        });


        await sql`INSERT INTO creations (user_id, promt, content, type) VALUES (${userId},'Remove Background from image',${imageUrlWithBackgroundRemoval},'image')`;

        res.json({ success: true, content: imageUrlWithBackgroundRemoval })

    } catch (error) {
        return handleError(error, res);
    }
}


// Remove image object
export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth;
        const image = req.file;
        // const plan = req.plan;
        const { object } = req.body

        // if (plan != 'premium') {
        //     return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        // }

        const { public_id } = await cloudinary.uploader.upload(image.path)

        const imageUrl = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image'
        })

        if (!imageUrl) {
            return res.status(400).json({ success: false, message: "Image upload failed. No URL returned." });
        }

        await sql`INSERT INTO creations (user_id, promt, content, type) VALUES (${userId},${`Removed ${object} from image`},${imageUrl},'image')`;

        res.json({ success: true, content: imageUrl })

    } catch (error) {
        return handleError(error, res);
    }
}


// Review Resume
export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth;
        const resume = req.file;
        // const plan = req.plan;

        // if (plan != 'premium') {
        //     return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
        // }

        if (resume.size > 2 * 1024 * 1024) {
            return res.json({ success: false, message: "Resume file size exeeds allowed size (2MB)." })
        }

        const dataBuffer = fs.readFileSync(resume.path);
        const pdfData = await pdf(dataBuffer)

        const promt = `Review the following resume and provide constructive feedback on its strengths, weakness, and areas for improvement. Resume Content:\n\n${pdfData.text}`


        const response = await AI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 5000,
            }
        });
        const content = response.text;


        await sql`INSERT INTO creations (user_id, promt, content, type) VALUES (${userId},'Review the uploaded resume',${content}, 'Resume-Review')`;

        res.json({ success: true, content });

    } catch (error) {
        return handleError(error, res);
    }
}