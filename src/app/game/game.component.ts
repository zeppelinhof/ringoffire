import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { GameService } from './game-service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { query, orderBy, limit, where, Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, elementAt } from 'rxjs';
<<<<<<< Updated upstream
import { GameService } from './game-service';
=======
import { ActivatedRoute } from '@angular/router';
>>>>>>> Stashed changes

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;

  items$;
  items;
  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog, public gameservice: GameService) {
<<<<<<< Updated upstream
    debugger
    this.items$ = collectionData(this.getGamesRef());
=======
    this.items$ = collectionData(gameservice.getGamesRef());
>>>>>>> Stashed changes
    this.items = this.items$.subscribe((list) => {
      list.forEach(element => {
        console.log(element);
      });
    })
    this.items.unsubscribe();
  }

  ngOnInit(): void {
    debugger
    this.newGame();
    // this.route.params.subscribe((params) => {
    //   console.log(params);
    // });
  }

  
  newGame() {
    this.game = new Game();

  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      console.log(this.currentCard);
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }

    });
  }
}
