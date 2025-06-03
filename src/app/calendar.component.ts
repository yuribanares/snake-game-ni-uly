import { Component } from '@angular/core';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  selectedDate: Date = new Date();
  currentDate: Date = new Date();
  monthNames: string[] = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  activities: { date: Date, status: string }[] = [];
  statuses = ['Pending', 'In Progress', 'Completed'];
  selectedActivities: { date: Date, status: string }[] = [];
  activityStatus: { date: Date; status: string } = {
    date: new Date(),
    status: 'Pending'
    
  };

  newNote: string = "";
  notes: string[] = [];



  daysInMonth: number[] = [];
  firstDayOfMonth: number = 0;

  constructor() {
    this.selectedDate = this.currentDate;
    this.displayNotes()
    this.generateCalendar();
  }


  generateCalendar() {
    this.daysInMonth = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    this.firstDayOfMonth = new Date(year, month, 1).getDay();

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      this.daysInMonth.push(i);
    }
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

    onDateSelect(day: number) {
    this.selectDate(day);
    this.displayNotes();
  }
  selectDate(day: number) {
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    this.updateSelectedActivities();
    this.displayNotes();
  }

  private notes: { [date: string]: string[] } = {};
  
  addNote(date: Date, note: string) {
    const dateString = this.getDateString(date);
    if (!this.notes[dateString]) {
        this.notes[dateString] = [];
    }
    this.notes[dateString].push(note);
    this.displayNotes();
}

  getNotes(date: Date): string[] {
      const dateString = this.getDateString(date);
      return this.notes[dateString] || [];
  }

  displayNotes(){
      const notes = this.getNotes(this.selectedDate)
      console.log(notes);
      this.notes = notes;
  }

  onAddNote(){
    this.addNote(this.selectedDate, this.newNote);
    this.newNote = '';
  }

  getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
}

  addActivity() {
    const existingActivity = this.activities.find(a => this.isSameDate(a.date, this.activityStatus.date));
    if (!existingActivity) {
      this.activityStatus.date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.selectedDate.getDate())

      this.activities.push({ ...this.activityStatus });
      this.activityStatus.status = 'Pending';
    } else {
      existingActivity.status = this.activityStatus.status
    }
    this.updateSelectedActivities();
  }



  changeActivityStatus(activity: { date: Date; status: string }, newStatus: string) {
    activity.status = newStatus;
    this.updateSelectedActivities();
  }
  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }
  updateSelectedActivities() {
    this.selectedActivities = this.activities.filter(activity =>
      this.isSameDate(activity.date, this.selectedDate)
    );
    if (this.selectedActivities.length > 0) {
      this.activityStatus.status = this.selectedActivities[0].status;
    }

  }
  isSelectedDate(day: number): boolean {
    return this.selectedDate.getFullYear() === this.currentDate.getFullYear() &&
      this.selectedDate.getMonth() === this.currentDate.getMonth() &&
      this.selectedDate.getDate() === day;
  }
}