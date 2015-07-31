# ScrumDown
Scrum tool

## How to start
Just execute this command:
```
git clone https://github.com/FabioDiMonte/ScrumDown.git && cd ScrumDown && npm install && grunt && open build/index.min.html
```

In details, you should:
- clone the project
- execute `npm install` once
- now you can do one of the following:
  - open the file `src/index.html`
  - execute `grunt build` and then open the built `build/index.min.html`

## How it works
Insert the desired countdown in the form `2h30m15s`, you can also just use one or more of them: `30m` and even unordered: `10s1h`..

At any time you can:
- Press `ENTER` to start the counter from the beginning
- Press `SPACE` to play/pause the counter
- Press `ESC` to stop the counter
