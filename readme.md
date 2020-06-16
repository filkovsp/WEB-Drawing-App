# WEB Drawing App

### HTML5, JavaScript, CSS

This project comes from a small and simple task given to my daughter:
[Simple-Drawing-App.git](https://github.com/robloxcoolabc123/Simple-Drawing-App)\
Published version of that could be found here:
[Simple-Drawing-App](https://robloxcoolabc123.github.io/Simple-Drawing-App/)

I've tried to improve that project with some [OOP in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).\
Avoiding using TypeScript for OOP or anything else but JS + JQuery was intentional.\
Published version of this one is here:
[WEB-Drawing-App](https://filkovsp.github.io/WEB-Drawing-App)

### Functionality
This relates to my version of the app: [WEB-Drawing-App](https://filkovsp.github.io/WEB-Drawing-App).
1. Choose a shape. Colour will be set to black by default.
2. Draw a shape by clicking once on the canvas, then move mouse and watch how shape's sketch chages its size. Make second click when you're satisfied with the size and place. This is called modelling process. If you decide to cancell modelling and pick another shape or shange its colour - press ESC key while modelling. Then repeat this step from beginning.
3. When shape has been placed on the canvas use Mouse scroll Up/Down to Zoom In/Out.
3. To drag the whole picture over the canvas press middle mouse button, hold it and move mouse in the direction you want. Relase the middle mouse button to set the new place for the drawing at the canvas. Alternatively, you can also use arrow buttons on UI, under the `Offset` display.

For quick "check and look around" you can use below code "short cut" in your browser's dev-tools console:
```javascript
$("#draw-button").click();
```