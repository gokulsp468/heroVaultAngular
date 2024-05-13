import { AbstractControl } from "@angular/forms";

export class Customvalidator {

static validatePassword(control:AbstractControl){
    const value = control.value as string;

    
    const hasLowercase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);

    if ( !hasLowercase || !hasDigit) {
    
      return { invalidPassword: true };
    }

   
    return null;

}

static validateContactNumber(control:AbstractControl) {
  
  const contactNumber = control.value as string;;

    
    const contactNumberPattern = /^\d{10}$/; 
    
    
    if (!contactNumberPattern.test(contactNumber)) {
     
      return { invalidContactNumber: true };
    }
    
    
    return null;
};

static validateURL(control: AbstractControl) {
  const url = control.value as string;

  // Regular expression for URL validation
  const urlPattern = /^(ftp|http[s]?)\:\/\/[^ "]+$/;

    // Allow empty value
    if (!url) {
        return null;
    }

    if (!urlPattern.test(url)) {
        return { invalidURL: true};
    }

    return null;
};
}
