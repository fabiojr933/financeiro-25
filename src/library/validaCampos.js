module.exports = function validaCampos(req, res, redirect, ...campos) {
  const faltando = campos.filter(campo => {
    return (
      req.body[campo] === undefined ||
      req.body[campo] === null ||
      req.body[campo].toString().trim() === ''
    );
  });

  if (faltando.length > 0) {
    const camposStr = faltando.join(', ');
    req.flash('info', `Os seguintes campos são obrigatórios: ${camposStr}`);
    res.redirect(redirect); 
    return false;
  }

  return true;
};
