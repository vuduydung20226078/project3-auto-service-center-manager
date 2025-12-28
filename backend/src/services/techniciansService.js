const { Technician, User } = require('../models');

// Lấy danh sách technicians
exports.listTechnicians = async () => {
    return await Technician.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'full_name', 'email', 'phone']
            }
        ],
        order: [['status', 'ASC'], ['id', 'ASC']]
    });
};

// Lấy technician theo ID
exports.getTechnicianById = async (id) => {
    return await Technician.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['id', 'full_name', 'email', 'phone']
            }
        ]
    });
};

// Tạo technician mới
exports.createTechnician = async (userId) => {
    return await Technician.create({
        user_id: userId,
        status: 'AVAILABLE'
    });
};

// Cập nhật trạng thái technician
exports.updateTechnicianStatus = async (id, status) => {
    const tech = await Technician.findByPk(id);
    if (!tech) throw new Error('Technician not found');
    await tech.update({ status });
    return tech;
};

// Xóa technician
exports.deleteTechnician = async (id) => {
    const tech = await Technician.findByPk(id);
    if (!tech) return null;
    await tech.destroy();
    return tech;
};

module.exports = exports;
