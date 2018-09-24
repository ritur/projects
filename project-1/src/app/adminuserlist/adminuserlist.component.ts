import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AdminapiService } from '../adminapi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SelectionModel } from '@angular/cdk/collections';
export interface UserList {
  emailId: string;
  creditprice: number;
  firstName: string;
  lastName: string;
  credit_detail: string;
  _id: string;

}
export interface DialogData {
  id: any;
}

@Component({
  selector: 'app-adminuserlist',
  templateUrl: './adminuserlist.component.html',
  styleUrls: ['./adminuserlist.component.css']
})
export class AdminuserlistComponent implements OnInit {
  displayedColumns: string[] = ['action', 'email', 'firstname', 'lastname', 'price', 'curent_balance'];
  listingusers: any;
  dataSource;
  deleteres: any;
  selection;
  loader = false;
  deletid:any;
  // dataSource = ELEMENT_DATA;
  constructor(private location: Location, public dialog: MatDialog, private api: AdminapiService, private router: Router, private route: ActivatedRoute) {
    this.loader = true
    this.api.getuserlist()
      .subscribe(res => {
        console.log(res);
        this.listingusers = res;
        this.loader = false
        if (this.listingusers.userlist.success) {

          const ELEMENT_DATA2: UserList[] = this.listingusers.userlist.data;
          this.dataSource = new MatTableDataSource<UserList>(ELEMENT_DATA2);
          this.selection = new SelectionModel<UserList>(true, []);
          this.dataSource.paginator = this.paginator;
        }else{
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
  openDialog(id) {
    this.deletid=id;
    const dialogRef = this.dialog.open(DialogBox, {
      width: '300px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',this.deletid);

    });
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
  editassets(editid) {
    console.log("delteelement", editid)

    this.router.navigate(['/admin/adminUsereditprice'], { queryParams: { id: editid } });
    // this.api.editUserCreditPrice(editid,price)
    //   .subscribe(res => {
    //     console.log(res);
    //     this.deleteres = res;
    //     if (this.deleteres.Assetdeletionresult.success) {

    //     }
    //   }, err => {
    //     console.log(err);
    //   })
  }
  deleteassest(delteelement) {

    this.api.deleteuser(delteelement)
      .subscribe(res => {
        console.log(res);
        this.deleteres = res;
        if (this.deleteres.UserDeleteresult.success) {
          location.reload();
        }else{
          this.router.navigate(['admin-login']);
        }
      }, err => {
        console.log(err);
      })

  }
}
@Component({
  selector: 'dialog-box',
  templateUrl: 'delete-user.component.html',
  styleUrls: ['./delete-user.component.css']

})


export class DialogBox {
  deleteres:any;
  constructor(private api: AdminapiService,
    public dialogRef: MatDialogRef<DialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteassest(delteelement) {
console.log("delete emlement",delteelement)
    this.api.deleteuser(delteelement)
      .subscribe(res => {
        console.log(res);
        this.deleteres = res;
        if (this.deleteres.UserDeleteresult.success) {
          location.reload();
        }
      }, err => {
        console.log(err);
      })

  }
}