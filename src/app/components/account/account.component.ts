import { Component, OnInit } from '@angular/core';
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
  numberAccounts: number = 0;
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
        this.numberAccounts = this.pageSize;
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
    this.numberAccounts = input.value === '' ? this.pageSize : this.filteredAccounts.length;
  }

  get displayedAccounts(): any[] {
    return this.filteredAccounts.slice(0, this.pageSize);
  }

  changePageSize(event: any): void {
    this.pageSize = event.target.value;
    this.numberAccounts = this.filteredAccounts.length > this.pageSize ? this.pageSize : this.filteredAccounts.length;
  }

  addNewAccount(): void {
    this.router.navigate(['/account-form']);
  }

  editAccount(account: Account) {
    this.router.navigate([`/account-form/${account.id}`]);
  }

}
