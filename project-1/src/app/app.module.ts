import { HttpModule } from '@angular/http';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatPaginator,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule
} from "@angular/material";
import { NgSelectModule } from '@ng-select/ng-select';
import { FileSelectDirective, FileDropDirective, FileUploadModule } from 'ng2-file-upload';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgxStripeModule } from 'ngx-stripe';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { Directive, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSectionComponent } from './right-section/right-section.component';
import { ApiService } from './api.service';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ImageCreditsComponent } from './image-credits/image-credits.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { ProfileComponent,PasswordChangeComponent } from './profile/profile.component';
import { SupportComponent } from './support/support.component';
import { PaymentComponent } from './payment/payment.component';
import { ForumComponent } from './forum/forum.component';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { VerificationUserComponent } from './verification-user/verification-user.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { LiveFurnishComponent } from './live-furnish/live-furnish.component';
import { AssetsBundleComponent } from './assets-bundle/assets-bundle.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLeftSidebarComponent } from './admin-left-sidebar/admin-left-sidebar.component';
import { AssetsBundleListingComponent,DeleteBundleListComponent } from './assets-bundle-listing/assets-bundle-listing.component';
import { CategoryComponent } from './category/category.component';
import { EditAssetsBundleComponent } from './edit-assets-bundle/edit-assets-bundle.component';
import { AdminuserlistComponent,DialogBox } from './adminuserlist/adminuserlist.component';
import { AdminUsereditpriceComponent } from './admin-usereditprice/admin-usereditprice.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetTokenComponent } from './reset-token/reset-token.component';
import { BuildFilesComponent } from './build-files/build-files.component';
import { CategoryListComponent,DeleteCategoryComponent } from './category-list/category-list.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { SearchTagComponent } from './search-tag/search-tag.component';
import { SearchTagListingComponent,DeleteSearchtagComponent } from './search-tag-listing/search-tag-listing.component';
import { EditSearchTagComponent } from './edit-search-tag/edit-search-tag.component';


const Route: Routes = [
  { path: '', component: LoginUserComponent },
  { path: 'login', component: LoginUserComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'verify_user', component: VerificationUserComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'reset_password', component: ResetTokenComponent },
  {
    path: 'livefurnish', component: LiveFurnishComponent, children:
      [{ path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'imagecredits', component: ImageCreditsComponent },
      { path: 'catalogue', component: CatalogueComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'support', component: SupportComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'forums', component: ForumComponent },


      ]
  }, {
    path: 'admin', component: AdminComponent, children:
      [{ path: '', component: AdminDashboardComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      // { path: 'imagecredits', component: ImageCreditsComponent },
      // { path: 'catalogue', component: CatalogueComponent },
      // { path: 'profile', component: ProfileComponent },
      // { path: 'support', component: SupportComponent },
      // { path: 'payment', component: PaymentComponent },
      // { path: 'forums', component: ForumComponent },
      { path: 'builds', component: BuildFilesComponent },
      { path: 'assetsbundle', component: AssetsBundleComponent },
      { path: 'assetsbundlelist', component: AssetsBundleListingComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'searchtag', component: SearchTagComponent },
      { path: 'editassetbundle', component: EditAssetsBundleComponent },
      { path: 'adminuserlist', component: AdminuserlistComponent },
      { path: 'adminUsereditprice', component: AdminUsereditpriceComponent },
      { path: 'categorylist', component: CategoryListComponent },
      { path: 'editCategory', component: EditCategoryComponent },
      { path: 'searchtaglist', component: SearchTagListingComponent },
      { path: 'editSearchtag', component: EditSearchTagComponent }

      ]
  }, { path: '**', component: ErrorPageComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftSidebarComponent,
    RightSectionComponent,
    DashboardComponent,
    ImageCreditsComponent,
    CatalogueComponent,
    ProfileComponent,
    SupportComponent,
    PaymentComponent,
    ForumComponent,
    VerificationUserComponent,
    ErrorPageComponent,
    LoginUserComponent,
    LiveFurnishComponent,
    AssetsBundleComponent,
    AdminComponent,
    AdminLeftSidebarComponent,
    AssetsBundleListingComponent,
    CategoryComponent,
    EditAssetsBundleComponent,
    AdminuserlistComponent,
    AdminUsereditpriceComponent,
    ForgotPasswordComponent,
    ResetTokenComponent,
    DialogBox,
    PasswordChangeComponent,
    BuildFilesComponent,
    CategoryListComponent,
    DeleteCategoryComponent,
    EditCategoryComponent,
    DeleteBundleListComponent,
    AdminDashboardComponent,
    AdminLoginComponent,
    AdminHeaderComponent,
    SearchTagComponent,
    SearchTagListingComponent,
    EditSearchTagComponent,
    DeleteSearchtagComponent

  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatAutocompleteModule,

    RouterModule.forRoot(Route),
    HttpModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    MatInputModule,
    MatTableModule,
    
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    AngularFileUploaderModule,
    FileUploadModule

  ],
  exports: [
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,

    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ],


  providers: [ApiService],
  bootstrap: [AppComponent,DialogBox,PasswordChangeComponent,DeleteCategoryComponent,DeleteBundleListComponent,DeleteSearchtagComponent],

})
// class FileSelectDirective
@Directive({ selector: '[ng2FileSelect]' })
// class FileDropDirective
@Directive({ selector: '[ng2FileDrop]' })
export class AppModule { }
