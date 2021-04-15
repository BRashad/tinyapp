const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  const userId = req.cookies['user_Id'];
  const currentUser = users[userId];
  const templateVars = { urls: urlDatabase, currentUser: currentUser };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies['user_Id'];
  const currentUser = users[userId];
  const templateVars = { currentUser: currentUser };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies['user_Id'];
  const currentUser = users[userId];
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL, currentUser: currentUser };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
});

const generateRandomString = () => {
  let randomString = Math.random().toString(36).substring(6);
  return randomString;
};

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const urlToDelete = req.params.shortURL;
  delete urlDatabase[urlToDelete];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortUrl = req.params.shortURL;
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect('/urls');
});

// app.post("/login", (req, res) => {
//   res.cookie('user_Id', req.body.username);
//   res.redirect('/urls');
// });

app.post("/logout", (req, res) => {
  res.clearCookie('user_Id');
  res.redirect('/urls');
});


// user database
const users = { 
  "qwerqwetw": {
    id: "user1RandomID", 
    email: "user1@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//register page rendering
app.get('/register',(req,res)=>{
  res.render("register");
});

const emailLookUp = (email) => {
  
  for (let i in users) {
    if(users[i]['email'] === email) {
      return true;    
    }
  }
  return false;
}

//user registration handler
app.post('/register',(req,res)=>{

  if (req.body.email === '' || req.body.password ==='') {
    res.status(400).send({ error: "Enter valid username or password" });
  } 
  if (emailLookUp(req.body.email)) {
    res.status(400).send({ error: "Email already exist. Please enter valid email" });
  }

  let userRandomId = generateRandomString();
  const createUser = { id: userRandomId, email: req.body.email, password: req.body.password };
  users[userRandomId] = createUser;
  
  res.cookie("user_Id", userRandomId);
  res.redirect('/urls');
});

//login page rendering
app.get('/login',(req,res)=>{
  res.render('login');
});

app.post('/login', (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  for (let i in users) {
    if(users[i]['email'] === userEmail && users[i]['password'] === userPassword) {
    
      res.cookie("user_Id", users[i]['id']);
      res.redirect("/urls");
      return;
    } 
  }
  res.redirect("/login");
})