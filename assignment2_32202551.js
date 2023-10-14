
var canvas;
var gl;

var NumVertices  = 18;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

var flag = true;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    Pyramid();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
        
    render();
}


function Pyramid()
{
    var vertices = [
        vec4(  0.0,  0.5,  0.0, 1.0 ),//꼭짓점
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5,  0.5, 1.0 )
    ];

    var Triangles = [
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 1
    ];

    var Square = [
        1, 2, 3,
        1, 3, 4
    ]

    var vertexColors = [
        [ 0.0, 1.0, 1.0, 1.0 ],
        [ 1.0, 0.0, 0.0, 1.0 ],
        [ 1.0, 1.0, 0.0, 1.0 ],
        [ 0.0, 1.0, 0.0, 1.0 ],
        [ 0.0, 0.0, 1.0, 1.0 ],
    ];


    for (var i = 0; i < Triangles.length; i += 3) {

        var triangleIndex = i / 3;
        
        var colorIndex = triangleIndex % vertexColors.length;
    
        colors.push(
            vertexColors[colorIndex],
            vertexColors[colorIndex],
            vertexColors[colorIndex]
        );
    
        points.push(
            vertices[Triangles[i]],
            vertices[Triangles[i + 1]],
            vertices[Triangles[i + 2]]
        );
    }

    for (var i = 0; i < Square.length; ++i) {
        points.push(vertices[Square[i]]);
        colors.push(vertexColors[4]);
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}

