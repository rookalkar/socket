var deviceorientation;
var deviceorientation_start;
var deviceorientation_delta;

var acceleration_sum;
var time_seconds;
var avg_acceleration;
var devicemotion = {};

var transform_type = "rotate"; //default behaviour

var dim = 'x';

// Get WebSocket
var socket = io();
// Join a channel
var room = "test";
socket.emit("join", room);

window.addEventListener("devicemotion", function (event) {
  devicemotion.x = event.accelerationIncludingGravity.x;
  devicemotion.y = event.accelerationIncludingGravity.y;
  devicemotion.z = event.accelerationIncludingGravity.z;
});

window.addEventListener("deviceorientation", function(event) {
  switch(dim) {
    case 'x':
    {
      deviceorientation = event.beta;
      break;
    }
    case 'y':
    {
      deviceorientation = event.gamma;
      break;
    }
    case 'z':
    {
      deviceorientation = event.alpha;
      break;
    }
  }
});

document.getElementById("input").addEventListener("click", function (event) {
    var msg = "Test";
    socket.emit("test", msg);
})

document.getElementById("start").addEventListener("click", function (event) {
    deviceorientation_start = deviceorientation;
// Acceleration Code
    acceleration_sum = devicemotion.x;
    time_seconds = 0;
    setTimeout(add, 1000);

    console.log("started");
})

document.getElementById("stop").addEventListener("click", function (event) {
  deviceorientation_delta = deviceorientation - deviceorientation_start;
  avg_acceleration = acceleration_sum/time_seconds;

  var msg = {
    delta: deviceorientation_delta,
    dimension: dim,
    transform: transform_type,
    avg_acceleration: avg_acceleration,
  };
  socket.emit("orientation", msg);
})

//Mouse down code
document.getElementById("translate").addEventListener("mousedown", function (event) {
    deviceorientation_start = deviceorientation;
    console.log("started");
})

document.getElementById("translate").addEventListener("mouseup", function (event) {
    deviceorientation_delta = deviceorientation - deviceorientation_start;

    var msg = {
      delta: deviceorientation_delta,
      dimension: dim,
      transform: transform_type,
    };
    socket.emit("orientation", msg);
})

document.getElementById("cameraButton").addEventListener("click", function (event) {
    var msg = {
      id: 'camera'
    };
    socket.emit("cameraChange", msg);
})

socket.on("test", function (msg) {
  console.log(msg);
});

socket.on("orientation", function (msg) {
  console.log(msg);
  switch (msg.transform) {
    case "rotate":
      change({element: "box", attr: "rotation", dim: msg.dimension , value: msg.delta}); break;
    case "translate":
      change({element: "box", attr: "position", dim: msg.dimension , value: msg.delta/10}); break;
  }

});

socket.on("cameraChange", function (msg) {
  console.log(msg);
  document.getElementById(msg.id).setAttribute('camera', 'active', true);
});

function setDim(value) {
  dim = value;
}

function change (payload) {
  var current_attr_value = {};
  current_attr_value = document.getElementById(payload.element).getAttribute(payload.attr);
  current_attr_value[payload.dim] = current_attr_value[payload.dim] + parseFloat(payload.value);
  document.getElementById(payload.element).setAttribute(payload.attr, current_attr_value);
}

function changeCamera (id) {
  document.getElementById(id).setAttribute("active", "true");
}

function add() {
    //console.log(devicemotion.x);
    acceleration_sum = acceleration_sum + devicemotion.x;
    time_seconds = time_seconds + 1;
}

function setTransformType (type) {
  transform_type = type;
  console.log(transform_type);
}
