import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form } from '../../model/form';

@Component({
  selector: 'app-modify-form',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './modify-form.component.html',
  styleUrls: ['./modify-form.component.css']
})
export class ModifyFormComponent {
  @Input() formData!: form;
  @Output() save = new EventEmitter<form>();

  // Propiedad para controlar la visibilidad del modal
  showModal: boolean = true;

  // Método para cerrar el modal
  closeModal() {
    this.showModal = false;
  }

  // Método para guardar los cambios
  onSubmit() {
    this.save.emit(this.formData); // 'this.formData' debe ser del tipo 'form'
    this.closeModal();
  }
}
