import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../service/invoice.service';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoicePage implements OnInit {
  invoiceId: number | null = null;
  invoiceData: any = null;

  // Inyectamos el identificador de la plataforma
  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    @Inject(PLATFORM_ID) private platformId: Object // Inyección de la plataforma
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const id = paramMap.get('invoiceId');
      if (id && !isNaN(+id)) {
        this.invoiceId = +id;
      } else {
        console.warn('ID no válido, no se puede cargar la factura.');
        return;
      }

      this.loadInvoiceData();
    });
  }

  loadInvoiceData() {
    if (this.invoiceId !== null) {
      this.invoiceService.getInvoiceById(this.invoiceId).subscribe(
        (data: any) => {
          this.invoiceData = data;

          // Solo ejecutamos window.print() si estamos en el navegador
          if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
              window.print();
            }, 500);
          }
        },
        error => {
          console.error('Error al cargar los datos de la factura:', error);
        }
      );
    }
  }

  // Método para descargar la factura en PDF
  printInvoice() {
    const data = document.querySelector('.invoice-container') as HTMLElement;

    if (isPlatformBrowser(this.platformId) && data) {
      html2canvas(data).then(canvas => {
        const pdf = new jsPDF('p', 'pt', 'a4');
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 595, 842);
        pdf.save(`factura_${this.invoiceId}.pdf`);
      });
    }
  }
}
