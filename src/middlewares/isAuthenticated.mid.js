export function isAuthenticated(req, res, next) {
  // Verifica si el usuario está autenticado
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
}