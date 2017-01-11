import { OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription, Subject } from "rxjs";
import { Party } from "../../../../both/models/party.model";
import { PaginationService } from "ng2-pagination";
import { MeteorObservable } from "meteor-rxjs";
import { Parties } from "../../../../both/collections/parties.collection";
import { Counts } from "meteor/tmeasday:publish-counts";
import { InjectUser } from "angular2-meteor-accounts-ui";
//import { MdDialog, MdDialogRef } from "@angular/material";
import { MdSnackBar } from "@angular/material";
import { PartiesFormComponent } from '../parties/parties-form.component';
//import { Papa } from 'meteor/harrison:papa-parse';

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@InjectUser('user')
export class PartiesList implements OnInit, OnDestroy {
  parties: Observable<Party[]>;
  partiesSub: Subscription;
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  partiesSize: number = 0;
  autorunSub: Subscription;
  location: Subject<string> = new Subject<string>();
  user: Meteor.User;
  imagesSubs: Subscription;

  //dialogRef: MdDialogRef<PartiesFormComponent>;

  constructor(
    private paginationService: PaginationService,
    public snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder,
      this.location
    ).subscribe(([pageSize, curPage, nameOrder, location]) => {
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: { name: nameOrder as number }
      };

      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);

      if (this.partiesSub) {
        this.partiesSub.unsubscribe();
      }

      this.partiesSub = MeteorObservable.subscribe('parties', options, location).zone().subscribe(() => {
        this.parties = Parties.find({}, {
          sort: {
            name: nameOrder
          }
        }).zone().publishReplay(1).refCount();
      });
    });

    this.paginationService.register({
      id: this.paginationService.defaultId,
      itemsPerPage: 200,
      currentPage: 1,
      totalItems: this.partiesSize
    });

    this.pageSize.next(200);
    this.curPage.next(1);
    this.nameOrder.next(1);
    this.location.next('');

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.partiesSize = Counts.get('numberOfParties');
      this.paginationService.setTotalItems(this.paginationService.defaultId, this.partiesSize);
    });
  }

  /*export(){

    this.parties = Parties.find({});

    var csv = Papa.unparse(this.parties);


    console.log(csv);

    //self.downloadCSV(csv);

    //$( event.target ).button( 'loading' ); jquery
      /*this.parties = Parties.find({});

      console.log(Papa.unparse( this.parties ));

      return Papa.unparse( this.parties )*/



      /*Papa.parse("http://usinegcc-dev.ca.aero.bombardier.net/global/workCenter/test.csv", {
        download: true,
        complete: function(results) {
            console.log(results);
        }
      });*/
      /*Papa.parse("file.csv", {
      	download: true,
      	complete: function(results) {
      		console.log(results);
      	}

  }*/

  /*downloadCSV (csv: string): void {
		var blob = new Blob([csv]);
		var a = window.document.createElement("a");
	    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
	    a.download = "contacts.csv";
	    document.body.appendChild(a);
	    a.click();
	    document.body.removeChild(a);
	}*/

  /*openFormDialog() {

    this.dialogRef = this.dialog.open(PartiesFormComponent, {
      disableClose: false
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('result: ' + result);
      this.dialogRef = null;
    });
  }*/

  removeParty(party: Party): void {
    Parties.remove(party._id);

    this.snackBar.open('Party successfully deleted.', 'Close');

  }

  search(value: string): void {
    this.curPage.next(1);
    this.location.next(value);
  }

  onPageChanged(page: number): void {
    this.curPage.next(page);
  }

  changeSortOrder(nameOrder: string): void {
    this.nameOrder.next(parseInt(nameOrder));
  }

  isOwner(party: Party): boolean {
    return this.user && this.user._id === party.owner;
  }

  ngOnDestroy() {
    this.partiesSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
    this.imagesSubs.unsubscribe();
  }
}
