const request = require('supertest');
const router = require('../server')  // นำเข้าแอป Express
const prisma = require('../config/prisma'); // นำเข้าการเชื่อมต่อกับ Prisma

// Mocking prisma
jest.mock('../config/prisma', () => ({
  attend: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
  employee: {
    findUnique: jest.fn(),
  },
}));

describe('Attendance API', () => {

  beforeAll(async () => {
    // Mocking employee creation
    prisma.employee.findUnique.mockResolvedValue({
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
    });

    // Mocking successful create attendance
    prisma.attend.create.mockResolvedValue({
      attend_id: 1,
      employee_id: 1,
      firstname: 'John',
      lastname: 'Doe',
      check_in_time: new Date(),
      check_out_time: null,
      status: 'check_in',
    });

    // Mocking successful findFirst (check if already checked in)
    prisma.attend.findFirst.mockResolvedValue(null);
  });

  

  describe('POST /attend', () => {
    it('should create a new attendance record for an employee', async () => {
      const response = await request(router)
        .post('/api/attend')
        .send({ employee_id: 1 });

      expect(response.status).toBe(200);  // คาดว่า status code จะเป็น 200
      expect(response.body.message).toBe('Check in successfully');  // ข้อความจาก API
      expect(response.body.newAttend).toHaveProperty('attend_id');  // คาดว่า response จะมี property attend_id
      expect(response.body.newAttend.check_in_time).toBeTruthy();  // คาดว่า check_in_time จะมีค่า
      expect(prisma.attend.create).toHaveBeenCalledTimes(1); // ตรวจสอบว่า prisma.attend.create ถูกเรียกครั้งเดียว
    });

    it('should return error if employee has already checked in', async () => {
      // Mocking findFirst ให้คืนค่าที่มีการเช็คอินอยู่แล้ว
      prisma.attend.findFirst.mockResolvedValueOnce({
        attend_id: 1,
        employee_id: 1,
        firstname: 'John',
        lastname: 'Doe',
        check_in_time: new Date(),
        check_out_time: null,
        status: 'check_in',
      });

      const response = await request(router)
        .post('/api/attend')
        .send({ employee_id: 1 });

      expect(response.status).toBe(400);  // คาดว่า status code จะเป็น 400
      expect(response.body.error).toBe('Employee has already checked in today');  // ข้อความ error
    });
  });

 

});