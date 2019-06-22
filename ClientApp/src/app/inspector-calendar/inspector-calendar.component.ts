
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import * as moment from 'moment';
import * as _ from "lodash";
import { Event } from '@angular/router';

export class CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
}

export class Year {
  value: string;
  viewValue: string;

  constructor(value: number, viewValue: number) {
    this.value = value.toString();
    this.viewValue = viewValue.toString();
  }

}

@Component({
  selector: 'app-inspector-calendar',
  templateUrl: './inspector-calendar.component.html',
  styleUrls: ['./inspector-calendar.component.scss']
})

export class InspectorCalendarComponent implements OnInit, OnChanges {


  currentDate = moment();
  dayNames = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];

  yearOptions: Year[] = [];
  selectedYear: string = "";

  @Input() selectedDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();

  constructor() { }

  ngOnInit(): void {
    this.generateCalendar();
    this.yearOptions = this.loadYearOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateCalendar();

  }

  // load dropdowns

  loadYearOptions(): Year[] {

    let result: Year[] = [];
    var currentYear = new Date().getFullYear();
    var firstYear = currentYear - 10;

    for (var i = 1; i < 21; i++) {
      let year: Year = new Year(firstYear + i, firstYear + i);
      result.push(year);

      if (year.value === currentYear.toString())
        this.selectedYear = year.value;
    }

    return result;
  }

  // date checkers

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate): void {
    this.onSelectDate.emit(date);
  }

  // actions from calendar

  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  firstMonth(): void {
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
  }

  onYearDdlChanged(year: Year): void {
    this.currentDate = moment(this.currentDate).year(((year.value) as any));
    this.generateCalendar();
  }

  // generate the calendar grid

  generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    const firstOfMonth = moment(currentMoment).startOf('month').day() - 1;
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          selected: this.isSelected(d),
          mDate: d,
        };
      });
  }
}




