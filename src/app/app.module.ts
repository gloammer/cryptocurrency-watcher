import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { WebSocketInfoModule } from "./websocket/websocket.component";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        WebSocketInfoModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
