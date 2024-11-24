import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Account } from '../interfaces/account.interface';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting()); 

describe('AccountService', () => {
  let service: AccountService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    service = new AccountService(httpClientMock);
  });

  it('debería verificar si una cuenta existe', (done) => {
    const idAccount = '123';
    httpClientMock.get.mockReturnValue(of(true));

    service.verifyAccountExist(idAccount).subscribe((result) => {
      expect(httpClientMock.get).toHaveBeenCalledWith(`${service['apiUrl']}/verification/${idAccount}`);
      expect(result).toBe(true);
      done();
    });
  });

  it('debería obtener las cuentas correctamente', (done) => {
    const mockResponse = { data: [{ id: '1', name: 'Cuenta 1' }] };

    httpClientMock.get.mockReturnValue(of(mockResponse));

    service.getAccounts().subscribe((accounts) => {
      expect(httpClientMock.get).toHaveBeenCalledWith(service['apiUrl']);
      expect(accounts).toEqual(mockResponse.data);
      done();
    });
  });

  it('debería manejar errores al obtener las cuentas', (done) => {
    const errorResponse = { status: 404, message: 'Not Found' };

    httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

    service.getAccounts().subscribe({
      error: (error) => {
        expect(httpClientMock.get).toHaveBeenCalledWith(service['apiUrl']);
        expect(error.message).toContain('Error del servidor: 404');
        done();
      },
    });
  });

  it('debería agregar una cuenta correctamente', (done) => {
    const mockAccount: Account = { id: "1", name: 'Account 1', description: 'Desc A', logo: '', date_release: "2024-11-01", date_revision: "2025-11-01" };

    httpClientMock.post.mockReturnValue(of(mockAccount));

    service.addAccount(mockAccount).subscribe((account) => {
      expect(httpClientMock.post).toHaveBeenCalledWith(service['apiUrl'], mockAccount);
      expect(account).toEqual(mockAccount);
      done();
    });
  });

  it('debería manejar errores al agregar una cuenta', (done) => {
    const mockAccount: Account = { id: "1", name: 'Account 1', description: 'Desc A', logo: '', date_release: "2024-11-01", date_revision: "2025-11-01" };
    const errorResponse = { status: 400, message: 'Bad Request' };

    httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

    service.addAccount(mockAccount).subscribe({
      error: (error) => {
        expect(httpClientMock.post).toHaveBeenCalledWith(service['apiUrl'], mockAccount);
        expect(error.message).toContain('Error del servidor: 400');
        done();
      },
    });
  });

  it('debería editar una cuenta correctamente', (done) => {
    const idAccount = '1';
    const mockAccount: Account = { id: "1", name: 'Account 1', description: 'Desc A', logo: '', date_release: "2024-11-01", date_revision: "2025-11-01" };

    httpClientMock.put.mockReturnValue(of(mockAccount));

    service.editAccount(idAccount, mockAccount).subscribe((account) => {
      expect(httpClientMock.put).toHaveBeenCalledWith(`${service['apiUrl']}/${idAccount}`, mockAccount);
      expect(account).toEqual(mockAccount);
      done();
    });
  });

  it('debería manejar errores al editar una cuenta', (done) => {
    const idAccount = '1';
    const mockAccount: Account = { id: "1", name: 'Account 1', description: 'Desc A', logo: '', date_release: "2024-11-01", date_revision: "2025-11-01" };
    const errorResponse = { status: 500, message: 'Internal Server Error' };

    httpClientMock.put.mockReturnValue(throwError(() => errorResponse));

    service.editAccount(idAccount, mockAccount).subscribe({
      error: (error) => {
        expect(httpClientMock.put).toHaveBeenCalledWith(`${service['apiUrl']}/${idAccount}`, mockAccount);
        expect(error.message).toContain('Error del servidor: 500');
        done();
      },
    });
  });
});
