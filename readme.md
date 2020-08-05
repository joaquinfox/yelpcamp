# YelpCamp
## Introduction
This is a node/Express application I built to practice synthesizing several technologies including a mongoDB database, passport for authentication, and connect-flash for messaging and UI.

## Technologies
* connect-flash@0.1.1
* cookie-parser@1.4.5
* ejs@3.0.2
*  express@4.17.1
* express-sanitizer@1.0.5
* express-session@1.17.1
* method-override@3.0.0
* mongoose@5.9.7
* passport@0.4.1
* passport-local@1.0.0
* passport-local-mongoose@6.0.1

## Launch
The project is hosted on heroku (single dyno) and can be previewed at <https://yelpcamp-deploy-03.herokuapp.com/campgrounds>

### Key Takeaways
The app gives a user access to a list of camps, each with a title, image and description. Upon registration users can then add a new camp, through a form submissiont, which then builds a new record in a mongo database. 

Users can comment on each camp, and users can edit or delete both their own comments and their own camps. Passport is used to verify user identity and authorization to edit or delete data. A local Passport strategy is used for authentication with sessions (as opposed to tokens).

The app is strictly RESTfull and data is associated via the ObjectId so that, for example, the author of a comment is identified by nesting identifying information _inside_ of the comment schema as follows:

```
commentSchema = new mongoose.Schema({
   text:String,
   author:{
       username: String,
       id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
       }
   }
})

```

Other features of this app include
 * connect-flash is used for user messaging to enhance UI
 
What this app does not do:
* Does not query an API
* Does not authenticate using tokens
* Styling is minimal 






