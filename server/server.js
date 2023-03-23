
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

//configuration
const configuration = new Configuration({
    apikey: process.env.OPENAI_API_KEY, //openai knows this key, and with it it should give responses
});

// create an instance of openai
const openai = new OpenAIApi(configuration);

// initialize our express application
const app = express();

//set up a couple of middlewears
app.use(cors());
app.use(express.json());

//create a dummy root route.
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Eppmit',
    })
});

//the post allow allows for a body or a payload
app.post('/', async (req, res) => {
    //wrap everything in a try and catch block
    try {
        const prompt = req.body.prompt;
        //get a response from th open API. Its a function that accepts an object
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0, //higher temperature value means the model will take more risks. in this case we don't want a lot of risk so we keep it down
            max_tokens: 3000,//The maximum number of tokens to generate in a completion. Giving it 3000 means it can give pretty long responses
            top_p: 1,
            frequency_penalty: 0.5,//means that it's not going to repeat similar sentences often, so we can set that to 0.5, hence its less likely to repeat itself 
            presence_penalty: 0,
            //we don't need a stop
        });

        //send response back to the frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        //if something goes wrong
        console.log(error);
        res.status(500).send({ error })
    }

})

// make sure that our server always listens for new requests
app.listen(17258, () => console.log(`Server is running on port http://localhost:17258`));