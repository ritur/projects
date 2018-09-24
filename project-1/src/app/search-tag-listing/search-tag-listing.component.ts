import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AdminapiService } from '../adminapi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
export interface SearchtagList {
  name: string;

  _id: string;

}
export interface DialogsearchtagData {

  id: string;

}
@Component({
  selector: 'app-search-tag-listing',
  templateUrl: './search-tag-listing.component.html',
  styleUrls: ['./search-tag-listing.component.css']
})
export class SearchTagListingComponent implements OnInit {

  displayedColumns: string[] = ['action', 'searchtag_name'];
  listingusers: any;
  dataSource;
  deleteres: any;
  selection;
  loader = false;
  deletid: any;
  constructor(private location: Location, public dialog: MatDialog, private api: AdminapiService, private router: Router, private route: ActivatedRoute) {
    this.loader = true
    this.api.searchtagapi()
      .subscribe(res => {
        console.log(res);
        this.listingusers = res;
        this.loader = false
        if (this.listingusers.searchtagresult.success) {

          const ELEMENT_DATA2: SearchtagList[] = this.listingusers.searchtagresult.searchtag_list;
          this.dataSource = new MatTableDataSource<SearchtagList>(ELEMENT_DATA2);
          this.selection = new SelectionModel<SearchtagList>(true, []);
          this.dataSource.paginator = this.paginator;
        } else {
          this.router.navigate(['admin-login']);
        }
      }, err => {
        console.log(err);
        this.loader = false;
      })
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  openDialog(id) {
    this.deletid = id;
    const dialogRef = this.dialog.open(DeleteSearchtagComponent, {
      width: '480px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', this.deletid);

    });
  }
  editassets(editid) {
    console.log("delteelement", editid)

    this.router.navigate(['/admin/editSearchtag'], { queryParams: { id: editid } });

  }

}


@Component({
  selector: 'app-delete-searchtag',
  templateUrl: './delete-searchtag.component.html',
  styleUrls: ['./delete-searchtag.component.css']
})

export class DeleteSearchtagComponent {
  deleteres: any;
  errormessage = null;

  constructor(private api: AdminapiService,
    public dialogRef: MatDialogRef<DeleteSearchtagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogsearchtagData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteassest(delteelement) {
    console.log("delete emlement", delteelement)
    this.api.deletesearchtag(delteelement)
      .subscribe(res => {
        console.log(res);
        this.deleteres = res;
        if (this.deleteres.searchtagDeleteresult.success) {
          location.reload();
        }
        else {
          this.errormessage = this.deleteres.searchtagDeleteresult.processStatus;
          // setTimeout(() => {
          //   this.dialogRef.close();
          // }, 1000);
        }
      }, err => {
        console.log(err);
      })

  }
}
