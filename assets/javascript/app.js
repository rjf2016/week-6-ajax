//----------------------------------------------
// Giphy API interface using AJAX
// 9/15/2016 RJF
//----------------------------------------------
/* --- Design thought process ---
  1) Layout how the button grid should look using sample bootstrap buttons
  2) Layout the "Add Item" text box and "Submit" button 
  3) Layout the results area using sample images and the "Rating:" text on top
  4) Ensure the grid can resize with images and buttons wrapping

Start stitching UI and Code together
  5) Create a new array to hold the buttons
  6) Create a function that displays the buttons from the array (drawButtons)
  7) Create an onclick handler for the "Submit" button 
  8) Create a drawGiphyData(searchString) function that makes an ajax call to the GiphyAPI
  9) Populate the resulting giphy data in the appropriate DIV 
 
Sample GIPHY Call:
http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC 
*/

var cars = ["Porsche 911 Turbo", "Tesla", "Audi", "Bentley Mulsanne", "Lamborghini Diablo", "Lamborghini Aventador"];
const maxRows = 25;  //set the max number we want returned from Giphy
const rating = "pg";  //rating used for Giphy call (i.e PG brings back PG, G.....R brings back R,PG-13,PG,G)
const category = "+cars"   //used to improve relevancy for whatever theme the page is using (in our case "cars").  We just append it to the search string.
    
// --- EVENT HANDLERS BELOW ---
// "ready" is called when the hmtl document is ready (loaded) ---
// placing code in a document.ready block holds off executing it until the page has loaded

$( document ).ready(function() 
{
  //Draw the initial set of buttons using the cars array default values
  drawButtons();  
 
 //Handle the click of the Category Submit and add the new category to the cars array ("push" to grow the array)
  $(".input-group-btn button").on("click", function()
  {
     categoryText = $(".form-control").val();  //get the value of what the user typed in the textbox
     
     if (cars.indexOf(categoryText) > -1)  // check if the name being submitted already exists in the array (if so, no need to repeat it, just return)
       return;

     cars.push(categoryText);
     drawButtons();

  });

//drawButtons: fills in the "selector" div with <button> objects for each item in the array 
function drawButtons()
{
  $("#selector").html("");  //clear whatever is in the html section
 
 //draw a button for each car in the cars array
  for (var car in cars){
    $("#selector").append("<button type='button' class='btn btn-primary'>" + cars[car] + "</button>");
  }

  //handles the Click event when a button is pressed and calls the drawGiphyData function to fetch images from the Giphy api
  $("#selector button").on("click", function()
  {
     btnText = this.innerHTML;
     drawGiphyData(btnText);
  });
}

//drawGiphyData: makes an ajax call to the giphy api using the text value of the clicked button as the search string 
//              url: "http://api.giphy.com/v1/gifs/search?limit=" + maxRows + "&rating=pg&q=" + searchString +  "+cars&api_key=dc6zaTOxFJmzC",
function drawGiphyData(searchString){

if(!searchString)  //empty or null, simply return
  return;

$("#giphyResults").html("");  //clear the existing results

  searchString = searchString.split(' ').join('+');  //replace spaces with "+"
  //console.log("http://api.giphy.com/v1/gifs/search?limit=" + maxRows + "&rating=" + rating + "&q=" + searchString + category + "&api_key=dc6zaTOxFJmzC");

  $.ajax({
    url: "https://api.giphy.com/v1/gifs/search?limit=" + maxRows + "&rating=" + rating + "&q=" + searchString + category + "&api_key=dc6zaTOxFJmzC",
    type: "GET",
    success: function(response) 
    {
      var htmlStr;  
      var lenResults = response.data.length;  //number of total rows returned from giphy

      for(var i=0; i < lenResults; i++)   
      {
          htmlStr = "<div class='col-lg-3 col-md-4 col-xs-6 thumb'>";
          htmlStr += "<a class='thumbnail' href='javascript:void(0);'>";   // used javascript:void(0) instead of "#" to avoid auto scroll when an image was clicked
          htmlStr += "<p>Rating: " + response.data[i].rating + "</p>";
          htmlStr += "<img class='img-responsive' src='" + response.data[i].images.fixed_height_still.url + "' data-swap='" + response.data[i].images.fixed_height.url + "' data-src='"+ response.data[i].images.fixed_height.url + "'></a>";
          htmlStr += "</a></div>";
         
          $("#giphyResults").append(htmlStr);
        }

        //function is called to toggle from the "still" image to the "animated" image
       $("#giphyResults img").on("click", function()
        {
             var _this = $(this);  //image that was clicked
             var current = _this.attr("src");  //current src of img on the screen (i.e. http://..../somephoto_still.jpg)
             var swap = _this.attr("data-swap");  //alternate version (i.e. http://..../somephoto_animated.jpg)
              _this.attr('src', swap).attr("data-swap",current); //simply swaps the 2 images upon a click (still->animated->still->animated...)
        });   
    
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("Status: " + textStatus); 
                    console.log("Error: " + errorThrown); 
           }  
});

}


});


 
