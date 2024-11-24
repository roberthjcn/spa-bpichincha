import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AccountService } from '../../service/account.service';
import { Account } from '../../interfaces/account.interface';

@Component({
  selector: 'app-account',
  standalone: true,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  imports: [CommonModule, RouterModule],
})
export class AccountComponent implements OnInit {
  pageSize: number = 5;
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private _accountService: AccountService
  ) {

  }

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(): void {
    this._accountService.getAccounts().subscribe(
      (data) => {
        this.accounts = data;
        this.filteredAccounts = [...this.accounts];
      },
      (error) => {
        console.error('Error al obtener las cuentas', error);
      }
    );
  }

  onSearch(searchText: Event): void {
    const input = searchText.target as HTMLInputElement;
    this.filteredAccounts = this.accounts.filter((account) =>
      account.name.toLowerCase().includes(input.value.toLowerCase())
    );
  }

  onPageSizeChange(pageSize: number): void {
    console.log(`Cambiar tamaño de página a: ${pageSize}`);
    // Aquí puedes implementar lógica de paginación
  }

  get displayedAccounts(): any[] {
    return this.filteredAccounts.slice(0, this.pageSize);
  }

  // Cambiar el número de accounts por página
  changePageSize(event: any): void {
    this.pageSize = event.target.value;
  }

  addNewAccount(): void {
    this.router.navigate(['/account-form']);
  }

  editAccount(account: Account) {
    this.router.navigate([`/account-form/${account.id}`]);
  }

}
