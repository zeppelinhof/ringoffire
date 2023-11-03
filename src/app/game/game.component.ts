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

  items$;
  items;
  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog) {
    this.items$ = collectionData(this.getGamesRef());
    this.items = this.items$.subscribe((list) => {
      list.forEach(element => {
        console.log(element);
      });
    })
    this.items.unsubscribe();
  }

  // subNotesList() {
  //   const q = query(this.getGamesRef(), limit(100));
  //   return onSnapshot(q, (list) => {
  //     this.normalNotes = [];
  //     list.forEach((element) => {
  //       this.normalNotes.push(this.setNoteObject(element.data(), element.id));
  //     });
  //     list.docChanges().forEach((change) => {
  //       if (change.type === "added") {
  //         console.log("New note: ", change.doc.data());
  //       }
  //       if (change.type === "modified") {
  //         console.log("Modified note: ", change.doc.data());
  //       }
  //       if (change.type === "removed") {
  //         console.log("Removed note: ", change.doc.data());
  //       }
  //     });
  //   });
  // }


  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }


  ngOnInit(): void {
    this.newGame();
  }

  async addGame(item: {}) {
    await addDoc(this.getGamesRef(), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written on ID:", docRef) }
    )
  }

  newGame() {
    this.game = new Game();
    this.items$.subscribe((list) => {
      list.forEach(element => {
        console.log(element);
      })
    })
      .add(this.game.toJson());
    this.addGame(this.game.toJson());
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
