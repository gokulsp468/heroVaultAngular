import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; // Correct import statement

import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from './service/store.service';
import { Customvalidator } from '../validator/customvalidator';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent {



  @ViewChild('searchBox') searchBox!: ElementRef<HTMLInputElement>;
  currentPage: number = 1;
  pageSize: number = 10; 
  totalItems: number = 0;
  totalPages: number = 0; 
  viewModalRef: NgbModalRef | undefined;
  viewModalOpened:boolean=false;
  editModalOpened:boolean=false;
  selectedFile: File | undefined;
  selectedFileUrl: string | ArrayBuffer | null | undefined;
  subscription!: Subscription;
  storeData: any[] = [];
  storeView: any={
    id:'',
    name:'',
    description:'',
    image_name:'',
    createdAt:'',
    location:'',
    contact_number:'',
    website:''
  }
  storeId:any=undefined
  deleteItem:any=undefined;
  sortDirection: 1 | -1 = 1;
  sortColumn: string = '';
  
  storeAddForm!: FormGroup;
  filterForm!: FormGroup;

  constructor(
    private storeService: StoreService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    config:NgbModalConfig // Inject NgbModal here
  ) {
     config.backdrop = 'static';
  config.keyboard = false;
}

  ngOnInit(): void {
    this.storeAddForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image_name: [''],
      location:['',[Validators.required]],
      contact_number:['',[Validators.required,Customvalidator.validateContactNumber]],
      website:['',[Customvalidator.validateURL]],

    });
    this.filterForm = this.fb.group({
      sortOrder: [''],
      fromDate:[''],
      toDate: [''],
    })
    this.getStoreData({});
  }

  getStoreData(options: {
    page?: number,
    pageLimit?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: number,
    fromDate?: string,
    toDate?: string
  }) {
    const {
      page = this.currentPage,
      pageLimit = this.pageSize,
      searchTerm,
      sortBy,
      sortOrder,
      fromDate,
      toDate
    } = options;
  
    this.subscription = this.storeService.getStoreData(
      page,
      pageLimit,
      searchTerm,
      sortBy,
      sortOrder,
      fromDate,
      toDate
    ).subscribe({
      next: (response) => {
        if (response.success && response.status_code == 200) {
          this.storeData = response.data.data;
          this.totalItems = response.page_info.total_items;
          this.totalPages = response.page_info.total_pages;
          this.currentPage=response.page_info.page;
          console.log(this.totalPages);
        }
      },
      error: (error) => {
        if (error && error.error) {
          this.toastr.error(error.error.error_message);
        }
      }
    });
  }
  

  openAddStoreModal(content: TemplateRef<any>) {
    this.modalService.open(content);
    this.storeAddForm.reset({website:''})
    
  }
  addStore(modal:NgbModalRef) {
    const formData = new FormData();
    formData.append('name', this.storeAddForm.value.name);
    formData.append('description', this.storeAddForm.value.description);
    formData.append('location', this.storeAddForm.value.location);
    formData.append('contact_number', this.storeAddForm.value.contact_number);
    formData.append('website', this.storeAddForm.value.website);
    if (this.storeAddForm.value.image_name){
      formData.append('image_name', this.storeAddForm.value.image_name);
    }
    
    if (this.storeAddForm.valid) {
      
      this.subscription = this.storeService.addStore(formData).subscribe({
        next: (response) => {
          if (response.success && response.status_code == 201){
            console.log("success")
            modal.close();
            this.storeAddForm.reset({website:''});
            this.selectedFile=undefined;
            this.selectedFileUrl=undefined;
            this.toastr.success(response.message);
            this.getStoreData({})
          }
        },
        error: (error) => {
          if (error && error.error && error.error.error_message) {
            const errorMessage: string = Object.values(error.error.error_message)[0] as string;
            this.toastr.error(errorMessage);
          } else {
            this.toastr.error('An error occurred. Please try again later.');
          }
        }
      });
    }else{
      Object.keys(this.storeAddForm.controls).forEach(key=>{
        this.storeAddForm.get(key)?.markAsDirty()
      })
    }
  }

 

  openViewStoreModal(content: TemplateRef<any>,store:any) {
    this.viewModalOpened=true;
    this.viewModalRef = this.modalService.open(content, { centered: true });
    this.storeView.id=store.id;
    this.storeView.name = store.name;
    this.storeView.description = store.description;
    this.storeView.image_name = store.image_name;
    this.storeView.createdAt = store.createdAt;
    this.storeView.website = store.website;
    this.storeView.location = store.location;
    this.storeView.contact_number = store.contact_number;

  }

  editStore(modal:NgbModalRef,storeId:any){
    const formData = new FormData();
    formData.append('name', this.storeAddForm.value.name);
    formData.append('description', this.storeAddForm.value.description);
    formData.append('location', this.storeAddForm.value.location);
    formData.append('contact_number', this.storeAddForm.value.contact_number);
    formData.append('website', this.storeAddForm.value.website);
    if (this.storeAddForm.value.image_name){
      formData.append('image_name', this.storeAddForm.value.image_name);
    }
    
    if (this.storeAddForm.valid) {
      
      this.subscription = this.storeService.editStore(formData,storeId).subscribe({
        next: (response) => {
          if (response.success && response.status_code == 200){
            console.log("success")
            modal.close();
            if (this.viewModalRef) {
              this.viewModalRef.close();
            }
            this.storeAddForm.reset();
            this.selectedFile=undefined;
            this.selectedFileUrl=undefined;
            this.storeId=undefined;
            this.toastr.success(response.message);
            this.getStoreData({})
          }
        },
        error: (error) => {
          if (error && error.error && error.error.error_message) {
            const errorMessage: string = Object.values(error.error.error_message)[0] as string;
            this.toastr.error(errorMessage);
          } else {
            this.toastr.error('An error occurred. Please try again later.');
          }
        }
      });
    }else{
      Object.keys(this.storeAddForm.controls).forEach(key=>{
        this.storeAddForm.get(key)?.markAsDirty()
      })
    }

  }
  openEditStoreModal(content: TemplateRef<any>,store:any) {
   
    this.modalService.open(content, { centered: true });
    this.editModalOpened=true
    this.storeId=store.id
    this.selectedFileUrl=store.image_name
    this.storeAddForm.patchValue({
      name:store.name,
      description:store.description,
      location:store.location,
      contact_number:store.contact_number,
      website:store.website
      

    });
  }

  deleteModal(content: TemplateRef<any>,store:any) {
    this.storeId = store.id
    this.deleteItem = store.name
    this.modalService.open(content, { centered: true });
  }

  deleteCategory(modal:NgbModalRef,storeId:any){
      
      this.subscription = this.storeService.deleteStore(storeId).subscribe({
        next: (response) => {
          if (response.success && response.status_code == 200){
           
            modal.close();
            this.toastr.success(response.message);
            this.storeId=undefined;
            this.deleteItem=undefined;
            this.getStoreData({});
          }
        },
        error: (error) => {
          if (error && error.error && error.error.error_message) {
            const errorMessage: string = Object.values(error.error.error_message)[0] as string;
            this.toastr.error(errorMessage);
          } else {
            this.toastr.error('An error occurred. Please try again later.');
          }
        }
      });
   
  }

  closeModal(modal:NgbModalRef){

    modal.close();
    if(this.viewModalOpened && this.editModalOpened){
      
      this.storeId=undefined
      this.storeAddForm.reset();
      this.selectedFile=undefined;
      this.selectedFileUrl=undefined;
      this.editModalOpened=false;
      this.deleteItem=undefined;
     


    }else{
      this.viewModalOpened=false;
      this.editModalOpened=false;
      this.storeId=undefined;
      this.deleteItem=undefined;
      this.storeAddForm.reset();
      this.selectedFile=undefined;
      this.selectedFileUrl=undefined;
      for (const key in this.storeView) {
        if (Object.prototype.hasOwnProperty.call(this.storeView, key)) {
          this.storeView[key] = '';
        }
      }
    }
   
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;

    if (fileList && fileList.length > 0) {
      // Get the first file from the file list
      this.selectedFile = fileList[0];
      

      // Read the selected file as a data URL to display in the image tag
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);

      // Set the selected file in the form control
      this.storeAddForm.patchValue({
        image_name: this.selectedFile
      });
      
    } else {

      this.selectedFile = undefined;
      this.selectedFileUrl = null;

      this.storeAddForm.patchValue({
        image_name: ''
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getStoreData({page:this.currentPage});
  }

  gettotalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
  

  performSearch(searchTerm:any) {
    
    this.getStoreData({ searchTerm:searchTerm.target.value });
  }
  clearSearchBox() {
    this.searchBox.nativeElement.value = '';
    this.getStoreData({})
}
  
toggleSort(column: string) {
  if (this.sortColumn === column) {
    
      this.sortDirection = this.sortDirection === 1 ? -1 : 1;
  } else {
      this.sortColumn = column;
      this.sortDirection = 1;
  }
  this.getStoreData({
      sortOrder: this.sortDirection,
      sortBy: this.sortColumn
  });
}

filter() {
  const fromDateObj: NgbDate | null = this.filterForm.get('fromDate')?.value;
  const toDateObj: NgbDate | null = this.filterForm.get('toDate')?.value;
  const sortOrder = this.filterForm.get('sortOrder')?.value;

  const fromDateStr: string | undefined = fromDateObj ? this.convertNgbDateToString(fromDateObj) : undefined;
  const toDateStr: string | undefined = toDateObj ? this.convertNgbDateToString(toDateObj) : undefined;

  this.getStoreData({ sortOrder: sortOrder, fromDate: fromDateStr, toDate: toDateStr,sortBy:'name' });
}

clearFilter(){
  this.filterForm.reset();
  this.getStoreData({})
}

convertNgbDateToString(dateObj: NgbDate): string {
  const year = dateObj.year;
  const month = String(dateObj.month).padStart(2, '0');
  const day = String(dateObj.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
}



}
