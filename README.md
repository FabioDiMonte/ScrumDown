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
Insert the desired countdown in the form `[NN]h[NN]m[NN]s` where `[NN]` is the desired amount of time.  
eg:
`2h30m15s`, `15m`, `24h`, `2h20s`, `70s`, `80m`, `30s10m`, ...

At any time you can:
- Press `ENTER` to start the counter from the beginning
- Press `SPACE` to play/pause the counter
- Press `ESC` to stop the counter
