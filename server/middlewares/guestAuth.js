// middleware for guest users — no Clerk login required

export const guestAuth = (req, res, next) => {
    // Mark this request as a guest — no Clerk session needed
    const isFullGuest = req.headers['x-guest-mode'] === 'full';
    req.plan = isFullGuest ? 'premium' : 'guest';
    req.free_usage = 0;

    if (!req.auth) req.auth = {};
    req.auth.userId = 'guest_user_' + Date.now();

    next();
}
