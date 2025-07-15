const axios = require('axios');

module.exports = {
    async Status(usuario) {
        try {
            const response = await axios.get(
                usuario.baseUrl + '/instance/connectionState/' + usuario.instance,
                {
                    headers: {
                        'apikey': usuario.apikey,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    async Qrcode(usuario) {
        try {
            const response = await axios.get(
                usuario.baseUrl + '/instance/connect/' + usuario.instance,
                {
                    headers: {
                        'apikey': usuario.apikey,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {

        }
    },
    async QrcodeLogoff(usuario) {
        try {
            const response = await axios.delete(
                usuario.baseUrl + '/instance/logout/' + usuario.instance,
                {
                    headers: {
                        'apikey': usuario.apikey,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {

        }
    },

    async createInstance(usuario, dados) {
        try {
            const response = await axios.post(
                usuario.baseUrl + '/instance/create',
                dados,
                {
                    headers: {
                        'apikey': usuario.apikey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            // return error.response.data;
        }
    },

    async FindContatosGrupos(usuario) {
        try {
            console.log(usuario)
            const response = await axios.post(
                usuario.baseUrl + '/chat/findContacts/' + usuario.instance,
                {},
                {
                    headers: {
                        'apikey': usuario.apikey,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {

        }
    },

        async sendTextGrupo(usuario, data) {
        try {         
            const response = await axios.post(
                usuario.baseUrl + '/message/sendText/' + usuario.instance,
                data,
                {
                    headers: {
                        'apikey': usuario.apikey,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {

        }
    },
    
};