const { Technician, User, WorkOrder, sequelize } = require('../models');
const { Op } = require('sequelize');

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

// 🔥 Check if technician has overlapping work orders
exports.hasOverlappingWorkOrder = async (technicianId, startTime, endTime, excludeWorkOrderId = null) => {
    const whereClause = {
        technician_id: technicianId,
        status: { [Op.in]: ['OPEN', 'IN_PROGRESS', 'WAITING_PARTS'] }, // Active statuses
        [Op.and]: [
            { start_time: { [Op.not]: null } },
            { end_time: { [Op.not]: null } },
            {
                [Op.or]: [
                    // New WO starts during existing WO
                    {
                        start_time: { [Op.lte]: startTime },
                        end_time: { [Op.gt]: startTime }
                    },
                    // New WO ends during existing WO
                    {
                        start_time: { [Op.lt]: endTime },
                        end_time: { [Op.gte]: endTime }
                    },
                    // New WO completely contains existing WO
                    {
                        start_time: { [Op.gte]: startTime },
                        end_time: { [Op.lte]: endTime }
                    }
                ]
            }
        ]
    };

    if (excludeWorkOrderId) {
        whereClause.id = { [Op.ne]: excludeWorkOrderId };
    }

    const count = await WorkOrder.count({ where: whereClause });
    return count > 0;
};

// Get available technicians for a time slot
exports.getAvailableTechnicians = async (startTime, endTime) => {
    const allTechnicians = await exports.listTechnicians();

    const availableTechnicians = [];

    for (const tech of allTechnicians) {
        const hasOverlap = await exports.hasOverlappingWorkOrder(tech.id, startTime, endTime);
        availableTechnicians.push({
            ...tech.toJSON(),
            available: !hasOverlap,
            conflictReason: hasOverlap ? 'Busy during this time slot' : null
        });
    }

    return availableTechnicians;
};

// 🔥 Get technician schedule (all work orders in date range)
exports.getTechnicianSchedule = async (technicianId, fromDate, toDate) => {
    return await WorkOrder.findAll({
        where: {
            technician_id: technicianId,
            status: { [Op.in]: ['OPEN', 'IN_PROGRESS', 'WAITING_PARTS'] },
            start_time: {
                [Op.gte]: fromDate,
                [Op.lte]: toDate
            }
        },
        include: [
            {
                model: sequelize.models.Vehicle,
                attributes: ['id', 'license_plate', 'make', 'model']
            }
        ],
        order: [['start_time', 'ASC']]
    });
};

module.exports = exports;
