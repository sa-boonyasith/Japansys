import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Progress = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateValue, setAnimateValue] = useState({});
  const projectsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/project");
        const data = await response.json();
        const formattedData = data.listProject.map((project) => ({
          id: project.project_id,
          name: project.project_name,
          progressCircle: project.progress_circle,
        }));
        setProjects(formattedData);
        
        // Initialize animation values
        const initialValues = {};
        formattedData.forEach(project => {
          initialValues[project.id] = 0;
        });
        setAnimateValue(initialValues);
        
        // Start animation after data is loaded
        setTimeout(() => {
          const finalValues = {};
          formattedData.forEach(project => {
            finalValues[project.id] = project.progressCircle;
          });
          setAnimateValue(finalValues);
        }, 100);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError("Failed to fetch projects");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Pagination calculation
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-3  min-h-[400px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white  rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <h2 className="text-center text-xl font-bold mb-6 text-gray-800">
              {project.name}
            </h2>
            <div className="w-40 h-40 mx-auto transition-all duration-1000 ease-out">
              <CircularProgressbar
                value={animateValue[project.id] || 0}
                text={`${Math.round(animateValue[project.id] || 0)}%`}
                styles={buildStyles({
                  pathColor: `rgba(0, 113, 240, ${animateValue[project.id] / 100})`,
                  textColor: "#1f2937",
                  trailColor: "#f3f4f6",
                  pathTransition: "ease-out 1s",
                  textSize: "16px",
                  strokeLinecap: "round",
                })}
              />
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            }`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`w-10 h-10 rounded-lg transition-colors ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Progress;