// Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
  window.addEventListener('load',function() {
    var canvas, context, canvaso, contexto;

    // The active tool instance.
    var tool;
    var tool_default = 'line';

    var cPushArray = new Array();
    var cStep = -1;

    function init() {
      
      // Find the canvas element.
      canvaso = document.getElementById('imageView');
      if (!canvaso) {
        alert('Error: I cannot find the canvas element!');
        return;
      }

      if (!canvaso.getContext) {
        alert('Error: no canvas.getContext!');
        return;
      }

      // Get the 2D canvas context.
      contexto = canvaso.getContext('2d');
      if (!contexto) {
        alert('Error: failed to getContext!');
        return;
      }

      // Add the temporary canvas.
      var container = canvaso.parentNode;
      canvas = document.createElement('canvas');
      if (!canvas) {
        alert('Error: I cannot create a new canvas element!');
        return;
      }

      canvas.id = 'imageTemp';
      canvas.width = canvaso.width;
      canvas.height = canvaso.height;
      container.appendChild(canvas);

      context = canvas.getContext('2d');

      // Get the tool select input (Line).
      var tool_select_line = document
          .getElementById('line');
      if (!tool_select_line) {
        alert('Error: failed to get the dtool element!');
        return;
      }
      tool_select_line.addEventListener('click',
          ev_tool_change, false);

      // Get the tool select input (rect).
      var tool_select_rect = document
          .getElementById('rect');
      if (!tool_select_rect) {
        alert('Error: failed to get the dtool element!');
        return;
      }
      tool_select_rect.addEventListener('click',
          ev_tool_change, false);

      // Get the tool select input (pencil).
      var tool_select_pencil = document
          .getElementById('pencil');
      if (!tool_select_pencil) {
        alert('Error: failed to get the dtool element!');
        return;
      }
      tool_select_pencil.addEventListener('click',
          ev_tool_change, false);


      // Get the tool select input (circle).
      var tool_select_circle = document
          .getElementById('circle');
      if (!tool_select_circle) {
        alert('Error: failed to get the dtool element!');
        return;
      }
      tool_select_circle.addEventListener('click',
          ev_tool_change, false);

      // Get the tool select input (delete).
      var tool_select_delete = document
          .getElementById('delete');
      if (!tool_select_delete) {
        alert('Error: failed to get the dtool element!');
        return;
      }
      tool_select_delete.addEventListener('click',
          ev_tool_change, false);

      // Get the tool select input (move).
      var tool_select_move = document
          .getElementById('move');
      if (!tool_select_move) {
        alert('Error: failed to get the dtool element!');
        return;
      }
      tool_select_move.addEventListener('click',
          ev_tool_change, false);

      // Activate the default tool.
      if (tools[tool_default]) {
        tool = new tools[tool_default]();
        tool_select_line.value = tool_default;
      }

      // Undo
      var tool_undo = document.getElementById('undo');
      if (!tool_undo) {
        alert('Error: failed to get the undo element!');
        return;
      }
      tool_undo.addEventListener('click', cUndo, false);

      // Redo
      var tool_redo = document.getElementById('redo');
      if (!tool_redo) {
        alert('Error: failed to get the redo element!');
        return;
      }
      tool_redo.addEventListener('click', cRedo, false);


      // Refresh Page
      var tool_refresh = document.getElementById('refresh');
      if (!tool_refresh) {
        alert('Error: failed to get the undo element!');
        return;
      }
      tool_refresh.addEventListener('click', refreshFunc, false);

      // Attach the mousedown, mousemove and mouseup event
      // listeners.
      canvas.addEventListener('mousedown', ev_canvas,
          false);
      canvas.addEventListener('mousemove', ev_canvas,
          false);
      canvas.addEventListener('mouseup', ev_canvas,
              false);
    }

    // The general-purpose event handler. This function just
    // determines the mouse
    // position relative to the canvas element.
    function ev_canvas(ev) {
      if (ev.layerX || ev.layerX == 0) { // Firefox
        ev._x = ev.layerX;
        ev._y = ev.layerY;
      } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        ev._x = ev.offsetX;
        ev._y = ev.offsetY;
      }

      // Call the event handler of the tool.
      var func = tool[ev.type];
      if (func) {
        func(ev);
      }
    }

    // The event handler for any changes made to the tool
    // selector.
    function ev_tool_change(ev) {
      if (tools[this.id]) {
        tool = new tools[this.id]();

        var current_id = document.getElementById(this.id);

        var rect_class = document.getElementById("rect");
        rect_class.className = "keypad";

        var line_class = document.getElementById("line");
        line_class.className = "keypad";

        var pencil_class = document
            .getElementById("pencil");
        pencil_class.className = "keypad";

        var circle_class = document
            .getElementById("circle");
        circle_class.className = "keypad";

        var delete_class = document.getElementById("delete");
        delete_class.className = "keypad";


        var move_class = document.getElementById("move");
        move_class.className = "keypad";

        current_id.className = current_id.className
            + " current";
      }
    }

    // This function draws the #imageTemp canvas on top of
    // #imageView, after which
    // #imageTemp is cleared. This function is called each
    // time when the user
    // completes a drawing operation.
    function img_update() {
      contexto.drawImage(canvas, 0, 0);
      cPush();
    }

    //Refresh Function

    function refreshFunc(){
      location.reload();
    }

    function cPush() {
      cStep++;
      if (cStep < cPushArray.length) {
        cPushArray.length = cStep;
      }
      cPushArray.push(document
          .getElementById('imageView').toDataURL());
      
      context.clearRect(0, 0, canvas.width,
            canvas.height);
    }

    function cUndo() {
      if (cStep > 0) {

        cStep--;
        
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];

        canvasPic.onload = function() {
          contexto.clearRect(0, 0, canvas.width,
              canvas.height);
          contexto.drawImage(canvasPic, 0, 0);
        }
      }
      else{        
        cStep = -1;
        contexto.clearRect(0, 0, canvas.width,
            canvas.height);
      }
    }

    function cRedo() {
      if (cStep < cPushArray.length - 1) {
        cStep++;
        
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        
        canvasPic.onload = function() {
          contexto.clearRect(0, 0, canvas.width,
              canvas.height);
          contexto.drawImage(canvasPic, 0, 0);

        }

      }
    }

    // This object holds the implementation of each drawing
    // tool.
    var tools = {};

    // The drawing pencil.
    tools.pencil = function() {
      var tool = this;
      this.started = false;

      // This is called when you start holding down the
      // mouse button.
      // This starts the pencil drawing.
      this.mousedown = function(ev) {
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
      };

      // This function is called every time you move the
      // mouse. Obviously, it only
      // draws if the tool.started state is set to true
      // (when you are holding down
      // the mouse button).
      this.mousemove = function(ev) {
        if (tool.started) {
          context.lineTo(ev._x, ev._y);
          context.stroke();
        }
      };

      // This is called when you release the mouse button.
      this.mouseup = function(ev) {
        if (tool.started) {
          context.clearRect(0, 0, canvas.width,
              canvas.height);
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };
    };

    // The rectangle tool.
    tools.rect = function() {
      var tool = this;
      this.started = false;

      this.mousedown = function(ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };

      this.mousemove = function(ev) {
        if (!tool.started) {
          return;
        }

        var x = Math.min(ev._x, tool.x0), y = Math.min(
            ev._y, tool.y0), w = Math.abs(ev._x
            - tool.x0), h = Math.abs(ev._y
            - tool.y0);

        context.clearRect(0, 0, canvas.width,
            canvas.height);

        if (!w || !h) {
          return;
        }

        context.strokeRect(x, y, w, h);
      };

      this.mouseup = function(ev) {
        if (tool.started) {
          context.clearRect(0, 0, canvas.width,
              canvas.height);
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };
    };

    // The Delete tool.
    tools.delete = function() {
      var tool = this;

      var x,y,w,h;
      this.started = false;

      this.mousedown = function(ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };

      this.mousemove = function(ev) {
        if (!tool.started) {
          return;
        }

        x = Math.min(ev._x, tool.x0), y = Math.min(
            ev._y, tool.y0), w = Math.abs(ev._x
            - tool.x0), h = Math.abs(ev._y
            - tool.y0);

        context.clearRect(0, 0, canvas.width,
            canvas.height);

        if (!w || !h) {
          return;
        }

        // contexto.fillStyle="red";
        // contexto.fillRect(0,0,300,150);
        context.strokeRect(x, y, w, h);        
        
      };

      this.mouseup = function(ev) {
        if (tool.started) {
          context.clearRect(0, 0, canvas.width,
              canvas.height); 

          tool.mousemove(ev);
          context.clearRect(x-5, y-5, w+20, h+20);
          contexto.clearRect(x, y, w, h);
          tool.started = false;
          img_update();
        }
      };
    };

    // The move tool.
    tools.move = function() {
      var tool = this;

      var x,y,w,h;
      this.started = false;

      this.mousedown = function(ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };

      this.mousemove = function(ev) {
        if (!tool.started) {
          return;
        }

        x = Math.min(ev._x, tool.x0), y = Math.min(
            ev._y, tool.y0), w = Math.abs(ev._x
            - tool.x0), h = Math.abs(ev._y
            - tool.y0);

        context.clearRect(0, 0, canvas.width,
            canvas.height);

        if (!w || !h) {
          return;
        }

        // contexto.fillStyle="red";
        // contexto.fillRect(0,0,300,150);
        context.strokeRect(x, y, w, h);        
        
      };

      this.mouseup = function(ev) {
        if (tool.started) {
          context.clearRect(0, 0, canvas.width,
              canvas.height); 

          tool.mousemove(ev);
          context.clearRect(x-5, y-5, w+20, h+20);
          contexto.clearRect(x, y, w, h);

          // var imgData = context.getImageData(x, y, w, h);
          // console.log(imgData);
          // contexto.putImageData(imgData, 0, 0);
          

          //Problem

          tool.started = false;
          img_update();
        }
      };
    };

    // The line tool.
    tools.line = function() {
      var tool = this;
      this.started = false;

      this.mousedown = function(ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };

      this.mousemove = function(ev) {
        if (!tool.started) {
          return;
        }

        context.clearRect(0, 0, canvas.width,
            canvas.height);

        context.beginPath();
        context.moveTo(tool.x0, tool.y0);
        context.lineTo(ev._x, ev._y);
        context.stroke();
        context.closePath();
      };

      this.mouseup = function(ev) {
        if (tool.started) {
          context.clearRect(0, 0, canvas.width,
              canvas.height);
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };
    };


    // The circle tool.
    tools.circle = function() {
      var tool = this;
      this.started = false;

      this.mousedown = function(ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };

      this.mousemove = function(ev) {
        if (!tool.started) {
          return;
        }

        var x = Math.min(ev._x, tool.x0), y = Math.min(
            ev._y, tool.y0), w = Math.abs(ev._x
            - tool.x0), h = Math.abs(ev._y
            - tool.y0);

        context.clearRect(0, 0, canvas.width,
            canvas.height);

        if (!w || !h) {
          return;
        }

        context.beginPath();
        context.arc(x, y, w, 0, 2 * Math.PI);
        context.stroke();
      };

      this.mouseup = function(ev) {
        if (tool.started) {
          context.clearRect(0, 0, canvas.width,
              canvas.height);
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };
    };


    // Download the file
    function download(){
      this.href = document.getElementById('imageView').toDataURL();      
      this.download = 'vishal.png';
    }


    document.getElementById('download').addEventListener('click', download, false);

    init();

  }, false);
}