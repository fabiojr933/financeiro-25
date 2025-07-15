const whatsapp = require('../models/Whatsapp');
const env = require('dotenv');

env.config();
const baseUrl = process.env.baseUrl;
const apikey = process.env.apikey;

exports.Qrcode = async (req, res) => {
    try {
        const usuario = {
            'instance': req.session.empresa.instance,
            'baseUrl': baseUrl,
            'apikey': apikey,
        }
        const status = await whatsapp.Status(usuario);
        const data = {
            status: '',
            qrcode: '',
        }


        if (status.status == 404) {
            const dados = {
                'instanceName': req.session.empresa.instance,
                "integration": "WHATSAPP-BAILEYS",
                "qrcode": true
            }
            const instacia = await whatsapp.createInstance(usuario, dados);

            data.qrcode = instacia.qrcode.base64;
            data.status = '';
            res.render('whatsapp/qrcode', { data });
            return
        }
        if (status.instance.state == 'open') {
            data.status = status.instance.state;
        } else {
            if (status.instance.state == 'connecting') {
                await whatsapp.QrcodeLogoff(usuario);
            }
            const code = await whatsapp.Qrcode(usuario);
            data.qrcode = code.base64;
        }
        res.render('whatsapp/qrcode', { data });

    } catch (error) {
        console.log(error);
        req.flash('info', 'Erro ao gerar qrcode ' + error.messege);
        res.redirect('/whatsapp/qrcode');
    }
};

exports.Desconectar = async (req, res) => {
    try {
        const usuario = {
            'instance': req.session.empresa.instance,
            'baseUrl': baseUrl,
            'apikey': apikey,
        }

        const code = await whatsapp.QrcodeLogoff(usuario);
        res.redirect('/whatsapp/qrcode');

    } catch (error) {
        req.flash('info', 'Erro inesperado na geração do qrcode. ' + error.messege);
        res.redirect('/whatsapp/qrcode');
    }
};