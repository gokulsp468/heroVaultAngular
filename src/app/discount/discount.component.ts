import { Component, TemplateRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrl: './discount.component.scss'
})
export class DiscountComponent {



  private modalService = inject(NgbModal);

  openAddDiscountModal(content: TemplateRef<any>){
    this.modalService.open(content)

  }

  openViewDiscountModal(content: TemplateRef<any>){
    this.modalService.open(content,{centered:true})

  }
  openEditDiscountModal(content: TemplateRef<any>){
    this.modalService.open(content,{centered:true})

  }

  deleteModal(content: TemplateRef<any>){
    this.modalService.open(content,{centered:true})

  }


}
