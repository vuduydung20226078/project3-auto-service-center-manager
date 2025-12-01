'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('vehicles', [
      { id: 1, customer_id: 1, license_plate: '30A-00001', model: 'Honda City', vin: 'VIN00001', mileage: 50000, note: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 2, customer_id: 2, license_plate: '30A-00002', model: 'Toyota Vios', vin: 'VIN00002', mileage: 45000, note: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 3, customer_id: 3, license_plate: '30A-00003', model: 'Mazda 3', vin: 'VIN00003', mileage: 60000, note: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },

      { id: 4, customer_id: 4, license_plate: '30A-00004', model: 'Hyundai Elantra', vin: 'VIN00004', mileage: 30000, note: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 5, customer_id: 5, license_plate: '30A-00005', model: 'Ford Ranger', vin: 'VIN00005', mileage: 80000, note: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 6, customer_id: 6, license_plate: '30A-00006', model: 'Toyota Camry', vin: 'VIN00006', mileage: 75000, note: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 7, customer_id: 7, license_plate: '30A-00007', model: 'Honda CR-V', vin: 'VIN00007', mileage: 40000, note: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 8, customer_id: 8, license_plate: '30A-00008', model: 'Mazda CX-5', vin: 'VIN00008', mileage: 55000, note: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 9, customer_id: 9, license_plate: '30A-00009', model: 'Kia Seltos', vin: 'VIN00009', mileage: 25000, note: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' },
      { id: 10, customer_id: 10, license_plate: '30A-00010', model: 'VinFast Lux A2.0', vin: 'VIN00010', mileage: 30000, note: '', created_at: '2024-01-01 10:00:00', updated_at: '2024-01-01 10:00:00' }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('vehicles', null, {});
  }
};
