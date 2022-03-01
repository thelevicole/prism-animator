
# PrismJS Animator

Simple code typing/animation library for [Prism](https://prismjs.com/) syntax highlighter.

## Basic usage

**HTML**

```html
<div id="editor"></div>
```

**JavasScript**
```javascript
new PrismAnimator({
    element: document.getElementById('editor'),
    language: 'javascript',
    code: 'var example = "Hello world";',
    charactersPerMinute: 600
});
```


## jQuery ready
```javascript
$('#editor').prismAnimator({
    language: 'javascript',
    code: 'var example = "Hello world";',
    charactersPerMinute: 600
});
```

## All parameters
| Parameter | Type | Description | Default | Required |
|--|--|--|--|--|
| `element` | `HTMLElement` | The target element to print the code. | `null` | `true` |
| `language` | `String` | The name of the language definition. | `null` | `true` |
| `code` | `String` | A string with the code to be highlighted. | `null` | `true` |
| `charactersPerMinute` | `Number` | The number of characters to print per minute. | `200` | `false` |
| `preClasses` | `String`, `Array` | Classes to add to the generated `<pre>` element. | `null` | `false` |
| `codeClasses` | `String`, `Array` | Classes to add to the generated `<code>` element. | `null` | `false` |
| `drawCallback` | `Function` | Callback function called everytime a new draw is made. | `null` | `false` |
