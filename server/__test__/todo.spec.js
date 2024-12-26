const request = require("supertest");
const prisma = require("../config/prisma");
const app = require("../server"); // assuming you export your Express app

jest.mock("../config/prisma", () => ({
  todo: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Todo API", () => {
  describe("GET /api/todo", () => {
    it("should return a list of projects", async () => {
      const mockProjects = [
        { project_id: 1, project_name: "Project 1", desc: "Description 1" },
        { project_id: 2, project_name: "Project 2", desc: "Description 2" },
      ];

      prisma.todo.findMany.mockResolvedValue(mockProjects);

      const response = await request(app).get("/api/todo");

      expect(response.status).toBe(200);
      expect(response.body.listproject).toEqual(mockProjects);
    });
  });

  describe("POST /api/todo", () => {
    it("should create a new project", async () => {
      const newProject = {
        project_name: "Test Project",
        desc: "Test Description",
        employee_id: 1,
      };

      const mockProject = {
        project_id: 1,
        project_name: "Test Project",
        desc: "Test Description",
        employee_id: 1,
      };

      prisma.todo.create.mockResolvedValue(mockProject);

      const response = await request(app)
        .post("/api/todo")
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Project created successfully");
      expect(response.body.newproject).toEqual(mockProject);
    });

    it("should return an error when employee_id is missing", async () => {
      const newProject = {
        project_name: "Test Project",
        desc: "Test Description",
      };

      const response = await request(app)
        .post("/api/todo")
        .send(newProject);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid or missing employee ID");
    });
  });

  describe("PUT /api/todo/:id", () => {
    it("should update an existing project", async () => {
      const updatedProjectData = {
        project_name: "Updated Project",
        desc: "Updated Description",
        status: "inprogress",
        employee_id: 1,
      };

      const mockUpdatedProject = {
        project_id: 1,
        project_name: "Updated Project",
        desc: "Updated Description",
        status: "inprogress",
        employee_id: 1,
      };

      prisma.todo.findUnique.mockResolvedValue({
        project_id: 1,
        project_name: "Test Project",
        desc: "Test Description",
        employee_id: 1,
      });

      prisma.todo.update.mockResolvedValue(mockUpdatedProject);

      const response = await request(app)
        .put("/api/todo/1")
        .send(updatedProjectData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Project updated successfully");
      expect(response.body.updatedProject).toEqual(mockUpdatedProject);
    });

    it("should return an error if the project doesn't exist", async () => {
      prisma.todo.findUnique.mockResolvedValue(null);

      const response = await request(app).put("/api/todo/999").send({
        project_name: "Non-existent Project",
        desc: "Description",
        status: "inprogress",
        employee_id: 1,
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Project not found");
    });
  });

  describe("DELETE /api/todo/:id", () => {
    it("should delete a project", async () => {
      const mockDeletedProject = {
        project_id: 1,
        project_name: "Test Project",
        desc: "Test Description",
        employee_id: 1,
      };

      prisma.todo.delete.mockResolvedValue(mockDeletedProject);

      const response = await request(app).delete("/api/todo/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Deleted succesfully");
      expect(response.body.deleted).toEqual(mockDeletedProject);
    });

  });
});