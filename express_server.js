const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['keys[0]'],
}))
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

app.get("/", (req, res) => {
  return res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//renders index page
app.get("/urls", (req, res) => {
  const userId = req.session['user_Id'];
  const currentUser = users[userId];
  const templateVars = { urls: urlDatabase, currentUser: currentUser, userId: userId };
  return res.render("urls_index", templateVars);
});

//register new user ?
app.get("/urls/new", (req, res) => {
  const userId = req.session['user_Id'];
  const currentUser = users[userId];
  const templateVars = { currentUser: currentUser };
  return res.render("urls_new", templateVars);
});

//show url
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session['user_Id'];
  const currentUser = users[userId];
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL, currentUser: currentUser };
  return res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const userId = req.session["user_Id"];
  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = { longURL: req.body.longURL, userID: userId };
  return res.redirect(`/urls/${shortUrl}`);
});

//generating random string for short url
const generateRandomString = () => {
  let randomString = Math.random().toString(36).substring(6);
  return randomString;
};

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  console.log(longURL);
  return res.redirect(longURL);
});

//loop over the user used in DELETE and EDIT links routes
const urlsForUser = (id) => {
  const result = {};
  for (let i in urlDatabase) {
    if (urlDatabase[i]['userID'] === id) {
      result[i] = urlDatabase[i];
    }
  }
  return result;
};

//DELETE URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const urlToDelete = req.params.shortURL;
  const userId = req.session["user_Id"];
  console.log("userId", userId);
  const myUrl = urlsForUser(userId);
  let theurl = myUrl[urlToDelete];
  if (theurl) {
    delete urlDatabase[urlToDelete];
  }
  return res.redirect("/urls");
});
  
//EDIT URL
app.post("/urls/:shortURL", (req, res) => {
  const userId = req.session["user_Id"];
  const shortUrl = req.params.shortURL;
  const myUrl = urlsForUser(userId);
  let theurl = myUrl[shortUrl];

  const newLongUrl = req.body.longURL;
  if (theurl) {
    urlDatabase[shortUrl].longURL = newLongUrl;
  }
  return res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  delete req.session["user_Id"];
  return res.redirect('/urls');
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
};

//register page rendering
app.get('/register',(req,res)=>{
  return res.render("register");
});

//email look up function
const emailLookUp = (email) => {
  
  for (let i in users) {
    if (users[i]['email'] === email) {
      return users[i];
    }
  }
  return false;
};

//user registration handler
app.post('/register',(req,res)=>{

  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send({ error: "Enter valid username or password" });
  }
  if (emailLookUp(req.body.email)) {
    return res.status(400).send({ error: "Email already exist. Please enter valid email" });
  }

  let userRandomId = generateRandomString();
  
  const password = req.body.password;
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const createUser = { id: userRandomId, email: req.body.email, password: hashedPassword };
  users[userRandomId] = createUser;
  console.log()
  req.session.user_Id = userRandomId;
  return res.redirect('/urls');
});

//login page rendering
app.get('/login',(req,res)=>{
  return res.render('login');
});

//login validation
app.post('/login', (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
   
  const user = emailLookUp(userEmail);
  //console.log(userEmail, userPassword, user)
  if (!user) {
    res.status(403).send({ error: "Enter valid email" });

    return;
  }
  console.log(user['email'], user['password'], userPassword)


  if (user['email'] && !bcrypt.compareSync(userPassword, user['password'])) {
    res.status(403).send({ error: "Enter valid password" });

    return;
  }
  req.session.user_Id = user['id'];
  return res.redirect("/urls");
});

  