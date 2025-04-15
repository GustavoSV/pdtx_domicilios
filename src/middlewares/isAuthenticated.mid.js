export function isAuthenticated(req, res, next) {
  // Verifica si el usuario está autenticado
  // if (req.session && req.session.user) {
  console.log("function isAuthenticated - req.session:", req.session);
  
    return next();
  // }
  // res.redirect('/auth/login');
}