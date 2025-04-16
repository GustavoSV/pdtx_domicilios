export function isAuthenticated(req, res, next) {
  console.log("function isAuthenticated - req.session:", req.session);
  console.log("function isAuthenticated - req.session.user:", req.session.user);

  // Verifica si el usuario está autenticado
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
}