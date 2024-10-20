'use strict';

/**
 * lectures controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::lectures.lectures');
