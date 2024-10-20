'use strict';

/**
 * login service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::login.login');
