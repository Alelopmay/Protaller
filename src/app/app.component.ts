import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './component/nav/nav.component';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AjustComponent } from './component/ajust/ajust.component';
import { ProfileComponent } from './component/profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent, AjustComponent,ProfileComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNav: boolean = true;
  showAjust: boolean = false; // Inicia como falso, se alternará al hacer clic en el perfil

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.router.url;
      this.showNav = !(currentRoute === '/login' || currentRoute === '/company');
    });
  }

  toggleAjust() {
    this.showAjust = !this.showAjust; // Cambia la visibilidad
  }

  closeNav() {
    this.showAjust = false; // Cierra los ajustes
    this.showNav = false; // O lo que desees hacer
  }
}