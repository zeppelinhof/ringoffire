import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { query, orderBy, limit, where, Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, elementAt } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  normalGames = [];
  unsubGames;
  currentGameId:string;

  // items$;
  // items;

  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    // this.items$ = collectionData(this.getGamesRef());
    // this.items = this.items$.subscribe((list) => {
    //   list.forEach(element => {
    //     console.log(element);
    //   });
    // })
    // this.items.unsubscribe();    
    this.unsubGames = this.subGameList();
  }

  async updateGame(element) {
    let docRef = this.getSingleDocRef("games", this.currentGameId);
    debugger
    if (true) {
      await updateDoc(docRef, this.getCleanJson(element)).catch(
        (err) => { console.error(err); }
      );
    }

  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }


  getCleanJson(game: Game): {} {
    return {
      currentPlayer: game.currentPlayer,
      playedCards: game.playedCards,
      players: game.players,
      stack: game.stack
    }
  }

  /**
   * 
   * @param item - this.game.toJson()
   * @param colId 
   */
  async addGame(item) {
    await this.subGameList();
    await addDoc(this.getGamesRef(), item).catch(
      (err) => { console.log(err) }
    ).then(
      (docRef) => { console.log('Document written with ID:', docRef) }
    )
  }

  ngOnDestroy(): void {
    this.unsubGames();
  }

  /**
   * (b) jedes Listenelement (setGameObject-konvertiert) in normalGames speichern
   * 
   * @returns gesamte Collection games fotografieren und 
   */
  async subGameList() {
    const q = query(this.getGamesRef(), limit(100));
    return onSnapshot(q, (list) => {
      this.normalGames = [];
      list.forEach((element) => {
        this.normalGames.push(this.setGameObject(element.data(), element.id));
      });
      list.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log("Neues Spiel", change.doc.data());

        }
        if (change.type === 'modified') {
          console.log("Geändertes Spiel", change.doc.data());

        }
        if (change.type === 'removed') {
          console.log("Entferntes Spiel", change.doc.data());

        }
      });
    });
  }

  setGameObject(obj: any, id: string) {
    return {
      id: id,
      currentPlayer: obj.currentPlayer,
      playedCards: obj.playedCards,
      players: obj.players,
      stack: obj.stack
    }
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  ngOnInit(): void {
    this.newGame();

    this.route.params.subscribe((params) => {
      this.currentGameId = params['id'];
    });
  }


  newGame() {
    this.game = new Game();
    console.log('NEUES SPIEL ERSTELLT von KOMPONENTE');
    this.addGame(this.game.toJson());
    
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      if (this.game.players.length > 0) {
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      }


      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    this.updateGame(this.game);
  }
}


