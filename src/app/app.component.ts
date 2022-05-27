import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './interfaces/employee';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'employeemanagerapp';

  public employees: Employee[];
  public editEmployee: Employee | null;
  public deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService) {
    this.employees = [];
    this.editEmployee = {
      id: -1,
      name: '',
      email: '',
      phone: '',
      imageUrl: '',
      jobTitle: '',
      employeeCode: ''
    };
    this.deleteEmployee = {
      id: -1,
      name: '',
      email: '',
      phone: '',
      imageUrl: '',
      jobTitle: '',
      employeeCode: ''
    };
  }

  ngOnInit(): void {
    this.getEmployees();
  }
  
  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe((response: Employee[]) => {
      this.employees = response;
    }, (error: HttpErrorResponse) => {
      alert(error);
    })
  }

  public onAddEmloyee(addForm: NgForm): void {
    document.getElementById("add-employee-form")?.click();
    this.employeeService.addEmployee(addForm.value).subscribe((response: Employee) => {
      console.log(response);
      this.getEmployees();
      addForm.reset();
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    })
  }

  public onUpdateEmloyee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe((response: Employee) => {
      console.log(response);
      this.getEmployees();
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    })
  }

  public onDeleteEmloyee(employeeId: Number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe((response: void) => {
      console.log(response);
      this.getEmployees();
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    })
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];

    for(const employee of this.employees) {
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) != -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) != -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) != -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) != -1
      )
        results.push(employee); 
    }

    this.employees = results;

    if(results.length === 0 || !key)
      this.getEmployees();
  }
  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById("main-container");
    const button = document.createElement("button");
    button.type = "button";
    button.style.display = "none";
    button.setAttribute("data-toggle", "modal");

    console.log(employee, mode);
    if(mode === "add") {
      button.setAttribute("data-target", "#addEmployeeModal");
    }
    else if(mode === "edit") {
      this.editEmployee = employee!;
      button.setAttribute("data-target", "#updateEmployeeModal");
    }
    else if(mode == "delete") {
      this.deleteEmployee = employee!;
      button.setAttribute("data-target", "#deleteEmployeeModal");
    }

    container?.appendChild(button);

    button.click();
  }

}
