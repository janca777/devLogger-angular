import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Log } from '../models/log';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  logs: Log[];

  private logSource = new BehaviorSubject<Log>({ id: null, text: null, date: null });
  selectedLog = this.logSource.asObservable();

  private stateSource = new BehaviorSubject<boolean>(true);
  stateClear = this.stateSource.asObservable();

  constructor() {
    this.logs = [];
    // dummy data for testing
    // this.logs = [
    //   { id: '1', text: 'Generated components', date: new Date('12/27/2022 12:54:23') },
    //   { id: '2', text: 'Added Bootstrap', date: new Date('12/27/2022 14:41:51') },
    //   { id: '3', text: 'Added logs component components', date: new Date('12/27/2022 17:2:22') }
    // ]
  }

  getLogs(): Observable<Log[]> {
    let logItems = localStorage.getItem('logs');

    if(logItems === null) {
      this.logs = [];
    } else {
      this.logs = JSON.parse(logItems);
    }
    return of(this.logs.sort((a, b) => {
      return b.date - a.date;
    }));
  }

  setFormLog(log: Log) {
    this.logSource.next(log);
  }

  updateLog(log: Log) {
    this.deleteLog(log);
    this.addLog(log);
  }

  addLog(log: Log) {
    this.logs.unshift(log);

    // Add to local storage
    localStorage.setItem('logs', JSON.stringify(this.logs));
  }

  deleteLog(log: Log) {
    this.logs.forEach((curr, index) => {
      if (log.id === curr.id) {
        this.logs.splice(index, 1)
      }
    });
    //update (= delete) from local storage
    localStorage.setItem('logs', JSON.stringify(this.logs));
  }

  clearState() {
    this.stateSource.next(true);
  }

}
