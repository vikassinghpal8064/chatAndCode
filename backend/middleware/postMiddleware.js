const {getUser}= require('./jwt')



const validateUser = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send({ message: 'No token provided' });
        }

        const user = getUser(token);

        if (!user) {
            return res.status(401).send({ message: 'Invalid token' });
        }

        // Attach the user information to the request object
        req.user = user;

        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


module.exports={validateUser}