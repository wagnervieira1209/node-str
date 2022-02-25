'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const guid = require('guid');
const config = require('../config');

/* Método NÃO async
exports.get = (req, res, next) => {
    / *Product
        //.find({}) // Se quiser filtrar: .find({_id: 'blabla', title: 'xpto'})
        .find(
            {
                active: true, // Somente produtos ativos
            }, 
            'title slug price' // Somente estes campos devem ser exibidos
        )* /

        repository
        .get()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(e => {
            res.status(400).send(e);
        });    
};
*/

exports.get = async (req, res, next) => {
    try
    {
        var data = await repository.get();
        res.status(200).send(data);
    }
    catch(e)
    {
        res.status(500).send({message: "Falha ao processar sua requisição"});
    }
};


exports.getBySlug = async (req, res, next) => {
    try
    {
        var data = await repository.getBySlug(req.params.slug);    
        res.status(200).send(data);
    }
    catch(e)
    {
        res.status(500).send({message: "Falha ao processar sua requisição"});
    }
};


exports.getByTag = async (req, res, next) => {
    try
    {
        var data = await repository.getByTag(req.params.tag);    
        res.status(200).send(data);
    }
    catch(e)
    {
        res.status(500).send({message: "Falha ao processar sua requisição"});
    }
};

exports.getById = async (req, res, next) => {
    try
    {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    }
    catch(e)
    {
        res.status(500).send({message: "Falha ao processar sua requisição"});
    }
};

exports.post = async (req, res, next) => {

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A descrição deve conter pelo menos 3 caracteres');

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    //const product = new Product(req.body); // Somente usar se não há validações
    /*
    const product = new Product();
    product.title = req.body.title;
    product.slug = req.body.slug;
    */

    // Salvando no banco de dados
    // Javascript é sempre assincrono
    // Then e .catch são forma de saber se teve exito ou erro (Dogma script)
    
    try
    {
        let filename = '';

        // Verifica se está mandando uma imagem
        if (req.body.image != undefined)
        {
            // Cria o Blob Service
            const blobSvc = azure.createBlobService(config.containerConnectionString);

            filename = guid.raw().toString() + '.jpg';
            let rawdata = req.body.image;
            let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let type = matches[1];
            let buffer = new Buffer(matches[2], 'base64');

            // Salva a imagem
            await blobSvc.createBlockBlobFromText('node-str', filename, buffer, {
                contentType: type
            }, function (error, result, response) {
                if (error) {
                    filename = 'default-product.png'
                }
            });
        }
        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: 'https://wagnervieira.blob.core.windows.net/node-str/' + filename
        });
        res.status(201).send({message: "Produto cadastrado com sucesso"});        
    }
    catch(e)
    {
        console.log(e);
        res.status(500).send({message: "Falha ao processar sua requisição"});
    }
};

exports.put = async (req, res, next) => {
    const id = req.params.id;
    try
    {
        await repository.update(id, req.body);
        res.status(200).send({message: "Produto atualizado com sucesso"});
    }
    catch(e)
    {
        res.status(500).send({message: "Falha ao processar sua requisição"});
    }
};

exports.delete = async (req, res, next) => {
    try
    {
        await repository.Delete(req.params.id);
        res.status(200).send({message: "Produto removido com sucesso"});
    }
    catch(e)
    {
        res.status(500).send({message: "Falha ao processar sua requisição"});
    }
};