// catalogService.js
const { services_catalog, parts_catalog } = require('../models');

// Services
exports.listServices = async () => {
    return await services_catalog.findAll({ order: [['name', 'ASC']] });
};

exports.createService = async ({ code, name, price, description, duration_minutes, active }) => {
    return await services_catalog.create({ code, name, price, description, duration_minutes, active });
};

exports.updateService = async (id, data) => {
    const row = await services_catalog.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return row;
};

exports.deleteService = async (id) => {
    const row = await services_catalog.findByPk(id);
    if (!row) return null;
    await row.destroy();
    return row;
};

// Parts
exports.listParts = async () => {
    return await parts_catalog.findAll({ order: [['name', 'ASC']] });
};

exports.createPart = async ({ sku, name, unit_price, unit, active }) => {
    return await parts_catalog.create({ sku, name, unit_price, unit, active });
};

exports.updatePart = async (id, data) => {
    const row = await parts_catalog.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return row;
};

exports.deletePart = async (id) => {
    const row = await parts_catalog.findByPk(id);
    if (!row) return null;
    await row.destroy();
    return row;
};
