
exports.Session = async (req, res, next) => {
    try {
        if (!req.session.empresa) {
            req.flash('info', 'Você precisa estar logado para acessar esta página.');
            return res.redirect('/');
        }
        return next();
    } catch (error) {
        req.flash('info', 'Ocorreu um erro ao verificar a sessão. Tente novamente.');
        return res.redirect('/');
    }
};
