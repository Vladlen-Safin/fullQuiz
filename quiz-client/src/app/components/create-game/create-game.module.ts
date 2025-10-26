import { NgModule } from "@angular/core";
import { CreateGameComponent } from "./create-game.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [CreateGameComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [CreateGameComponent]
}) 
export class CreateGameModule {}