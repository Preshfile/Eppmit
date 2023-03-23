//here we do all the setups and all the configurations to be all to call openai's API
//but first we need the API key and we can get it straight from https://platform.openai.com/
//to get started, click your profile on top right and click view API keys
//right there you will see 'create a new secrete key'
//finally copy it
//Then back inside our code, open the file explorer, and then in the root of our our application,
//create a new .env file(make sure it's in the root and not in the server folder).
//write this OPENAI_OPEN_KEY"" inside the .env file and paste the generated key inside the string, thats all.

//now lets start writing inside our server.js file

//first let's import a couple of things
//the .env should be inside theserver folder because thats where we should use it
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

//to be able to use the dotenv vaiable
dotenv.config();


//configuration
const configuration = new Configuration({
    apikey: process.env.OPENAI_API_KEY, //openai knows this key, and with it it should give us responses
});

//then we need to create an instance of openai
const openai = new OpenAIApi(configuration);

//we need to initialize our express application
const app = express();
//set up a couple of middlewears
app.use(cors());//This is going to allow us to make those cross origin requests and allow our server to be called from the front end
app.use(express.json());//this is going to allow us to pass jason from the front end to the back end

//create a dummy root route. 
//its going to be an asynchronous function that will accept a request and a response
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Eppmit',
    })
});

//the post allow allows us to have a body or a payload so
app.post('/', async (req, res) => {
    //lets wrapp everything in a try and catch block
    try {
        const prompt = req.body.prompt;
        //get a response from th open API. Its a function that accepts an object
        const response = await openai.createCompletion({
            //there are a lot of different things we can pass into this function
            //go to this https://platform.openai.com/examples and type code, click on natural language Api and click on openplayground
            //we will see on the right side different language models available from which we can choose from
            //code models are capable of generating code. 
            //in our available options, text DaVinci 3 is found to be more capable because...
            //it can understand text as well as code and it can produce higher quality output.
            //so we gonna switch to text DaVinci 3. now click view code
            //This is going to give you a snippet of code, we only copy the parameters and paste them in this function

            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature: 0, //higher temperature value means the model will take more risks. in this case we don't want a lot of risk so we keep it down
            max_tokens:3000,//The maximum number of tokens to generate in a completion. Giving it 3000 means it can give pretty long responses
            top_p: 1,
            frequency_penalty: 0.5,//means that it's not going to repeat similar sentences often, so we can set that to 0.5, hence its less likely to repeat itself 
            presence_penalty: 0,
           //we don't need a stop
        });
        
        //once we get the responses, we need to send it back to the frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        //if something goes wrong
        console.log(error);
        res.status(500).send({ error })
    }

})

//the above is all you need to do to be able to get a response from the most powerful AI

//now we have to make sure that our server always listens for new requests
app.listen(17258, () => console.log(`Server is running on port http://localhost:17258`));