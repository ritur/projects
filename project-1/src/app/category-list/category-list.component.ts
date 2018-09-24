import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AdminapiService } from '../adminapi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
export interface CategoryList {
  name: string;
  
  _id: string;

}
export interface DialogcategaryData {
  
  id: string;

}
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  displayedColumns: string[] = ['action', 'category_name'];
  listingusers: any;
  dataSource;
  deleteres: any;
  selection;
  loader = false;
  deletid:any;
  constructor(private location: Location, public dialog: MatDialog, private api: AdminapiService, private router: Router, private route: ActivatedRoute) { 
    this.loader = true
    this.api.categoryapi()
      .subscribe(res => {
        console.log(res);
        this.listingusers = res;
        this.loader = false
        if (this.listingusers.categoryresult.success) {

          const ELEMENT_DATA2: CategoryList[] = this.listingusers.categoryresult.category_list;
          this.dataSource = new MatTableDataSource<CategoryList>(ELEMENT_DATA2);
          this.selection = new SelectionModel<CategoryList>(true, []);
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
    this.deletid=id;
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      width: '480px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',this.deletid);

    });
  }
  editassets(editid) {
    console.log("delteelement", editid)

    this.router.navigate(['/admin/editCategory'], { queryParams: { id: editid } });
    
  }

}


@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.css']
})

export class DeleteCategoryComponent {
  deleteres:any;
  errormessage=null;

  constructor(private api: AdminapiService,
    public dialogRef: MatDialogRef<DeleteCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogcategaryData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteassest(delteelement) {
console.log("delete emlement",delteelement)
    this.api.deletecategory(delteelement)
      .subscribe(res => {
        console.log(res);
        this.deleteres = res;
        if (this.deleteres.CategoryDeleteresult.success) {
          location.reload();
        }
        else{
          this.errormessage=this.deleteres.CategoryDeleteresult.processStatus;
          // setTimeout(() => {
          //   this.dialogRef.close();
          // }, 1000);
        }
      }, err => {
        console.log(err);
      })

  }
}
