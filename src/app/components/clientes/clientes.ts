import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteService, Cliente } from '../../services/cliente';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.isLoading = true;
    this.clienteService.getClientes().subscribe({
      next: (response) => {
        this.clientes = Array.isArray(response.data) ? response.data : [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar clientes';
        this.isLoading = false;
      }
    });
  }

  editCliente(id: number): void {
    this.router.navigate(['/cliente-form', id]);
  }

  deleteCliente(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          this.loadClientes();
        },
        error: (error) => {
          this.errorMessage = 'Erro ao excluir cliente';
        }
      });
    }
  }

  addCliente(): void {
    this.router.navigate(['/cliente-form']);
  }
}

