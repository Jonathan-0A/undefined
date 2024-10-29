import jwt from "jsonwebtoken" // Assuming you're using the 'jsonwebtoken' library

// Middleware to check if JWT token is present and valid
function checkAuth(req, res, next) {
    // Check if JWT is present in cookies or headers
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (token) {
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            // Token is valid, attach user info to the request
            req.user = decoded;
            // Redirect to previous page or homepage if user is already logged in
            return res.status(302).redirect(req.get("Referer") || "/");
        });
    } else {
        next(); // No token present, proceed to the requested page
    }
}

export default checkAuth