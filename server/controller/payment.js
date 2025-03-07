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
        const { id } = req.params;
        const { desc, date } = req.body;

        if (!id) {
            return res.status(400).json({ error: "ต้องระบุ payment_id เพื่ออัปเดตข้อมูล" });
        }

        // คำนวณช่วงเวลาการจ่ายเงินใหม่
        const startDate = new Date(date);
        startDate.setDate(1);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);

        // ดึงข้อมูลเงินเดือนที่ตรงกับช่วงเวลาที่กำหนด
        const salaries = await prisma.salary.findMany({
            where: {
                payroll_startdate: { gte: startDate },
                payroll_enddate: { lte: endDate },
                status: "Paid"
            },
            select: { salary_id: true, salary_total: true }
        });

        const totalPayment = salaries.reduce((sum, item) => sum + item.salary_total, 0);

        // อัปเดตข้อมูลการจ่ายเงิน
        const updatedPayment = await prisma.payment.update({
            where: { payment_id: Number(id) },
            data: {
                desc,
                money: totalPayment,
                total: totalPayment,
                date,
                payment_startdate: startDate,
                payment_enddate: endDate
            }
        });

        res.status(200).json({
            message: "อัปเดตรายการจ่ายเงินสำเร็จ",
            month: startDate.toISOString().slice(0, 7),
            total_payment: totalPayment,
            transactions: salaries
        });

    } catch (err) {
        console.error("Error updating payment:", err);
        res.status(500).json({ error: "Failed to update payment" });
    }
};


exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ต้องระบุ payment_id เพื่อทำการลบ" });
        }

        // ตรวจสอบว่ามีรายการนี้อยู่หรือไม่
        const existingPayment = await prisma.payment.findUnique({
            where: { payment_id: Number(id) }
        });

        if (!existingPayment) {
            return res.status(404).json({ error: "ไม่พบรายการจ่ายเงินที่ต้องการลบ" });
        }

        // ทำการลบ
        await prisma.payment.delete({
            where: { payment_id: Number(id) }
        });

        res.status(200).json({ message: "ลบรายการจ่ายเงินสำเร็จ" });

    } catch (err) {
        console.error("Error deleting payment:", err);
        res.status(500).json({ error: "Failed to delete payment" });
    }
};
