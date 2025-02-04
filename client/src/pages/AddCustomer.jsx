import React, { useEffect, useState } from "react";
import axios from "axios";

const AddCustomer = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/customer");
        setCustomers(response.data.listCustomer); // อัปเดต state ด้วยข้อมูลจาก API
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []); // โหลดข้อมูลแค่ครั้งเดียวตอนคอมโพเนนต์เรนเดอร์

  return (
    <div>
      <h2>Customer List</h2>
      <ul>
        {customers.length > 0 ? (
          customers.map((customer) => (
            <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td>
                {customer.cus_company_name} {customer.contact_name} {customer.cus_address} {customer.cus_phone} {customer.cus_tax_id}
            </td>
            </tr>
          ))
        ) : (
          <p>กำลังโหลดข้อมูล...</p>
        )}
      </ul>
    </div>
  );
};

export default AddCustomer;
