export const AppointmentRepository = jest.fn().mockImplementation(() => {
  return {
    findAvailable: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue(null),
    count: jest.fn().mockResolvedValue(null),
  };
});
