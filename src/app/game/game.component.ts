import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { query, orderBy, limit, where, Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, elementAt } from 'rxjs';

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
  gameNumber = 0;

  // items$;
  // items;

  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog) {
    // this.items$ = collectionData(this.getGamesRef());
    // this.items = this.items$.subscribe((list) => {
    //   list.forEach(element => {
    //     console.log(element);
    //   });
    // })
    // this.items.unsubscribe();
    console.log('Constructor game.component.ts');
    this.unsubGames = this.subGameList();
  }

  async updateGame(element) {
    console.log('updateGame wird jetzt aufgerufen');
    debugger
    console.log('normalGames:', this.normalGames);
    let docRef = this.getSingleDocRef("games", this.normalGames[this.gameNumber]['id']);
    if (this.game.currentPlayer) {
      await updateDoc(docRef, this.getCleanJson(element)).catch(
        (err) => { console.error(err); }
      );
    }

  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }


  getCleanJson(game: Game): {} {
    console.log('getCleanJson wird jetzt aufgerufen');
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
    console.log('getCleanJson wird jetzt aufgerufen');
    await this.subGameList();
    console.log('... und this.game.toJson() in games speichern');
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
    console.log('subGameList');
    const q = query(this.getGamesRef(), limit(100));
    console.log('Query q:', q);
    const snappy = await onSnapshot(q, (list) => {
      console.log('-in return');
      debugger
      this.normalGames = [];
      console.log('normal Games in subGameList:', this.normalGames);
      console.log('onSnapshot aufgerufen - Liste:')
      list.forEach((element) => {
        console.log('... Listenelement:', element);
        debugger
        console.log('normal Games bei aktivem Push:', this.normalGames);
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
    console.log('kurz vor return');
    return snappy;
  }

  setGameObject(obj: any, id: string) {
    console.log('setGameObject wird jetzt auferufen');

    return {
      id: id,
      currentPlayer: obj.currentPlayer,
      playedCards: obj.playedCards,
      players: obj.players,
      stack: obj.stack
    }
  }

  getGamesRef() {
    console.log('collection games:', collection(this.firestore, 'games'));
    return collection(this.firestore, 'games');
  }

  ngOnInit(): void {
    console.log('On Init');
    this.newGame(0);

    // this.route.params.subscribe((params) => {
    //   console.log(params);
    // });
  }


  newGame(gameNumber: number) {
    console.log('New game aus game-component.ts');
    this.game = new Game(gameNumber);
    this.addGame(this.game.toJson());
    this.gameNumber = gameNumber;
    this.saveGame();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      console.log(this.currentCard);
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
    console.log('Save Game');

    this.updateGame(this.game);
  }
}


