'use strict';

/**
 * students service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::students.students');
