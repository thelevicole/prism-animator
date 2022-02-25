# PrismJS Animator

Simple code typing/animation library for [Prism](https://prismjs.com/) syntax highlighter.

## Basic usage

**HTML**

```html
<div id="editor"></div>
```

**JavasScript**
```javascript
const editor = document.getElementById('editor');
new PrismAnimator(editor, 'javascript', 'var example = "Hello world";', 600);
```


## jQuery ready
```javascript
$('#editor').prismAnimator({
    language: 'javascript',
    code: 'var example = "Hello world";',
    cpm: 600
});
```
