import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { JoinGameComponent } from "./join-game.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [JoinGameComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [JoinGameComponent]
})
export class JoinGameModule {
};