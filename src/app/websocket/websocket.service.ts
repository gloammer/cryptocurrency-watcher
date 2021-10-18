import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { WebSocketSubject } from "rxjs/webSocket";
import { debounceTime, skip } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class WebsocketService {
    public webSocketMessage = new Subject<Message>();

    private webSocketSubject: WebSocketSubject<any>;

    constructor() {
        this.webSocketSubject = new WebSocketSubject(environment.webSocketApiUrl);
    }

    public connect({ currencyPairId, debounceTimeMs }: { currencyPairId: number, debounceTimeMs: number }): void {
        // The first message is acknowledgement of the subscription (for example [<id>, 1])
        this.webSocketSubject.pipe(debounceTime(debounceTimeMs), skip(1)).subscribe(
            (message) => {
                const tickerUpdates = this.getMessage(message[2]);
                if (tickerUpdates.currencyPairId === currencyPairId) {
                    this.webSocketMessage.next(tickerUpdates);
                }
            }
        );
    }

    public send({ command, channel }: { command: string, channel: number } ): void {
        this.webSocketSubject.next(
            { command, channel }
        );
    }

    private getMessage(tickerUpdates: any): Message {
        return {
            currencyPairId: tickerUpdates[0],
            lastTradePrice: tickerUpdates[1],
            lowestAsk: tickerUpdates[2],
            highestBid: tickerUpdates[3],
            percentChangeInLast24Hours: tickerUpdates[4],
            baseCurrencyVolumeInLast24Hours: tickerUpdates[5],
            quoteCurrencyVolumeInLast24Hours: tickerUpdates[6],
            isFrozen: tickerUpdates[7],
            highestTradePriceInLast24Hours: tickerUpdates[8],
            lowestTradePriceInLast24Hours: tickerUpdates[9],
            postOnly: tickerUpdates[10],
            maintenanceMode: tickerUpdates[11]
        };
    }
}

export interface Message {
    currencyPairId: number;
    lastTradePrice: string;
    lowestAsk: string;
    highestBid: string;
    percentChangeInLast24Hours: string;
    baseCurrencyVolumeInLast24Hours: string;
    quoteCurrencyVolumeInLast24Hours: string;
    isFrozen: string;
    highestTradePriceInLast24Hours: string;
    lowestTradePriceInLast24Hours: string;
    postOnly: string;
    maintenanceMode: string;
}
