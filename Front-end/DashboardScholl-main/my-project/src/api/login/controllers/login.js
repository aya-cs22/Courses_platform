'use strict';

/**
 * login controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::login.login');
