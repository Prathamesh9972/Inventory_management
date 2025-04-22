// Simulate role middleware by attaching a role to the `req.user` object
// In a real-world app, this would come from your authentication system
const checkRole = (req, res, next) => {
  // Simulate role-based logic (you can set this role in a session or hardcoded for testing)
  req.user = { role: "admin" };  // Here we set the role to 'admin' for testing

  // Or if you want to support other roles, you could check a session or cookie for the role
  next();  // Call next middleware or route handler
};

module.exports = checkRole;
