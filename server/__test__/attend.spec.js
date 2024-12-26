const request = require("supertest");
const router = require("../server"); // นำเข้าแอป Express
const prisma = require("../config/prisma"); // นำเข้าการเชื่อมต่อกับ Prisma

// Mocking prisma
jest.mock("../config/prisma", () => ({
  attend: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn(), // Mocking findMany for the DELETE /attend route
  },
  attendhistory: {
    createMany: jest.fn(), // Mocking createMany for the DELETE operation
  },
  employee: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(async (callback) => {
    return callback({
      attend: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      attendhistory: {
        createMany: jest.fn(), // Ensure this is mocked correctly
      },
    });
  }),
}));

describe("Attendance API", () => {
  beforeAll(async () => {
    // Mocking employee creation
    prisma.employee.findUnique.mockResolvedValue({
      id: 1,
      firstname: "John",
      lastname: "Doe",
    });

    // Mocking successful create attendance
    prisma.attend.create.mockResolvedValue({
      attend_id: 1,
      employee_id: 1,
      firstname: "John",
      lastname: "Doe",
      check_in_time: new Date(),
      check_out_time: null,
      status: "check_in",
    });

    // Mocking successful findFirst (check if already checked in)
    prisma.attend.findFirst.mockResolvedValue(null);
  });

  describe("POST /attend", () => {
    it("should create a new attendance record for an employee", async () => {
      const response = await request(router)
        .post("/api/attend")
        .send({ employee_id: 1 });

      expect(response.status).toBe(200); // คาดว่า status code จะเป็น 200
      expect(response.body.message).toBe("Check in successfully"); // ข้อความจาก API
      expect(response.body.newAttend).toHaveProperty("attend_id"); // คาดว่า response จะมี property attend_id
      expect(response.body.newAttend.check_in_time).toBeTruthy(); // คาดว่า check_in_time จะมีค่า
      expect(prisma.attend.create).toHaveBeenCalledTimes(1); // ตรวจสอบว่า prisma.attend.create ถูกเรียกครั้งเดียว
    });

    it("should return error if employee has already checked in", async () => {
      // Mocking findFirst ให้คืนค่าที่มีการเช็คอินอยู่แล้ว
      prisma.attend.findFirst.mockResolvedValueOnce({
        attend_id: 1,
        employee_id: 1,
        firstname: "John",
        lastname: "Doe",
        check_in_time: new Date(),
        check_out_time: null,
        status: "check_in",
      });

      const response = await request(router)
        .post("/api/attend")
        .send({ employee_id: 1 });

      expect(response.status).toBe(400); // คาดว่า status code จะเป็น 400
      expect(response.body.error).toBe("Employee has already checked in today"); // ข้อความ error
    });
  });

  describe("PUT /attend", () => {
    beforeEach(() => {
      prisma.attend.findFirst = jest.fn();
      prisma.attend.update = jest.fn();
      prisma.$transaction = jest.fn(async (callback) => {
        return callback(prisma);
      });
    });

    it("should update attend record", async () => {
      prisma.attend.findFirst.mockResolvedValueOnce({
        attend_id: 1,
        employee_id: 1,
        check_in_time: new Date().toISOString(),
        check_out_time: null,
        working_hours: null,
        status: "check_in",
      });

      prisma.attend.update.mockResolvedValueOnce({
        attend_id: 1,
        employee_id: 1,
        check_in_time: new Date().toISOString(),
        check_out_time: new Date().toISOString(),
        working_hours: 8,
        status: "check_out",
      });

      const response = await request(router)
        .put("/api/attend")
        .send({ employee_id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Check out successfully");
      expect(prisma.attend.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.attend.update).toHaveBeenCalledTimes(1);
    });
    it("should return if employee has not checked in", async () => {
      prisma.attend.findFirst.mockResolvedValueOnce({
        attend_id: 1,
        employee_id: 1,
        check_in_time: null,
        check_out_time: null,
        working_hours: null,
        status: "check_in",
      });
      const response = await request(router)
        .put("/api/attend")
        .send({ employee_id: 1 });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Employee has not checked in today");
      expect(prisma.attend.findFirst).toHaveBeenCalledTimes(1);
    });
    it("should return error if employee_id is missing", async () => {
      const response = await request(router).put("/api/attend").send({}); // No employee_id provided

      expect(response.status).toBe(400); // Expecting 400 as the error
      expect(response.body.error).toBe("Employee ID is required");
      expect(prisma.attend.findFirst).toHaveBeenCalledTimes(0); // No DB call should be made
    });
  });
  describe("DELETE /attend", () => {
    beforeEach(() => {
      prisma.attend.findMany = jest.fn();
      prisma.attend.deleteMany = jest.fn();
      prisma.attendhistory.createMany = jest.fn();
      prisma.$transaction = jest.fn(async (callback) => {
        return callback(prisma);
      });
    });

    it("should move attendance records to history and delete them", async () => {
      const mockAttend = [
        {
          attend_id: 1,
          employee_id: 1,
          firstname: "John",
          lastname: "Doe",
          check_in_time: new Date().toISOString(),
          check_out_time: new Date().toISOString(),
          working_hours: 8,
          status: "check_out",
        },
        {
          attend_id: 2,
          employee_id: 2,
          firstname: "Jane",
          lastname: "Doe",
          check_in_time: new Date().toISOString(),
          check_out_time: new Date().toISOString(),
          working_hours: 7,
          status: "check_out",
        },
      ];

      // Mocking the findMany to return attendance records
      prisma.attend.findMany.mockResolvedValue(mockAttend);

      // Mocking the $transaction
      prisma.$transaction.mockResolvedValue(null);

      // Calling the API to delete attendance records
      const response = await request(router)
        .delete("/api/attend") // Assuming route is DELETE /api/attend
        .send();

      // Check the response
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Attendance records moved to history and deleted successfully"
      );

      // Verify the correct methods were called
      expect(prisma.attend.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.attendhistory.createMany).toHaveBeenCalledTimes(1);
      expect(prisma.attendhistory.createMany).toHaveBeenCalledWith({
        data: [
          {
            attend_id: 1,
            employee_id: 1,
            firstname: "John",
            lastname: "Doe",
            check_in_time: mockAttend[0].check_in_time,
            check_out_time: mockAttend[0].check_out_time,
            working_hours: 8,
            status: "check_out",
          },
          {
            attend_id: 2,
            employee_id: 2,
            firstname: "Jane",
            lastname: "Doe",
            check_in_time: mockAttend[1].check_in_time,
            check_out_time: mockAttend[1].check_out_time,
            working_hours: 7,
            status: "check_out",
          },
        ],
      });

      expect(prisma.attend.deleteMany).toHaveBeenCalledTimes(1);
      expect(prisma.attend.deleteMany).toHaveBeenCalledWith({
        where: {
          attend_id: { in: [1, 2] },
        },
      });
    });

    it("should handle errors correctly", async () => {
      // Mocking error on findMany
      prisma.attend.findMany.mockRejectedValue(new Error("Database error"));

      const response = await request(router).delete("/api/attend").send();

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Failed to remove attendance record");
    });
  });
  afterAll(() => {
    jest.clearAllMocks(); // Clear all mocks after tests
  });
  
});
