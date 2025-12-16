import { NgModule } from "@angular/core";
import { TeacherComponent } from "./teacher.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [TeacherComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [TeacherComponent]
})
export class TeacherModule {}