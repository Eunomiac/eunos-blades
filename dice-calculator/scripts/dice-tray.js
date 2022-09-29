// CONFIG.debug.hooks = true;

Hooks.once('init', async function() {
  const dice = {
    'd3': `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
        <g
          aria-label="I"
          id="text8041-9-0"
          style="font-size:10.58329964px;line-height:1.25;font-family:'Samyak Tamil';-inkscape-font-specification:'Samyak Tamil';stroke-width:0.37078401"
          transform="matrix(3.7795603,0,0,3.7714103,-15.409119,-285.41643)"><path
            id="path39580"
            style="font-weight:bold;font-family:'Noto Serif';-inkscape-font-specification:'Noto Serif Bold';fill:#ffffff;fill-opacity:1;stroke-width:0.37078401"
            d="m 7.1064188,78.052082 c -0.3704167,0 -0.6614577,0.291042 -0.6614577,0.661459 v 10.847916 c 0,0.370417 0.291041,0.66125 0.6614577,0.714169 H 17.954334 c 0.396875,0 0.687813,-0.317397 0.687813,-0.687814 V 78.739896 c 0,-0.396875 -0.317397,-0.687814 -0.687813,-0.687814 z m 0.4563027,2.938839 h 3.0659615 v 0.471289 h -0.373104 c -0.130344,0 -0.240307,0.0325 -0.3291787,0.09767 -0.08295,0.06517 -0.12454,0.225311 -0.12454,0.480076 v 4.2478 c 0,0.254765 0.04159,0.414904 0.12454,0.480076 0.08887,0.06517 0.1988347,0.09767 0.3291787,0.09767 h 0.373104 v 0.471289 H 7.5627215 v -0.471289 h 0.3731037 c 0.130345,0 0.236931,-0.0325 0.319877,-0.09767 0.08887,-0.06518 0.133325,-0.225314 0.133325,-0.480076 v -4.2478 c 0,-0.254765 -0.04445,-0.414904 -0.133325,-0.480076 -0.08295,-0.06517 -0.189532,-0.09767 -0.319877,-0.09767 H 7.5627215 Z m 3.4478505,0 h 3.065962 v 0.471289 h -0.373103 c -0.130344,0 -0.239791,0.0325 -0.328663,0.09767 -0.08295,0.06517 -0.12454,0.225311 -0.12454,0.480076 v 4.2478 c 0,0.254765 0.04159,0.414904 0.12454,0.480076 0.08887,0.06517 0.198319,0.09767 0.328663,0.09767 h 0.373103 v 0.471289 h -3.065962 v -0.471289 h 0.37362 c 0.130344,0 0.236931,-0.0325 0.319877,-0.09767 0.08887,-0.06518 0.133326,-0.225314 0.133326,-0.480076 v -4.2478 c 0,-0.254765 -0.04445,-0.414904 -0.133326,-0.480076 -0.08295,-0.06517 -0.189533,-0.09767 -0.319877,-0.09767 h -0.37362 z m 3.448368,0 h 3.065963 v 0.471289 h -0.373104 c -0.130344,0 -0.240308,0.0325 -0.329179,0.09767 -0.08295,0.06517 -0.124023,0.225311 -0.124023,0.480076 v 4.2478 c 0,0.254765 0.04108,0.414904 0.124023,0.480076 0.08887,0.06517 0.198835,0.09767 0.329179,0.09767 h 0.373104 v 0.471289 H 14.45894 v -0.471289 h 0.373104 c 0.130345,0 0.236931,-0.0325 0.319877,-0.09767 0.08887,-0.06518 0.133325,-0.225314 0.133325,-0.480076 v -4.2478 c 0,-0.254765 -0.04445,-0.414904 -0.133325,-0.480076 -0.08295,-0.06517 -0.189532,-0.09767 -0.319877,-0.09767 H 14.45894 Z"
            inkscape:connector-curvature="0" /></g>
      </svg>`,
    'd4': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
      <g>
        <polygon points="31.7,15.7 13.2,47.8 31.7,37.1 	"/>
        <polygon points="32.3,15.7 32.3,37.1 50.8,47.8 	"/>
        <polygon points="32,37.6 13.5,48.3 50.5,48.3 	"/>
      </g>
      </svg>`,
    'd5': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
        <path
          id="path1968"
          style="stroke-width:1.74038863;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;fill:#ffffff;fill-opacity:1"
          inkscape:transform-center-x="58.868666"
          inkscape:transform-center-y="1.6092478"
          d="M 46.431192,9.788085 32.534859,9.789825 55.027535,36.221024 Z M 31.463457,9.791565 17.558745,9.793305 8.9724646,36.239596 Z m 0.529834,0.625407 -22.4708793,26.424494 44.9669113,-0.0051 z M 54.79951,37.644591 9.2021636,37.656372 32.005026,54.211915 Z"
          inkscape:connector-curvature="0" />
      </svg>`,
    'd6': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
      <g>
        <path d="M11.5,9h41c1.4,0,2.6,1.1,2.6,2.6v41c0,1.4-1.1,2.6-2.6,2.6h-41C10.1,55,9,53.9,9,52.5v-41C9,10.1,10.1,9,11.5,9z"/>
      </g>
      </svg>`,
    'd7': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
        <path
          id="path40815"
          style="stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stop-color:#000000"
          d="M 31.913078,9.2043342 13.942681,17.880507 49.901412,17.830347 Z M 50.2597,18.695631 13.587964,18.749401 21.843142,54.6562 42.101278,54.62916 Z M 51.03008,19.24383 43.072278,54.279968 55.494446,38.670734 Z M 12.823003,19.292187 8.4087715,38.735215 20.87216,54.306831 Z" />
      </svg>`,
    'd8': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
      <g>
        <g transform="translate(-242.40981,-473.89862)">
          <path d="M254.5,515.3l19.9-34.6l20.1,34.4L254.5,515.3z"/>
          <path d="M253.4,515.1l-0.3-19.6l20.2-14.9L253.4,515.1z"/>
          <path d="M295.4,514.9l0.3-19.3l-20.3-15L295.4,514.9z"/>
          <path d="M274.4,531.2l-19.9-14.9l40-0.3L274.4,531.2z"/>
        </g>
      </g>
      </svg>`,
    'd10': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
      <g>
        <g transform="matrix(1.1679092,0,0,1.1679092,-274.931,-137.53749)">
          <path d="M263.4,124.6L249.9,153l12.5,8.1l13.5-8.2L263.4,124.6z"/>
          <path d="M264.1,124.1l12.5,28.6l7.3-2.3l0.5-11.6L264.1,124.1z"/>
          <path d="M262.7,161.8v4.4l20.9-14.7l-7,2L262.7,161.8z"/>
          <path d="M262.7,124.2l-13.7,28.5l-7.1-3.1l-0.6-11.6L262.7,124.2z"/>
          <path d="M261.8,161.7v4.5l-20-15.4l6.9,2.7L261.8,161.7z"/>
        </g>
      </g>
      </svg>`,
    'd12': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
      <g>
        <path d="M24,43.7l-5.4-16.3l13.7-10.8l14.1,10.8L41.2,44L24,43.7z"/>
        <path d="M7.9,24l0.5,16.3l8.8,12.1l6.3-7.7l-5.8-17.5L7.9,24z"/>
        <path d="M41,45.1L23.9,45l-5.5,7.8l13.9,4.3l14.2-4.5L41,45.1z"/>
        <path d="M8.7,23.5l8.7-11.6l14.3-4.9v8.7L17.8,26.5L8.7,23.5z"/>
        <path d="M33.4,6.9l14.2,4.8l8.3,11.9l-8.7,3.1l-13.9-11L33.4,6.9z"/>
        <path d="M42.2,44.4l5.3-16.3l8.6-3l0,14.6l-8.5,11.9L42.2,44.4z"/>
      </g>
      </svg>`,
    'd14': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
        <g
          aria-label="I"
          id="text8041-9-0"
          style="font-size:10.58329964px;line-height:1.25;font-family:'Samyak Tamil';-inkscape-font-specification:'Samyak Tamil';stroke-width:0.37078401"
          transform="matrix(3.7795603,0,0,3.7714103,-15.409119,-285.41643)"><path
            id="path1065"
            style="fill:#ffffff;stroke:#000000;stroke-width:0.00550133;stroke-linecap:round;fill-opacity:1"
            d="M 18.855002,82.863029 16.531889,79.335907 C 16.287822,79.17857 16.041329,79.025045 15.7925,78.875386 l -0.44884,1.403171 1.608695,2.200932 1.992258,1.045288 c -0.02725,-0.220931 -0.05712,-0.441529 -0.08961,-0.661748 z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccccc" /><path
            id="path1073"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.00550133;stroke-linecap:round"
            d="m 14.829049,80.048367 0.468276,-1.463931 c -0.258111,-0.148117 -0.51856,-0.292105 -0.781248,-0.431908 h -3.945046 c -0.262688,0.139803 -0.523137,0.283791 -0.781248,0.431908 l 0.468276,1.463931 z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccccc" /><path
            id="path1087"
            style="fill:#ffffff;stroke:#000000;stroke-width:0.00550133;stroke-linecap:round;fill-opacity:1"
            d="M 9.2946086,78.875386 C 9.0457798,79.025045 8.799287,79.17857 8.5552195,79.335907 l -2.3231132,3.527122 c -0.032488,0.220219 -0.06236,0.440817 -0.089611,0.661748 l 1.992258,-1.045288 1.6086947,-2.200932 z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccccc" /><path
            id="path1089"
            style="fill:#feffff;stroke:#000000;stroke-width:0.00550133;stroke-linecap:round;fill-opacity:1"
            d="m 11.572748,86.540832 1.941613,0 2.901347,-3.84556 -1.524347,-2.085531 h -4.695616 l -1.5243451,2.085531 z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccccc" /><path
            id="path1093"
            style="fill:#ffffff;stroke:#000000;stroke-width:0.00550133;stroke-linecap:round;fill-opacity:1"
            d="m 19.075697,84.841943 c -0.0163,-0.214966 -0.03507,-0.429736 -0.0563,-0.644269 l -2.174261,-1.140782 -2.831177,3.752552 2.182221,2.522518 c 0.266154,-0.184458 0.529098,-0.373525 0.788714,-0.567115 z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccccc" /><path
            id="path1097"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.00550133;stroke-linecap:round"
            d="m 15.72895,89.648852 -2.203094,-2.546645 h -1.964604 l -2.2030939,2.546645 c 0.2715904,0.180232 0.5462975,0.355701 0.8239959,0.526329 h 4.722798 c 0.277699,-0.170628 0.552407,-0.346097 0.823998,-0.526329 z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccccc" /><path
            id="path1099"
            style="fill:#ffffff;stroke:#000000;stroke-width:0.00550133;stroke-linecap:round;fill-opacity:1"
            d="m 8.2419701,83.056892 -2.1742629,1.140782 c -0.021234,0.214533 -0.04,0.429303 -0.056296,0.644269 l 2.0908014,3.922904 c 0.2596158,0.19359 0.5225597,0.382657 0.7887134,0.567115 l 2.1822221,-2.522518 z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccccc" /></g>
      </svg>`,
    'd16': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
        <g
          id="g1090"><path
            sodipodi:nodetypes="ccccc"
            inkscape:connector-curvature="0"
            d="M 52.37899,18.070479 C 47.791379,11.711923 40.498753,7.8590897 32.66071,7.6529381 v 8.9712079 l 14.380751,6.379858 z"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.01748129;stroke-linecap:round"
            id="path1850" /><path
            sodipodi:nodetypes="ccccccc"
            inkscape:connector-curvature="0"
            d="M 55.621657,24.200224 C 54.981786,22.437239 54.14656,20.751428 53.131582,19.174288 l -5.300087,4.898917 v 9.870611 l 7.900455,7.093031 c 0.728713,-2.092863 1.177383,-4.272925 1.334335,-6.48346 z"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.01748129;stroke-linecap:round"
            id="path1856" /><path
            sodipodi:nodetypes="ccccccc"
            inkscape:connector-curvature="0"
            d="M 46.510075,33.865213 V 24.213882 L 32,17.77665 17.489926,24.213882 v 9.651331 L 32,42.605075 Z"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.01748129;stroke-linecap:round"
            id="path1862" /><path
            sodipodi:nodetypes="ccccc"
            inkscape:connector-curvature="0"
            d="M 16.958538,23.004004 11.621011,18.070479 C 16.208622,11.711923 23.501248,7.8590897 31.339291,7.6529381 v 8.9712079 z"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.01748129;stroke-linecap:round"
            id="path1866" /><path
            sodipodi:nodetypes="ccccccc"
            inkscape:connector-curvature="0"
            d="M 8.2680506,41.036847 C 7.5393378,38.943984 7.0906681,36.763922 6.933716,34.553387 L 8.3783435,24.200224 C 9.0182144,22.437239 9.853441,20.751428 10.868419,19.174288 l 5.300087,4.898917 v 9.870611 z"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.01748129;stroke-linecap:round"
            id="path1868" /><path
            id="path882"
            style="fill:none;stroke:#000000;stroke-width:0.01748135;stroke-linecap:round"
            d="M 31.339294,7.6527358 A 25.129354,25.129602 0 0 0 11.621039,18.070366"
            inkscape:connector-curvature="0" /><path
            sodipodi:nodetypes="cccccc"
            inkscape:connector-curvature="0"
            d="m 55.228646,42.360948 -8.135615,-7.304233 -14.43232,8.693115 v 6.783871 c 3.660099,0.229205 6.939923,2.338966 8.666195,5.57456 6.299605,-2.518018 11.313474,-7.476192 13.90174,-13.747313 z"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.01748135;stroke-linecap:round"
            id="path942" /><path
            sodipodi:nodetypes="cccccc"
            inkscape:connector-curvature="0"
            d="m 8.7713571,42.360948 8.1356179,-7.304233 14.432319,8.693115 v 6.783871 C 27.679195,50.762907 24.399367,52.872668 22.6731,56.108261 16.373495,53.590243 11.359623,48.63207 8.7713571,42.360948 Z"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.01748135;stroke-linecap:round"
            id="path944" /><path
            sodipodi:nodetypes="ccc"
            inkscape:connector-curvature="0"
            d="m 24.055166,56.347268 h 15.889672 c -3.587691,-6.017072 -12.301981,-6.017072 -15.889672,0 z"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.01748135;stroke-linecap:round"
            id="path946" /></g>
      </svg>`,
    'd20': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
      <g transform="translate(-246.69456,-375.66745)">
        <path d="M278.2,382.1c-0.1,0-0.2,0-0.3,0.1L264.8,398c-0.2,0.3-0.2,0.3,0.1,0.3l26.4-0.1c0.4,0,0.4,0,0.1-0.3l-13-15.8
          C278.4,382.1,278.3,382.1,278.2,382.1L278.2,382.1z M280.7,383.5l11.9,14.5c0.2,0.2,0.2,0.2,0.5,0.1l6.3-2.9
          c0.4-0.2,0.4-0.2,0.1-0.4L280.7,383.5z M275.2,384c0,0-0.1,0.1-0.3,0.2l-17.3,11.4l5.4,2.5c0.3,0.1,0.4,0.1,0.5-0.1l11.4-13.6
          C275.1,384.1,275.2,384,275.2,384L275.2,384z M300.3,395.8c-0.1,0-0.1,0-0.3,0.1l-6.4,2.9c-0.2,0.1-0.2,0.2-0.1,0.4l7.5,19
          l-0.5-22.1C300.4,395.9,300.4,395.8,300.3,395.8L300.3,395.8z M257.1,396.4l-0.7,21.5l6.3-18.6c0.1-0.3,0.1-0.3-0.1-0.4
          L257.1,396.4L257.1,396.4z M291.6,399.2l-27,0.1c-0.4,0-0.4,0-0.2,0.3l13.7,23.1c0.2,0.4,0.2,0.3,0.4,0l13.2-23.2
          C291.9,399.3,291.9,399.2,291.6,399.2L291.6,399.2z M292.7,399.8c0,0-0.1,0.1-0.1,0.2l-13.3,23.3c-0.1,0.2-0.2,0.3,0.2,0.3
          l21.1-2.9c0.3-0.1,0.3-0.2,0.2-0.5l-7.9-20.2C292.7,399.9,292.7,399.8,292.7,399.8L292.7,399.8z M263.6,400c0,0,0,0.1-0.1,0.3
          l-6.7,19.8c-0.1,0.4-0.1,0.6,0.3,0.7l20.1,2.9c0.4,0.1,0.3-0.1,0.2-0.3l-13.7-23.1C263.6,400,263.6,400,263.6,400L263.6,400z
          M258.3,421.9l19.7,11.2c0.3,0.2,0.3,0.1,0.3-0.2l-0.4-7.9c0-0.3,0-0.4-0.3-0.4L258.3,421.9L258.3,421.9z M299.1,421.9l-20,2.8
          c-0.3,0-0.2,0.2-0.2,0.4l0.4,8c0,0.2,0,0.3,0.3,0.2L299.1,421.9z"/>
      </g>
      </svg>`,
    'd24': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
        <g
          id="g1847"
          style="fill:#ffffff;fill-opacity:1"><path
            id="path939"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.02061486;stroke-linecap:round"
            d="m 51.663207,36.190102 6.446029,-12.150411 2.734416,7.833738 -6.105231,18.083851 z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccc" /><path
            id="path947"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.02061486;stroke-linecap:round"
            d="M 32.779144,60.631584 V 48.482773 l 17.542428,-11.150822 3.208113,14.362135 z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccc" /><path
            id="path955"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.02061486;stroke-linecap:round"
            d="M 10.470316,51.694086 13.678428,37.331951 31.220856,48.482773 V 60.631584 Z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccc" /><path
            id="path957"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.02061486;stroke-linecap:round"
            d="M 12.336794,36.190102 5.8907653,24.039691 3.1563476,31.873429 9.2615793,49.95728 Z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccc" /><path
            id="path967"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.02061486;stroke-linecap:round"
            d="M 15.095916,7.0817396 6.6917302,22.224419 13.289402,34.660668 30.714422,12.658089 Z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccc" /><path
            id="path971"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.02061486;stroke-linecap:round"
            d="M 32,3.3632298 16.969507,6.0960466 32,11.462457 47.030495,6.0960466 Z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccc" /><path
            id="path975"
            style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.02061486;stroke-linecap:round"
            d="M 48.904084,7.0817396 33.28558,12.658089 50.7106,34.660668 57.308271,22.224419 Z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccc" /><path
            id="path1627"
            style="fill:#ffffff;stroke:#000000;stroke-width:0.02043523;stroke-linecap:round;fill-opacity:1"
            d="M 14.306991,35.820306 32,13.86789 49.69301,35.820306 32,46.871247 Z"
            inkscape:connector-curvature="0"
            sodipodi:nodetypes="ccccc" /></g>
      </svg>`,
    'd30': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
        <path
          id="path5796"
          style="fill:#ffffff;stroke:#000000;stroke-width:0.02250439;stroke-linecap:round;fill-opacity:1"
          d="M 16.092872,5.5019551 32.105492,2.4561525 48.118113,5.5019551 32.105492,9.1542466 16.092872,5.5019551"
          inkscape:connector-curvature="0"
          sodipodi:nodetypes="ccccc" /><path
          id="path5804"
          style="fill:#ffffff;stroke:#000000;stroke-width:0.02250439;stroke-linecap:round;fill-opacity:1"
          d="M 59.173581,22.149372 51.228908,7.7560241 52.74216,24.188061 61.156859,38.326942 Z"
          inkscape:connector-curvature="0"
          sodipodi:nodetypes="ccccc" /><path
          id="path5812"
          style="fill:#ffffff;stroke:#000000;stroke-width:0.02250439;stroke-linecap:round;fill-opacity:1"
          d="M 49.445804,6.9439307 32.956053,10.705051 v 18.98769 l 18.047375,-5.83494 z"
          inkscape:connector-curvature="0"
          sodipodi:nodetypes="ccccc" /><path
          id="path5822"
          style="fill:#ffffff;stroke:#000000;stroke-width:0.02250439;stroke-linecap:round;fill-opacity:1"
          d="M 5.0374054,22.149372 12.982076,7.7560241 11.468827,24.188061 3.0541268,38.326942 Z"
          inkscape:connector-curvature="0"
          sodipodi:nodetypes="ccccc" /><path
          id="path5824"
          style="fill:#ffffff;stroke:#000000;stroke-width:0.02250439;stroke-linecap:round;fill-opacity:1"
          d="M 13.207558,23.857801 14.76518,6.9439307 31.254932,10.705051 v 18.98769 z"
          inkscape:connector-curvature="0"
          sodipodi:nodetypes="ccccc" /><path
          id="path5832"
          style="fill:#ffffff;stroke:#000000;stroke-width:0.02250439;stroke-linecap:round;fill-opacity:1"
          d="M 30.726063,31.309571 12.682072,25.475725 4.0237642,40.02393 19.504076,46.696281 Z"
          inkscape:connector-curvature="0"
          sodipodi:nodetypes="ccccc" /><path
          id="path5838"
          style="fill:#ffffff;stroke:#000000;stroke-width:0.02250439;stroke-linecap:round;fill-opacity:1"
          d="M 15.393889,53.942569 4.2391945,41.969194 19.279521,48.451901 30.183964,60.802984 Z"
          inkscape:connector-curvature="0"
          sodipodi:nodetypes="ccccc" /><path
          id="path5844"
          style="fill:#ffffff;stroke:#000000;stroke-width:0.02250439;stroke-linecap:round;fill-opacity:1"
          d="M 33.484921,31.309571 51.528914,25.475725 60.187222,40.02393 44.706911,46.696281 Z"
          inkscape:connector-curvature="0"
          sodipodi:nodetypes="ccccc" /><path
          id="path5848"
          style="fill:#ffffff;stroke:#000000;stroke-width:0.02250439;stroke-linecap:round;fill-opacity:1"
          d="M 32.105492,60.409148 20.88087,47.69541 32.105492,32.305088 43.330115,47.69541 Z"
          inkscape:connector-curvature="0"
          sodipodi:nodetypes="ccccc" /><path
          id="path5850"
          style="fill:#ffffff;stroke:#000000;stroke-width:0.02250439;stroke-linecap:round;fill-opacity:1"
          d="M 59.971792,41.969194 44.931464,48.451901 34.027021,60.802984 48.817097,53.942569 Z"
          inkscape:connector-curvature="0"
          sodipodi:nodetypes="ccccc" /><rect
          style="opacity:0.98000004;fill:url(#radialGradient5976);fill-opacity:1;stroke:none;stroke-width:2.76727915;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
          id="rect5968"
          width="51.018867"
          height="34.339622"
          x="6.4905643"
          y="13.283018" />
      </svg>`,
    'd100': `<?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
      <g>
        <g transform="matrix(1.1679092,0,0,1.1679092,-274.931,-137.53749)">
          <polygon points="264.7,150.8 263.7,151.4 262.2,152.3 261.4,152.8 259.6,153.8 253.3,157.7 242.7,150.8 254.2,126.6 258.2,135.9
            259.9,139.8 262.7,146.1 263.1,147 263.1,147 		"/>
          <polygon points="271.9,138.7 271.5,148.5 265.4,150.5 263.5,146.2 263.1,145.3 258.8,135.5 257.8,133.3 254.7,126.2 255.8,127
            263.4,132.5 267.8,135.7 268.3,136 		"/>
          <polygon points="271.3,149.5 264.9,154.1 264.6,154.2 264.2,154.5 262.3,155.9 253.6,162 253.6,158.2 260.2,154.3 262.1,153.2
            262.8,152.7 263.9,152 265.4,151.1 		"/>
          <path d="M253.6,126.3L242,150.5l-6.1-2.6l-0.5-9.9L253.6,126.3z"/>
          <path d="M252.8,158.2v3.8l-17-13.1l5.9,2.3L252.8,158.2z"/>
        </g>
      </g>
      <g>
        <g transform="matrix(1.1679092,0,0,1.1679092,-274.931,-137.53749)">
          <polygon points="283,151.5 271.5,158.4 265.6,154.5 272.2,149.7 272.6,138.2 268.6,135.3 272.5,127.3 		"/>
          <path d="M273,126.9l10.6,24.3l6.2-2l0.4-9.8L273,126.9z"/>
          <path d="M271.9,159v3.7l17.7-12.5l-5.9,1.7L271.9,159z"/>
          <polygon points="271.9,127 268.1,134.9 264.1,132 		"/>
          <polygon points="265,155 271.1,158.9 271.1,162.7 262.9,156.4 		"/>
        </g>
      </g>
      </svg>`
  };

  CONFIG.DICETRAY = {
    dice: dice
  };

  Handlebars.registerHelper('dtSvgDie', (context, options) => {
    return `${context}Svg`;
  });

  if (!game.settings.get('dice-calculator', 'enableDiceTray')) {
    return;
  }

  if (game.settings.get('dice-calculator', 'enableD6Pips')) {
    CONFIG.DICETRAY.dice.d6 = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
      <g>
        <path d="M 11.5 9 C 10.149212 8.9609669 8.960847 10.149856 9 11.5 L 9 51.195312 C 8.7783001 52.934174 9.4649439 55.027114 11.5 55.199219 L 51.195312 55.199219 C 52.934562 55.433915 55.164599 54.729057 55.099609 52.599609 L 55.099609 12.90625 C 55.334305 11.167 54.629448 8.935012 52.5 9 L 11.5 9 z M 22.671875 13.931641 A 4.3972788 4.3972788 0 0 1 22.705078 13.931641 A 4.3972788 4.3972788 0 0 1 27.101562 18.330078 A 4.3972788 4.3972788 0 0 1 22.705078 22.726562 A 4.3972788 4.3972788 0 0 1 18.306641 18.330078 A 4.3972788 4.3972788 0 0 1 22.671875 13.931641 z M 41.367188 13.931641 A 4.3972788 4.3972788 0 0 1 41.398438 13.931641 A 4.3972788 4.3972788 0 0 1 45.796875 18.330078 A 4.3972788 4.3972788 0 0 1 41.398438 22.726562 A 4.3972788 4.3972788 0 0 1 37.001953 18.330078 A 4.3972788 4.3972788 0 0 1 41.367188 13.931641 z M 22.671875 27.732422 A 4.3972788 4.3972788 0 0 1 22.705078 27.732422 A 4.3972788 4.3972788 0 0 1 27.101562 32.130859 A 4.3972788 4.3972788 0 0 1 22.705078 36.527344 A 4.3972788 4.3972788 0 0 1 18.306641 32.130859 A 4.3972788 4.3972788 0 0 1 22.671875 27.732422 z M 41.367188 27.732422 A 4.3972788 4.3972788 0 0 1 41.398438 27.732422 A 4.3972788 4.3972788 0 0 1 45.796875 32.130859 A 4.3972788 4.3972788 0 0 1 41.398438 36.527344 A 4.3972788 4.3972788 0 0 1 37.001953 32.130859 A 4.3972788 4.3972788 0 0 1 41.367188 27.732422 z M 22.671875 41.751953 A 4.3972788 4.3972788 0 0 1 22.705078 41.751953 A 4.3972788 4.3972788 0 0 1 27.101562 46.150391 A 4.3972788 4.3972788 0 0 1 22.705078 50.546875 A 4.3972788 4.3972788 0 0 1 18.306641 46.150391 A 4.3972788 4.3972788 0 0 1 22.671875 41.751953 z M 41.398438 41.751953 A 4.3972788 -4.3972788 0 0 1 45.796875 46.150391 A 4.3972788 -4.3972788 0 0 1 41.398438 50.546875 A 4.3972788 -4.3972788 0 0 1 37.001953 46.150391 A 4.3972788 -4.3972788 0 0 1 41.398438 41.751953 z " />
      </g>
      </svg>`;
  }

  // Register dice partials.
  for (let [die, tpl] of Object.entries(CONFIG.DICETRAY.dice)) {
    // const partialTemplate = await renderTemplate(tpl, {});
    Handlebars.registerPartial(`${die}Svg`, tpl);
  }

  // A mapper for behavior and layout functions depending on the game system
  // -------------------------------
  // EXTEND HERE FOR CUSTOM SYSTEMS
  // -------------------------------
  const system_behavior_mapper = {
    generic: {
      apply_layout: function(html) {_dtApplyGenericLayout(html)},
      get_raw_formula: function(qty, dice, html) {return _dtGetGenericRawFormula(qty, dice, html)},
      load_dice: function() {return _dtLoadGenericDice()}
    },
    swade: {
      apply_layout: function(html) {_dtApplySwadeLayout(html)},
      get_raw_formula: function(qty, dice, html) {return _dtGetSwadeRawFormula(qty, dice, html)},
      load_dice: function() {return _dtLoadSwadeDice()}
    },
    fatex: {
      apply_layout: function(html) {_dtApplyFateLayout(html)},
      get_raw_formula: function(qty, dice, html) {return _dtGetFateRawFormula(qty, dice, html)},
      load_dice: function() {return _dtLoadFateDice()}
    },
    ModularFate: {
      apply_layout: function(html) {_dtApplyFateLayout(html)},
      get_raw_formula: function(qty, dice, html) {return _dtGetFateRawFormula(qty, dice, html)},
      load_dice: function() {return _dtLoadFateDice()}
    },
    'fate-core-official': {
      apply_layout: function(html) {_dtApplyFateLayout(html)},
      get_raw_formula: function(qty, dice, html) {return _dtGetFateRawFormula(qty, dice, html)},
      load_dice: function() {return _dtLoadFateDice()}
    },
    dnd5e: {
      apply_layout: function(html) {_dtApplyDnd5eLayout(html)},
      get_raw_formula: function(qty, dice, html) {return _dtGetDnd5eRawFormula(qty, dice, html)},
      load_dice: function() {return _dtLoadDnd5eDice()}
    },
    pf2e: {
      apply_layout: function(html) {_dtApplyDnd5eLayout(html)},
      get_raw_formula: function(qty, dice, html) {return _dtGetDnd5eRawFormula(qty, dice, html)},
      load_dice: function() {return _dtLoadDnd5eDice()}
    },
    dcc: {
      apply_layout: function(html) {_dtApplyDccLayout(html)},
      get_raw_formula: function(qty, dice, html) {return _dtGetGenericRawFormula(qty, dice, html)},
      load_dice: function() {return _dtLoadDccDice()}
    },
  };

  // -------------------------------

  // Define which behavior in the mapper to use
  let game_system = game.system.id;

  let formula_applier = null;
  if (game_system in system_behavior_mapper) {
    formula_applier = system_behavior_mapper[game_system];
  } else {
    formula_applier = system_behavior_mapper['generic'];
  }

  CONFIG.DICETRAY.SYSTEM_MAP = system_behavior_mapper;
  CONFIG.DICETRAY.GAME_SYSTEM = game_system;
  CONFIG.DICETRAY.FORMULA_APPLIER = formula_applier;
});

Hooks.once('ready', function() {
  // Add the drop handler for dice.
  $('html').on('drop', 'body', _dtDropHandler);
});

Hooks.on('renderSidebarTab', (app, html, data) => {
  // Exit early if necessary;
  if (!game.settings.get('dice-calculator', 'enableDiceTray')) return;
  if (app.tabName !== 'chat') return;

  // Define which behavior in the mapper to use
  let game_system = game.system.id;
  const game_system_override = game.settings.get('dice-calculator', 'systemOverride');

  if (game_system_override && game_system_override !== 'none') {
    game_system = game_system_override;
  }

  let formula_applier = null;
  const system_behavior_mapper = CONFIG.DICETRAY.SYSTEM_MAP;
  if (game_system in system_behavior_mapper) {
    formula_applier = system_behavior_mapper[game_system];
  } else {
    formula_applier = system_behavior_mapper['generic'];
  }

  CONFIG.DICETRAY.GAME_SYSTEM = game_system;
  CONFIG.DICETRAY.FORMULA_APPLIER = formula_applier;

  // Prepare the dice tray for rendering.
  let $chat_form = html.find('#chat-form');
  const template = 'modules/dice-calculator/templates/tray.html';
  const options = {
    dicerows: formula_applier.load_dice()
  };

  renderTemplate(template, options).then(c => {
    if (c.length > 0) {
      let $content = $(c);
      $chat_form.after($content);
      $content.find('.dice-tray__button').on('click', event => {
        event.preventDefault();
        let $self = $(event.currentTarget);
        let dataset = event.currentTarget.dataset;

        _dtUpdateChatDice(dataset, 'add', html, formula_applier);
      });
      $content.find('.dice-tray__button').on('contextmenu', event => {
        event.preventDefault();
        let $self = $(event.currentTarget);
        let dataset = event.currentTarget.dataset;

        _dtUpdateChatDice(dataset, 'sub', html, formula_applier);
      });
      // Handle drag events.
      $content.find('.dice-tray__button').attr('draggable', true);
      $content.on('dragstart', '.dice-tray__button, .dice-tray__ad', (event) => {
        let dataset = event.currentTarget.dataset;
        let dragData = JSON.parse(JSON.stringify(dataset));
        if (dragData?.formula) {
          // Grab the modifier, if any.
          let $parent = $(event.currentTarget).parents('.dice-tray');
          let $modInput = $parent.find('.dice-tray__input');
          let mod = $modInput.val();

          // Handle advantage/disadvantage.
          if (dragData.formula == 'kh') dragData.formula = '2d20kh';
          if (dragData.formula == 'kl') dragData.formula = '2d20kl';

          dragData.icon = dragData.formula;

          // Grab the count, if any.
          let qty = $(event.currentTarget).find('.dice-tray__flag').text();
          if (qty.length > 0 && dragData.formula.includes('k') == false) {
            dragData.formula = `${qty}${dataset.formula}`;
          }

          // Apply the modifier.
          if (mod && mod != 0) dragData.formula += ` + ${mod}`;

        }
        event.originalEvent.dataTransfer.setData('text/plain', JSON.stringify(dragData));

        // Set the image to the dice icon.
        let icon = document.createElement('img');
        let suffix = '';
        // Handle pips.
        if (game.settings.get('dice-calculator', 'enableD6Pips') && dragData.icon == 'd6') {
          suffix = 'pips';
        }
        icon.src = `modules/dice-calculator/icons/${dragData.icon.replace(/2d20k[hl]/g, 'd20')}${suffix}white.png`;
        // event.originalEvent.dataTransfer.setDragImage(icon, 50, 50);
      });
      // Handle correcting the modifier math if it's null.
      $content.find('.dice-tray__input').on('input', event => {
        // event.preventDefault();
        let $self = $(event.currentTarget);
        let dataset = event.currentTarget.dataset;
        let mod_val = $self.val();

        mod_val = Number(mod_val);
        mod_val = Number.isNaN(mod_val) ? 0 : mod_val;

        $self.val(mod_val);
        _dtApplyModifier(html);
      })
      // Handle changing the modifier with the scroll well.
      .on('wheel', event => {
        let $self = $(event.currentTarget);
        let diff = event.originalEvent.deltaY < 0 ? 1 : -1;
        let mod_val = $self.val();
        mod_val = Number.isNaN(mod_val) ? 0 : Number(mod_val);
        $self.val(mod_val + diff);
        _dtApplyModifier(html);
      });
      // Handle +/- buttons near the modifier input.
      $content.find('.dice-tray__math').on('click', event => {
        event.preventDefault();
        let $self = $(event.currentTarget);
        let dataset = event.currentTarget.dataset;
        let mod_val = $('input[name="dice.tray.modifier"]').val();

        mod_val = Number(mod_val);
        mod_val = Number.isNaN(mod_val) ? 0 : mod_val;

        switch (dataset.formula) {
          case '+1':
            mod_val = mod_val + 1;
            break;

          case '-1':
            mod_val = mod_val - 1;

          default:
            break;
        }
        $('input[name="dice.tray.modifier"]').val(mod_val);
        _dtApplyModifier(html);
      });
      formula_applier.apply_layout(html);
    }
  });
});

function _dtDropHandler(event) {
   // Attempt to parse the data.
   let data;
   try {
     data = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'));
   } catch (err) {
     return false;
   }

   // If there's a formula, trigger the roll.
   if (data?.formula) {
     new Roll(data.formula).roll({async: true}).then(r => {
       r.toMessage();
     });
   }

   // Prevent the event from firing multiple times.
   event.stopImmediatePropagation();
}

function _dtUpdateChatDice(dataset, direction, html, formula_applier) {
  let $chat = html.find('#chat-form textarea');
  let chat_val = String($chat.val());
  let new_formula = null;
  let roll_prefix = '/r';
  let $roll_mode_selector = html.find('select[name="rollMode"]');
  let qty = 0;

  if ($roll_mode_selector.length > 0) {
    switch ($roll_mode_selector.val()) {
      case 'gmroll':
        roll_prefix = '/gmr';
        break;

      case 'blindroll':
        roll_prefix = '/br';
        break;

      case 'selfroll':
        roll_prefix = '/sr';
        break;

      default:
        roll_prefix = '/r';
        break;
    }
  }

  if (html.find('.dice-tray__disadvantage').hasClass('active')) {
    roll_suffix = 'x=';
  }

  if (html.find('.dice-tray__advantage').hasClass('active')) {
    add_wild = true;
  }

  let match_dice = dataset.formula == 'd10' ? 'd10(?!0)' : dataset.formula;
  if (match_dice == 'd20') match_dice = `${match_dice}[khl]*`;

  let match_string = new RegExp(formula_applier.get_raw_formula('([0-9]*)', '('+match_dice+')', html) + '(?=\\+|\\-|$)');
  if (chat_val.match(match_string)) {
    let match = chat_val.match(match_string);
    let parts = {};

    parts.txt = match[0] ? match[0] : '';
    parts.qty = match[1] ? match[1] : '1';
    parts.die = match[2] ? match[2] : '';

    if (parts.die == '' && match[3]) {
      parts.die = match[3];
    }

    qty = direction == 'add' ? Number(parts.qty) + 1 : Number(parts.qty) - 1;

    // Update the dice quantity.
    qty = qty < 1 ? '' : qty;

    if (qty == '' && direction == 'sub') {
      new_formula = '';
      let new_match_string = new RegExp(formula_applier.get_raw_formula('([0-9]*)', '('+match_dice+')', html) + '(?=\\+|\\-|$)');
      chat_val = chat_val.replace(new_match_string, new_formula);
      if (new RegExp(`${roll_prefix}\\s+(?!.*d\\d+.*)`).test(chat_val)) {
        chat_val = '';
      }
    }
    else {
      new_formula = formula_applier.get_raw_formula(qty, parts.die, html);
      chat_val = chat_val.replace(match_string, new_formula);
    }
    $chat.val(chat_val);
  }
  else {
    qty = 1;
    if (chat_val == '') {
      $chat.val(roll_prefix + ' ' + formula_applier.get_raw_formula('', dataset.formula, html));
    }
    else {
      chat_val = chat_val.replace(/(\/r|\/gmr|\/br|\/sr) /g, roll_prefix + ' ' + formula_applier.get_raw_formula('', dataset.formula, html) + '+');
      $chat.val(chat_val);
    }
  }
  // Add a flag indicator on the dice.
  let $flag_button = html.find(`.dice-tray__flag--${dataset.formula}`);
  if (qty == '') {
    qty = direction == 'add' ? 1 : 0;
  }
  qty = Number(qty);
  if (qty > 0) {
    $flag_button.text(qty);
    $flag_button.removeClass('hide');
  }
  else if (qty < 0) {
    $flag_button.text(qty);
  }
  else {
    $flag_button.text('');
    $flag_button.addClass('hide');
  }
  // TODO: Optimize this so that we're not running two regexes.
  chat_val = $chat.val();
  // chat_val = chat_val.replace(/(\/r|\/gmr|\/br|\/sr) /g, `${roll_prefix} `);
  chat_val = chat_val.replace(/(\/r|\/gmr|\/br|\/sr)(( \+)| )/g, `${roll_prefix} `).replace(/\+{2}/g, '+').replace(/\-{2}/g, '-').replace(/\+$/g, '');
  $chat.val(chat_val);
  _dtApplyModifier(html);
}

function _dtApplyModifier(html) {
  $mod_input = html.find('.dice-tray__input');
  mod_val = Number($mod_input.val());
  let mod_string = '';
  if ($mod_input.length > 0 && !Number.isNaN(mod_val)) {
    if (mod_val > 0) {
      mod_string = `+${mod_val}`;
    }
    else if (mod_val < 0) {
      mod_string = `${mod_val}`;
    }
  }

  // Existing modifier.
  if (mod_string.length > 0 || mod_string === '') {
    let $chat = html.find('#chat-form textarea');
    let chat_val = String($chat.val());

    let match_string = new RegExp('(\\+|\\-)([0-9]+)$');
    if (chat_val.match(match_string)) {
      chat_val = chat_val.replace(match_string, mod_string);
      $chat.val(chat_val);
    }
    else if (chat_val !== '') {
      chat_val = chat_val + mod_string;
      $chat.val(chat_val);
    }
  }

  return mod_string;
}

//----------------------------------
//Specific System Implementations
//----------------------------------

function _dtTriggerRollClick() {
  // Set up the keypress event properties.
  let spoofedProperties = {
    which: 13,
    keycode: 13,
    code: 'Enter',
    key: 'Enter',
  }
  // Create an event for the keypress.
  let spoofed = $.Event('keydown', spoofedProperties);
  // Create a second event for the originalEvent property.
  let spoofedOriginal = $.Event('keydown', spoofedProperties);
  spoofedOriginal.isComposing = false;
  // Assign the original event.
  spoofed.originalEvent = spoofedOriginal;

  return spoofed;
}

// LAYOUT BY SYSTEM
function _dtApplyGenericLayout(html) {
  html.find('.dice-tray__roll').on('click', event => {
    event.preventDefault();
    let spoofed = _dtTriggerRollClick();
    // Trigger the event.
    html.find('#chat-message').trigger(spoofed);
    html.find('.dice-tray__input').val(0);
    html.find('.dice-tray__flag').text('');
    html.find('.dice-tray__flag').addClass('hide');
  });
  html.find('#chat-message').keydown(e => {
    if (e.code == 'Enter' || e.key == 'Enter' || e.keycode == '13') {
      html.find('.dice-tray__flag').text('');
      html.find('.dice-tray__flag').addClass('hide');
    }
  });
}

function _dtApplyDnd5eLayout(html) {
  // PF2e and dnd5e otherwise have identical settings, so all we need to do is
  // use the same layout function and swap the i18n string.
  let labels = {};
  if (game.system.id == 'pf2e') {
    labels.advantage = "DICE_TRAY.Fortune";
    labels.adv = "DICE_TRAY.For";
    labels.disadvantage = "DICE_TRAY.Misfortune";
    labels.dis = "DICE_TRAY.Mis";
  }
  else {
    labels.advantage = "DICE_TRAY.Advantage";
    labels.adv = "DICE_TRAY.Adv";
    labels.disadvantage = "DICE_TRAY.Disadvantage";
    labels.dis = "DICE_TRAY.Dis";
  }

  html.find('#dice-tray-math').show();
  html.find('#dice-tray-math').append(
    `<div class="dice-tray__stacked flexcol">
       <button class="dice-tray__ad dice-tray__advantage" data-formula="kh" title="${game.i18n.localize(labels.advantage)}">${game.i18n.localize(labels.adv)}</button>
       <button class="dice-tray__ad dice-tray__disadvantage" data-formula="kl" title="${game.i18n.localize(labels.disadvantage)}">${game.i18n.localize(labels.dis)}</button>
    </div>`
  );
  html.find('.dice-tray__ad').attr('draggable', true).on('click', event => {
    event.preventDefault();
    let $self = $(event.currentTarget);
    let dataset = event.currentTarget.dataset;
    let $chat = html.find('#chat-form textarea');
    let chat_val = String($chat.val());
    let match_string = new RegExp(`\d*d20[khl]*`);

    /**
     * Process a formula to apply advantage or disadvantage. Should be used
     * within a regex replacer function's callback.
     *
     * @param {string} count | String match for the current dice count.
     * @param {string} dice | String match for the dice type (d20).
     * @param {string} khl | String match for kh|l (includes kh|l count).
     * @param {number} countDiff | Integer to adjust the dice count by.
     * @param {string} newKhl | Formula on the button (kh or kl).
     * @returns {object} Object with content and count keys.
     */
    function updateDiceKeep(count, dice, khl, countDiff, newKhl) {
      // Start by getting the current number of dice (minimum 1).
      let keep = Number.isNumeric(count) ? Number(count) : 1;
      if (keep === 0) keep = 1;

      // Apply the count diff to adjust how many dice we need for adv/dis.
      let newCount = keep + countDiff;
      let newKeep = newCount - 1;

      // Handling toggling on/off advantage.
      if (khl) {
        // If switching from adv to dis or vice versa, adjust the formula to
        // simply replace the kh and kl while leaving the rest as it was prior
        // to applying the count diff.
        if (!khl.includes(newKhl)) {
          newCount = keep;
          newKeep = newCount - 1;
          khl = newKhl;
        }
        // If the adv/dis buttons were clicked after they were previously
        // applied, we need to remove them. If it's currently 2d20kh or kl,
        // change it to 1d20. Otherwise, only strip the kh or kl.
        else {
          newCount = keep > 2 ? keep : newCount;
          newKeep = 0;
        }
      }
      // If adv/dis weren't enabled, then that means we need to enable them.
      else {
        khl = newKhl;
      }

      // Limit the count to 2 when adding adv/dis to avoid accidental super advantage.
      if (newCount > 2 && newKeep > 0) {
        newCount = 2;
        newKeep = newCount - 1;
      }

      // Create the updated text string.
      let result = `${newCount > 0 ? newCount : 1}${dice}`;
      // Append kh or kl if needed.
      if (newCount > 1 && newKeep > 0) result = `${result}${newKhl.includes('kh') ? 'kh' : 'kl'}`;

      // TODO: This allows for keeping multiple dice, but in this case, we only need to keep one.
      // if (newCount > 1 && newKeep > 1) result = `${result}${newKeep}`;

      // Return an object with the updated text and the new count.
      return {
        content: result,
        count: newCount
      };
    }

    // If there's a d20, toggle the current if needed.
    if (chat_val.match(match_string)) {
      // If there was previously a kh or kl, update it.
      if (chat_val.match(/d20k[hl]/g)) {
        chat_val =  chat_val.replace(/(\d*)(d20)(k[hl]\d*)/g, (match, p1, p2, p3, offset, string) => {
          let diceKeep = updateDiceKeep(p1, p2, p3, -1, dataset.formula);
          html.find('.dice-tray__flag--d20').text(diceKeep.count);
          return diceKeep.content;
        });
      }
      // Otherwise, add it.
      else {
        chat_val = chat_val.replace(/(\d*)(d20)/g, (match, p1, p2, offset, string) => {
          let diceKeep = updateDiceKeep(p1, p2, '', 1, dataset.formula);
          html.find('.dice-tray__flag--d20').text(diceKeep.count);
          return diceKeep.content;
        });
      }
    }

    // Handle toggle classes.
    if (chat_val.includes('kh')) {
      html.find('.dice-tray__advantage').addClass('active');
    }
    else {
      html.find('.dice-tray__advantage').removeClass('active');
    }
    if (chat_val.includes('kl')) {
      html.find('.dice-tray__disadvantage').addClass('active');
    }
    else {
      html.find('.dice-tray__disadvantage').removeClass('active');
    }
    // Update the value.
    $chat.val(chat_val);
  });
  html.find('.dice-tray__roll').on('click', event => {
    event.preventDefault();
    let spoofed = _dtTriggerRollClick();
    html.find('#chat-message').trigger(spoofed);
    html.find('.dice-tray__input').val(0);
    html.find('.dice-tray__flag').text('');
    html.find('.dice-tray__flag').addClass('hide');
    html.find('.dice-tray__ad').removeClass('active');
  });
  html.find('#chat-message').keydown(e => {
    if (e.code == 'Enter' || e.key == 'Enter' || e.keycode == '13') {
      html.find('.dice-tray__flag').text('');
      html.find('.dice-tray__flag').addClass('hide');
      html.find('.dice-tray__ad').removeClass('active');
    }
  });
}

function _dtApplySwadeLayout(html) {
  html.find('#dice-tray-math').show();
  html.find('#dice-tray-math').append(
    `<div class="dice-tray__stacked flexcol">
       <button class="dice-tray__ad dice-tray__advantage" data-formula="kh" title="${game.i18n.localize("DICE_TRAY.WildDie")}">${game.i18n.localize("DICE_TRAY.Wild")}</button>
       <button class="dice-tray__ad dice-tray__disadvantage" data-formula="kl" title="${game.i18n.localize("DICE_TRAY.ExplodingDie")}">${game.i18n.localize("DICE_TRAY.Ace")}</button>
     </div>`
  );
  html.find('.dice-tray__advantage').on('click', event => {
    event.preventDefault();
    let $self = $(event.currentTarget);
    if (!html.find('.dice-tray__advantage').hasClass('active')) {
      html.find('.dice-tray__advantage').addClass('active');
    }
    else {
      html.find('.dice-tray__advantage').removeClass('active');
    }
  });
  html.find('.dice-tray__disadvantage').on('click', event => {
    event.preventDefault();
    let $self = $(event.currentTarget);
    if (!html.find('.dice-tray__disadvantage').hasClass('active')) {
      html.find('.dice-tray__disadvantage').addClass('active');
    }
    else {
      html.find('.dice-tray__disadvantage').removeClass('active');
    }
  });
  html.find('.dice-tray__roll').on('click', event => {
    event.preventDefault();
    let spoofed = _dtTriggerRollClick();
    html.find('#chat-message').trigger(spoofed);
    html.find('.dice-tray__input').val(0);
    html.find('.dice-tray__flag').text('');
    html.find('.dice-tray__flag').addClass('hide');
  });
  html.find('#chat-message').keydown(e => {
    if (e.code == 'Enter' || e.key == 'Enter' || e.keycode == '13') {
      html.find('.dice-tray__flag').text('');
      html.find('.dice-tray__flag').addClass('hide');
    }
  });
}

function _dtApplyFateLayout(html) {
  html.find('#dice-tray-math').show();
  html.find('.dice-tray__roll').on('click', event => {
    event.preventDefault();
    let spoofed = _dtTriggerRollClick();
    html.find('#chat-message').trigger(spoofed);
    html.find('.dice-tray__input').val(0);
  });
  html.find("#Layer_1").remove();
  html.find("#dice-tray-math").remove();
  html.find("#fate-text").remove();
  html.find(".dice-tray__buttons.flexrow > button").append(`<a id=fate-text>Fate Dice</a>`);
  html.find(`.dice-tray__flag--d6`).hide();
  html.find('#chat-message').keydown(e => {
    if (e.code == 'Enter' || e.key == 'Enter' || e.keycode == '13') {
      html.find('.dice-tray__flag').text('');
      html.find('.dice-tray__flag').addClass('hide');
    }
  });
}

function _dtApplyDccLayout(html) {
  let dice_chain = [ 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 30 ];
  let labels = {
    plusdie: "DICE_TRAY.PlusOneDieLong",
    plusd: "DICE_TRAY.PlusOneDie",
    minusdie: "DICE_TRAY.MinusOneDieLong",
    minusd: "DICE_TRAY.MinusOneDie",
  };
  html.find('.dice-tray__roll').on('click', event => {
    event.preventDefault();
    let spoofed = _dtTriggerRollClick();
    // Trigger the event.
    html.find('#chat-message').trigger(spoofed);
    html.find('.dice-tray__input').val(0);
    html.find('.dice-tray__flag').text('');
    html.find('.dice-tray__flag').addClass('hide');
  });
  html.find('#chat-message').keydown(e => {
    if (e.code == 'Enter' || e.key == 'Enter' || e.keycode == '13') {
      html.find('.dice-tray__flag').text('');
      html.find('.dice-tray__flag').addClass('hide');
    }
  });
  html.find('#dice-tray-math').show();
  html.find('#dice-tray-math').append(
    `<div class="dice-tray__stacked flexcol">
       <button class="dice-tray__dicechain" data-mod="+1" title="${game.i18n.localize(labels.plusdie)}">${game.i18n.localize(labels.plusd)}</button>
       <button class="dice-tray__dicechain" data-mod="-1" title="${game.i18n.localize(labels.minusdie)}">${game.i18n.localize(labels.minusd)}</button>
    </div>`
  );
  html.find('.dice-tray__dicechain').on('click', event => {
    event.preventDefault();
    // Get the chat box
    let $chat = html.find('#chat-form textarea');
    let chat_val = String($chat.val());
    let match_string = /(\d+)d(\d+)/;

    // Find the first dice on the line to update
    const match = chat_val.match(match_string)
    if (match) {
      // Locate this die in the dice chain
      const chain_index = dice_chain.indexOf(parseInt(match[2]))
      if (chain_index >= 0) {
        const new_index = chain_index + parseInt(event.currentTarget.dataset.mod)
        // Is the new index still in range?
        if (new_index >= 0 && new_index < dice_chain.length) {
          chat_val = chat_val.replace(match_string, `${match[1]}d${dice_chain[new_index]}`)
        }
      }
    }

    // Update the value.
    $chat.val(chat_val);
  });
}

// DICE LOADING BY SYSTEM
function _dtLoadGenericDice() {
  return [
    {
      d4: 'd4',
      d6: 'd6',
      d8: 'd8',
      d10: 'd10',
      d12: 'd12',
      d20: 'd20',
      d100: 'd100'
    }
  ];
}

function _dtLoadDnd5eDice() {
  return [
           {
             d4: 'd4',
             d6: 'd6',
             d8: 'd8',
             d10: 'd10',
             d12: 'd12',
             d20: 'd20',
             d100: 'd100'
           }
         ];
}

function _dtLoadSwadeDice() {
  var all_dice = [
                   {
                     d4: 'd4',
                     d6: 'd6',
                     d8: 'd8',
                     d10: 'd10',
                     d12: 'd12'
                   }
                 ];
  // This will fail if not within a swade system
  if (game.settings.get('dice-calculator', 'enableExtraDiceInSwade')) {
    all_dice[0].d20 = 'd20';
    all_dice[0].d100 = 'd100';
  }
  return all_dice;
}

function _dtLoadFateDice() {
  var selected_dice = [
                   {
                     d6: 'd6',
                   }
                 ];
  return selected_dice;
}

function _dtLoadDccDice() {
  return [
    {
      d3: 'd3',
      d4: 'd4',
      d5: 'd5',
      d6: 'd6',
      d7: 'd7',
      d8: 'd8',
      d10: 'd10',
    },
    {
      d12: 'd12',
      d14: 'd14',
      d16: 'd16',
      d20: 'd20',
      d24: 'd24',
      d30: 'd30',
      d100: 'd100',
    },
  ];
}

// --------------------------
// RAW FORMULAS BY SYSTEM
function _dtGetGenericRawFormula(qty, dice, html) {
  return `${qty === '' ? 1 : qty}${dice}`
}

function _dtGetDnd5eRawFormula(qty, dice, html) {
  return `${qty === '' ? 1 : qty}${dice}`
}

function _dtGetSwadeRawFormula(qty, dice, html) {
  let roll_suffix = '';
  let add_wild = false;

  if (html.find('.dice-tray__disadvantage').hasClass('active')) {
    roll_suffix = 'x=';
  }
  if (html.find('.dice-tray__advantage').hasClass('active')) {
    add_wild = true;
  }

  if (add_wild) {
    return `{${qty === '' ? 1 : qty}${dice}${roll_suffix},1d6${roll_suffix}}kh`;
  }
  else {
    return `${qty === '' ? 1 : qty}${dice}${roll_suffix}`;
  }
}

function _dtGetFateRawFormula(qty, dice, html) {
  let roll_suffix = 'df';
  return `4${roll_suffix}`;
}
