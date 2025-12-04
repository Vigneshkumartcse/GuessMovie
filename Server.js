const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// CORS configuration to allow multiple origins
const corsOptions = {
    origin: [
        'https://breaktimebrainpuzz.in',
        'https://www.breaktimebrainpuzz.in',
        'http://localhost:3000',
        'http://localhost:5173'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
const PORT = process.env.PORT || 3331;
const MONGO_URI = "mongodb+srv://movies:kumar2002@cluster0.hne66h1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MovieSchema  = mongoose.Schema({
    name: String,
    clue: [String]
})

const Movie = mongoose.model("Movie", MovieSchema);


const CricketSchema  = mongoose.Schema({
    name: String,
    clue: [String]
})

const GuessQuestionSchema  = mongoose.Schema({
    name: String,
    Title:String,
    Explanation:String,
    Answer:String,
    img:String
})


const DetectiveSchema  = mongoose.Schema({
    Question:String,
    peopleInvolved:[String],
    Questionasked:[String],
    clues:[String],
    Options:[String],
    Answer:String
})


const SongsSchema  = mongoose.Schema({
    name: String,
    clue: [String]
})
const Songs = mongoose.model("Songs", SongsSchema);



const CountryByCapitalSchema  = mongoose.Schema({
    name: String,
    catagory:String,
    clue: [String],
    Answer:String
})
const CountryByCapital = mongoose.model("CountryByCapital", CountryByCapitalSchema);  


const Detective = mongoose.model("Detective", DetectiveSchema);



const GuessQuestion = mongoose.model("GuessQuestion", GuessQuestionSchema);


const GKschema  = mongoose.Schema({
    question: String,
    category:String,
    region:String,
    clues: [String],
    answer:String
})

const GK = mongoose.model("GK", GKschema);

app.post("/GK", async (req, res) => {
    try {
        const { question, category, region, clues, answer } = req.body;
        const gk = new GK({ question, category, region, clues, answer });
        await gk.save();
        res.status(201).json(gk);
    } catch (error) {
        console.error("Error creating GK question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/GK/Bulk", async (req, res) => {
    try {
        const gkData = req.body;
        const gkQuestions = await GK.insertMany(gkData);
        res.status(201).json(gkQuestions);
    } catch (error) {
        console.error("Error creating GK questions in bulk:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.get("/GK", async (req, res) => {
    try {
        const gkQuestions = await GK.find();
        res.status(200).json(gkQuestions);
    } catch (error) {
        console.error("Error fetching GK questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/GKSingle/:category/:region", async (req, res) => {
    try {
        const { category, region } = req.params;
        const gkQuestions = await GK.find({ category, region });
        res.status(200).json(gkQuestions);
    } catch (error) {
        console.error("Error fetching GK questions by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.delete("/GK/:category/:region", async (req, res) => {
    try {
        await GK.deleteMany({});
        res.status(200).json({ message: "All GK questions deleted successfully" });
    } catch (error) {
        console.error("Error deleting GK questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//allow multiple categories (comma-separated)
app.get("/GK/:category/:region", async (req, res) => {
    try {   
        const { category, region } = req.params;
        // Split by comma to handle multiple categories
        const categories = category.split(',').map(cat => cat.trim());
        // Use $in operator to find documents matching any of the categories
        const gkQuestions = await GK.find({ category: { $in: categories }, region });
        res.status(200).json(gkQuestions);
    }
    catch (error) {
        console.error("Error fetching GK questions by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});





app.get("/CountryByCapital", async (req, res) => {
    try {
        const countryByCapitals = await CountryByCapital.find();    
        res.status(200).json(countryByCapitals);
    } catch (error) {
        console.error("Error fetching CountryByCapital:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/CountryByCapital", async (req, res) => {
    try {
        const { name, catagory, clue, Answer } = req.body;  
        const countryByCapital = new CountryByCapital({ name, catagory, clue, Answer });
        await countryByCapital.save();
        res.status(201).json(countryByCapital);
    }
    catch (error) {
        console.error("Error creating CountryByCapital:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/countrybycapital/Bulk", async (req, res) => {
    try {
        const countryByCapitalsData = req.body;
        const countryByCapitals = await CountryByCapital.insertMany(countryByCapitalsData);
        res.status(201).json(countryByCapitals);
    } catch (error) {
        console.error("Error creating CountryByCapital in bulk:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/countrybycapital/:catagory", async (req, res) => {
    try {
        const { catagory } = req.params;
        const countryByCapitals = await CountryByCapital.find({ catagory });
        res.status(200).json(countryByCapitals);
    } catch (error) {
        console.error("Error fetching CountryByCapital by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post("/songs", async (req, res) => {
    try {
        const { name, clue } = req.body;
        const song = new Songs({ name, clue });
        await song.save();
        res.status(201).json(song);
    } catch (error) {
        console.error("Error creating song:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/songs", async (req, res) => {
    try {
        const songs = await Songs.find();
        res.status(200).json(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/Detective", async (req, res) => {
    try {
        const { Question, peopleInvolved, Questionasked, clues, Options, Answer } = req.body;
        const detective = new Detective({ Question, peopleInvolved, Questionasked, clues, Options, Answer });
        await detective.save();
        res.status(201).json(detective);
    } catch (error) {
        console.error("Error creating detective question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/Detective", async (req, res) => {
    try {
        const detectives = await Detective.find();
        res.status(200).json(detectives);
    }
    catch (error) {
        console.error("Error fetching detective questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});





app.post("/Questions", async (req, res) => {
    try {
        const { name, Title, Explanation, Answer, img } = req.body;
        const question = new GuessQuestion({ name, Title, Explanation, Answer, img });
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        console.error("Error creating question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/Questions", async (req, res) => {
    try {
        const questions = await GuessQuestion.find();
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


const Cricket = mongoose.model("Cricket", CricketSchema);
mongoose.connect(MONGO_URI).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});


app.post("/movies", async (req, res) => {
    try {
        const { name, clue } = req.body;
        const movie = new Movie({ name, clue });
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        console.error("Error creating movie:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/cricket", async (req, res) => {
    try {
        const { name, clue } = req.body;
        const cricket = new Cricket({ name, clue });
        await cricket.save();
        res.status(201).json(cricket);
    } catch (error) {
        console.error("Error creating cricket:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/cricket", async (req, res) => {
    try {
        const cricket = await Cricket.find();
        res.status(200).json(cricket);
    } catch (error) {
        console.error("Error fetching cricket:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/movies", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
