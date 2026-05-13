/**
 * Receipt Printer Utility
 * 
 * Generates a formatted receipt HTML and opens the browser's print dialog.
 * Works with ANY printer connected to the computer — thermal, laser, or inkjet.
 * 
 * For thermal printers: set paper size to 80mm or 58mm in printer settings.
 */

import type { CompletedOrder } from '@/store/Order.store';

interface ReceiptConfig {
  restaurantName: string;
  address: string;
  phone: string;
  gstNumber?: string;
  fssaiNumber?: string;
  footerText?: string;
}

const DEFAULT_CONFIG: ReceiptConfig = {
  restaurantName: 'Spicy Kitchen',
  address: 'Bhubaneswar, Odisha',
  phone: '',
  gstNumber: '',
  fssaiNumber: '',
  footerText: 'Thank you for your order!',
};

export function printReceipt(order: CompletedOrder, config: ReceiptConfig = DEFAULT_CONFIG) {
  const receiptHTML = generateReceiptHTML(order, config);
  
  // Open a new window for printing
  const printWindow = window.open('', '_blank', 'width=300,height=600');
  if (!printWindow) {
    alert('Please allow popups to print receipts');
    return;
  }

  printWindow.document.write(receiptHTML);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    // Close after printing (or cancel)
    printWindow.onafterprint = () => printWindow.close();
  };
}

export function printKOT(
  kotNumber: number,
  tableNumber: number,
  areaName: string,
  items: { name: string; quantity: number }[],
  restaurantName: string = 'Spicy Kitchen',
) {
  const kotHTML = generateKOTHTML(kotNumber, tableNumber, areaName, items, restaurantName);

  const printWindow = window.open('', '_blank', 'width=300,height=400');
  if (!printWindow) {
    alert('Please allow popups to print KOT');
    return;
  }

  printWindow.document.write(kotHTML);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${mins}`;
}

function generateReceiptHTML(order: CompletedOrder, config: ReceiptConfig): string {
  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="text-align:left;padding:2px 0;">${item.quantity}x ${item.name}</td>
        <td style="text-align:right;padding:2px 0;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt #${order.orderNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      width: 280px;
      margin: 0 auto;
      padding: 8px;
      color: #000;
    }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .divider {
      border-top: 1px dashed #000;
      margin: 6px 0;
    }
    table { width: 100%; border-collapse: collapse; }
    .total-row td {
      font-weight: bold;
      font-size: 14px;
      padding: 4px 0;
      border-top: 1px dashed #000;
    }
    @media print {
      body { width: 100%; padding: 0; }
      @page { margin: 2mm; size: 80mm auto; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="center bold" style="font-size:16px;margin-bottom:4px;">
    ${config.restaurantName}
  </div>
  <div class="center" style="font-size:10px;">
    ${config.address}
  </div>
  ${config.phone ? `<div class="center" style="font-size:10px;">Tel: ${config.phone}</div>` : ''}
  ${config.gstNumber ? `<div class="center" style="font-size:10px;">GST: ${config.gstNumber}</div>` : ''}
  ${config.fssaiNumber ? `<div class="center" style="font-size:10px;">FSSAI: ${config.fssaiNumber}</div>` : ''}

  <div class="divider"></div>

  <!-- Order Info -->
  <table>
    <tr>
      <td>Bill No: ${order.orderNumber}</td>
      <td style="text-align:right">Table: ${order.tableNumber}</td>
    </tr>
    <tr>
      <td>Type: Dine In</td>
      <td style="text-align:right">${order.areaName}</td>
    </tr>
    <tr>
      <td colspan="2">Date: ${formatDate(new Date(order.settledAt))}</td>
    </tr>
    <tr>
      <td colspan="2">Biller: ${order.billerName}</td>
    </tr>
  </table>

  <div class="divider"></div>

  <!-- Items Header -->
  <table>
    <tr style="font-weight:bold;">
      <td style="text-align:left;padding:2px 0;">Item</td>
      <td style="text-align:right;padding:2px 0;">Amount</td>
    </tr>
  </table>

  <div style="border-top:1px solid #000;margin:2px 0;"></div>

  <!-- Items -->
  <table>
    ${itemsRows}
  </table>

  <div class="divider"></div>

  <!-- Totals -->
  <table>
    <tr>
      <td>Subtotal</td>
      <td style="text-align:right">₹${order.subtotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td>SGST (2.5%)</td>
      <td style="text-align:right">₹${order.sgst.toFixed(2)}</td>
    </tr>
    <tr>
      <td>CGST (2.5%)</td>
      <td style="text-align:right">₹${order.cgst.toFixed(2)}</td>
    </tr>
    <tr class="total-row">
      <td>TOTAL</td>
      <td style="text-align:right">₹${order.total.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Payment</td>
      <td style="text-align:right">${order.paymentMethod}</td>
    </tr>
  </table>

  <div class="divider"></div>

  <!-- Footer -->
  <div class="center" style="font-size:10px;margin-top:4px;">
    ${config.footerText || 'Thank you!'}
  </div>
  <div class="center" style="font-size:9px;margin-top:2px;color:#666;">
    Powered by DineFlow POS
  </div>
</body>
</html>`;
}

function generateKOTHTML(
  kotNumber: number,
  tableNumber: number,
  areaName: string,
  items: { name: string; quantity: number }[],
  restaurantName: string,
): string {
  const now = new Date();
  const itemsRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:4px 0;font-size:14px;font-weight:bold;">${item.quantity} x ${item.name}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>KOT #${kotNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      width: 280px;
      margin: 0 auto;
      padding: 8px;
      color: #000;
    }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .divider { border-top: 1px dashed #000; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; }
    @media print {
      body { width: 100%; padding: 0; }
      @page { margin: 2mm; size: 80mm auto; }
    }
  </style>
</head>
<body>
  <div class="center bold" style="font-size:18px;margin-bottom:4px;">
    *** KOT ***
  </div>
  <div class="center" style="font-size:11px;">${restaurantName}</div>

  <div class="divider"></div>

  <table>
    <tr>
      <td class="bold">KOT #${kotNumber}</td>
      <td style="text-align:right" class="bold">Table: ${tableNumber}</td>
    </tr>
    <tr>
      <td>Area: ${areaName}</td>
      <td style="text-align:right">${formatDate(now)}</td>
    </tr>
  </table>

  <div class="divider"></div>

  <table>
    ${itemsRows}
  </table>

  <div class="divider"></div>

  <div class="center" style="font-size:10px;">
    Total Items: ${items.reduce((sum, i) => sum + i.quantity, 0)}
  </div>
</body>
</html>`;
}