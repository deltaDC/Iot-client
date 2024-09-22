import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    private socket$!: WebSocketSubject<any>;
    private subject: Subject<any> = new Subject<any>();

    constructor() {
        this.initializeWebSocketConnection();
    }

    initializeWebSocketConnection() {
        this.socket$ = new WebSocketSubject('ws://localhost:8080/ws/sensors');
        this.socket$.subscribe(
            (message) => {
                this.subject.next(message);
            },
            (err) => console.error(err),
            () => console.warn('WebSocket connection completed')
        );
    }

    getSensorUpdates(): Observable<any> {
        return this.subject.asObservable();
    }

    sendMessage(msg: any): void {
        this.socket$.next(msg);
    }
}
