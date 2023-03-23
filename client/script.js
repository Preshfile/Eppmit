//import icons from assets folder
import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

// is  to return 3 dots (...) to keep running until it fetches an answer to a question
function loader(element) {
  element.textContent = '';

  // set the load interval, 
  loadInterval = setInterval(() => {
    element.textContent += '.';
    //reset after 3 dots
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300) 
}

//letter by letter typing function to have a robot feel
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    //check if index is lower than text dot length. If yes, it means still typing.
    if(index < text.length){
      element.innerHTML += text.chartAt(index); //this will get the character under a specific index in the text that AI is going to return.
      index++; //increment
    } else {
      // simply clear the interval
      clearInterval(interval);
    }
  }, 20)
}

// generate a unique ID for every single message, to be able to map over them
function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  //finally we can return an id.
  return `id-${timestamp}-${hexadecimalString}`;//This will surely return a unique id.
}

// implement the chat stripe - the gray and the dark gray area, including who is speaking: AI or US.
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

// handle submit function which is going to be the trigger to get the Ai generated response. 
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
    //we need to parse it
    const parsedData = data.bot.trim();
 
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
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) { //13 is the enter key
    handleSubmit(e);
  }
}) 
