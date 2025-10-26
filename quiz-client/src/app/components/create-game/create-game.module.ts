import { NgModule } from "@angular/core";
import { CreateGameComponent } from "./create-game.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [CreateGameComponent],
    imports: [
        CommonModule
    ],
    exports: [CreateGameComponent]
}) 
export class CreateGameModule {}