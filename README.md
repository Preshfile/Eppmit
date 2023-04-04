<img src="https://user-images.githubusercontent.com/79994012/229786373-fb5b6cbe-8c66-4b44-a589-1c5f6685e98b.png">
<h1>Welcome to Eppmit</h1>
<p>Eppmit is a chatbot that leverages OpenAI's natural language processing capabilities to provide human-like responses to users' prompts. This README provides a guide on how to install and use the Eppmit chatbot.</p>

<h2>Task</h2>
<p>Eppmit is designed to generate responses to text prompts entered by the user. The chatbot makes use of OpenAI's GPT-3 natural language processing engine to generate human-like responses to the user's prompts.</p>

<h2>Description</h2>
<p>The Eppmit chatbot is built with Node.js, Express, and OpenAI's API. The server.js file contains the backend code that handles requests and responses from the user. The script.js file contains the front-end code that sends prompts to the backend and displays responses from the chatbot.</p>

<h2>Installation</h2>
<p>To install and use the Eppmit chatbot, follow the steps below:</p>
<ul>
  <li>Clone the repository to your local machine using the command: git clone https://github.com/Preshfile/Eppmit.git.</li>
  <li>Navigate to the root directory of the project using the command: cd eppmit.</li>
  <li>Install the required dependencies using the command: npm install.</li>
  <li>Obtain an OpenAI API key from the OpenAI platform.</li>
  <li>Create a new .env file in the root of the project and add the following line: OPENAI_API_KEY="your_openai_api_key", replacing your_openai_api_key with the API key    obtained in step 4.</li>
  <li>Start the server using the command: npm start.</li>
  <li>Open your web browser and navigate to http://localhost:17258 to launch the Eppmit chatbot.</li>
</ul>
<h2>Usage</h2>
<p>To use the Eppmit chatbot, enter a prompt in the input field provided and click the "Send" button. The chatbot will generate a response to the prompt entered and display it in the chat window. A loader will appear while the chatbot processes the prompt and generates a response.</p>

<p>The chatbot is capable of generating responses of up to 3000 tokens in length. The model parameter in the server.js file can be changed to any of the available models on the OpenAI platform to suit your specific use case.</p>
<h2>Author</h2>
<p>Precious Oranye.</p>
