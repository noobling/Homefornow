~~# Basic skeleton code for now it won't run, just to show you structure of app~~

# anglicare-sprint-week
LETS GOOOOOOOOOOOOO

## Getting started
* `git clone https://github.com/noobling/anglicare-sprint-week.git`
* `npm install`
* `npm start`
* `npm run devstart` This runs the project using nodemon. To reset the server then use 'rs'.

## Useful commands
* `heroku addons:open mongolab`
* `nodemon` Adds hot reloading (server automatically restarts on each file change)
* `heroku config:get MONGODB_URI`

## Helpful hints for professional software development
### Workflow
In a real world scenario where you have a _production_ application that is being used by customers things start to get complicated very quickly because just this introduces the need for the following:
* Production application
* Producation Database
* Development application 
* Development Database
* Local application
* Local Database

Why do we need that development stuff? Just because this thing works on my machine doesn't mean it works on your machine.

### Branches
The way we make commits is also impacted. 
<table>
  <thead>
    <tr>
      <th>Instance</th>
      <th>Branch</th>
      <th>Description, Instructions, Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Stable</td>
      <td>stable</td>
      <td>Accepts merges from Working and Hotfixes</td>
    </tr>
    <tr>
      <td>Working</td>
      <td>master</td>
      <td>Accepts merges from Features/Issues and Hotfixes</td>
    </tr>
    <tr>
      <td>Features/Issues</td>
      <td>topic-*</td>
      <td>Always branch off HEAD of Working</td>
    </tr>
    <tr>
      <td>Hotfix</td>
      <td>hotfix-*</td>
      <td>Always branch off Stable</td>
    </tr>
  </tbody>
</table>

There are generally three or four main branches in which developers will branch off, of to make their required changes.
Hopefully what each branch is self explanatory from its name. Master is the main branch which contains tested code that is ready to be deployed. Stable branch represents what is in production. Each release should be tagged and each hot fix merged into stable should be tagged.
[Learn more here](https://gist.github.com/digitaljhelms/4287848#file-gistfile1-md)


## TODO
1. Become familiar with main technologies `express/mongoDB/mongoose` you can learn HTML/CSS/JAVASCRIPT but your time would be more efficiently spent learning the framework 
2. Become proficient enough to fix this broken app
3. Break down problem into components/functions e.g. authentication, admin form for vacancies, page for vancancies, landing page, schemas etc.
4. Start building your component function!

## I hope you guys have fun and learn a bunch from this :) ~David
