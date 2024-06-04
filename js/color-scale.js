let colorScale = document.getElementById('sidebar__scale'); 
 let temp = document.getElementById('parameters_tempreture'); 

 let colors = ['#0044ff','#ff0099','#ff6655','#ff7744','#ff9933','#ffaa22','#ffee11','#ffff99','#ff0000']; 

    if(temp.value){
        drawScale(colors); 
    }


  function drawScale(colors){
    colorScale.innerHTML = `
            
    <p class="scale_unit"> °C </p>
    <aside style ="background: ${colors[7]} " >>30</aside>                
    <aside style ="background: ${colors[6]} " >25</aside>                
    <aside style ="background: ${colors[5]} " >22</aside>                
    <aside style ="background: ${colors[4]} " >20</aside>                
    <aside style ="background: ${colors[3]} " >18</aside>                
    <aside style ="background: ${colors[2]} " >16</aside>                
    <aside style ="background: ${colors[1]} " >13</aside>                
    <aside style ="background: ${colors[8]} " >11</aside>                
    <aside style ="background: ${colors[0]} " ><10</aside>                
    
    `

}



