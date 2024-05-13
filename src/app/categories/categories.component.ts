import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; // Correct import statement
import { CategoryService } from './service/category.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'] // Correct property name and value
})
export class CategoriesComponent implements OnInit {
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
  categoryData: any[] = [];
  categoryView: any={
    id:'',
    name:'',
    description:'',
    image:'',
    createdAt:''
  }
  catId:any=undefined
  deleteItem:any=undefined;
  sortDirection: 1 | -1 = 1;
  sortColumn: string = '';
  
  categoryAddForm!: FormGroup;
  filterForm!: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    config:NgbModalConfig // Inject NgbModal here
  ) {
     config.backdrop = 'static';
  config.keyboard = false;
}

  ngOnInit(): void {
    this.categoryAddForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['']
    });
    this.filterForm = this.fb.group({
      sortOrder: [''],
      fromDate:[''],
      toDate: [''],
    })
    this.getcategoryData({});
  }

  getcategoryData(options: {
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
  
    this.subscription = this.categoryService.getCategoryData(
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
          this.categoryData = response.data.data;
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
  

  openAddCategoryModal(content: TemplateRef<any>) {
    this.modalService.open(content);
    this.categoryAddForm.reset();
  }
  addCategory(modal:NgbModalRef) {
    const formData = new FormData();
    formData.append('name', this.categoryAddForm.value.name);
    formData.append('description', this.categoryAddForm.value.description);
    if (this.categoryAddForm.value.image){
      formData.append('image', this.categoryAddForm.value.image);
    }
    
    if (this.categoryAddForm.valid) {
      
      this.subscription = this.categoryService.addCategory(formData).subscribe({
        next: (response) => {
          if (response.success && response.status_code == 201){
            console.log("success")
            modal.close();
            this.categoryAddForm.reset();
            this.selectedFile=undefined;
            this.selectedFileUrl=undefined;
            this.toastr.success(response.message);
            this.getcategoryData({})
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
      Object.keys(this.categoryAddForm.controls).forEach(key=>{
        this.categoryAddForm.get(key)?.markAsDirty()
      })
    }
  }

 

  openViewCategoryModal(content: TemplateRef<any>,category:any) {
    this.viewModalOpened=true;
    this.viewModalRef = this.modalService.open(content, { centered: true });
    this.categoryView.id=category.id;
    this.categoryView.name = category.name;
    this.categoryView.description = category.description;
    this.categoryView.image=category.image;
    this.categoryView.createdAt=category.createdAt;
  }

  editCategory(modal:NgbModalRef,catId:any){
    const formData = new FormData();
    formData.append('name', this.categoryAddForm.value.name);
    formData.append('description', this.categoryAddForm.value.description);
    if(this.categoryAddForm.value.image){
      formData.append('image', this.categoryAddForm.value.image);
    }
    
    if (this.categoryAddForm.valid) {
      
      this.subscription = this.categoryService.editCategory(formData,catId).subscribe({
        next: (response) => {
          if (response.success && response.status_code == 200){
            console.log("success")
            modal.close();
            if (this.viewModalRef) {
              this.viewModalRef.close();
            }
            this.categoryAddForm.reset();
            this.selectedFile=undefined;
            this.selectedFileUrl=undefined;
            this.catId=undefined;
            this.toastr.success(response.message);
            this.getcategoryData({})
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
      Object.keys(this.categoryAddForm.controls).forEach(key=>{
        this.categoryAddForm.get(key)?.markAsDirty()
      })
    }

  }
  openEditCategoryModal(content: TemplateRef<any>,category:any) {
   
    this.modalService.open(content, { centered: true });
    this.editModalOpened=true
    this.catId=category.id
    this.selectedFileUrl=category.image
    this.categoryAddForm.patchValue({
      name:category.name,
      description:category.description
    });
  }

  deleteModal(content: TemplateRef<any>,category:any) {
    this.catId = category.id
    this.deleteItem = category.name
    this.modalService.open(content, { centered: true });
  }

  deleteCategory(modal:NgbModalRef,catId:any){
      
      this.subscription = this.categoryService.deleteCategory(catId).subscribe({
        next: (response) => {
          if (response.success && response.status_code == 200){
           
            modal.close();
            this.toastr.success(response.message);
            this.catId=undefined;
            this.deleteItem=undefined;
            this.getcategoryData({});
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
      
      this.catId=undefined
      this.categoryAddForm.reset();
      this.selectedFile=undefined;
      this.selectedFileUrl=undefined;
      this.editModalOpened=false;
      this.deleteItem=undefined;
     


    }else{
      this.viewModalOpened=false;
      this.editModalOpened=false;
      this.catId=undefined;
      this.deleteItem=undefined;
      this.categoryAddForm.reset();
      this.selectedFile=undefined;
      this.selectedFileUrl=undefined;
      for (const key in this.categoryView) {
        if (Object.prototype.hasOwnProperty.call(this.categoryView, key)) {
          this.categoryView[key] = '';
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
      console.log(this.selectedFile);

      // Read the selected file as a data URL to display in the image tag
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);

      // Set the selected file in the form control
      this.categoryAddForm.patchValue({
        image: this.selectedFile
      });
      console.log(this.categoryAddForm.value);
    } else {

      this.selectedFile = undefined;
      this.selectedFileUrl = null;

      this.categoryAddForm.patchValue({
        image: ''
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getcategoryData({page:this.currentPage});
  }

  gettotalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
  

  performSearch(searchTerm:any) {
    
    this.getcategoryData({ searchTerm:searchTerm.target.value });
  }
  clearSearchBox() {
    this.searchBox.nativeElement.value = '';
    this.getcategoryData({})
}
  
toggleSort(column: string) {
  if (this.sortColumn === column) {
    
      this.sortDirection = this.sortDirection === 1 ? -1 : 1;
  } else {
      this.sortColumn = column;
      this.sortDirection = 1;
  }
  this.getcategoryData({
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

  this.getcategoryData({ sortOrder: sortOrder, fromDate: fromDateStr, toDate: toDateStr,sortBy:'name' });
}

clearFilter(){
  this.filterForm.reset();
  this.getcategoryData({})
}

convertNgbDateToString(dateObj: NgbDate): string {
  const year = dateObj.year;
  const month = String(dateObj.month).padStart(2, '0');
  const day = String(dateObj.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


}
