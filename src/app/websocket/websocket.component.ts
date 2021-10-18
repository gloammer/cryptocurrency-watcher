import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgModule, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Message, WebsocketService } from "./websocket.service";

@Component({
    selector: "app-websocket-info",
    template: `<div></div>`,
    providers: [
        WebsocketService, { provide: "debounceTimeMs", useValue: 100 }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebSocketInfoComponent implements OnDestroy {
    public messages: Message[] = [];

    private readonly subscriptions = new Subscription();

    constructor(readonly websocketService: WebsocketService, private changeDetectorRef: ChangeDetectorRef) {
        websocketService.connect({
            currencyPairId: 638,
            debounceTimeMs: 100
        });
        this.subscriptions.add(websocketService.webSocketMessage.subscribe(message => {
            this.messages.push(message);
            this.changeDetectorRef.markForCheck();
        }));
        websocketService.send({
            command: "subscribe",
            channel: 1002
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [WebSocketInfoComponent],
    entryComponents: [WebSocketInfoComponent],
    exports: [WebSocketInfoComponent]
})
export class WebSocketInfoModule { }
