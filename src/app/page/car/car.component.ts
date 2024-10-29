import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegistreCarComponent } from '../../component/registre-car/registre-car.component';

import { ListFileComponent } from '../../component/list-file/list-file.component';
import { ListCarComponent } from '../../component/list-car/list-car.component';



@Component({
  selector: 'app-car',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, RegistreCarComponent, ListFileComponent ,ListCarComponent],  // Asegúrate de importar FileListComponent
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent {
  isRegisterCarVisible: boolean = false;
  isCarListVisible: boolean = false;
  isFileListVisible: boolean = false;
  showSuccessMessage: boolean = false;
  searchQuery: string = ''; // Variable para almacenar el término de búsqueda

  constructor() { }

  // Maneja el cambio en el término de búsqueda
  onSearchQueryChanged() {
    // Lógica opcional si necesitas hacer algo cada vez que el término cambie
  }

  // Mostrar el formulario de registro de coche
  showRegisterCarForm() {
    this.isRegisterCarVisible = true;
    this.isCarListVisible = false;
    this.isFileListVisible = false;
  }

  hideRegisterCarForm() {
    this.isRegisterCarVisible = false;
  }

  onRegisterCar() {
    this.hideRegisterCarForm();
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }

  showCarList() {
    this.isCarListVisible = true;
    this.isRegisterCarVisible = false;
    this.isFileListVisible = false;
  }

  showFileList() {
    this.isFileListVisible = true;
    this.isRegisterCarVisible = false;
    this.isCarListVisible = false;
  }
}
