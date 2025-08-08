import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClienteResponse {
  message: string;
  data: Cliente | Cliente[];
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:80/api/clientes';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getClientes(): Observable<ClienteResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ClienteResponse>(this.apiUrl, { headers });
  }

  getCliente(id: number): Observable<ClienteResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ClienteResponse>(`${this.apiUrl}/${id}`, { headers });
  }

  createCliente(cliente: Cliente): Observable<ClienteResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<ClienteResponse>(this.apiUrl, cliente, { headers });
  }

  updateCliente(id: number, cliente: Cliente): Observable<ClienteResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<ClienteResponse>(`${this.apiUrl}/${id}`, cliente, { headers });
  }

  deleteCliente(id: number): Observable<ClienteResponse> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ClienteResponse>(`${this.apiUrl}/${id}`, { headers });
  }
}

