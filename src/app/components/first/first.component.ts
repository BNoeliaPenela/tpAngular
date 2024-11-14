import {  Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import { TestService } from '../../services/test.service';
import { Test } from '../../models/test';
import { Data } from '../../models/data';


@Component({
  selector: 'app-first', 
  templateUrl: './first.component.html',
  styleUrl: './first.component.css'
})
export class FirstComponent implements OnInit{
  @ViewChild('firstInput') firstInput!: ElementRef;
  
  testList = new Array<Test>()
  /*testList = [{ id: '', name: 'Celular 1', data: { capacity: 64, color: 'Negro', screenSize: '6.1', generation: '1st Gen', price: 300 }},
  { id: '', name: 'Celular 2', data: { capacity: 128, color: 'Blanco', screenSize: '6.5', generation: '2nd Gen', price: 500 }},
  { id: '', name: 'Celular 3', data: { capacity: null, color: null, screenSize: null, generation: null, price: null }},]*/
  
  newPhone = new Test()
  selectedPhone: Test | null;
  isEditing: boolean = false;
  
  
  constructor(private testService: TestService){
    this.newPhone = {
      id: '',
      name: '',
      data: {
        price: 0,
        color: null,
        Capacity: null,
        screenSize: null,
        generation: null
      }
    };
  }

  ngOnInit(): void{
    
    this.testService.getAll().subscribe(
        (response) => { 
          this.testList = response,
          setTimeout(() => this.firstInput.nativeElement.focus(), 0);
        (Error: any) => console.error('Error fetching phones', Error)
    } )
  }



  addPhone(newPhone: Test): void { 

    if(this.newPhone.name)
    {
      
      this.testService.addPhone(this.newPhone).subscribe(
        (response) => {
          
          this.testList.push(response); //agrega fila a la tabla
          setTimeout(() => this.firstInput.nativeElement.focus(), 0);
          
          console.log('response: ' + response)
          console.log(this.newPhone)
          
          
          this.newPhone = {
            id: '',
            name: '',
            data: {
              price: 0,
              color: null,
              Capacity: null,
              screenSize: null,
              generation: null
            }
          };
          
        },
        (error) => {console.error('Error adding phone', error)}
        
      );
    }else{
      console.error('Please fill all fields');
    }
    
  }


  deletePhone(id: string): void{

    this.testService.deletePhone(id).subscribe(
      () => {
        console.log(`Phone with ID ${id} deleted`);
        
        const row = document.getElementById(`${id}`);// Elimina la fila de la tabla en el DOM
        if (row) {
          row.remove();
        }
        this.testList = this.testList.filter(p => p.id !== id)
      },
      (error) => {console.error('Error deleting phone', error)}
    )
  }

  viewPhone(test: Test): void{
    
    this.selectedPhone = JSON.parse(JSON.stringify(test));
    this.isEditing = true;
    
    
    const popup = document.getElementById('popUp'); 
    if (popup) {
      popup.style.visibility = 'visible'; // Muestra el popup
      this.showPopup();
    }
  }

  showPopup(): void{

    if (!this.selectedPhone) return;

    const inputs = { 
      id: document.querySelector('#popUp input[name="id"]') as HTMLInputElement,
      name: document.querySelector('#popUp input[name="name"]') as HTMLInputElement,
      capacity: document.querySelector('#popUp input[name="capacity"]') as HTMLInputElement,
      color: document.querySelector('#popUp input[name="color"]') as HTMLInputElement,
      screenSize: document.querySelector('#popUp input[name="screenSize"]') as HTMLInputElement,
      generation: document.querySelector('#popUp input[name="generation"]') as HTMLInputElement,
      price: document.querySelector('#popUp input[name="price"]') as HTMLInputElement
    };

    if (inputs.id) inputs.id.value = this.selectedPhone.id;
    if (inputs.name) inputs.name.value = this.selectedPhone.name;
    if (inputs.capacity) inputs.capacity.value = this.selectedPhone.data?.Capacity || '';
    if (inputs.color) inputs.color.value = this.selectedPhone.data?.color || '';
    if (inputs.screenSize) inputs.screenSize.value = this.selectedPhone.data?.screenSize || '';
    if (inputs.generation) inputs.generation.value = this.selectedPhone.data?.generation || '';
    if (inputs.price) inputs.price.value = this.selectedPhone.data?.price?.toString() || '';

  }

  closePopUp(): void{

    const popup = document.getElementById('popUp');
    if (popup) {
      popup.style.visibility = 'hidden';
    }
    
  }

  updatePhone(){

    if(!this.selectedPhone) return;

    const updatedPhone: Test = {
      id: this.selectedPhone.id,
      name: (document.querySelector('#popUp input[name="name"]') as HTMLInputElement).value, //trae el valor del input
      data: {

        Capacity: (document.querySelector('#popUp input[name="capacity"]') as HTMLInputElement).value || null,
        color: (document.querySelector('#popUp input[name="color"]') as HTMLInputElement).value || null,
        screenSize: (document.querySelector('#popUp input[name="screenSize"]') as HTMLInputElement).value || null,
        generation: (document.querySelector('#popUp input[name="generation"]') as HTMLInputElement).value || null,
        price: Number((document.querySelector('#popUp input[name="price"]') as HTMLInputElement).value) || null
        
      }
    };
    console.log("UpdatedPhone: " + updatedPhone.name)
    this.testService.updatePhone(updatedPhone).subscribe(
    (response) => {
      console.log('Phone updated successfully:', response);
      const index = this.testList.findIndex(p => p.id === response.id); //recorre array testList para encontrar el celular que es igual al que tiene response
        if (index !== -1) {
          this.testList[index] = response;
          this.testList = [...this.testList];
        }
        this.closePopUp();
      },
      (error) => {
        this.closePopUp();
        console.error('Error updating phone', error);
      }
    );
    
  }

}







