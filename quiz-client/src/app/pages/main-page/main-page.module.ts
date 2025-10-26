import { NgModule } from "@angular/core";
import { MainPageComponent } from "./main-page.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [MainPageComponent],
    imports: [
        CommonModule,
    ],
    exports: [MainPageComponent],
})
export class MainPageModule { }
