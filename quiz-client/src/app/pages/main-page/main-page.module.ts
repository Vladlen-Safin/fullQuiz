import { NgModule } from "@angular/core";
import { MainPageComponent } from "./main-page.component";
import { CommonModule } from "@angular/common";
import { HeaderModule } from "src/app/components/header/header.module";
import { FooterModule } from "src/app/components/footer/footer.module";

@NgModule({
    declarations: [MainPageComponent],
    imports: [
        CommonModule,
        HeaderModule,
        FooterModule
    ],
    exports: [MainPageComponent],
})
export class MainPageModule { }
