import sql from "../configs/db.js";

const dbErrorHandler = (error, res) => {
    console.error(error);
    let errorString = error?.message || String(error);
    let errorMessage = "An unexpected error occurred.";

    if (errorString.includes('database') || 
        errorString.includes('relation') || 
        errorString.includes('sql') || 
        errorString.includes('neon') ||
        errorString.includes('connection') || 
        errorString.includes('timeout')) { 
        errorMessage = "Database fetching problem. Please check connection or try again.";
    } else {
        errorMessage = errorString;
    }

    res.json({ success: false, message: errorMessage });
};
export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth;
        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
        res.json({ success: true, creations });
    } catch (error) {
        return dbErrorHandler(error, res);
    }
}

export const getPublishedCreations = async (req, res) => {
    try {
        const creations = await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

        res.json({ success: true, creations });
    } catch (error) {
        return dbErrorHandler(error, res);
    }
}


export const toggleLikeCreation = async (req, res) => {
    try {

        const { userId } = req.auth;
        const { id } = req.body;

        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`

        if (!creation) {
            return res.json({ success: false, message: 'creation not found' })
        }

        const currentLikes = creation.likes || [];
        const useridStr = userId.toString();
        let updatedLikes;
        let message;

        if (currentLikes.includes(useridStr)) {
            updatedLikes = currentLikes.filter((user) => user !== useridStr);
            message = 'Creation Unliked'
        } else {
            updatedLikes = [...currentLikes, useridStr];
            message = 'Creation Liked'
        }

        const formattedArray = `{${updatedLikes.join(',')}}`

        await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`

        res.json({ success: true, message });
    } catch (error) {
        return dbErrorHandler(error, res);
    }
}