import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService, Invoice, InvoiceItem } from '../../services/invoice.service';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss']
})
export class NewInvoiceComponent implements OnInit {
  invoice: Partial<Invoice> = {
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    supplierName: '',
    supplierContact: '',
    supplierAddress: '',
    supplierEmail: '',
    items: [],
    subtotal: 0,
    total: 0,
    deliveryTime: '',
    offerValidity: '',
    payConditions: '',
    notes: ''
  };

  newItem: Partial<InvoiceItem> = {
    description: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0
  };

  error: string = '';
  success: string = '';
  loading: boolean = false;

  constructor(
    private invoiceService: InvoiceService,
    private pdfService: PdfService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generateInvoiceNumber();
  }

  generateInvoiceNumber(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoice.invoiceNumber = `${year}${month}${day}${random}`;
  }

  addItem(): void {
    if (!this.newItem.description || !this.newItem.quantity || !this.newItem.unitPrice) {
      this.error = 'Por favor, complete todos los campos del item';
      return;
    }

    const item: InvoiceItem = {
      description: this.newItem.description || '',
      quantity: this.newItem.quantity || 0,
      unitPrice: this.newItem.unitPrice || 0,
      totalPrice: (this.newItem.quantity || 0) * (this.newItem.unitPrice || 0)
    };

    this.invoice.items = this.invoice.items || [];
    this.invoice.items.push(item);
    this.calculateTotals();

    // Resetear formulario de item
    this.newItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
  }

  removeItem(index: number): void {
    if (this.invoice.items) {
      this.invoice.items.splice(index, 1);
      this.calculateTotals();
    }
  }

  calculateTotals(): void {
    if (!this.invoice.items) {
      this.invoice.subtotal = 0;
      this.invoice.total = 0;
      return;
    }

    this.invoice.subtotal = this.invoice.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.invoice.total = this.invoice.subtotal;
  }

  validateForm(): boolean {
    if (!this.invoice.invoiceNumber || !this.invoice.date) {
      this.error = 'Por favor, complete el número y fecha de factura';
      return false;
    }

    if (!this.invoice.supplierName || !this.invoice.supplierEmail) {
      this.error = 'Por favor, complete al menos el nombre y email del cliente';
      return false;
    }

    if (!this.invoice.items || this.invoice.items.length === 0) {
      this.error = 'Debe agregar al menos un item a la factura';
      return false;
    }

    return true;
  }

  saveInvoice(): void {
    this.error = '';
    this.success = '';

    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    this.invoiceService.createInvoice(this.invoice as Omit<Invoice, 'id' | 'createdAt'>).subscribe(
      (savedInvoice) => {
        this.loading = false;
        this.success = 'Factura guardada correctamente';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      (err) => {
        this.loading = false;
        this.error = 'Error al guardar la factura';
        console.error(err);
      }
    );
  }

  generatePDF(): void {
    this.error = '';
    this.success = '';

    if (!this.validateForm()) {
      return;
    }

    try {
      this.pdfService.generateInvoice(this.invoice as Invoice);
      this.success = 'PDF generado correctamente';
    } catch (err) {
      this.error = 'Error al generar el PDF';
      console.error(err);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

