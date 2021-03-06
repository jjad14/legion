import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IUser } from '../shared/models/user';
import { ShopService } from '../shop/shop.service';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private shopService: ShopService) { }

  getProducts() {
    return this.http.get<Partial<IProduct[]>>(this.baseUrl + 'admin/products');
  }

  createProduct(values: any) {
    return this.http.post(this.baseUrl + 'admin/create-product', values)
      .pipe(
        map((product: IProduct) => {
          if (product) {
            this.shopService.products.push(product);
          }
        })
      );
  }

  updateProduct(id: number, data: any) {
    return this.http.put(this.baseUrl + 'admin/edit-product/' + id, data);
  }

  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + 'admin/product/' + id);
  }

  getUsers() {
    return this.http.get<Partial<IUser[]>>(this.baseUrl + 'admin/users');
  }

  updateUserRoles(email: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + email + '?roles=' + roles, {});
  }

  deleteUser(email: string) {
    this.http.delete(this.baseUrl + 'admin/user/' + email)
      .subscribe(res => {
        // console.log(res);
      });
  }

  getBrands() {
    return this.shopService.getBrands();
  }

  getTypes() {
    return this.shopService.getTypes();
  }


}
