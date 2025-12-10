// catalogService.js
const { Service, Part } = require('../models');

// Services
exports.listServices = async () => {
    return await Service.findAll({ order: [['name', 'ASC']] });
};

exports.createService = async ({ code, name, price, description, duration_minutes, active }) => {
    return await Service.create({ code, name, price, description, duration_minutes, active });
};

exports.updateService = async (id, data) => {
    const row = await Service.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return row;
};

exports.deleteService = async (id) => {
    const row = await Service.findByPk(id);
    if (!row) return null;
    await row.destroy();
    return row;
};

// Parts
exports.listParts = async () => {
    return await Part.findAll({ order: [['name', 'ASC']] });
};

exports.createPart = async ({ sku, name, unit_price, unit, active }) => {
    return await Part.create({ sku, name, unit_price, unit, active });
};

exports.updatePart = async (id, data) => {
    const row = await Part.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return row;
};

exports.deletePart = async (id) => {
    const row = await Part.findByPk(id);
    if (!row) return null;
    await row.destroy();
    return row;
};
