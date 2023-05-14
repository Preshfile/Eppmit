// import the icons from our assets folder
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
    //add each of the three dots ever 300 milliseconds
    element.textContent += '.';
    //if the elements reaches 3 dots, we want to reset it
    if (element.textContent === '....') {
      //reset it if the dot reaches 3. This is going to repeat every 300 milliseconds
      element.textContent = '';
    }
  }, 300) 
}
//create a function that would make the API type one letter by letter giving the feel of a robot or machine.
function typeText(element, text) {
  //at the start, the index is going to be set to 0
  let index = 0;

  //we create another interval with just 20 milliseconds
  let interval = setInterval(() => {
    //check if index is lower than text dot length. If yes, it means we're still typing.
    if(index < text.length){
      element.innerHTML += text.chartAt(index);
      index++; 
    } else {
      //clear the interval
      clearInterval(interval);
    }
  }, 20)
}

// generate a unique ID for every single message, to be able to map over them
function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  
  //return an id.
  return `id-${timestamp}-${hexadecimalString}`;//This will surely return a unique id.
}
//implement the chat stripe - the gray and the dark gray area, including who is speaking: AI or US.
function chatStripe (isAi, value, uniqueId ){
  return(
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
//a handle submit function which is going to be the trigger to get the Ai generated response. 
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);//get the data the form element from our HTML
  //Generate the user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  //clear the text area input
  form.reset();

  //bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  //scrol to see the message
  chatContainer.scrollTop = chatContainer.scrollHeight;
  //fetch the newly created div with every single message having a uniqueId
  const messageDiv = document.getElementById(uniqueId);
  //turn on the loader and pass in the message
  loader(messageDiv);

//fetch data from server
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
messageDiv.innerHTML = '';
  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();
    
    // parse it through the type text function created before
    typeText(messageDiv, parsedData);
  } else{
    // if we have an error
    const err = await response.text();
    //set the error message
    messageDiv.innerHTML = "Something went wrong"
    //and alert the error;
    alert(err);
  }
}

//to see the changes made to handle submit, call it
form.addEventListener('submit', handleSubmit);
//we developers are used to submitting with enter key.
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) { //13 is the enter key
    handleSubmit(e);
  }
}) 
