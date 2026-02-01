const { techniciansRepo, workOrdersRepo } = require('../repositories');

/**
 * TechniciansService should contain business rules only.
 * Data access is delegated to repositories (workOrdersRepo, techniciansRepo).
 */

class TechniciansService {
    /**
     * Return technicians available for the given time slot.
     * Strategy: get technicians with status AVAILABLE, exclude those with overlapping work orders.
     */
    async getAvailableTechnicians(start, end) {
        // get technicians already marked AVAILABLE (includes User)
        const availableTechs = await techniciansRepo.findAll({ available_only: true });
        // ask repository for technician ids that are busy in the slot
        const busyIds = new Set(await workOrdersRepo.findTechnicianIdsWithOverlappingSlot(start, end));

        return availableTechs.filter(t => !busyIds.has(t.id));
    }

    /**
     * Get a technician schedule between two dates
     */
    async getTechnicianSchedule(technicianId, from, to) {
        // delegate to repository which returns work orders with vehicle+customer included
        return await workOrdersRepo.findByTechnicianAndRange(technicianId, from, to);
    }
}

module.exports = new TechniciansService();
