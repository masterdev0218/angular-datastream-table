import { Component, OnInit } from "@angular/core";
import { NgAlertService, MessageType } from "@theo4u/ng-alert";

import { EmployeeService } from "./../services/employee.service";
import { IEmployee } from "../interfaces/iemployee";

@Component({
  selector: "app-list-employee",
  templateUrl: "./list-employee.component.html",
  styles: [],
})
export class ListEmployeeComponent implements OnInit {
  employees: IEmployee[] = [];
  loading = true;

  constructor(
    private _employeeService: EmployeeService,
    private _ngAlert: NgAlertService
  ) {}

  ngOnInit() {
    this.loading = true;
    this._employeeService.list().subscribe((employees) => {
      this.loading = false;
      this.employees = employees;
    });

    // subscribe to pusher's event
    this._employeeService.getChannel().bind("new", (data) => {
      data.new = true;
      this.employees.push(data);
    });

    this._employeeService.getChannel().bind("deleted", (data) => {
      this.employees = this.employees.filter((emp) => emp.id !== data.id);
    });
  }

  delete(employee: IEmployee): void {
    try {
      // show delete confirmation with ngAlert
      this._ngAlert.push({
        message: `<strong>Are you sure</strong> you want to delete employee <strong>${employee.name}</strong>`,
        type: MessageType.warning,
        buttons: [
          {
            label: "Continue",
            action: () => {
              this._actualDelete(employee);
            },
            css: "btn btn-danger",
          },
        ],
      });
    } catch (error) {
      console.error("An onSubmit function error occured", error);
    }
  }
  // remove employee from list using the filter function
  private _actualDelete(employee: IEmployee) {
    try {
      this._employeeService.delete(employee).subscribe(() => {
        // remove the employee if removed successfully
        this.employees = this.employees.filter((item) => item !== employee);
        this._ngAlert.push({
          message: `${employee.name} removed`,
          type: MessageType.success,
        });
      });
    } catch (error) {
      console.error("An onSubmit function error occured", error);
    } finally {
      window.location.reload();
    }
  }

  edit(employee: IEmployee) {

  }
}
