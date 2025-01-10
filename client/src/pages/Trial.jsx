import React from "react";

const Trial = () => {
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2">ชื่อ</th>
              <th className="border border-gray-300 px-4 py-2">ตำแหน่ง</th>
              <th className="border border-gray-300 px-4 py-2">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Firstname Lastname</td>
              <td className="border border-gray-300 px-4 py-2">Job Position</td>
              <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-4">
                <button
                  className="text-green-500 hover:text-green-700"
                  aria-label="Confirm"
                >
                  ✔
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete"
                >
                  ✖
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trial;
