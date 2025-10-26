import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LobbyComponent } from "./lobby.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [LobbyComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [LobbyComponent]
})
export class LobbyModule {}