import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";

const Progress = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/project");
        console.log(response.data); // Debug เพื่อดูโครงสร้างข้อมูล

        // เข้าถึง listProject ที่เป็นอาเรย์
        const data = response.data.listProject.map((project) => ({
          id: project.project_id,
          name : project.project_name,
          progressCircle: project.progress_circle,
        }));
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError("Failed to fetch projects");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-wrap gap-6 p-6 max-h-[20px]">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white p-4 rounded-lg shadow-lg w-64"
        >
          <h2 className="text-center text-lg font-bold mb-4">
          {project.name}
          </h2>
          <div className="w-32 mx-auto">
            <CircularProgressbar
              value={project.progressCircle}
              text={
                <tspan className="font-bold text-black">
                  {`${project.progressCircle} %`}
                </tspan>
              }
              styles={buildStyles({
                pathColor: "#3b82f6",
                textColor:"#000000",
                trailColor: "#d1d5db",
              })}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Progress;
