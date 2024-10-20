'use strict';

/**
 * attendance service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::attendance.attendance');
