import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit, OnChanges {
  cardAction = [
    { title: 'one', description: 'Run!' },
    { title: 'two', description: 'Tie your shoe!' },
    { title: 'three', description: 'Climb a tree!' },
    { title: 'four', description: 'Shut the door!' },
    { title: 'five', description: 'The rest of your life!' },
    { title: 'six', description: 'Pick up sticks!' },
    { title: 'seven', description: 'Reach for heaven!' },
    { title: 'eight', description: 'Hit - otherwise help will come too late!' },
    { title: 'nine', description: 'Feel just fine!' },
    { title: 'ten', description: 'Use your pen!' }
  ];

  title = '';
  description = '';
  @Input() card: string;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    if (this.card) {
      console.log('current card:', this.card);
      let cardNumber = +this.card.split('_')[1];
      this.title = this.cardAction[cardNumber - 1].title;
      this.description = this.cardAction[cardNumber - 1].description;
    }

  }
}
