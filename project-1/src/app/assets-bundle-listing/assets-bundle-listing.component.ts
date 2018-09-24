import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminapiService } from '../adminapi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";

import { SelectionModel } from '@angular/cdk/collections';
export interface AssetListBundle {
  assetsname: string;
  version: number;
  _id: string;
  thumbnail: string;
  macAssetbundle: string;
  iosAssetbundle: string;
  windowsAssetbundle: string;
  androidAssetbundle: string;
  webglAssetbundle: string;
  category: string

}
export interface Dialogbundlelist {
  id: any;
}
@Component({
  selector: 'app-assets-bundle-listing',
  templateUrl: './assets-bundle-listing.component.html',
  styleUrls: ['./assets-bundle-listing.component.css']
})
export class AssetsBundleListingComponent implements OnInit {
  displayedColumns: string[] = ['action', 'name', 'version', 'category', 'thumbnail', 'windowsAssetbundle', 'macAssetbundle', 'iosAssetbundle', 'androidAssetbundle','webglAssetbundle'];
  listingassets: any;
  dataSource;
  deleteres: any;
  selection;
  // dataSource = ELEMENT_DATA;
  constructor(private location: Location, private api: AdminapiService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    this.api.getassetslist()
      .subscribe(res => {
        console.log(res);
        this.listingassets = res;
        if (this.listingassets.assetslist.success) {
          const ELEMENT_DATA: AssetListBundle[] = this.listingassets.assetslist.data;
          this.dataSource = new MatTableDataSource<AssetListBundle>(ELEMENT_DATA);
          this.selection = new SelectionModel<AssetListBundle>(true, []);
          this.dataSource.paginator = this.paginator;
        }
        else {
          this.router.navigate(['admin-login']);
        }
      }, err => {
        console.log(err);
      })
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {

  }
  openDialog(id) {
    const dialogRef = this.dialog.open(DeleteBundleListComponent, {
      width: '400px',
      data: { id: id }
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
  deleteassest(delteelement) {
    console.log("delteelement", delteelement)
    this.api.deleteassetBundle(delteelement)
      .subscribe(res => {
        console.log(res);
        this.deleteres = res;
        if (this.deleteres.Assetdeletionresult.success) {
          location.reload();
        }
      }, err => {
        console.log(err);
      })
  }
  editassets(editid) {

    this.router.navigate(['/admin/editassetbundle'], { queryParams: { id: editid } });
  }
}
@Component({
  selector: 'app-delete-bundlelist',
  templateUrl: 'delete-bundlelist.component.html',
  styleUrls: ['./delete-bundlelist.component.css']
})
export class DeleteBundleListComponent {
  deleteres: any;
  constructor(private api: AdminapiService,
    public dialogRef: MatDialogRef<DeleteBundleListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Dialogbundlelist) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteassest(delteelement) {
    console.log("delete emlement", delteelement)
    this.api.deleteassetBundle(delteelement)
      .subscribe(res => {
        console.log(res);
        this.deleteres = res;
        if (this.deleteres.Assetdeletionresult.success) {
          location.reload();
        }
      }, err => {
        console.log(err);
      })

  }
}
