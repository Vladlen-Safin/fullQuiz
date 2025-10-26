import { NgModule } from "@angular/core";
import { LoginComponent } from "./login.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SipaIconComponent } from "src/app/helpers/icons/sipa.component";

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SipaIconComponent
    ],
    exports: [LoginComponent],
})
export class LoginModule {}
