const prisma = require("../config/prisma");

exports.list = async (req, res) => {
    try {
        const listIncome = await prisma.income.findMany({
            orderBy: { date: 'desc' }
        });
        res.json({ listIncome });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to retrieve income records" });
    }
}

exports.create = async (req, res) => {
    try {
        const { desc, date } = req.body;

        // คำนวณช่วงเวลาเดือนปัจจุบัน
        const startDate = new Date(date);
        startDate.setDate(1); // ตั้งให้เป็นวันแรกของเดือน
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); // ตั้งให้เป็นวันสุดท้ายของเดือน

        // ดึงข้อมูล invoice และ receipt ในเดือนนั้น
        const invoices = await prisma.invoice.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: { invoice_id: true, total_all: true, date: true }
        });

        const receipts = await prisma.receipt.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: { receipt_id: true, total_all: true, date: true }
        });

        // เพิ่ม source ระบุว่าเป็น "invoice" หรือ "receipt"
        const invoicesWithSource = invoices.map(inv => ({
            ...inv,
            source: "invoice"
        }));

        const receiptsWithSource = receipts.map(rec => ({
            ...rec,
            source: "receipt"
        }));

        // รวมรายการทั้งหมด
        const allTransactions = [...invoicesWithSource, ...receiptsWithSource];

        // คำนวณยอดรวม
        const totalIncome = allTransactions.reduce((sum, item) => sum + item.total_all, 0);

        // บันทึกข้อมูลลง Income
        const income = await prisma.income.create({
            data: {
                desc,
                money: totalIncome,
                total: totalIncome,
                date,
                income_startdate: startDate,
                income_enddate: endDate,
                source: "system" // หรือจะให้มาจาก invoice/receipt?
            }
        });

        // ส่ง JSON รายละเอียดกลับไป
        res.status(201).json({
            message: "สร้างรายการรายรับสำเร็จ",
            month: startDate.toISOString().slice(0, 7), // แสดงเฉพาะปี-เดือน
            total_income: totalIncome,
            transactions: allTransactions // รวม invoice + receipt พร้อม source
        });

    } catch (err) {
        console.error("Error creating income:", err);
        res.status(500).json({ error: "Failed to create income" });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { desc, date } = req.body;

        // ตรวจสอบว่ามี date และเป็นรูปแบบที่ถูกต้อง
        if (!date || isNaN(new Date(date))) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        // ตรวจสอบว่า income มีอยู่จริงหรือไม่
        const existingIncome = await prisma.income.findUnique({
            where: { income_id: Number(id) }
        });

        if (!existingIncome) {
            return res.status(404).json({ error: "Income not found" });
        }

        // คำนวณช่วงเวลาเดือนปัจจุบัน
        const startDate = new Date(date);
        startDate.setDate(1); // ตั้งให้เป็นวันแรกของเดือน
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); // ตั้งให้เป็นวันสุดท้ายของเดือน

        // ดึงข้อมูล invoice และ receipt ในเดือนนั้น (เหมือนกับ create)
        const invoices = await prisma.invoice.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: { invoice_id: true, total_all: true, date: true }
        });

        const receipts = await prisma.receipt.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: { receipt_id: true, total_all: true, date: true }
        });

        // เพิ่ม source ระบุว่าเป็น "invoice" หรือ "receipt"
        const invoicesWithSource = invoices.map(inv => ({
            ...inv,
            source: "invoice"
        }));

        const receiptsWithSource = receipts.map(rec => ({
            ...rec,
            source: "receipt"
        }));

        // รวมรายการทั้งหมด
        const allTransactions = [...invoicesWithSource, ...receiptsWithSource];

        // คำนวณยอดรวม
        const totalIncome = allTransactions.reduce((sum, item) => sum + item.total_all, 0);

        // อัปเดตข้อมูล Income
        const updatedIncome = await prisma.income.update({
            where: { income_id: Number(id) },
            data: {
                desc,
                money: totalIncome,
                total: totalIncome,
                date,
                income_startdate: startDate,
                income_enddate: endDate,
                source: "system" // หรือจะให้มาจาก invoice/receipt?
            }
        });

        res.status(200).json({
            message: "อัปเดตรายการรายรับสำเร็จ",
            updated_income: updatedIncome,
            transactions: allTransactions // รวม invoice + receipt พร้อม source
        });

    } catch (err) {
        console.error("Error updating income:", err);
        res.status(500).json({ error: "Failed to update income" });
    }
};


exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        // ตรวจสอบว่า income_id มีอยู่หรือไม่
        const existingIncome = await prisma.income.findUnique({
            where: { income_id: Number(id) }
        });

        if (!existingIncome) {
            return res.status(404).json({ error: "Income not found" });
        }

        // ลบรายการ income
        await prisma.income.delete({
            where: { income_id: Number(id) }
        });

        // ส่ง JSON ตอบกลับ
        res.status(200).json({
            message: "ลบรายรับสำเร็จ",
            deleted_income_id: Number(id)
        });

    } catch (err) {
        console.error("Error deleting income:", err);
        res.status(500).json({ error: "Failed to delete income" });
    }
};
