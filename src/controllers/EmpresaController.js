const usuario = require('../models/Usuario');
const validaCampos = require('../library/validaCampos');
const empresaModel = require('../models/Empresa');
const whatsappModel = require('../models/Whatsapp');
const env = require('dotenv');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');


env.config();
const baseUrl = process.env.baseUrl;
const apikey = process.env.apikey;




exports.Index = async (req, res) => {
  try {
    const dados = await usuario.Lista(req.session.empresa.id_empresa);  
    req.flash('info', 'Dados carregados com sucesso');
    res.render('usuario/index', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('usuario/index', { dados: [] });
  }
};


exports.Novo = async (req, res) => {
  res.render('usuario/novo');
};
exports.Editar = async (req, res) => {
  try {
    const data = await usuario.UsuarioId(req.params.id, req.session.empresa.id_empresa);
    res.render('usuario/editar', { data });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/usuario/index');
  }
}

exports.Salvar = async (req, res) => {
  if (!validaCampos(req, res, 'nome')) return;

  try {
    const dados = { nome: req.body.nome, status: req.body.status, id_empresa: req.session.empresa.id_empresa };
    await usuario.Salvar(dados);
    req.flash('info', 'Usuário salvo com sucesso!');
    res.redirect('/usuario/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/usuario/novo');
  }
};


exports.Delete = async (req, res) => {
  try {
    await usuario.DeleteId(req.params.id, req.session.empresa.id_empresa);
    req.flash('info', 'Usuario deletado com sucesso!');
    res.redirect('/usuario/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/usuario/index');
  }
};
exports.Configuracao = async (req, res) => {
  try {
    const dados = await empresaModel.EmpresaId(req.session.empresa.id_empresa);
    let grupos = [];
    let numeroGrupo = '';

    const status = {
      'instance': req.session.empresa.instance,
      'baseUrl': baseUrl,
      'apikey': apikey,
    }
    const ativo = await whatsappModel.Status(status);

    if (ativo.status === 404) {
      console.log(ativo);
      grupos = [{
        'remoteJid': 1,
        'pushName': 'Whatsapp não configurado!'
      }];
      numeroGrupo = '';
      dados[0].enviar_notificacao = 'N';
    } else {
      const usuario = {
        'instance': req.session.empresa.instance,
        'baseUrl': baseUrl,
        'apikey': apikey,
      }

      const contatos = await whatsappModel.FindContatosGrupos(usuario);
      grupos = contatos.filter(c => c.isGroup === true);
      const numero = await empresaModel.EmpresaId(req.session.empresa.id_empresa);
      numeroGrupo = numero[0].numero_notificacao;
    }

    req.flash('info', 'Dados carregado com sucesso!');
    res.render('empresa/configuracao', { dados, grupos, numeroGrupo });

  } catch (error) {
    console.log(error);
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/empresa/configuracao');
  }
};




exports.Update = async (req, res) => {
  try {
    const data = {    
      telefone: req.body.telefone,
      endereco: req.body.endereco,
      enviar_notificacao: req.body.enviar_notificacao,
      numero_notificacao: req.body.numero_notificacao,
    };
    const id = req.body.id;
   
    let grupos = [];
    let numeroGrupo = '';
    console.log(data);
    await empresaModel.Update(data, id);
    const dados = await empresaModel.EmpresaId(req.session.empresa.id_empresa);

    const status = {
      'instance': req.session.empresa.instance,
      'baseUrl': baseUrl,
      'apikey': apikey,
    };

    const ativo = await whatsappModel.Status(status);

    if (ativo.status === 404) {
      console.log(ativo);
      grupos = [{
        'remoteJid': 1,
        'pushName': 'Whatsapp não configurado!'
      }];
      numeroGrupo = '';
      dados[0].enviar_notificacao = 'N';
    } else {
      const usuario = {
        'instance': req.session.empresa.instance,
        'baseUrl': baseUrl,
        'apikey': apikey,
      };

      const contatos = await whatsappModel.FindContatosGrupos(usuario);
      grupos = contatos.filter(c => c.isGroup === true);


      const numero = await empresaModel.EmpresaId(req.session.empresa.id_empresa);
      numeroGrupo = numero[0].numero_notificacao;
    }

    req.flash('info', 'Empresa atualizada com sucesso!');
    res.render('empresa/configuracao', { dados, grupos, numeroGrupo });

  } catch (error) {
    console.log(error);
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/empresa/configuracao');
  }
};

exports.Backup = async (req, res) => {
  try {
    const pgUser = 'postgres';
    const pgPassword = 'postgres';      
    const pgDatabase = 'financeiro2';


    const backupDir = path.join(__dirname, '..', 'database', 'backups');
    const backupFile = `backup_${new Date().toISOString().split('T')[0]}.sql`;
    const backupPath = path.join(backupDir, backupFile);

    // Cria a pasta de backup se não existir
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`Pasta criada: ${backupDir}`);
    }

    console.log('Iniciando backup do banco PostgreSQL...');

    // Executa o pg_dump
    const dump = spawn('pg_dump', ['-U', pgUser, pgDatabase], {
      env: { ...process.env, PGPASSWORD: pgPassword },
      shell: true,
    });

    const fileStream = fs.createWriteStream(backupPath);
    dump.stdout.pipe(fileStream);

    dump.stderr.on('data', (data) => {
      console.error(`Erro: ${data.toString()}`);
    });

    dump.on('close', (code) => {
      if (code === 0) {
        console.log(`Backup criado com sucesso em: ${backupPath}`);
      } else {
        console.error(`pg_dump finalizou com código: ${code}`);
      }
    });
    req.flash('info', 'Backup realizado com sucesso!');
    res.redirect('/dashboard');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/dashboard');
  }
};