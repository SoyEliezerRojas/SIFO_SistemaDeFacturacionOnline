import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Invoice } from './invoice.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  generateInvoice(invoice: Invoice): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Configuración de fuentes y colores
    doc.setFontSize(16);
    doc.setTextColor(26, 54, 93); // Color primario

    // Información del proveedor (izquierda)
    doc.setFontSize(12);
    doc.text('Daniel Chircovich', margin, yPosition);
    yPosition += 6;
    doc.setFontSize(10);
    doc.text('RUC: 10155822932', margin, yPosition);
    yPosition += 5;
    doc.text('Address: October 18 urbanization, house E 35. Huacho - Lima', margin, yPosition);
    yPosition += 10;

    // Fecha y número de factura (derecha)
    doc.setFontSize(10);
    const formattedDate = this.formatDate(invoice.date);
    const dateText = `Date: ${formattedDate}`;
    const invoiceNumberText = `N°. ${invoice.invoiceNumber}`;
    const dateWidth = doc.getTextWidth(dateText);
    const invoiceWidth = doc.getTextWidth(invoiceNumberText);
    doc.text(dateText, pageWidth - margin - dateWidth, margin);
    doc.text(invoiceNumberText, pageWidth - margin - invoiceWidth, margin + 5);
    yPosition = margin + 15;

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Información del cliente
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Supplier name:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.supplierName, margin + 40, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Contact:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.supplierContact, margin + 40, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Supplier address:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.supplierAddress, margin + 40, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Email:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.supplierEmail, margin + 40, yPosition);
    yPosition += 15;

    // Tabla de items
    const tableStartY = yPosition;
    const colWidths = [15, 80, 20, 30, 30];
    const colX = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], 
                  margin + colWidths[0] + colWidths[1] + colWidths[2], 
                  margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]];

    // Encabezados de tabla
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(26, 54, 93);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('#', colX[0] + 2, yPosition + 6);
    doc.text('ITEM & DESCRIPTION', colX[1] + 2, yPosition + 6);
    doc.text('QTY', colX[2] + 2, yPosition + 6);
    doc.text('UNIT PRICE', colX[3] + 2, yPosition + 6);
    doc.text('TOTAL PRICE', colX[4] + 2, yPosition + 6);
    yPosition += 8;
    doc.setTextColor(0, 0, 0);

    // Filas de items
    doc.setFont('helvetica', 'normal');
    invoice.items.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }

      const rowHeight = 8;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      
      doc.text((index + 1).toString(), colX[0] + 2, yPosition + 5);
      
      // Descripción (puede ser multilínea)
      const descLines = doc.splitTextToSize(item.description || '', colWidths[1] - 4);
      doc.text(descLines, colX[1] + 2, yPosition + 5);
      
      doc.text(item.quantity.toString(), colX[2] + 2, yPosition + 5);
      doc.text(item.unitPrice.toFixed(2), colX[3] + 2, yPosition + 5);
      doc.text(item.totalPrice.toFixed(2), colX[4] + 2, yPosition + 5);
      
      yPosition += Math.max(rowHeight, descLines.length * 5);
    });

    // Línea final de tabla
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;

    // Subtotal y Total
    doc.setFont('helvetica', 'bold');
    const subtotalX = pageWidth - margin - colWidths[3] - colWidths[4];
    doc.text('SUBTOTAL:', subtotalX, yPosition);
    doc.text(invoice.subtotal.toFixed(2), colX[4] + 2, yPosition);
    yPosition += 8;

    doc.line(subtotalX, yPosition - 3, pageWidth - margin, yPosition - 3);
    yPosition += 2;

    doc.text('TOTAL:', subtotalX, yPosition);
    doc.setFontSize(12);
    doc.text(invoice.total.toFixed(2), colX[4] + 2, yPosition);
    yPosition += 15;

    // Información adicional
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Delivery time:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.deliveryTime || '', margin + 40, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Offer Validity:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.offerValidity || '', margin + 40, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Pay conditions:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.payConditions || '', margin + 40, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(invoice.notes || '', pageWidth - 2 * margin - 40);
    doc.text(notesLines, margin + 40, yPosition);
    yPosition += notesLines.length * 5 + 10;

    // Información de contacto al final
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('centritechs@gmail.com', margin, yPosition);
    yPosition += 5;
    doc.text('Contact: +58 0241 8584483, +39 3519450871, +58 414 4039891', margin, yPosition);

    // Guardar PDF
    doc.save(`Factura_${invoice.invoiceNumber}.pdf`);
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '00/00/0000';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  }
}

