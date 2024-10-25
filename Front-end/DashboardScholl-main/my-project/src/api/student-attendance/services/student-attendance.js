'use strict';

/**
 * student-attendance service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::student-attendance.student-attendance');
