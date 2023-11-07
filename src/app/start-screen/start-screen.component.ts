import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit{

  constructor(private firestore: Firestore, private router: Router){
    
  }

  ngOnInit(): void {
    
  }

  newGame(gameNumber:number){
    // console.log(`newGame von startscreen (gameNumber:${gameNumber})`);
    // let game = new Game(gameNumber);

    this.router.navigateByUrl('/game');
  }


}
