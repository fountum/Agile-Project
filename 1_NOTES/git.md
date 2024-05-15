 <!-- BASICS -->
# Check version of git 
`git --version`

# See what git is currently thinking
`git status`

# Tell git to watch over this folder (only run once ever)
`git init`

# "U" beside file name means the files are being untracked

# Track all files in the folder - needs to be done every time a change is made to file 
`git add .`

# Untrack specific file 
`git reset app.py`

# Do this easier with  a .gitignore file in your folder
# Simply put "app.py" into your .gitignore file

# Commit changes - should write message in present tense (can use conventional commits for more detail)
`git commit -m " "`

# Make sure code sent to Github lives in an area called main (or master)
`git branch -M maim`

# Connect code to your repository
`git remote add origin https://github.com/your-username/repo-name`
 
# When you push code for first time (-u sets origin main as the default )
`git push -u origin main`

# Shows all commits that have been made 
`git log`
# Slightly more condensend version 
`git log --oneline --all`

# You always have to run `git pull` before you `git push` 

<!-- BRANCHING  -->

# Shows all branches 
`git branch`
# Downloads others' branches
`git fetch`

# Creates branch called  "feat/registration"
`git checkout -b feat/register#TrelloID`

# Navigates to branch specified
`git checkout main`

# Pushes to new branch 
`git push origin feat/register`

# Should run `git pull` after branches are merged, or if you encounter an error

# Delete a brach 
`git branch -d feat/register`

# Creating a pull request: create a branch and push to this branch 

<!-- RESET: Only use it when you go back in time on your own branch -->
# Rewind code to one commit ago 
`git reset --hard HEAD~1`
# Rewind code to two commits ago 
`git reset --hard HEAD~2`
# Rewind code to id shown when running `git log`
`git reset --hard ID`


# Shows teammates' branches
`get branch --all`
# Then you can `git checkout` into teammates' branch


# `git pull` = `git fetch` + `git merge`