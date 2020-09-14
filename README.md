## Demo


# Pan Zoom Component for Camio
## Live Demo

[See a live demo!](https://mlpierce22.github.io/camio-auto-pan-zoom/)

## Installation
### In Angular:
1. Add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` into `app.module.ts` of the app you want to import into.
2. In `main.ts` add an import statement. I recommend downloading the pan-zoom.js file at this link and placing it into a local folder. For example, if I wanted something like `<script type='text/javascript' src="./pan-zoom.js"></script>`, then I would run something like `curl https://raw.githubusercontent.com/mlpierce22/camio-auto-pan-zoom/master/element/pan-zoom.js > ./element/pan-zoom.js` write this import into the main.ts: `import "../element/pan-zoom.js"`.
3. Using the tag name that you declared for the custom component, just embed it where you want it in the app as if it was a regular component. Eg. in this case: `<pan-zoom></pan-zoom>`

### In Javascript and HTML:
1. Place the web component declaration in the body of the html file (including inputs you need).
2. Underneath that, place a script tag that imports the `custom-component.js` file and declares it as type `text/javascript`.
3. Finally, add another script tag and inside that, place all event listeners.

```
...
<body>
  <pan-zoom></pan-zoom>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mlpierce22/camio-auto-pan-zoom@master/element/pan-zoom.js"></script>
  <script>
    // Javascript code for registering event listeners (see Javascript: Outputs below)
  </script>
</body>
```
## Quickstart Usage:
```
<body>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mlpierce22/camio-auto-pan-zoom@master/element/pan-zoom.js"></script>
  <pan-zoom></pan-zoom>
  <script>
    var config = {
      height: 100,
      width: 100,
      units: "%",
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
    document.querySelector("pan-zoom").setAttribute("config", JSON.stringify(config));
    document.querySelector("pan-zoom").addEventListener("videoElementSetup", function(elementSetUp) {
      // set video options, etc. since this is the actual video object
      const video = elementSetUp.detail
      video.autoplay = true;
      video.muted = true
      video.controls = false
      console.log("video element is set up!", video)
    })
  </script>
</body>
```

## Handling Input/Output events
### In Angular:
#### Inputs:
Follow the normal Angular syntax for inputs. That is `<pan-zoom [inputTitle]="componentNeedsThis"></pan-zoom>` would take our local variable `componentNeedsThis` and gives it to the web component as an input variable called `inputTitle`. **Note: inputTitle has to be the name of an actual input in the web component**

#### Outputs:
Follow the normal Angular syntax unless you need the payload of an event. That is `<pan-zoom (outputTitle)="functionToCall()"></pan-zoom>` would call our local function called `functionToCall` whenever an event fires from the emitter variable called `outputTitle`. Unlike typical Angular Syntax though, `$event` encapsulates the full event instead of the actual payload. To get the payload, and pass it to our function, we would have to do this: `(outputTitle)="functionToCall($event.detail)`. **Note: outputTitle has to be the name of an actual output event in the web component**

### In Javascript:
#### Inputs:
`<pan-zoom inputTitle="componentNeedsThis"></pan-zoom>` would take our local variable `componentNeedsThis` and gives it to the web component as an input variable called `inputTitle`.

Some sample code to make this more clear:
```
<pan-zoom inputTitle="componentNeedsThis"></pan-zoom>
<script>
var componentNeedsThis = "important words"
</script>
```

#### Outputs:
Unlike inputs, the outputs don't need to be declared in the html, instead they should be handled in a seperate script tag (so that we can actually catch the events) by registering an event listener on the component itself.

Some sample code to make this more clear:
```
<pan-zoom></pan-zoom>
<script>
  var camioStream = document.querySelector("pan-zoom")
  camioStream.addEventListener("outputTitle", function (event) {
    ...
    // Do stuff with event that will happen when outputTitle fires
    ...
  });
}
</script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mlpierce22/camio-auto-pan-zoom@master/element/pan-zoom.js"></script>
```

## Schema for this web component:
### Inputs
- *config*
  - Payload: Config
  - Description: Handles height, width, units and the video url

### Outputs
- *videoElementSetup*
  - Payload: HTMLVideoObject (use the `.detail` field of the event)
  - Triggered: When the video loads with the panzoom wrapper
  - Description: Allows access to the video settings once the object is embedded.

### Models
```
Config {
    height: number;
    width: number;
    units: string;
    videoUrl: string;
}
```