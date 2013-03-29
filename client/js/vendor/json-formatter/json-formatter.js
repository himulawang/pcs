// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name background.js
// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/chrome_extensions.js
// @js_externs var console = {assert: function(){}};
// @formatting pretty_print
// ==/ClosureCompiler==

/** @license
  JSON Formatter | MIT License
  Copyright 2012 Callum Locke

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 */

/*jshint eqeqeq:true, forin:true, strict:true */
/*global chrome, console */

function JSONFormatter(jsonObj) {
  
  "use strict" ;

  // Constants
    var
      TYPE_STRING = 1,
      TYPE_NUMBER = 2,
      TYPE_OBJECT = 3,
      TYPE_ARRAY  = 4,
      TYPE_BOOL   = 5,
      TYPE_NULL   = 6
    ;

  // Utility functions
    function removeComments (str) {
      str = ('__' + str + '__').split('');
      var mode = {
        singleQuote: false,
        doubleQuote: false,
        regex: false,
        blockComment: false,
        lineComment: false,
        condComp: false
      };
      for (var i = 0, l = str.length; i < l; i++) {
        if (mode.regex) {
          if (str[i] === '/' && str[i-1] !== '\\') {
            mode.regex = false;
          }
          continue;
        }
        if (mode.singleQuote) {
          if (str[i] === "'" && str[i-1] !== '\\') {
            mode.singleQuote = false;
          }
          continue;
        }
        if (mode.doubleQuote) {
          if (str[i] === '"' && str[i-1] !== '\\') {
            mode.doubleQuote = false;
          }
          continue;
        }
        if (mode.blockComment) {
          if (str[i] === '*' && str[i+1] === '/') {
            str[i+1] = '';
            mode.blockComment = false;
          }
          str[i] = '';
          continue;
        }
        if (mode.lineComment) {
          if (str[i+1] === '\n' || str[i+1] === '\r') {
            mode.lineComment = false;
          }
          str[i] = '';
          continue;
        }
        if (mode.condComp) {
          if (str[i-2] === '@' && str[i-1] === '*' && str[i] === '/') {
            mode.condComp = false;
          }
          continue;
        }
        mode.doubleQuote = str[i] === '"';
        mode.singleQuote = str[i] === "'";
        if (str[i] === '/') {
          if (str[i+1] === '*' && str[i+2] === '@') {
            mode.condComp = true;
            continue;
          }
          if (str[i+1] === '*') {
            str[i] = '';
            mode.blockComment = true;
            continue;
          }
          if (str[i+1] === '/') {
            str[i] = '';
            mode.lineComment = true;
            continue;
          }
          mode.regex = true;
        }
      }
      return str.join('').slice(2, -2);
    }

    function firstJSONCharIndex(s) {
      var arrayIdx = s.indexOf('['),
          objIdx = s.indexOf('{'),
          idx = 0
      ;
      if (arrayIdx !== -1)
        idx = arrayIdx ;
      if (objIdx !== -1) {
        if (arrayIdx === -1)
          idx = objIdx ;
        else
          idx = Math.min(objIdx, arrayIdx) ;
      }
      return idx ;
    }

    // function spin(seconds) {
    //   // spin - Hog the CPU for the specified number of seconds
    //   // (for simulating long processing times in development)
    //   var stop = +new Date() + (seconds*1000)  ;
    //   while (new Date() < stop) {}
    //   return true ;
    // }

  // Record current version (in case future update wants to know)
    localStorage.jfVersion = '0.5.6' ;

  // Template elements
    var templates,
        baseSpan = document.createElement('span') ;
    
    function getSpanBoth(innerText,className) {
      var span = baseSpan.cloneNode(false) ;
      span.className = className ;
      span.innerText = innerText ;
      return span ;
    }
    function getSpanText(innerText) {
      var span = baseSpan.cloneNode(false) ;
      span.innerText = innerText ;
      return span ;
    }
    function getSpanClass(className) {
      var span = baseSpan.cloneNode(false) ;
      span.className = className ;
      return span ;
    }

    // Create template nodes
      var templatesObj = {
        t_kvov: getSpanClass('kvov'),
        t_exp: getSpanClass('e'),
        t_key: getSpanClass('k'),
        t_string: getSpanClass('s'),
        t_number: getSpanClass('n'),
        
        t_null: getSpanBoth('null', 'nl'),
        t_true: getSpanBoth('true','bl'),
        t_false: getSpanBoth('false','bl'),
        
        t_oBrace: getSpanBoth('{','b'),
        t_cBrace: getSpanBoth('}','b'),
        t_oBracket: getSpanBoth('[','b'),
        t_cBracket: getSpanBoth(']','b'),
        
        t_ellipsis: getSpanClass('ell'),
        t_blockInner: getSpanClass('blockInner'),
        
        t_colonAndSpace: document.createTextNode(':\u00A0'),
        t_commaText: document.createTextNode(','),
        t_dblqText: document.createTextNode('"')
      } ;

  // Core recursive DOM-building function
    function getKvovDOM(value, keyName) {
      var type,
          kvov,
          nonZeroSize,
          templates = templatesObj, // bring into scope for tiny speed boost
          objKey,
          keySpan,
          valueElement
      ;

      // Establish value type
        if (typeof value === 'string')
          type = TYPE_STRING ;
        else if (typeof value === 'number')
          type = TYPE_NUMBER ;
        else if (value === false || value === true )
          type = TYPE_BOOL ;
        else if (value === null)
          type = TYPE_NULL ;
        else if (value instanceof Array)
          type = TYPE_ARRAY ;
        else
          type = TYPE_OBJECT ;

      // Root node for this kvov
        kvov = templates.t_kvov.cloneNode(false) ;
      
      // Add an 'expander' first (if this is object/array with non-zero size)
        if (type === TYPE_OBJECT || type === TYPE_ARRAY) {
          nonZeroSize = false ;
          for (objKey in value) {
            if (value.hasOwnProperty(objKey)) {
              nonZeroSize = true ;
              break ; // no need to keep counting; only need one
            }
          }
          if (nonZeroSize)
            kvov.appendChild(  templates.t_exp.cloneNode(false) ) ;
        }
        
      // If there's a key, add that before the value
        if (keyName !== false) { // NB: "" is a legal keyname in JSON
          // This kvov must be an object property
            kvov.classList.add('objProp') ;
          // Create a span for the key name
            keySpan = templates.t_key.cloneNode(false) ;
            keySpan.textContent = JSON.stringify(keyName).slice(1,-1) ; // remove quotes
          // Add it to kvov, with quote marks
            kvov.appendChild(templates.t_dblqText.cloneNode(false)) ;
            kvov.appendChild( keySpan ) ;
            kvov.appendChild(templates.t_dblqText.cloneNode(false)) ;
          // Also add ":&nbsp;" (colon and non-breaking space)
            kvov.appendChild( templates.t_colonAndSpace.cloneNode(false) ) ;
        }
        else {
          // This is an array element instead
            kvov.classList.add('arrElem') ;
        }
      
      // Generate DOM for this value
        var blockInner, childKvov ;
        switch (type) {
          case TYPE_STRING:
            // If string is a URL, get a link, otherwise get a span
              var innerStringEl = baseSpan.cloneNode(false),
                  escapedString = JSON.stringify(value)
              ;
              escapedString = escapedString.substring(1, escapedString.length-1) ; // remove quotes
              if (value[0] === 'h' && value.substring(0, 4) === 'http') { // crude but fast - some false positives, but rare, and UX doesn't suffer terribly from them.
                var innerStringA = document.createElement('A') ;
                innerStringA.href = value ;
                innerStringA.innerText = escapedString ;
                innerStringEl.appendChild(innerStringA) ;
              }
              else {
                innerStringEl.innerText = escapedString ;
              }
              valueElement = templates.t_string.cloneNode(false) ;
              valueElement.appendChild(templates.t_dblqText.cloneNode(false)) ;
              valueElement.appendChild(innerStringEl) ;
              valueElement.appendChild(templates.t_dblqText.cloneNode(false)) ;
              kvov.appendChild(valueElement) ;
            break ;
          
          case TYPE_NUMBER:
            // Simply add a number element (span.n)
              valueElement = templates.t_number.cloneNode(false) ;
              valueElement.innerText = value ;
              kvov.appendChild(valueElement) ;
            break ;
          
          case TYPE_OBJECT:
            // Add opening brace
              kvov.appendChild( templates.t_oBrace.cloneNode(true) ) ;
            // If any properties, add a blockInner containing k/v pair(s)
              if (nonZeroSize) {
                // Add ellipsis (empty, but will be made to do something when kvov is collapsed)
                  kvov.appendChild( templates.t_ellipsis.cloneNode(false) ) ;
                // Create blockInner, which indents (don't attach yet)
                  blockInner = templates.t_blockInner.cloneNode(false) ;
                // For each key/value pair, add as a kvov to blockInner
                  var count = 0, k, comma ;
                  for (k in value) {
                    if (value.hasOwnProperty(k)) {
                      count++ ;
                      childKvov =  getKvovDOM(value[k], k) ;
                      // Add comma
                        comma = templates.t_commaText.cloneNode() ;
                        childKvov.appendChild(comma) ;
                      blockInner.appendChild( childKvov ) ;
                    }
                  }
                // Now remove the last comma
                  childKvov.removeChild(comma) ;
                // Add blockInner
                  kvov.appendChild( blockInner ) ;
              }
            
            // Add closing brace
              kvov.appendChild( templates.t_cBrace.cloneNode(true) ) ;
            break ;

          case TYPE_ARRAY:
            // Add opening bracket
              kvov.appendChild( templates.t_oBracket.cloneNode(true) ) ;
            // If non-zero length array, add blockInner containing inner vals
              if (nonZeroSize) {
                // Add ellipsis
                  kvov.appendChild( templates.t_ellipsis.cloneNode(false) ) ;
                // Create blockInner (which indents) (don't attach yet)
                  blockInner = templates.t_blockInner.cloneNode(false) ;
                // For each key/value pair, add the markup
                  for (var i=0, length=value.length, lastIndex=length-1; i<length; i++) {
                    // Make a new kvov, with no key
                      childKvov = getKvovDOM(value[i], false) ;
                    // Add comma if not last one
                      if (i < lastIndex)
                        childKvov.appendChild( templates.t_commaText.cloneNode() ) ;
                    // Append the child kvov
                      blockInner.appendChild( childKvov ) ;
                  }
                // Add blockInner
                  kvov.appendChild( blockInner ) ;
              }
            // Add closing bracket
              kvov.appendChild( templates.t_cBracket.cloneNode(true) ) ;
            break ;

          case TYPE_BOOL:
            if (value)
              kvov.appendChild( templates.t_true.cloneNode(true) ) ;
            else
              kvov.appendChild( templates.t_false.cloneNode(true) ) ;
            break ;

          case TYPE_NULL:
            kvov.appendChild( templates.t_null.cloneNode(true) ) ;
            break ;
        }

      return kvov ;
    }
  



  // Function to convert object to an HTML string
    this.jsonObjToHTML = function jsonObjToHTML(obj) {

      // spin(5) ;

      // Format object (using recursive kvov builder)
        var rootKvov = getKvovDOM(obj, false) ;

      // The whole DOM is now built.

      // Set class on root node to identify it
        rootKvov.classList.add('rootKvov') ;
        
      // Make div#formattedJson and append the root kvov
        var divFormattedJson = document.createElement('DIV') ;
        divFormattedJson.id = 'formattedJson' ;
        divFormattedJson.appendChild( rootKvov ) ;
      
      // Convert it to an HTML string (shame about this step, but necessary for passing it through to the content page)
        var returnHTML = divFormattedJson.outerHTML ;
        
      // Return the HTML
        return returnHTML ;
    }

  var mac = navigator.platform.indexOf('Mac') !== -1,
      modKey ;
  if (mac)
    modKey = function (ev) {
      return ev.metaKey ;
    } ;
  else
    modKey = function (ev) {
      return ev.ctrlKey ;
    } ;

  this.generalClick = function generalClick(ev) {
    // console.log('click', ev) ;

    if (ev.which === 1) {
      var elem = ev.target ;
      
      if (elem.className === 'e') {
        // It's a click on an expander.

        ev.preventDefault() ;

        var parent = elem.parentNode,
            //div = jfContent,
            prevBodyHeight = document.body.offsetHeight,
            scrollTop = document.body.scrollTop,
            parentSiblings
        ;
        
        // Expand or collapse
          if (parent.classList.contains('collapsed')) {
            // EXPAND
              if (modKey(ev))
                expand(parent.parentNode.children) ;
              else
                expand([parent]) ;
          }
          else {
            // COLLAPSE
              if (modKey(ev))
                collapse(parent.parentNode.children) ;
              else
                collapse([parent]) ;
          }

        // Restore scrollTop somehow
          // Clear current extra margin, if any
            //div.style.marginBottom = 0 ;

          // No need to worry if all content fits in viewport
            if (document.body.offsetHeight < window.innerHeight) {
              // console.log('document.body.offsetHeight < window.innerHeight; no need to adjust height') ;
              return ;
            }

          // And no need to worry if scrollTop still the same
            if (document.body.scrollTop === scrollTop) {
              // console.log('document.body.scrollTop === scrollTop; no need to adjust height') ;
              return ;
            }

          // console.log('Scrolltop HAS changed. document.body.scrollTop is now '+document.body.scrollTop+'; was '+scrollTop) ;
          
          // The body has got a bit shorter.
          // We need to increase the body height by a bit (by increasing the bottom margin on the jfContent div). The amount to increase it is whatever is the difference between our previous scrollTop and our new one.
          
          // Work out how much more our target scrollTop is than this.
            var difference = scrollTop - document.body.scrollTop  + 8 ; // it always loses 8px; don't know why

          // Add this difference to the bottom margin
            //var currentMarginBottom = parseInt(div.style.marginBottom) || 0 ;
            //div.style.marginBottom = difference + 'px' ;

          // Now change the scrollTop back to what it was
            document.body.scrollTop = scrollTop ;
            
        return ;
      }
    }
  }

  var lastKvovIdGiven = 0 ;
  function collapse(elements) {
    // console.log('elements', elements) ;

    var el, i, blockInner, count ;

    for (i = elements.length - 1; i >= 0; i--) {
      el = elements[i] ;
      el.classList.add('collapsed') ;

      // (CSS hides the contents and shows an ellipsis.)

      // Add a count of the number of child properties/items (if not already done for this item)
        if (!el.id) {
          el.id = 'kvov' + (++lastKvovIdGiven) ;

          // Find the blockInner
            blockInner = el.firstElementChild ;
            while ( blockInner && !blockInner.classList.contains('blockInner') ) {
              blockInner = blockInner.nextElementSibling ;
            }
            if (!blockInner)
              continue ;

          // See how many children in the blockInner
            count = blockInner.children.length ;

          // Generate comment text eg "4 items"
            var comment = count + (count===1 ? ' item' : ' items') ;
          // Add CSS that targets it
            //jfStyleEl.insertAdjacentHTML(
            //  'beforeend',
            //  '\n#kvov'+lastKvovIdGiven+'.collapsed:after{color: #aaa; content:" // '+comment+'"}'
            //) ;
        }
    }
  }
  function expand(elements) {
    for (var i = elements.length - 1; i >= 0; i--)
      elements[i].classList.remove('collapsed') ;
  }
};
