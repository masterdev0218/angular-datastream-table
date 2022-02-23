// FormGroup tracks the value and validity state of a group of FormControl instances.
// It aggregates the values of each child FormControl into one object, with each control name as the key

import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { EmployeeService } from "../services/employee.service";

@Component({
  selector: "app-create-employee",
  templateUrl: "./create-employee.component.html",
  styles: [],
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  loader: boolean;

  constructor(
    private _fb: FormBuilder,
    private _employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this._createForm();
  }

  // create reactive form
  private _createForm(): void {
    this.employeeForm = this._fb.group({
      name: ["", Validators.required],
      position: ["Manager", Validators.required],
      salary: ["", Validators.required],
    });
  }

  onSubmit(): void {
    const param = this.employeeForm.value;
    this._employeeService.create(param).subscribe({
      next: () => {
        this.loader = false;
        this.employeeForm.reset({ position: "Manager" });
      },
      error: (error) => {
        console.error("An onSubmit function error occured", error);
        this.loader = false;
      },
    });
    window.location.reload();
  }
}
