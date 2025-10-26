import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [AdminComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [AdminComponent]
})
export class AdminModule {}