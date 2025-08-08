import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService, Cliente } from '../../services/cliente';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.html',
  styleUrls: ['./cliente-form.css']
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isEditMode = false;
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      cpf: [''],
      endereco: [''],
      cidade: [''],
      estado: ['', [Validators.maxLength(2)]],
      cep: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clienteId = +params['id'];
        this.loadCliente();
      }
    });
  }

  loadCliente(): void {
    if (this.clienteId) {
      this.isLoading = true;
      this.clienteService.getCliente(this.clienteId).subscribe({
        next: (response) => {
          const cliente = response.data as Cliente;
          this.clienteForm.patchValue(cliente);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erro ao carregar cliente';
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const clienteData = this.clienteForm.value;

      if (this.isEditMode && this.clienteId) {
        this.clienteService.updateCliente(this.clienteId, clienteData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/clientes']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Erro ao atualizar cliente';
          }
        });
      } else {
        this.clienteService.createCliente(clienteData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/clientes']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Erro ao criar cliente';
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/clientes']);
  }

  get nome() { return this.clienteForm.get('nome'); }
  get email() { return this.clienteForm.get('email'); }
  get estado() { return this.clienteForm.get('estado'); }
}

