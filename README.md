# Sticky Bottom
Sticky Bottom library - vanilla JS

# demo
* https://codepen.io/kunukn/full/yzvWQq/

<img src="https://github.com/kunukn/sticky-bottom/blob/master/media/sticky-bottom.gif?raw=true" width="300">

# about
A sticky box that sticks at the bottom within a boundary element.

# browser support

![IE](https://cloud.githubusercontent.com/assets/398893/3528325/20373e76-078e-11e4-8e3a-1cb86cf506f0.png) | ![Chrome](https://cloud.githubusercontent.com/assets/398893/3528328/23bc7bc4-078e-11e4-8752-ba2809bf5cce.png) | ![Firefox](https://cloud.githubusercontent.com/assets/398893/3528329/26283ab0-078e-11e4-84d4-db2cf1009953.png) | ![Opera](https://cloud.githubusercontent.com/assets/398893/3528330/27ec9fa8-078e-11e4-95cb-709fd11dac16.png) | ![Safari](https://cloud.githubusercontent.com/assets/398893/3528331/29df8618-078e-11e4-8e3e-ed8ac738693f.png)
--- | --- | --- | --- | --- |
IE 11+ ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |


### html structure

```html
<body>
  <!-- library markup -->
  <div class="js sticky-bottom">
      <div class="sticky-bottom__boundary">
        This is the boundary area, 
        the sticky box will be around if boundary is in focus
        long content here......
      </div>
      <div class="sticky-bottom__box">
        Sticky within boundary, with static height.
      </div>
    </div>
  <!-- end library markup -->
                
   <script src="dist/app.bundle.js"></script> <!-- library -->
   <script> <!-- usage -->
      var stickyBottom = new StickyBottom({
        /* optional config */        
        renderingMode: 'two-states', // two modes only, default is three-states
      });
      stickyBottom.init();
   </script> 
 </body>
```


# development
* git clone the project or download it
* npm install
* npm start
* open a browser and go to localhost:3333


# license

MIT License: http://opensource.org/licenses/MIT
