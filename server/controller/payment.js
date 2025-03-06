const prisma = require("../config/prisma");

exports.list = async (req, res) => {
    try {
        const listPayment = await prisma.payment.findMany({
            orderBy: { date: 'desc' }
        });
        res.json({ listPayment });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to retrieve payment records" });
    }
}

exports.create = async (req, res) => {
    try {
        const { desc, date } = req.body;

        const startDate = new Date(date);
        startDate.setDate(1);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);

        const salaries = await prisma.salary.findMany({
            where: {
                payroll_startdate: {
                    gte: startDate
                },
                payroll_enddate: {
                    lte: endDate
                },
                status: "Paid"  // เพิ่มเงื่อนไขให้รวมเฉพาะที่มีสถานะ "Paid"
            },
            select: { salary_id: true, salary_total: true, payroll_startdate: true, payroll_enddate: true }
        });

        const totalPayment = salaries.reduce((sum, item) => sum + item.salary_total, 0);

        const payment = await prisma.payment.create({
            data: {
                desc,
                money: totalPayment,
                total: totalPayment,
                date,
                payment_startdate: startDate,
                payment_enddate: endDate,
                source: "salary"
            }
        });

        res.status(201).json({
            message: "สร้างรายการจ่ายเงินสำเร็จ",
            month: startDate.toISOString().slice(0, 7),
            total_payment: totalPayment,
            transactions: salaries
        });
    } catch (err) {
        console.error("Error creating payment:", err);
        res.status(500).json({ error: "Failed to create payment" });
    }
};


exports.update = async (req, res) => {
    try {
        const { id } = req.params; // รับค่า payment_id จาก URL
        const { desc, date, money, total } = req.body; // รับค่าที่ต้องการอัปเดต

        // ตรวจสอบว่ามีรายการ payment นี้อยู่หรือไม่
        const existingPayment = await prisma.payment.findUnique({
            where: { payment_id: Number(id) }
        });

        if (!existingPayment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        // อัปเดตรายการจ่ายเงิน
        const updatedPayment = await prisma.payment.update({
            where: { payment_id: Number(id) },
            data: { desc, date, money, total }
        });

        res.status(200).json({
            message: "อัปเดตรายการจ่ายเงินสำเร็จ",
            updated_payment: updatedPayment
        });
    } catch (err) {
        console.error("Error updating payment:", err);
        res.status(500).json({ error: "Failed to update payment" });
    }
};


exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const existingpayment = await prisma.payment.findUnique({
            where: { payment_id: Number(id) }
        });

        if (!existingpayment) {
            return res.status(404).json({ error: "payment not found" });
        }


        await prisma.payment.delete({
            where: { payment_id: Number(id) }
        });

        // ส่ง JSON ตอบกลับ
        res.status(200).json({
            message: "ลบรายจ่ายสำเร็จ",
            deleted_payment_id: Number(id)
        });

    } catch (err) {
        console.error("Error deleting payment:", err);
        res.status(500).json({ error: "Failed to delete payment" });
    }
};