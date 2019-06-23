import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as _ from "lodash";
import * as moment from 'moment';
import { months } from "../../data/month-data";
import { CalendarDate } from "../models/CalendarDate";
import { Month } from "../models/Month";
import { Year } from "../models/Year";

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

  monthOptions: Month[] = [];
  selectedMonth: number;

  @Input() selectedDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();

  public constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("Paco Rosa Cotecna Exercise");
    this.generateCalendar();
    this.yearOptions = this.loadYearsDdl();
    this.monthOptions = this.loadMonthsDdl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateCalendar();
  }

  // load dropdowns

  loadYearsDdl(): Year[] {
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

  loadMonthsDdl(): Month[] {
    let result: Month[] = months;
    this.selectedMonth = new Date().getMonth();
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

  onMonthDdlChanged(month: Month): void {
    this.currentDate = moment(this.currentDate).month(((month.value) as any));
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
