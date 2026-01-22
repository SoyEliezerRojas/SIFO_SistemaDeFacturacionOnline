import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  supplierName: string;
  supplierContact: string;
  supplierAddress: string;
  supplierEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  deliveryTime: string;
  offerValidity: string;
  payConditions: string;
  notes: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private invoices: Invoice[] = [];

  constructor(private http: HttpClient) {
    this.loadInvoices();
  }

  private loadInvoices(): void {
    this.http.get<Invoice[]>('data/invoices.json').subscribe(
      (invoices) => {
        this.invoices = invoices || [];
      },
      () => {
        this.invoices = [];
      }
    );
  }

  private saveInvoices(): void {
    // En un entorno real, esto haría una petición HTTP al backend
    // Por ahora, guardamos en localStorage como respaldo
    localStorage.setItem('invoices', JSON.stringify(this.invoices));
  }

  createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Observable<Invoice> {
    const newInvoice: Invoice = {
      ...invoice,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    this.invoices.push(newInvoice);
    this.saveInvoices();

    return of(newInvoice);
  }

  getInvoices(): Observable<Invoice[]> {
    return of([...this.invoices]);
  }

  getInvoiceById(id: string): Observable<Invoice | undefined> {
    return of(this.invoices.find(inv => inv.id === id));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

