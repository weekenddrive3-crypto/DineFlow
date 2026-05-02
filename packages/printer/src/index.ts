/**
 * Thermal Printer Service
 *
 * Handles receipt and KOT printing via ESC/POS protocol.
 * Supports 58mm and 80mm paper widths.
 *
 * Usage:
 *   const printer = new ReceiptPrinter({ printerName: 'POS-80', paperWidth: 80 });
 *   await printer.printReceipt(orderData);
 *   await printer.printKOT(kotData);
 */

export interface PrinterConfig {
  printerName: string;
  paperWidth: 58 | 80;
  interface?: string; // 'tcp://192.168.1.100' or 'printer:POS-80'
}

export interface ReceiptData {
  outletName: string;
  outletAddress: string;
  outletPhone: string;
  gstNumber?: string;
  fssaiNumber?: string;
  billNumber: number;
  orderNumber: number;
  orderType: string;
  tableNumber?: number;
  billerName: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  sgst: number;
  cgst: number;
  total: number;
  paymentMethod: string;
  date: string;
  footerText?: string;
}

export interface KOTData {
  kotNumber: number;
  orderNumber: number;
  tableNumber?: number;
  orderType: string;
  items: {
    name: string;
    quantity: number;
    notes?: string;
  }[];
  date: string;
  billerName: string;
}

export class ReceiptPrinter {
  private config: PrinterConfig;

  constructor(config: PrinterConfig) {
    this.config = config;
  }

  /**
   * Print a bill receipt
   * TODO: Implement with node-thermal-printer when hardware is connected
   */
  async printReceipt(data: ReceiptData): Promise<{ success: boolean; error?: string }> {
    try {
      // const ThermalPrinter = require('node-thermal-printer').printer;
      // const PrinterTypes = require('node-thermal-printer').types;
      //
      // const printer = new ThermalPrinter({
      //   type: PrinterTypes.EPSON,
      //   interface: this.config.interface || `printer:${this.config.printerName}`,
      //   width: this.config.paperWidth === 80 ? 48 : 32,
      // });
      //
      // printer.alignCenter();
      // printer.bold(true);
      // printer.println(data.outletName);
      // printer.bold(false);
      // printer.println(data.outletAddress);
      // printer.println(`Tel: ${data.outletPhone}`);
      // if (data.gstNumber) printer.println(`GST: ${data.gstNumber}`);
      // printer.drawLine();
      //
      // printer.alignLeft();
      // printer.println(`Bill No: ${data.billNumber}  Order: ${data.orderNumber}`);
      // printer.println(`Type: ${data.orderType}  Table: ${data.tableNumber || '-'}`);
      // printer.println(`Date: ${data.date}`);
      // printer.println(`Biller: ${data.billerName}`);
      // printer.drawLine();
      //
      // // Items
      // for (const item of data.items) {
      //   printer.tableCustom([
      //     { text: `${item.quantity}x ${item.name}`, align: 'LEFT', width: 0.7 },
      //     { text: `${item.total.toFixed(2)}`, align: 'RIGHT', width: 0.3 },
      //   ]);
      // }
      //
      // printer.drawLine();
      // printer.tableCustom([
      //   { text: 'Subtotal:', align: 'LEFT', width: 0.6 },
      //   { text: data.subtotal.toFixed(2), align: 'RIGHT', width: 0.4 },
      // ]);
      // if (data.discount > 0) {
      //   printer.tableCustom([
      //     { text: 'Discount:', align: 'LEFT', width: 0.6 },
      //     { text: `-${data.discount.toFixed(2)}`, align: 'RIGHT', width: 0.4 },
      //   ]);
      // }
      // printer.tableCustom([
      //   { text: 'SGST:', align: 'LEFT', width: 0.6 },
      //   { text: data.sgst.toFixed(2), align: 'RIGHT', width: 0.4 },
      // ]);
      // printer.tableCustom([
      //   { text: 'CGST:', align: 'LEFT', width: 0.6 },
      //   { text: data.cgst.toFixed(2), align: 'RIGHT', width: 0.4 },
      // ]);
      // printer.drawLine();
      // printer.bold(true);
      // printer.tableCustom([
      //   { text: 'TOTAL:', align: 'LEFT', width: 0.6 },
      //   { text: `Rs. ${data.total.toFixed(2)}`, align: 'RIGHT', width: 0.4 },
      // ]);
      // printer.bold(false);
      // printer.println(`Payment: ${data.paymentMethod}`);
      //
      // if (data.footerText) {
      //   printer.drawLine();
      //   printer.alignCenter();
      //   printer.println(data.footerText);
      // }
      //
      // printer.cut();
      // await printer.execute();

      console.log('[PRINTER] Receipt printed:', data.billNumber);
      return { success: true };
    } catch (error: any) {
      console.error('[PRINTER] Receipt error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Print a KOT (Kitchen Order Ticket)
   */
  async printKOT(data: KOTData): Promise<{ success: boolean; error?: string }> {
    try {
      // Similar implementation with node-thermal-printer
      // KOTs are typically simpler: just items + table + order info
      console.log('[PRINTER] KOT printed:', data.kotNumber);
      return { success: true };
    } catch (error: any) {
      console.error('[PRINTER] KOT error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ReceiptPrinter;
