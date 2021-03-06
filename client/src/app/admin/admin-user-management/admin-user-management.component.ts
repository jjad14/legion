import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { IUser } from 'src/app/shared/models/user';
import { AdminService } from '../admin.service';
import { RolesModalComponent } from 'src/app/shared/modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.scss']
})
export class AdminUserManagementComponent implements OnInit {
  users: Partial<IUser[]>;
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.adminService.getUsers()
      .subscribe(users => {
        this.users = users;
      });
  }

  deleteUser(user: IUser) {
    // this.adminService.deleteUser(user.email);
    // console.log('Deleted');
  }

  openRolesModal(user: IUser) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        user,
        roles: this.getRolesArray(user)
      }
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe(values => {
      const rolesToUpdate = {
        roles: [...values.filter(r => r.checked === true).map(el => el.name)]
      };
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user.email, rolesToUpdate.roles)
          .subscribe(() => {
            user.roles = [...rolesToUpdate.roles];
          });
      }
    });
  }

  private getRolesArray(user: IUser) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Employee', value: 'Employee'},
      {name: 'Customer', value: 'Customer'}
    ];

    availableRoles.forEach(role => {
      let isMatch = false;
      for (const userRole of userRoles) {
        if (role.name === userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    });
    return roles;
  }

}
