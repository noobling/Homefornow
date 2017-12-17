# anglicare-sprint-week
LETS GOOOOOOOOOOOOO

## Our work flow
1. Find something to fix or add.
2. Create a card [here](https://github.com/noobling/anglicare-sprint-week/projects/1)
3. Open an issue with card
4. Assign the appropriate people
5. Make your feature or fix branch by branching off `developer`
6. Add you changes
7. Make a pull request to `developer` branch. Make sure you reference the issue you are resolving
8. Request and wait for someone to review you changes
9. Merge your changes
10. Delete your branch

Just ask me if any of this doesn't make sense

## Getting started
* `git clone https://github.com/noobling/anglicare-sprint-week.git`
* `npm install`
* `npm start`
* `npm run devstart` This runs the project using nodemon. To reset the server then use 'rs'.

## Useful commands
* `heroku addons:open mongolab`
* `nodemon` Adds hot reloading (server automatically restarts on each file change)
* `heroku config:get MONGODB_URI`
* Windows: `ctrl+f` mac: `cmd+k then cmd+f` Auto indentation/formatting of code

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

## Git basics
What is git? Basically something to track your file changes. Ofcourse it gives you much more than that, that is why nearly every software organisation large or small e.g. Google, Atlassian, Microsoft, Apple etc use it. [Learn more here](https://www.atlassian.com/git/tutorials/what-is-git)

There exists GUIs for using git e.g. Github desktop app, Git Kraken and Source tree however you will find
that the command line is actually easier to use for basic commands and gives you more power. That doesn't mean the CLI and GUIs are mutually exclusive. I use both in my daily work. 

### Common git commands
* Get the remote repo and set up remote tracking on origin/branch-name: `git clone https://github.com/githubusername/repo-name.git`
* Add your changes to staging, this prepares yours changes to be saved to "history": `git add file-name`
* Save your stages changes into "history": `git commit -m "Helpful commit message that describes your changes"`
* Push your changes up to remote repo (The remote repo must be tracked): `git push origin branch-name`
* Get changes from a remote tracking branch: `git pull origin remote-branch-name`

### The git cheat sheet
![Git cheat sheet](https://github.com/noobling/anglicare-sprint-week/blob/master/wiki_assets/atlassian-git-cheatsheet.pdf "Git cheat sheet")

## TODO
Probably should use trello for this stuff but its nice to have everything in one location
1. Decide whether we should start from the beginning on new repo or build from this
2. I feel like the best way for you guys to learn is to pick a task to do then learn the required things to do that task then do that task?
- [ ] Yes
- [ ] No

## I hope you guys have fun and learn a bunch from this :) ~David
