import { Component, Input, OnInit } from '@angular/core';
import { Firestore, collectionData, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit{
  // @Input() gameNumber;

  constructor(private firestore: Firestore, private router: Router){
    
  }

  ngOnInit(): void { }

  newGame(){
    let game = new Game();
    console.log('NEUES SPIEL ERSTELLT von START SCREEN')
    

    addDoc(collection(this.firestore, 'games'), game.toJson()).catch(
      (err) => { console.log(err) }
    ).then(      
      (gameInfo:any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id)
    });
  }

}
