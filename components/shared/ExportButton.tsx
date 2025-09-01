'use client';
import { formatDateTime, formatPrice } from '@/lib/utils';
import { IOrder } from '@/types';
import { Button } from '../ui/button';
import { saveAs } from 'file-saver'; // Import file-saver
import ExcelJS from 'exceljs'; // Import exceljs
const ExportButton = ({ orders}: { orders: IOrder[]}) => {
const handleDownloadExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Orders');

  worksheet.addRow([
    'Order ID',
    'Present',
    'User Email',
    'Full Name',
    'Booked',
    'Amount',
  ]);

  orders.forEach((order) => {
    worksheet.addRow([
      order.id,
      order.used ? "Yes" : "No",
      order.buyer?.email,
      `${order.buyer?.firstName} ${order.buyer?.lastName}`,
      formatDateTime(order.createdAt).dateTime,
      formatPrice(order.totalAmount || ""),
    ]);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, `orders-${orders[0].event?.title}.xlsx`);
};
  return (
    <Button className="button rounded-full" onClick={handleDownloadExcel}>
      Export to Excel
    </Button>
  );
};
export default ExportButton;
