
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

//to be able to use the dotenv variable
dotenv.config();


//configuration
const configuration = new Configuration({
    apikey: process.env.OPENAI_API_KEY, //openai key, 
});

//then we need to create an instance of openai
const openai = new OpenAIApi(configuration);

//we need to initialize our express application
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
app.post('/', async (req, res) => {
    //wrapp everything in a try and catch block
    try {
        const prompt = req.body.prompt;
        //get a response from th open API. Its a function that accepts an object
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature: 0, 
            max_tokens:3000,
            top_p: 1,
            frequency_penalty: 0.5, 
            presence_penalty: 0,
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        //if something goes wrong
        console.log(error);
        res.status(500).send({ error })
    }

})
//server listens for new requests
app.listen(17258, () => console.log(`Server is running on port http://localhost:17258`));
