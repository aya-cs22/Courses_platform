'use strict';

/**
 * attendance controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::attendance.attendance');
