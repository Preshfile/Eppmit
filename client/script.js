//lets start by importing our icons from our assets folder
import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

//This loader is simply going to return 3 dots (...) to keep running until it fetches an answer to a question
function loader(element) {
  element.textContent = '';

  // set the load interval, a function that accepts another call back function
  loadInterval = setInterval(() => {
    //we want to do something - adding each of the three dots ever 300 milliseconds
    element.textContent += '.';
    //if the elements reaches 3 dots, we want to reset it
    if (element.textContent === '....') {
      //then we reset it if the dot reaches 3. This is going to repeat every 300 milliseconds
      element.textContent = '';
    }
  }, 300) 
 
}

//create a function that would make the API type one letter by letter giving the feel of a robot or machine.
//we don't want our entire text to simply appear instantly, we want it running
//letter by letter so it could be perceived as a robot
function typeText(element, text) {
  //at the start, the index is going to be set to 0
  let index = 0;

  //we create another interval with just 20 milliseconds
  let interval = setInterval(() => {
    //lets check if index is lower than text dot length. If yes, it means we're still typing.
    if(index < text.length){
      element.innerHTML += text.chartAt(index); //this will get the character under a specific index in the text that AI is going to return.
      index++; //increment
    } else {
      //we want to simply clear the interval
      clearInterval(interval);
    }
  }, 20)
}

//we want to generate a unique ID for every single message, to be able to map over them
function generateUniqueId(){
  const timestamp = Date.now();//in javascript and many other languages, how you generate a unique id is using the current time and date - that is always unique.
  const randomNumber = Math.random();//to make it even more random, we use these JavaSript built-in functions
  const hexadecimalString = randomNumber.toString(16);//we can make it even more random by creating a hexadecimal string - 16 characters.
  
  //finally we can return an id.
  return `id-${timestamp}-${hexadecimalString}`;//This will surely return a unique id.
}

//let's implement the chat stripe - the gray and the dark gray area, including who is speaking: AI or US.
//we will get the value of the message and pass it a unique id
function chatStripe (isAi, value, uniqueId ){
  return(
    //this function will return a template string not regular strings
    //with regular strings, you cannot create spaces or enters, but with template strings, you can
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

//let's create our handle submit function which is going to be the trigger to get the Ai generated response. it's going to be an async function to take an event as the first and only parameter
const handleSubmit = async (e) => {
  //the default browser behaviour for when you submit a form is to reload the browser. But we dont want that to happen so we first prevent it:
  e.preventDefault();//This will prevent the default behaviour of the browser.

  const data = new FormData(form);//Now to get the data we typed into the form element from our HTML
  
  
  //Generate the user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  //clear the text area input
  form.reset();

  //bot's chatstripe
  const uniqueId = generateUniqueId();//first generate a unique Id for it's message
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);//also Generate the bot's chatStripe. This time it's going to be true because the Ai is typing. we also give it a string with one empty space bcos it will fill it up later on.
  //we also provide the uniqueId as the third parameter

  //to keep scrolling down to see the message
  chatContainer.scrollTop = chatContainer.scrollHeight;//This is going to put he new message in view
  
  //fetch the newly created div with every single message having a uniqueId
  const messageDiv = document.getElementById(uniqueId);

  //turn on the loader and pass in the message
  loader(messageDiv);

//fetch data from server
//this is the place we can fetch the data from server, which means that we can get the bot's response
const response = await fetch(`http://localhost:17258`, {
  method: 'POST',
  headers: {
    'content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: data.get('prompt')
  })
})

clearInterval(loadInterval);
messageDiv.innerHTML = ''; //because were not sure at which point in the loading are we right now at the point when we fetch - might be one dot 2 or three dots
//but we want to clear it to be empty at the time we want to add our message.
  if(response.ok){
    const data = await response.json();//this is giving us the actual response coming from the backend but 
    //we need to parse it
    const parsedData = data.bot.trim();
    // console.log({parsedData})

    //and finally we can parse it through our type text function which we created before
    typeText(messageDiv, parsedData);
  } else{
    // if we have an error
    const err = await response.text();
    //set the error message
    messageDiv.innerHTML = "Something went wrong"
    //and we're going to alert the error;
    alert(err);
  }
}

//to be able to see the changes made to our handle submit, we have to call it
form.addEventListener('submit', handleSubmit);//its going to be a listener for a submit event. Once we submit, we want to call the handleSubmit function)
//we developers are used to submitting with enter key.
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) { //13 is the enter key
    handleSubmit(e);
  }
}) 

//create a backend application that is going to make a 
//a call to the ope AI's chat GPD API. Lets get started with that in the server folder
