'use strict';

var config = require('../config');

var sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(config.sendgridKey);

exports.send = async (to, subject, body) => {
    sendgrid.send({
        to: to,
        from: 'wagnervieira1209@gmail.com',
        subject: subject,
        html: body
    });
}