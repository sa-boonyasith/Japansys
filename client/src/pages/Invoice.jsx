import React from "react";
import logo from "../img/japanlogo.png";

const Invoice = () => {
  const [invoices, setInvoices] = React.useState([]);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:8080/api/invoice")
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data);
      })
      .catch((err) => console.error("Error fetching invoices:", err));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${thaiYear}`;
  };

  const formatNumber = (num) => {
    return num?.toLocaleString("th-TH", { minimumFractionDigits: 2 }) || "0.00";
  };

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="w-full">
      {/* Invoice List */}
      <div className="mb-8 p-4">
        <h2 className="text-xl font-bold mb-4">รายการใบแจ้งหนี้ทั้งหมด</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.invoice_id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => handleInvoiceClick(invoice)}
            >
              <p className="font-bold">เลขที่: {invoice.invoice_id}</p>
              <p>บริษัท: {invoice.customer?.cus_company_name}</p>
              <p>วันที่: {formatDate(invoice.date)}</p>
              <p>ยอดรวม: {formatNumber(invoice.total)} บาท</p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Invoice Details */}
      {selectedInvoice && (
        <div className="max-w-4xl mx-auto p-8 bg-white border rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold">ใบแจ้งหนี้ / ใบกำกับภาษี</h1>
              <h2 className="text-lg">Invoice / Tax Invoice</h2>
              <div className="mt-4">
                <p>ผู้ออก {selectedInvoice.customer?.cus_company_name}</p>
                <p>{selectedInvoice.customer?.cus_address}</p>
                <p>
                  เลขประจำตัวผู้เสียภาษี {selectedInvoice.customer?.cus_tax_id}{" "}
                  โทร {selectedInvoice.customer?.cus_phone}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={logo}
                alt="Company Logo"
                className="mt-5 w-[160px] h-[100px] object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 border border-gray-300">
            <div className="p-4">
              <p className="font-bold">
                ลูกค้า {selectedInvoice.customer?.cus_company_name}
              </p>
              <p>ที่อยู่ {selectedInvoice.customer?.cus_address}</p>
              <p>
                เลขประจำตัวผู้เสียภาษี {selectedInvoice.customer?.cus_tax_id}
              </p>
              <p>โทร {selectedInvoice.customer?.cus_phone}</p>
            </div>
            <div className="p-4 border-l border-gray-300">
              <p>เลขที่ {selectedInvoice.invoice_id}</p>
              <p>วันที่ {formatDate(selectedInvoice.date)}</p>
              <p>เครดิต 30 วัน</p>
            </div>
          </div>

          <table className="w-full mt-8 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray text-left p-2">ลำดับ</th>
                <th className="border border-gray-300 p-2 text-left">รายการ</th>
                <th className="border border-gray-300 p-2 text-right">จำนวน</th>
                <th className="border border-gray-300 p-2 text-right">ราคา</th>
                <th className="border border-gray-300 p-2 text-right">
                  ส่วนลด
                </th>
                <th className="border border-gray-300 p-2 text-right">
                  ราคารวม
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.items?.map((item, index) => (
                <tr key={item.item_id}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {item.product.name}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatNumber(item.product.price)}{" "}
                   
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatNumber(item.discount)}{" "}
                    {/* ใช้ discount จาก invoice_item */}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatNumber(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
            <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 p-2 text-right"
                >
                  รวมเป็นเงิน
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {formatNumber(selectedInvoice.subtotal)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 p-2 text-right"
                >
                  หักส่วนลด
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {formatNumber(selectedInvoice.discount)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 p-2 text-right"
                >
                  จำนวนเงินหลังหักส่วนลด
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {formatNumber(
                    selectedInvoice.subtotal - selectedInvoice.discount
                  )}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 p-2 text-right"
                >
                  ภาษีมูลค่าเพิ่ม {selectedInvoice.vat_rate}%
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {formatNumber(selectedInvoice.vat)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 p-2 text-right font-bold"
                >
                  จำนวนเงินทั้งสิ้น
                </td>
                <td className="border border-gray-300 p-2 text-right font-bold">
                  {formatNumber(selectedInvoice.total)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="grid grid-cols-2 gap-8 mt-8 text-center">
            <div>
              <div className="border-b border-gray-400 mb-2 h-8"></div>
              <p>ผู้รับใบเสร็จ</p>
              <p>วันที่ {formatDate(selectedInvoice.date)}</p>
            </div>
            <div>
              <div className="border-b border-gray-400 mb-2 h-8"></div>
              <p>ผู้ออกใบเสร็จ</p>
              <p>วันที่ {formatDate(selectedInvoice.date)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
