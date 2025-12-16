import { NgModule } from "@angular/core";
import { StudentComponent } from "./student.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [StudentComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [StudentComponent]
})
export class StudentModule {}