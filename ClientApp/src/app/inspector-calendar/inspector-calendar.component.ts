
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import * as _ from "lodash";
import { Event } from '@angular/router';
import { Year } from "../models/Year";
import { CalendarDate } from "../models/CalendarDate";
import { Month } from "../models/Month";


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
    this.yearOptions = this.loadYearOptions();
    this.monthOptions = this.loadMonths();
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

  loadMonths(): Month[] {
    let result: Month[] = [
      {
        value: 0,
        locale: "en-US",
        name: "January"
      },
      {
        value: 1,
        locale: "en-US",
        name: "February"
      }, {
        value: 2,
        locale: "en-US",
        name: "March"
      }, {
        value: 3,
        locale: "en-US",
        name: "April"
      }, {
        value: 4,
        locale: "en-US",
        name: "May"
      }, {
        value: 5,
        locale: "en-US",
        name: "June"
      }, {
        value: 6,
        locale: "en-US",
        name: "July"
      }, {
        value: 7,
        locale: "en-US",
        name: "August"
      }, {
        value: 8,
        locale: "en-US",
        name: "September"
      }, {
        value: 9,
        locale: "en-US",
        name: "October"
      }, {
        value: 10,
        locale: "en-US",
        name: "November"
      }, {
        value: 11,
        locale: "en-US",
        name: "December"
      }
    ];

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




