'use strict';

/**
 * students controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::students.students');
