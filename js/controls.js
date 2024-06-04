class Controls {
  constructor(inputElementId, outputElmentId){
    this.inputElementId = document.getElementById(inputElementId); 
    this.outputElmentId = document.getElementById(outputElmentId); 
    this.variable; 

    if(this.inputElementId.type === "checkbox"){
      this.updateOutputUI(this.inputElementId.checked); 
      this.updateOutputVar(this.inputElementId.checked);

      this.inputElementId.addEventListener('input', ()=> {
          this.updateOutputUI(this.inputElementId.checked); 
          this.updateOutputVar(this.inputElementId.checked);
    })
    }else  if(this.inputElementId.localName.includes("section" || "div" || "li" || "ul") &&  
              this.inputElementId.localName === this.outputElmentId.localName){
    
                return; 
    
    }else {

    this.updateOutputUI(this.inputElementId.value); 
    this.updateOutputVar(this.inputElementId.value);

   
    this.inputElementId.addEventListener('input', ()=> {
        this.updateOutputUI(this.inputElementId.value); 
        this.updateOutputVar(this.inputElementId.value);

    })
    }

  }


  updateOutputUI(value){
    this.outputElmentId.textContent = value; 
  }

  updateOutputVar(value){
    this.variable = value;
  }

  getValue() {
    return this.variable; 
  }

  setContent(content){
    if(this.outputElmentId.textContent === content) return ; 
    
    this.outputElmentId.innerHTML = content; 
  }
}
 