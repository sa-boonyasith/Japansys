import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Progress = () => {
  // ข้อมูลตัวอย่างของโปรเจค
  const projects = [
    { id: 1, name: "Project A", progress: 70 },
    { id: 2, name: "Project B", progress: 40 },
    { id: 3, name: "Project C", progress: 90 },
    { id: 4, name: "Project D", progress: 25 },
  ];

  return (
    <div className="flex flex-wrap gap-6 p-6  min-h-screen">
      {/* แสดงการ์ดแต่ละโปรเจค */}
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white p-4 rounded-lg shadow-lg w-64"
        >
          {/* ชื่อโปรเจค */}
          <h2 className="text-center text-lg font-bold mb-4">
            {project.name}
          </h2>

          {/* Circular Progress */}
          <div className="w-32 mx-auto">
            <CircularProgressbar
              value={project.progress}
              text={`${project.progress}%`}
              styles={buildStyles({
                pathColor: "#3b82f6", // สีเส้นวงกลม
                textColor: "#3b82f6", // สีข้อความ
                trailColor: "#d1d5db", // สีเส้นที่ยังไม่เต็ม
                backgroundColor: "#ffffff",
              })}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Progress;
